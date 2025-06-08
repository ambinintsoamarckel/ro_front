"use client";
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "vis-network/styles/vis-network.css";

const CPMGraph = forwardRef(({ projectId, onDataLoaded }, ref) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  const loadCriticalPathData = useCallback(() => {
    fetch(`http://localhost:3001/critical-path/${projectId}`)
      .then(res => res.json())
      .then(tasks => {
        const maxEarlyFinish = Math.max(...tasks.map(t => t.earlyFinish), 0);
        
        // Identifier les tâches de début et de fin
        const startTaskIds = new Set(tasks.map(task => task.id));
        tasks.forEach(task => 
          task.successors.forEach(s => startTaskIds.delete(s))
        );
        
        const endTaskIds = tasks
          .filter(task => task.successors.length === 0)
          .map(task => task.id);

        // Créer les noeuds
        const nodes = new DataSet([
          // Noeud de début
          { 
            id: "start", 
            label: "DÉBUT",
            shape: "circle",
            color: { 
              background: "#4CAF50", 
              border: "#2E7D32"
            },
            borderWidth: 3,
            size: 50,
            font: { 
              color: "white", 
              size: 14, 
              face: "Arial", 
              bold: true
            },
            shadow: {
              enabled: true,
              color: "rgba(76, 175, 80, 0.5)",
              size: 8,
              x: 2,
              y: 2
            }
          },
          // Noeuds de tâches
          ...tasks.map(task => {
            const isCritical = task.slack === 0;
            
            // Format du label avec mise en évidence du slack

            const timingText = `${task.earlyStart} | ${task.lateStart}`;
            const nameText = task.name;
            const fullLabel = `\n${timingText}\n${nameText}`;
            
            return {
              id: task.id,
              label: fullLabel,
              color: {
                background: isCritical ? "#FFCDD2" : "#E3F2FD",
                border: isCritical ? "#D32F2F" : "#1976D2"
              },
              borderWidth: isCritical ? 4 : 2,
              shape: "circle",
              size: 60,
              font: { 
                color: isCritical ? "#B71C1C" : "#0D47A1", 
                size: 10, 
                face: "Arial",
                bold: true,
                multi: true,
                align: "center"
              },
              shadow: {
                enabled: true,
                color: isCritical ? "rgba(211, 47, 47, 0.4)" : "rgba(25, 118, 210, 0.4)",
                size: 6,
                x: 2,
                y: 2
              }
            };
          }),
          // Noeud de fin
          { 
            id: "end", 
            label: `FIN\n(${maxEarlyFinish})`,
            shape: "circle",
            color: { 
              background: "#F44336", 
              border: "#B71C1C"
            },
            borderWidth: 3,
            size: 50,
            font: { 
              color: "white", 
              size: 14, 
              face: "Arial", 
              bold: true,
              multi: true
            },
            shadow: {
              enabled: true,
              color: "rgba(244, 67, 54, 0.5)",
              size: 8,
              x: 2,
              y: 2
            }
          }
        ]);

        // Créer les arêtes
        const edges = new DataSet([
          // Arêtes de début (vertes)
          ...Array.from(startTaskIds).map(taskId => ({
            from: "start",
            to: taskId,
            color: { color: "#4CAF50" },
            width: 3,
            smooth: {
              type: "continuous",
              roundness: 0.3
            },
            arrows: {
              to: { 
                enabled: true,
                scaleFactor: 1,
                type: "arrow"
              }
            }
          })),
          
          // Arêtes entre tâches
          ...tasks.flatMap(task =>
            task.successors.map(succ => {
              const target = tasks.find(t => t.id === succ);
              const isCritical = task.slack === 0 && target && target.slack === 0 && 
                               task.earlyFinish === target.earlyStart;
              
              return {
                from: task.id,
                to: succ,
                label: task.duration.toString(),
                color: { color: isCritical ? "#D32F2F" : "#1976D2" },
                width: isCritical ? 4 : 2,
                font: { 
                  color: isCritical ? "#D32F2F" : "#1976D2", 
                  size: 12,
                  face: "Arial",
                  bold: true,
                  background: "white",
                  strokeWidth: 2,
                  strokeColor: "white"
                },
                smooth: {
                  type: "continuous",
                  roundness: 0.3
                },
                arrows: {
                  to: { 
                    enabled: true,
                    scaleFactor: 1,
                    type: "arrow"
                  }
                }
              };
            })
          ),
          
          // Arêtes vers la fin
          ...endTaskIds.map(taskId => {
            const task = tasks.find(t => t.id === taskId);
            const isCritical = task.slack === 0 && task.earlyFinish === maxEarlyFinish;
            
            return {
              from: taskId,
              to: "end",
              label: task.duration.toString(),
              color: { color: isCritical ? "#D32F2F" : "#1976D2" },
              width: isCritical ? 4 : 2,
              font: { 
                color: isCritical ? "#D32F2F" : "#1976D2", 
                size: 12,
                face: "Arial",
                bold: true,
                background: "white",
                strokeWidth: 2,
                strokeColor: "white"
              },
              smooth: {
                type: "continuous",
                roundness: 0.3
              },
              arrows: {
                to: { 
                  enabled: true,
                  scaleFactor: 1,
                  type: "arrow"
                }
              }
            };
          })
        ]);

        // Configuration du réseau
        const options = {
          layout: {
            hierarchical: {
              direction: "LR",
              nodeSpacing: 120,
              levelSeparation: 180,
              sortMethod: "directed",
              shakeTowards: "leaves"
            }
          },
          edges: {
            smooth: {
              type: "continuous",
              roundness: 0.3
            },
            arrows: {
              to: { 
                enabled: true,
                scaleFactor: 1,
                type: "arrow"
              }
            }
          },
          physics: {
            enabled: false
          },
          interaction: {
            dragNodes: true,
            dragView: true,
            zoomView: true,
            selectConnectedEdges: false,
            hover: false,
            navigationButtons: false,
            keyboard: false
          },
          nodes: {
            chosen: {
              node: function(values, id, selected, hovering) {
                values.shadow = true;
                values.shadowSize = 15;
                values.shadowColor = "rgba(0,0,0,0.5)";
                values.borderWidth = values.borderWidth + 1;
              }
            }
          }
        };

        // Créer ou mettre à jour le réseau
        if (networkRef.current) {
          networkRef.current.destroy();
        }

        networkRef.current = new Network(
          containerRef.current,
          { nodes, edges },
          options
        );

        // Custom rendering pour ajouter les badges verts pour le slack
        networkRef.current.on("afterDrawing", function (ctx) {
          const nodePositions = networkRef.current.getPositions();
          
          tasks.forEach(task => {
            const pos = nodePositions[task.id];
            if (pos) {
              // Dessiner un badge vert pour le slack en haut du nœud
              ctx.fillStyle = "#4CAF50";
              ctx.strokeStyle = "#2E7D32";
              ctx.lineWidth = 2;
              
              // Badge circulaire
              const badgeX = pos.x;
              const badgeY = pos.y - 35;
              const badgeRadius = 12;
              
              ctx.beginPath();
              ctx.arc(badgeX, badgeY, badgeRadius, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();
              
              // Texte du slack dans le badge
              ctx.fillStyle = "white";
              ctx.font = "bold 10px Arial";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(task.slack.toString(), badgeX, badgeY);
            }
          });
        });

        // Ajuster la vue initiale
        setTimeout(() => {
          if (networkRef.current) {
            networkRef.current.fit({
              animation: {
                duration: 500,
                easingFunction: "easeInOutQuad"
              }
            });
          }
        }, 100);

        if (onDataLoaded) onDataLoaded(tasks);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des données:", err);
      });
  }, [projectId, onDataLoaded]);

  useEffect(() => {
    loadCriticalPathData();
    
    // Cleanup
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [loadCriticalPathData]);

  useImperativeHandle(ref, () => ({
    getNodes: () => networkRef.current ? networkRef.current.body.data.nodes : null,
    getEdges: () => networkRef.current ? networkRef.current.body.data.edges : null,
    reloadData: () => loadCriticalPathData(),
    fitView: () => {
      if (networkRef.current) {
        networkRef.current.fit();
      }
    }
  }));

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "80vh",
        border: "2px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        position: "relative",
        background: `
          linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%),
          radial-gradient(circle, #e0e0e0 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 20px 20px",
        backgroundBlendMode: "multiply, normal"
      }}
    />
  );
});

CPMGraph.displayName = "CPMGraph";

export default CPMGraph;