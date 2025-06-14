"use client";
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "vis-network/styles/vis-network.css";

const CPMGraph = forwardRef(({ projectId, onDataLoaded }, ref) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [graphSize, setGraphSize] = React.useState({ width: 1000, height: 800 });
  const [isGraphReady, setIsGraphReady] = React.useState(false);

  const loadCriticalPathData = useCallback(() => {
    setIsGraphReady(false);
    fetch(`http://localhost:3001/critical-path/${projectId}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn("Aucune donnée de tâches disponible");
          setIsGraphReady(true);
          return;
        }
        
        const tasks = data;
        const maxEarlyFinish = Math.max(...tasks.map(t => t.earlyFinish), 0);

        const startTaskIds = new Set(tasks.map(task => task.id));
        tasks.forEach(task =>
          task.successors.forEach(s => startTaskIds.delete(s))
        );

        const endTaskIds = tasks
          .filter(task => task.successors.length === 0)
          .map(task => task.id);

        const nodes = new DataSet([
          {
            id: "start",
            label: "DEBUT",
            shape: "circle",
            size: 50,
            color: { 
              background: "#4f46e5",
              border: "#3730a3",
              highlight: {
                background: "#6366f1",
                border: "#4f46e5"
              }
            },
            borderWidth: 3,
            font: { 
              color: "#ffffff", 
              size: 16, 
              face: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", 
              bold: true 
            },
            widthConstraint: {
              minimum: 75,
              maximum: 75
            },
            heightConstraint: {
              minimum: 75,
              maximum: 75
            },
            shadow: {
              enabled: true,
              color: "rgba(79, 70, 229, 0.3)",
              size: 10,
              x: 0,
              y: 4
            }
          },
          ...tasks.map(task => {
            const isCritical = task.slack === 0;
            const label = `\n${task.earlyStart}|${task.lateStart}\n\n${task.name}`;

            return {
              id: task.id,
              label: label,
              shape: "circle",
              color: {
                background: isCritical ? "#fee2e2" : "#e0e7ff",
                border: isCritical ? "#dc2626" : "#4f46e5",
                highlight: {
                  background: isCritical ? "#fecaca" : "#c7d2fe",
                  border: isCritical ? "#ef4444" : "#4338ca"
                }
              },
              borderWidth: isCritical ? 3 : 2,
              font: {
                color: isCritical ? "#b91c1c" : "#312e81",
                size: 16,
                face: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                bold: true,
                multi: true,
                align: "center",
                vadjust: -4
              },
              widthConstraint: {
                minimum: 75,
                maximum: 75
              },
              heightConstraint: {
                minimum: 75,
                maximum: 75
              },
              shadow: {
                enabled: true,
                color: isCritical ? "rgba(220, 38, 38, 0.15)" : "rgba(79, 70, 229, 0.15)",
                size: 8,
                x: 0,
                y: 3
              },
              fixed: { x: false, y: false }
            };
          }),
          {
            id: "end",
            label: `FIN\n${maxEarlyFinish}`,
            shape: "circle",
            size: 70,
            color: { 
              background: "#7c3aed",
              border: "#5b21b6",
              highlight: {
                background: "#8b5cf6",
                border: "#7c3aed"
              }
            },
            borderWidth: 3,
            font: {
              color: "#ffffff",
              size: 16,
              face: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
              bold: true,
              multi: true,
              align: "center"
            },
            widthConstraint: {
              minimum: 75,
              maximum: 75
            },
            heightConstraint: {
              minimum: 75,
              maximum: 75
            },            
            shadow: {
              enabled: true,
              color: "rgba(124, 58, 237, 0.3)",
              size: 12,
              x: 0,
              y: 4
            }
          }
        ]);

        const edges = new DataSet([
          ...Array.from(startTaskIds).map(taskId => ({
            from: "start",
            to: taskId,
            color: { 
              color: "#7c3aed",
              highlight: "#8b5cf6",
              hover: "#8b5cf6"
            },
            width: 2.5,
            smooth: { type: "continuous", roundness: 0.3 },
            arrows: { 
              to: { 
                enabled: true, 
                scaleFactor: 1, 
                type: "arrow" 
              } 
            },
            
            shadow: {
              enabled: true,
              color: "rgba(124, 58, 237, 0.15)",
              size: 5,
              x: 0,
              y: 2
            }
          })),
          ...tasks.flatMap(task =>
            task.successors.map(succ => {
              const target = tasks.find(t => t.id === succ);
              const isCritical = task.slack === 0 && target && target.slack === 0 &&
                                 task.earlyFinish === target.earlyStart;

              return {
                from: task.id,
                to: succ,
                label: task.duration.toString(),
                color: { 
                  color: isCritical ? "#dc2626" : "#4f46e5",
                  highlight: isCritical ? "#ef4444" : "#6366f1",
                  hover: isCritical ? "#ef4444" : "#6366f1"
                },
                width: isCritical ? 3 : 2,
                font: {
                  color: "#1e293b",
                  size: 16,
                  face: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                  bold: true,
                  background: "rgba(255, 255, 255, 0.95)",
                  strokeWidth: 0,
                  strokeColor: "transparent"
                },
                smooth: { type: "continuous", roundness: 0.3 },
                arrows: { 
                  to: { 
                    enabled: true, 
                    scaleFactor: 1, 
                    type: "arrow" 
                  } 
                },
                shadow: {
                  enabled: true,
                  color: isCritical ? "rgba(220, 38, 38, 0.15)" : "rgba(79, 70, 229, 0.15)",
                  size: 5,
                  x: 0,
                  y: 2
                }
              };
            })
          ),
          ...endTaskIds.map(taskId => {
            const task = tasks.find(t => t.id === taskId);
            const isCritical = task.slack === 0 && task.earlyFinish === maxEarlyFinish;

            return {
              from: taskId,
              to: "end",
              label: task.duration.toString(),
              color: { 
                color: isCritical ? "#dc2626" : "#7c3aed",
                highlight: isCritical ? "#ef4444" : "#8b5cf6",
                hover: isCritical ? "#ef4444" : "#8b5cf6"
              },
              width: isCritical ? 3 : 2,
              font: {
                color: "#1e293b",
                size: 16,
                face: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                bold: true,
                background: "rgba(255, 255, 255, 0.95)",
                strokeWidth: 0,
                strokeColor: "transparent"
              },
              smooth: { type: "continuous", roundness: 0.3 },
              arrows: { 
                to: { 
                  enabled: true, 
                  scaleFactor: 1, 
                  type: "arrow" 
                } 
              },
              shadow: {
                enabled: true,
                color: isCritical ? "rgba(220, 38, 38, 0.15)" : "rgba(124, 58, 237, 0.15)",
                size: 5,
                x: 0,
                y: 2
              }
            };
          })
        ]);

        const options = {
          layout: {
            hierarchical: {
              direction: "LR",
              nodeSpacing: 180,
              levelSeparation: 220,
              sortMethod: "directed",
              shakeTowards: "leaves",
              parentCentralization: true
            }
          },
          edges: {
            smooth: { type: "continuous", roundness: 0.3 },
            arrows: { to: { enabled: true, scaleFactor: 1, type: "arrow" } }
          },
          physics: { 
            enabled: false,
            stabilization: { enabled: false }
          },
          interaction: {
            dragNodes: true,
            dragView: true,
            zoomView: false,
            selectConnectedEdges: false,
            hover: true,
            navigationButtons: false,
            keyboard: false,
            hoverConnectedEdges: true
          },
          nodes: {
            chosen: {
              node: function (values, id, selected, hovering) {
                if (id !== "start" && id !== "end") {
                  values.shadow = true;
                  values.shadowSize = 15;
                  values.shadowColor = "rgba(0,0,0,0.1)";
                  values.borderWidth = values.borderWidth + 1;
                }
              }
            }
          }
        };

        if (networkRef.current) {
          networkRef.current.destroy();
        }

        networkRef.current = new Network(
          containerRef.current,
          { nodes, edges },
          options
        );

        const positions = networkRef.current.getPositions();
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
        Object.values(positions).forEach(pos => {
          if (pos.x < minX) minX = pos.x;
          if (pos.x > maxX) maxX = pos.x;
          if (pos.y < minY) minY = pos.y;
          if (pos.y > maxY) maxY = pos.y;
        });
    
        const padding = 150;
        const width = Math.max(1000, Math.abs(maxX - minX) + padding * 2);
        const height = Math.max(800, Math.abs(maxY - minY) + padding * 2);
    
        setGraphSize({ width, height });

        networkRef.current.moveTo({
          position: { x: 0, y: 0 },
          scale: 0.8,
          animation: false
        });

        setTimeout(() => {
          setIsGraphReady(true);
        }, 100);

        networkRef.current.on("afterDrawing", function (ctx) {
          const nodePositions = networkRef.current.getPositions();

          tasks.forEach(task => {
            const pos = nodePositions[task.id];
            if (pos) {
              // Ligne de séparation plus subtile
              ctx.beginPath();
              ctx.strokeStyle = "rgba(203, 213, 225, 0.5)";
              ctx.lineWidth = 1;
              ctx.moveTo(pos.x - 40, pos.y);
              ctx.lineTo(pos.x + 40, pos.y);
              ctx.stroke();

              // Badge slack redessiné
              const badgeWidth = 36;
              const badgeHeight = 24;
              const cornerRadius = 12;
              const badgeX = pos.x - badgeWidth / 2;
              const badgeY = pos.y - 55;

              const isCritical = task.slack === 0;
              
              // Fond du badge avec dégradé
              const gradient = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + badgeHeight);
              gradient.addColorStop(0, isCritical ? "#ef4444" : "#10b981");
              gradient.addColorStop(1, isCritical ? "#dc2626" : "#059669");
              
              ctx.fillStyle = gradient;
              ctx.strokeStyle = isCritical ? "#b91c1c" : "#047857";
              ctx.lineWidth = 1.5;

              ctx.beginPath();
              ctx.moveTo(badgeX + cornerRadius, badgeY);
              ctx.lineTo(badgeX + badgeWidth - cornerRadius, badgeY);
              ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY, badgeX + badgeWidth, badgeY + cornerRadius);
              ctx.lineTo(badgeX + badgeWidth, badgeY + badgeHeight - cornerRadius);
              ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY + badgeHeight, badgeX + badgeWidth - cornerRadius, badgeY + badgeHeight);
              ctx.lineTo(badgeX + cornerRadius, badgeY + badgeHeight);
              ctx.quadraticCurveTo(badgeX, badgeY + badgeHeight, badgeX, badgeY + badgeHeight - cornerRadius);
              ctx.lineTo(badgeX, badgeY + cornerRadius);
              ctx.quadraticCurveTo(badgeX, badgeY, badgeX + cornerRadius, badgeY);
              ctx.closePath();

              ctx.fill();
              ctx.stroke();

              // Texte du badge avec ombre légère
              ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
              ctx.shadowBlur = 2;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 1;
              
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 12px Inter, -apple-system, BlinkMacSystemFont, sans-serif";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(task.slack.toString(), pos.x, badgeY + badgeHeight / 2);
              
              // Reset shadow
              ctx.shadowColor = "transparent";
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
            }
          });
        });

      })
      .catch(err => {
        console.error("Erreur lors du chargement des données:", err);
        setIsGraphReady(true);
      });
  }, [projectId, onDataLoaded]);

  useEffect(() => {
    loadCriticalPathData();

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [loadCriticalPathData]);

  useImperativeHandle(ref, () => ({
    getNodes: () => networkRef.current?.body.data.nodes || null,
    getEdges: () => networkRef.current?.body.data.edges || null,
    reloadData: () => loadCriticalPathData(),
    fitView: () => {
      if (networkRef.current) {
        networkRef.current.fit();
      }
    }
  }));

  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        overflow: "auto",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06)",
        background: "#ffffff",
        position: "relative"
      }}
    >
      {!isGraphReady && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 10
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px"
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f1f5f9",
                borderTop: "4px solid #4f46e5",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}
            />
            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: "500"
              }}
            >
              Chargement du graphique...
            </div>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          width: `${graphSize.width}px`,
          height: `${graphSize.height}px`,
          position: "relative",
          opacity: isGraphReady ? 1 : 0,
          transition: "opacity 0.3s ease-in-out"
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

CPMGraph.displayName = "CPMGraph";

export default CPMGraph;