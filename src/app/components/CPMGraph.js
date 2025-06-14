"use client";
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "vis-network/styles/vis-network.css";

const CPMGraph = forwardRef(({ projectId, onDataLoaded }, ref) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [graphSize, setGraphSize] = React.useState({ width: 1000, height: 800 });

  const loadCriticalPathData = useCallback(() => {
    fetch(`http://localhost:3001/critical-path/${projectId}`)
      .then(res => res.json())
      .then(data => {
        // Vérifier si les données sont valides
        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn("Aucune donnée de tâches disponible");
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
            label: "START",
            shape: "circle",
            size: 50,
            color: { 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "#4c63d2"
            },
            borderWidth: 3,
            font: { 
              color: "#ffffff", 
              size: 13, 
              face: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", 
              bold: true 
            },
            shadow: { 
              enabled: true, 
              color: "rgba(102, 126, 234, 0.3)", 
              size: 8, 
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
                background: isCritical ? "#fecaca" : "#bfdbfe",
                border: isCritical ? "#ef4444" : "#3b82f6"
              },
              borderWidth: isCritical ? 3 : 2,
              font: {
                color: isCritical ? "#dc2626" : "#1d4ed8",
                size: 13,
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
                color: isCritical ? "rgba(239, 68, 68, 0.2)" : "rgba(59, 130, 246, 0.2)",
                size: 6,
                x: 0,
                y: 3
              },
              fixed: { x: false, y: false }
            };
          }),
          {
            id: "end",
            label: `END\n${maxEarlyFinish}`,
            shape: "circle",
            size: 70,
            color: { 
              background: "#f472b6",
              border: "#e11d48"
            },
            borderWidth: 3,
            font: {
              color: "#ffffff",
              size: 14,
              face: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
              bold: true,
              multi: true,
              align: "center"
            },
            shadow: {
              enabled: true,
              color: "rgba(244, 114, 182, 0.3)",
              size: 10,
              x: 0,
              y: 4
            }
          }
        ]);

        const edges = new DataSet([
          ...Array.from(startTaskIds).map(taskId => ({
            from: "start",
            to: taskId,
            color: { color: "#8b5cf6" },
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
              color: "rgba(139, 92, 246, 0.2)",
              size: 3,
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
                color: { color: isCritical ? "#ef4444" : "#3b82f6" },
                width: isCritical ? 3 : 2,
                font: {
                  color: "#374151",
                  size: 13,
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
                  color: isCritical ? "rgba(239, 68, 68, 0.2)" : "rgba(59, 130, 246, 0.2)",
                  size: 3,
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
              color: { color: isCritical ? "#ef4444" : "#f472b6" },
              width: isCritical ? 3 : 2,
              font: {
                color: "#374151",
                size: 13,
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
                color: isCritical ? "rgba(239, 68, 68, 0.2)" : "rgba(244, 114, 182, 0.2)",
                size: 3,
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
            keyboard: false
          },
          nodes: {
            chosen: {
              node: function (values, id, selected, hovering) {
                // Ne pas appliquer d'effet hover aux nœuds START et END
                if (id !== "start" && id !== "end") {
                  values.shadow = true;
                  values.shadowSize = 12;
                  values.shadowColor = "rgba(0,0,0,0.2)";
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

        // Calculer immédiatement la taille pour éviter les changements visuels
        const positions = networkRef.current.getPositions();
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
        Object.values(positions).forEach(pos => {
          if (pos.x < minX) minX = pos.x;
          if (pos.x > maxX) maxX = pos.x;
          if (pos.y < minY) minY = pos.y;
          if (pos.y > maxY) maxY = pos.y;
        });
    
        // Ajouter une marge pour les badges et les ombres
        const padding = 150;
        const width = Math.max(1000, Math.abs(maxX - minX) + padding * 2);
        const height = Math.max(800, Math.abs(maxY - minY) + padding * 2);
    
        setGraphSize({ width, height });

        // Fixer le zoom et la position une seule fois
        networkRef.current.moveTo({
          position: { x: 0, y: 0 },
          scale: 0.8,
          animation: false
        });

        networkRef.current.on("afterDrawing", function (ctx) {
          const nodePositions = networkRef.current.getPositions();

          tasks.forEach(task => {
            const pos = nodePositions[task.id];
            if (pos) {
              // Ligne de séparation avec style moderne
              const gradient = ctx.createLinearGradient(pos.x - 40, pos.y, pos.x + 40, pos.y);
              gradient.addColorStop(0, "rgba(148, 163, 184, 0.1)");
              gradient.addColorStop(0.5, "rgba(148, 163, 184, 0.6)");
              gradient.addColorStop(1, "rgba(148, 163, 184, 0.1)");
              
              ctx.beginPath();
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1.5;
              ctx.moveTo(pos.x - 40, pos.y);
              ctx.lineTo(pos.x + 40, pos.y);
              ctx.stroke();

              // Badge slack avec design moderne
              const badgeWidth = 36;
              const badgeHeight = 24;
              const cornerRadius = 12;
              const badgeX = pos.x - badgeWidth / 2;
              const badgeY = pos.y - 55;

              const isCritical = task.slack === 0;
              
              ctx.fillStyle = isCritical ? "#ef4444" : "#22c55e";
              ctx.strokeStyle = isCritical ? "#dc2626" : "#16a34a";
              ctx.lineWidth = 2;

              // Ombre du badge
              ctx.shadowColor = isCritical ? "rgba(239, 68, 68, 0.3)" : "rgba(34, 197, 94, 0.3)";
              ctx.shadowBlur = 6;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 2;

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

              // Reset shadow
              ctx.shadowColor = "transparent";
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;

              // Text du badge
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 13px Inter, -apple-system, BlinkMacSystemFont, sans-serif";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(task.slack.toString(), pos.x, badgeY + badgeHeight / 2);
            }
          });
        });

      })
      .catch(err => {
        console.error("Erreur lors du chargement des données:", err);
        // Optionnel : afficher un état d'erreur à l'utilisateur
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
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05), 0 4px 16px rgba(0, 0, 0, 0.08)",
        background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)"
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: `${graphSize.width}px`,
          height: `${graphSize.height}px`,
          position: "relative"
        }}
      />
    </div>
  );
});

CPMGraph.displayName = "CPMGraph";

export default CPMGraph;