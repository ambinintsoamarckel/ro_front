"use client";

import React, {  useImperativeHandle,forwardRef, useState, useEffect, useCallback, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,getBezierPath, getSimpleBezierPath, getSmoothStepPath 
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";


const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  labelStyle,
}) => {
  // Paramètres de courbure personnalisés
  const edgeParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 30,  // Rayon de courbure
  };

  // Générer le chemin avec courbure
  const [path, labelX, labelY] = getSmoothStepPath(edgeParams);

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          fill: 'none',
          strokeWidth: style.strokeWidth || 2,
        }}
        className="react-flow__edge-path"
        d={path}
        markerEnd={markerEnd}
      />
      
      {/* Espace pour la durée avec un petit rectangle blanc */}
      {label && (
        <g>
          <rect
            x={labelX - 15}
            y={labelY - 10}
            width={30}
            height={20}
            fill="white"
            stroke="none"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            alignmentBaseline="middle"
            style={{
              ...labelStyle,
              fontSize: "12px",
              fontWeight: "bold",
            }}
            className="react-flow__edge-label"
          >
            {label}
          </text>
        </g>
      )}
    </>
  );
};

// Configuration pour l'algorithme de layout Dagre
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  // Configuration de base pour le graphe dagre
  dagreGraph.setGraph({ rankdir: direction, nodesep: 120, ranksep: 180 });
  
  // Ajouter les nœuds au graphe dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 100, height: 100 });
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
        x: nodeWithPosition.x - 50,
        y: nodeWithPosition.y - 50,
      },
      draggable: true,
    };
  });
  
  return { nodes: layoutedNodes, edges };
};

// Fonction améliorée pour calculer la largeur nécessaire du graphe
const calculateGraphWidth = (nodes) => {
  if (!nodes || nodes.length === 0) return 1200;
  
  // Définir une marge minimale à gauche pour le graphe
  const leftMargin = 100;
  
  // Trouver la position x minimale (le nœud le plus à gauche)
  const leftmostNode = nodes.reduce((min, node) => {
    return (node.position.x < min.position.x) ? node : min;
  }, nodes[0]);
  
  // Trouver le nœud le plus à droite
  const rightmostNode = nodes.reduce((max, node) => {
    return (node.position.x > max.position.x) ? node : max;
  }, nodes[0]);
  
  // Calculer la largeur totale nécessaire avec marges à gauche et à droite
  const totalWidth = Math.max(0, leftmostNode.position.x) + 
                     (rightmostNode.position.x - leftmostNode.position.x) + 
                     300; // marge droite
  
  return Math.max(1200, totalWidth);
};

