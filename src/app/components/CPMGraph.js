"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

const CPMGraph = ({ projectId }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/critical-path/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        const formattedNodes = data.map((task) => ({
          id: task.id.toString(),
          position: { x: Math.random() * 400, y: Math.random() * 300 },
          data: {
            label: (
              <div style={{ position: "relative" }}>
                {/* Rectangle vert pour le slack (sans bordure noire) */}
                <div
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    fontSize: "12px",
                    position: "absolute",
                    top: "-15px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {task.slack}
                </div>

                {/* Cercle contenant les valeurs */}
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#D3D3D3",
                    border: "2px solid black",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {/* Partie supérieure divisée en 2 */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "80%",
                      position: "absolute",
                      top: "25%",
                    }}
                  >
                    <span style={{ color: "red", fontSize: "12px" }}>
                      {task.earlyStart}
                    </span>
                    <span style={{ color: "black", fontSize: "12px" }}>
                      {task.lateStart}
                    </span>
                  </div>

                  {/* Trait vertical entre earlyStart et lateStart */}
                  <div
                    style={{
                      width: "2px",
                      height: "15px",
                      backgroundColor: "black",
                      position: "absolute",
                      top: "25%",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  ></div>

                  {/* Séparation horizontale */}
                  <div
                    style={{
                      width: "100%",
                      height: "2px",
                      backgroundColor: "black",
                      position: "absolute",
                      top: "50%",
                    }}
                  ></div>

                  {/* Nom de la tâche en bas */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10%",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {task.name}
                  </div>
                </div>
              </div>
            ),
          },
          style: { width: 80, height: 80 },
        }));

        const formattedEdges = data.flatMap((task) =>
          task.successors.map((successor) => ({
            id: `e${task.id}-${successor}`,
            source: task.id.toString(),
            target: successor.toString(),
            animated: task.critical, // Animation sur le chemin critique
            label: task.duration.toString() + "j",
            style: {
              stroke: task.critical ? "red" : "black", // Couleur rouge pour le chemin critique
              strokeWidth: 2,
              fontSize: "12px",
            },
          }))
        );

        setNodes(formattedNodes);
        setEdges(formattedEdges);
      })
      .catch((error) => console.error("Erreur chargement des tâches :", error));
  }, [projectId]);

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
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default CPMGraph;
