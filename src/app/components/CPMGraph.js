"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Panel
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
    };
  });
  
  return { nodes: layoutedNodes, edges };
};

const CPMGraph = ({ projectId }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [direction, setDirection] = useState('LR'); // LR = gauche à droite, TB = haut en bas

  // Fonction pour changer la direction du graphe
  const changeDirection = () => {
    setDirection(direction === 'LR' ? 'TB' : 'LR');
  };

  // Effet pour appliquer le nouveau layout quand direction change
  useEffect(() => {
    if (nodes.length > 0 && edges.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    }
  }, [direction]);

  useEffect(() => {
    fetch(`http://localhost:3001/critical-path/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
      // Création des nœuds avec une configuration corrigée
      const formattedNodes = data.map((task) => ({
        id: task.id.toString(),
        position: { x: 0, y: 0 }, // position temporaire
        data: { label: <TaskNode task={task} /> },
        style: {
          background: "transparent", // Fond complètement transparent
          border: "none", // Pas de bordure pour le conteneur
          width: 100,  // Un peu plus grand pour donner de l'espace au cercle
          height: 100,
        },
        sourcePosition: direction === 'LR' ? 'right' : 'bottom',
        targetPosition: direction === 'LR' ? 'left' : 'top',
      }));

        // Créer les arêtes
        const formattedEdges = data.flatMap((task) =>
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

        // Appliquer le layout automatique
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          formattedNodes,
          formattedEdges,
          direction
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      })
      .catch((error) => console.error("Erreur chargement des tâches :", error));
  }, [projectId, direction]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="w-full h-[600px] border border-gray-300 shadow-lg rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.5}
        maxZoom={2}
      >
        <Panel position="top-right">
          <button 
            onClick={changeDirection} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {direction === 'LR' ? 'Afficher vertical' : 'Afficher horizontal'}
          </button>
        </Panel>
        <MiniMap 
          nodeStrokeColor={(n) => {
            return n.data.critical ? 'red' : 'black';
          }}
          nodeColor={(n) => {
            return '#D3D3D3';
          }}
        />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

// Composant personnalisé pour un nœud circulaire proprement implémenté
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
          backgroundColor: "white", // Fond blanc au lieu de gris
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