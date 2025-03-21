"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";

// Configuration pour l'algorithme de layout Dagre
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  // Configuration de base pour le graphe dagre
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 150 });
  
  // Ajouter les nœuds au graphe dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 80, height: 80 });
  });
  
  // Ajouter les arêtes au graphe dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  
  // Calculer le layout
  dagre.layout(dagreGraph);
  
  // Récupérer les positions calculées pour les nœuds
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 40, // Centrer le nœud (largeur/2)
        y: nodeWithPosition.y - 40, // Centrer le nœud (hauteur/2)
      },
      draggable: true,
    };
  });
  
  return { nodes: layoutedNodes, edges };
};

// Fonction pour calculer la largeur nécessaire du graphe
const calculateGraphWidth = (nodes) => {
  if (!nodes || nodes.length === 0) return 1000; // Valeur par défaut
  
  // Trouver le nœud le plus à droite
  const rightmostNode = nodes.reduce((max, node) => {
    return (node.position.x > max.position.x) ? node : max;
  }, nodes[0]);
  
  // Ajouter une marge de 200px à la position x du nœud le plus à droite
  return rightmostNode.position.x + 200;
};

// Composant pour un nœud spécial (début/fin)
const SpecialNode = ({ label, isStart }) => {
  const color = isStart ? "#4CAF50" : "#F44336"; // Vert pour début, Rouge pour fin
  
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "white",
          border: `3px solid ${color}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)"
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: color
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

const CPMGraph = ({ projectId }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [graphWidth, setGraphWidth] = useState(1000); // État pour stocker la largeur calculée
  const flowContainerRef = useRef(null);
  const direction = 'LR';

  useEffect(() => {
    fetch(`http://localhost:3001/critical-path/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        // Identifier les tâches qui n'ont pas de prédécesseurs (tâches de début)
        const startTaskIds = new Set(data.map(task => task.id.toString()));
        data.forEach(task => {
          task.successors.forEach(successor => {
            startTaskIds.delete(successor.toString());
          });
        });
        
        // Identifier les tâches qui n'ont pas de successeurs (tâches de fin)
        const endTaskIds = new Set();
        data.forEach(task => {
          if (task.successors.length === 0) {
            endTaskIds.add(task.id.toString());
          }
        });

        // Création du nœud de début
        const startNode = {
          id: 'start',
          position: { x: 0, y: 0 },
          data: { label: <SpecialNode label="Début" isStart={true} /> },
          style: {
            background: "transparent",
            border: "none",
            width: 100,
            height: 100,
          },
          sourcePosition: 'right',
          targetPosition: 'left',
          draggable: true,
        };
        
        // Création du nœud de fin
        const endNode = {
          id: 'end',
          position: { x: 0, y: 0 },
          data: { label: <SpecialNode label="Fin" isStart={false} /> },
          style: {
            background: "transparent",
            border: "none",
            width: 100,
            height: 100,
          },
          sourcePosition: 'right',
          targetPosition: 'left',
          draggable: true,
        };

        // Création des nœuds de tâches
        const taskNodes = data.map((task) => ({
          id: task.id.toString(),
          position: { x: 0, y: 0 },
          data: { label: <TaskNode task={task} /> },
          style: {
            background: "transparent",
            border: "none",
            width: 100,
            height: 100,
          },
          sourcePosition: 'right',
          targetPosition: 'left',
          draggable: true,
        }));
        
        // Combinaison de tous les nœuds
        const formattedNodes = [startNode, ...taskNodes, endNode];

        // Créer les arêtes entre les tâches
        const taskEdges = data.flatMap((task) =>
          task.successors.map((successor) => ({
            id: `e${task.id}-${successor}`,
            source: task.id.toString(),
            target: successor.toString(),
            animated: task.critical,
            label: task.duration.toString() + "j",
            labelStyle: { fontSize: "12px", fill: task.critical ? "red" : "black" },
            style: {
              stroke: task.critical ? "red" : "black",
              strokeWidth: task.critical ? 3 : 2,
            },
          }))
        );
        
        // Créer les arêtes depuis le nœud de début vers les premières tâches
        const startEdges = Array.from(startTaskIds).map(taskId => ({
          id: `estart-${taskId}`,
          source: 'start',
          target: taskId,
          animated: true,
          style: {
            stroke: "green",
            strokeWidth: 2,
          },
        }));
        
        // Créer les arêtes depuis les dernières tâches vers le nœud de fin
        const endEdges = Array.from(endTaskIds).map(taskId => ({
          id: `e${taskId}-end`,
          source: taskId,
          target: 'end',
          animated: true,
          style: {
            stroke: "red",
            strokeWidth: 2,
          },
        }));
        
        // Combinaison de toutes les arêtes
        const formattedEdges = [...startEdges, ...taskEdges, ...endEdges];

        // Appliquer le layout automatique
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          formattedNodes,
          formattedEdges,
          direction
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        
        // Calculer et définir la largeur nécessaire du graphe
        const calculatedWidth = calculateGraphWidth(layoutedNodes);
        setGraphWidth(calculatedWidth);
      })
      .catch((error) => console.error("Erreur chargement des tâches :", error));
  }, [projectId]);

  const onNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
      
      // Recalculer la largeur du graphe après chaque changement de nœud
      const newWidth = calculateGraphWidth(updatedNodes);
      setGraphWidth(newWidth);
    },
    [nodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const containerStyle = {
    width: "100%",
    height: "600px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "auto",
    display: "block"
  };

  // Style du conteneur interne pour centrer le graphe verticalement
  const innerContainerStyle = {
    width: `${graphWidth}px`, // Largeur dynamique basée sur le contenu
    height: "100%",
    display: "flex",
    alignItems: "center", // Centrage vertical
    justifyContent: "flex-start", // Alignement à gauche
    minHeight: "100%"
  };

  // Style spécifique pour ReactFlow
  const reactFlowStyle = {
    width: "100%",
    height: "80%", // Hauteur réduite pour centrer verticalement
  };

  return (
    <div style={containerStyle} ref={flowContainerRef}>
      <div style={innerContainerStyle}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnScroll={false}
          panOnDrag={false}
          preventScrolling={false}
          nodesDraggable={true}
          elementsSelectable={true}
          style={reactFlowStyle}
        >
          <MiniMap 
            nodeStrokeColor={(n) => {
              if (n.id === 'start') return 'green';
              if (n.id === 'end') return 'red';
              return n.data.critical ? 'red' : 'black';
            }}
            nodeColor={() => '#FFFFFF'}
          />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

// Composant personnalisé pour un nœud circulaire
const TaskNode = ({ task }) => {
  // Déterminer si la tâche est critique
  const isCritical = task.slack === 0;
  
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "white",
          border: `2px solid ${isCritical ? "red" : "black"}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)"
        }}
      >
        {/* Slack à l'intérieur du cercle, en haut */}
        <div
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "2px 5px",
            borderRadius: "5px",
            fontSize: "12px",
            position: "absolute",
            top: "5px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2
          }}
        >
          {task.slack}
        </div>

        {/* Partie supérieure (earlyStart et lateStart) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "60%",
            position: "absolute",
            top: "25%",
          }}
        >
          <span style={{ color: "red", fontSize: "12px" }}>{task.earlyStart}</span>
          <span style={{ color: "black", fontSize: "12px" }}>{task.lateStart}</span>
        </div>

        {/* Trait vertical au milieu */}
        <div
          style={{
            width: "1px",
            height: "15px",
            backgroundColor: "black",
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        ></div>

        {/* Trait horizontal (séparation) */}
        <div
          style={{
            width: "70%",
            height: "1px",
            backgroundColor: "black",
            position: "absolute",
            top: "50%",
            left: "15%"
          }}
        ></div>

        {/* Nom de la tâche en bas */}
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            fontSize: "14px",
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          {task.name}
        </div>
      </div>
    </div>
  );
};

export default CPMGraph;