// Fonction améliorée pour calculer la hauteur nécessaire du graphe
const calculateGraphHeight = (nodes) => {
  if (!nodes || nodes.length === 0) return 800;
  
  // Définir une marge minimale en haut pour le graphe
  const topMargin = 100;
  
  // Trouver la position y minimale (le nœud le plus haut)
  const topmostNode = nodes.reduce((min, node) => {
    return (node.position.y < min.position.y) ? node : min;
  }, nodes[0]);
  
  // Trouver le nœud le plus bas
  const bottomNode = nodes.reduce((max, node) => {
    return (node.position.y > max.position.y) ? node : max;
  }, nodes[0]);
  
  // Calculer la hauteur totale nécessaire avec marges en haut et en bas
  const totalHeight = Math.max(0, topmostNode.position.y) + 
                      (bottomNode.position.y - topmostNode.position.y) + 
                      200; // marge bas
  
  return Math.max(800, totalHeight);
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
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "white",
          border: `4px solid ${color}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: color,
            textAlign: "center",
            whiteSpace: "pre-line" // Pour supporter les sauts de ligne
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};



const CPMGraph = forwardRef((props, ref) => {
  const { projectId, onDataLoaded } = props;
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [graphWidth, setGraphWidth] = useState(1200);
  const [graphHeight, setGraphHeight] = useState(800);
  const [graphTransform, setGraphTransform] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const flowContainerRef = useRef(null);
  const direction = 'LR';
  
  const loadCriticalPathData = useCallback(() => {
    setIsLoading(true);
    fetch(`http://localhost:3001/critical-path/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        // Trouver le max earlyFinish pour le nœud de fin
        const maxEarlyFinish = Math.max(...data.map(task => task.earlyFinish), 0);
        
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
            width: 120,
            height: 120,
          },
          sourcePosition: 'right',
          targetPosition: 'left',
          draggable: true,
        };
        
        // Création du nœud de fin avec le max earlyFinish
        const endNode = {
          id: 'end',
          position: { x: 0, y: 0 },
          data: { label: <SpecialNode label={`Fin\n(${maxEarlyFinish})`} isStart={false} /> },
          style: {
            background: "transparent",
            border: "none",
            width: 120,
            height: 120,
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
            width: 120,
            height: 120,
          },
          sourcePosition: 'right',
          targetPosition: 'left',
          draggable: true,
        }));
        
        // Combinaison de tous les nœuds
        const formattedNodes = [startNode, ...taskNodes, endNode];

        // Fonction pour déterminer si un arc est critique
        const isEdgeCritical = (sourceTask, targetTask) => {
          return sourceTask.critical && 
                 targetTask.critical && 
                 sourceTask.earlyFinish === targetTask.earlyStart;
        };

        // Créer les arêtes entre les tâches
        const taskEdges = data.flatMap((task) =>
          task.successors.map((successor) => {
            const targetTask = data.find(t => t.id.toString() === successor.toString());
            return {
              id: `e${task.id}-${successor}`,
              source: task.id.toString(),
              target: successor.toString(),
              label: task.duration.toString(),
              labelStyle: { 
                fontSize: "14px", 
                fill: isEdgeCritical(task, targetTask) ? "red" : "black" 
              },
              style: {
                stroke: isEdgeCritical(task, targetTask) ? "red" : "black",
                strokeWidth: isEdgeCritical(task, targetTask) ? 4 : 2,
                strokeDasharray: 'none' // Trait entier
              },
            };
          })
        );
        
        // Créer les arêtes depuis le nœud de début vers les premières tâches
        const startEdges = Array.from(startTaskIds).map(taskId => ({
          id: `estart-${taskId}`,
          source: 'start',
          target: taskId,
          style: {
            stroke: "green",
            strokeWidth: 3,
            strokeDasharray: 'none' // Trait entier
          },
        }));
        
        // Créer les arêtes depuis les dernières tâches vers le nœud de fin
        const endEdges = Array.from(endTaskIds).map(taskId => {
          const sourceTask = data.find(t => t.id.toString() === taskId);
          
          // Condition pour un arc rouge : 
          // 1. La tâche source est critique
          // 2. Son earlyFinish est égal au maxEarlyFinish
          const isEndEdgeCritical = sourceTask.critical && 
                                     sourceTask.earlyFinish === maxEarlyFinish;
  
          return {
            id: `e${taskId}-end`,
            source: taskId,
            target: 'end',
            label: sourceTask.duration.toString(),
            labelStyle: { 
              fontSize: "14px", 
              fill: isEndEdgeCritical ? "red" : "black" 
            },
            style: {
              stroke: isEndEdgeCritical ? "red" : "black",
              strokeWidth: isEndEdgeCritical ? 4 : 3,
              strokeDasharray: 'none'
            },
          };
        });
        
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
        
        const calculatedWidth = calculateGraphWidth(layoutedNodes);
        const calculatedHeight = calculateGraphHeight(layoutedNodes);
        setGraphWidth(calculatedWidth);
        setGraphHeight(Math.max(calculatedHeight, 800));

        if (onDataLoaded) {
          onDataLoaded(data);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur chargement des tâches :", error);
        setIsLoading(false);
      });
  }, [projectId]);
  
  useEffect(() => {
    loadCriticalPathData();
  }, [loadCriticalPathData]);

  const onNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
      
      // Trouver les positions extrêmes pour tous les nœuds
      if (updatedNodes.length > 0) {
        const leftmostNode = updatedNodes.reduce((min, node) => {
          return (node.position.x < min.position.x) ? node : min;
        }, updatedNodes[0]);
        
        const topmostNode = updatedNodes.reduce((min, node) => {
          return (node.position.y < min.position.y) ? node : min;
        }, updatedNodes[0]);
        
        // Ajuster le graphTransform pour s'assurer que les nœuds ne sortent pas du viewport
        const newTransform = {
          x: Math.min(0, -leftmostNode.position.x + 100),
          y: Math.min(0, -topmostNode.position.y + 100)
        };
        setGraphTransform(newTransform);
      }
      
      // Recalculer la largeur et hauteur du graphe après chaque changement de nœud
      const newWidth = calculateGraphWidth(updatedNodes);
      const newHeight = calculateGraphHeight(updatedNodes);
      setGraphWidth(newWidth);
      setGraphHeight(Math.max(newHeight, 800));
    },
    [nodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Style du conteneur principal avec des barres de défilement explicites
  const containerStyle = {
    width: "100%",
    height: "80vh",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    overflowX: "auto", // Barre de défilement horizontale explicite
    overflowY: "auto", // Barre de défilement verticale explicite
    margin: "20px 0",
    position: "relative"
  };

  // Style du conteneur interne qui définit la taille réelle du graphe
  const innerContainerStyle = {
    width: `${graphWidth}px`,
    height: `${graphHeight}px`,
    position: "relative", // Nécessaire pour que le contenu s'affiche correctement
    transform: `translate(${graphTransform.x}px, ${graphTransform.y}px)`,
    transition: "transform 0.3s ease" // Animation fluide pour le repositionnement
  };

  // Style spécifique pour ReactFlow avec dimensions complètes
  const reactFlowStyle = {
    width: "100%",
    height: "100%"
  };
  // Ajout d'une propriété pour permettre un rechargement manuel


  // Exposer la méthode de rechargement si nécessaire
  useImperativeHandle(ref, () => ({
    getNodes: () => nodes,
    getEdges: () => edges,
    reloadData: () => loadCriticalPathData()
  }));
  const edgeTypes = {
    custom: CustomEdge,
  };
  return (
    <div>
    {isLoading ? (
      <div>Chargement du graphe...</div>
    ) : (
    <div style={containerStyle} ref={flowContainerRef}>
      <div style={innerContainerStyle}>
      <ReactFlow
          nodes={nodes}
          edges={edges.map(edge => ({
            ...edge,
            type: 'custom', // Utiliser le type d'arête personnalisé
          }))}
          edgeTypes={edgeTypes} // Ajouter cette ligne
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
          <Background variant="dots" gap={15} size={1.5} />
          {/* MiniMap supprimée */}
        </ReactFlow>
      </div>
    </div>
  )}
  </div>
  );
});

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
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "white",
          border: `${isCritical ? "3px" : "2px"} solid ${isCritical ? "red" : "black"}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
        }}
      >
        {/* Slack à l'intérieur du cercle, en haut */}
        <div
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "3px 6px",
            borderRadius: "5px",
            fontSize: "14px",
            position: "absolute",
            top: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            fontWeight: "bold"
          }}
        >
          {task.slack}
        </div>

        {/* Partie supérieure (earlyStart et lateStart) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "70%",
            position: "absolute",
            top: "30%",
          }}
        >
          <span style={{ color: "red", fontSize: "14px", fontWeight: "bold" }}>{task.earlyStart}</span>
          <span style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}>{task.lateStart}</span>
        </div>

        {/* Trait vertical au milieu */}
        <div
          style={{
            width: "1px",
            height: "18px",
            backgroundColor: "black",
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        ></div>

        {/* Trait horizontal (séparation) */}
        <div
          style={{
            width: "75%",
            height: "1px",
            backgroundColor: "black",
            position: "absolute",
            top: "50%",
            left: "12.5%"
          }}
        ></div>

        {/* Nom de la tâche en bas */}
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
            maxWidth: "80%",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {task.name}
        </div>
      </div>
    </div>
  );
};

export default CPMGraph;