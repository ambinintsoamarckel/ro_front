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
            size: 45,
            color: { background: "#4CAF50", border: "#2E7D32" },
            borderWidth: 2,
            font: { color: "white", size: 12, face: "Arial", bold: true },
            shadow: { enabled: true, color: "rgba(0,0,0,0.2)", size: 4, x: 2, y: 2 }
          },
          ...tasks.map(task => {
            const isCritical = task.slack === 0;
            const label = `${task.earlyStart} | ${task.lateStart}\n${task.name}`;

            return {
              id: task.id,
              label: label,
              shape: "circle",
              color: {
                background: "white",
                border: "#000000"
              },
              borderWidth: 2,
              font: {
                color: "#000000",
                size: 12, // taille réduite
                face: "Courier New",
                bold: true,
                multi: true,
                align: "center",
                vadjust: -4 // remonte légèrement le texte
              },
              widthConstraint: {
                minimum: 100,
                maximum: 100
              },
              heightConstraint: {
                minimum: 100,
                maximum: 100
              },
              fixed: { x: false, y: false }
            };
          }),
          {
            id: "end",
            label: `END\n${maxEarlyFinish}`,
            shape: "circle",
            size: 45,
            color: { background: "#FF5722", border: "#D84315" },
            borderWidth: 2,
            font: {
              color: "white",
              size: 12,
              face: "Arial",
              bold: true,
              multi: true,
              align: "center"
            },
            shadow: {
              enabled: true,
              color: "rgba(0,0,0,0.2)",
              size: 4,
              x: 2,
              y: 2
            }
          }
        ]);

        const edges = new DataSet([
          ...Array.from(startTaskIds).map(taskId => ({
            from: "start",
            to: taskId,
            color: { color: "#666666" },
            width: 2,
            smooth: { type: "continuous", roundness: 0.2 },
            arrows: { to: { enabled: true, scaleFactor: 0.8, type: "arrow" } }
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
                color: { color: isCritical ? "#F44336" : "#666666" },
                width: isCritical ? 3 : 2,
                font: {
                  color: "#333333",
                  size: 11,
                  face: "Arial",
                  bold: true,
                  background: "rgba(255, 255, 255, 0.9)",
                  strokeWidth: 1,
                  strokeColor: "#ffffff"
                },
                smooth: { type: "continuous", roundness: 0.2 },
                arrows: { to: { enabled: true, scaleFactor: 0.8, type: "arrow" } }
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
              color: { color: isCritical ? "#F44336" : "#666666" },
              width: isCritical ? 3 : 2,
              font: {
                color: "#333333",
                size: 11,
                face: "Arial",
                bold: true,
                background: "rgba(255, 255, 255, 0.9)",
                strokeWidth: 1,
                strokeColor: "#ffffff"
              },
              smooth: { type: "continuous", roundness: 0.2 },
              arrows: { to: { enabled: true, scaleFactor: 0.8, type: "arrow" } }
            };
          })
        ]);

        const options = {
          layout: {
            hierarchical: {
              direction: "LR",
              nodeSpacing: 150,
              levelSeparation: 200,
              sortMethod: "directed",
              shakeTowards: "leaves",
              parentCentralization: true
            }
          },
          edges: {
            smooth: { type: "continuous", roundness: 0.2 },
            arrows: { to: { enabled: true, scaleFactor: 0.8, type: "arrow" } }
          },
          physics: { enabled: false },
          interaction: {
            dragNodes: true,
            dragView: true,
            zoomView: true,
            selectConnectedEdges: false,
            hover: true,
            navigationButtons: false,
            keyboard: false
          },
          nodes: {
            chosen: {
              node: function (values, id, selected, hovering) {
                values.shadow = true;
                values.shadowSize = 8;
                values.shadowColor = "rgba(0,0,0,0.3)";
                values.borderWidth = 3;
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

        networkRef.current.on("afterDrawing", function (ctx) {
          const nodePositions = networkRef.current.getPositions();

          tasks.forEach(task => {
            const pos = nodePositions[task.id];
            if (pos) {
              ctx.beginPath();
              ctx.strokeStyle = "#999999";
              ctx.lineWidth = 1;
              ctx.moveTo(pos.x - 40, pos.y);
              ctx.lineTo(pos.x + 40, pos.y);
              ctx.stroke();

              const badgeWidth = 30;
              const badgeHeight = 20;
              const cornerRadius = 6;
              const badgeX = pos.x - badgeWidth / 2;
              const badgeY = pos.y - 50;

              const isCritical = task.slack === 0;
              ctx.fillStyle = isCritical ? "#F44336" : "#4CAF50";
              ctx.strokeStyle = isCritical ? "#C62828" : "#2E7D32";
              ctx.lineWidth = 2;

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

              ctx.fillStyle = "white";
              ctx.font = "bold 12px Arial";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(task.slack.toString(), pos.x, badgeY + badgeHeight / 2);
            }
          });
        });

        setTimeout(() => {
          if (networkRef.current) {
            networkRef.current.fit({
              animation: {
                duration: 800,
                easingFunction: "easeInOutQuad"
              }
            });
          }
        }, 200);

        if (onDataLoaded) onDataLoaded(tasks);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des données:", err);
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
      ref={containerRef}
      style={{
        width: "100%",
        height: "80vh",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#fafafa"
      }}
    />
  );
});

CPMGraph.displayName = "CPMGraph";

export default CPMGraph;