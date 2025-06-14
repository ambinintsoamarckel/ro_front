"use client";
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "vis-network/styles/vis-network.css";

const CPMGraph = forwardRef(({ projectId, onDataLoaded }, ref) => {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null); // Référence au container avec scrollbars
  const networkRef = useRef(null);
  const dragStateRef = useRef({ isDragging: false, draggedNode: null });
  const autoscrollRef = useRef(null); // Pour gérer l'autoscroll
  const [graphSize, setGraphSize] = React.useState({ width: 1000, height: 800 });
  const [isGraphReady, setIsGraphReady] = React.useState(false);
  const [selectedNodeId, setSelectedNodeId] = React.useState(null);

  // Fonction d'autoscroll améliorée
  const handleAutoscroll = useCallback((mouseX, mouseY) => {
    if (!scrollContainerRef.current || !dragStateRef.current.isDragging) return;

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const scrollZone = 60; // Zone élargie pour une meilleure réactivité
    const maxScrollSpeed = 15; // Vitesse max
    const minScrollSpeed = 3; // Vitesse min

    let scrollX = 0;
    let scrollY = 0;

    // Calcul autoscroll horizontal avec vitesse progressive
    if (mouseX < containerRect.left + scrollZone) {
      const distance = containerRect.left + scrollZone - mouseX;
      const speed = minScrollSpeed + (distance / scrollZone) * (maxScrollSpeed - minScrollSpeed);
      scrollX = -Math.min(speed, maxScrollSpeed);
    } else if (mouseX > containerRect.right - scrollZone) {
      const distance = mouseX - (containerRect.right - scrollZone);
      const speed = minScrollSpeed + (distance / scrollZone) * (maxScrollSpeed - minScrollSpeed);
      scrollX = Math.min(speed, maxScrollSpeed);
    }

    // Calcul autoscroll vertical avec vitesse progressive
    if (mouseY < containerRect.top + scrollZone) {
      const distance = containerRect.top + scrollZone - mouseY;
      const speed = minScrollSpeed + (distance / scrollZone) * (maxScrollSpeed - minScrollSpeed);
      scrollY = -Math.min(speed, maxScrollSpeed);
    } else if (mouseY > containerRect.bottom - scrollZone) {
      const distance = mouseY - (containerRect.bottom - scrollZone);
      const speed = minScrollSpeed + (distance / scrollZone) * (maxScrollSpeed - minScrollSpeed);
      scrollY = Math.min(speed, maxScrollSpeed);
    }

    // Appliquer le scroll avec requestAnimationFrame pour plus de fluidité
    if (scrollX !== 0 || scrollY !== 0) {
      requestAnimationFrame(() => {
        container.scrollLeft += scrollX;
        container.scrollTop += scrollY;
      });
    }
  }, []);

  // Gestionnaire de mouvement de souris global avec throttling
  const handleGlobalMouseMove = useCallback((e) => {
    if (dragStateRef.current.isDragging) {
      // Throttle pour améliorer les performances
      if (!handleGlobalMouseMove.lastCall || Date.now() - handleGlobalMouseMove.lastCall > 16) {
        handleAutoscroll(e.clientX, e.clientY);
        handleGlobalMouseMove.lastCall = Date.now();
      }
    }
  }, [handleAutoscroll]);

  // Fonction pour vérifier si un point est dans les limites du container
  const isPointInContainer = useCallback((x, y) => {
    if (!scrollContainerRef.current) return true;
    
    const containerRect = scrollContainerRef.current.getBoundingClientRect();
    return (
      x >= containerRect.left &&
      x <= containerRect.right &&
      y >= containerRect.top &&
      y <= containerRect.bottom
    );
  }, []);

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
            },
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
            },
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

        // Options avec layout hiérarchique pour placement initial
        const initialOptions = {
          layout: {
            hierarchical: {
              direction: "LR",
              nodeSpacing: 180,
              levelSeparation: 220,
              sortMethod: "directed"
            }
          },
          physics: { enabled: false },
          interaction: {
            dragNodes: false,
            dragView: false,
            zoomView: false
          }
        };

        // Création temporaire du graph avec layout actif
        if (networkRef.current) {
          networkRef.current.destroy();
        }
        networkRef.current = new Network(containerRef.current, { nodes, edges }, initialOptions);

        // Attendre que le layout soit appliqué
        setTimeout(() => {
          if (!networkRef.current) return;
          const positions = networkRef.current.getPositions();

          // Désactiver le layout hiérarchique, activer le drag libre
          const finalOptions = {
            layout: { hierarchical: false },
            physics: { enabled: false },
            interaction: {
              dragNodes: true,
              dragView: false,
              zoomView: false
            }
          };

          // Appliquer la nouvelle config
          networkRef.current.setOptions(finalOptions);

          // Réappliquer les positions manuellement
          for (const [id, pos] of Object.entries(positions)) {
            networkRef.current.moveNode(id, pos.x, pos.y);
          }

          // Calcul du nouveau width/height du canvas
          const xs = Object.values(positions).map(p => p.x);
          const ys = Object.values(positions).map(p => p.y);
          const padding = 150;
          const width = Math.max(1000, Math.abs(Math.max(...xs) - Math.min(...xs)) + padding * 2);
          const height = Math.max(800, Math.abs(Math.max(...ys) - Math.min(...ys)) + padding * 2);

          // Enregistrer la taille
          setGraphSize({ width, height });

          // Limites pour le clamping
          const clampPadding = 40;
          const minX = -width / 2 + clampPadding;
          const maxX = width / 2 - clampPadding;
          const minY = -height / 2 + clampPadding;
          const maxY = height / 2 - clampPadding;

          // Gestionnaire de début de drag
          networkRef.current.on("dragStart", (params) => {
            if (params.nodes && params.nodes.length > 0) {
              dragStateRef.current.isDragging = true;
              dragStateRef.current.draggedNode = params.nodes[0];
            }
          });

          // Gestionnaire pendant le drag - utilise onBeforeDrawing pour intercepter avant le rendu
          networkRef.current.on("beforeDrawing", (ctx) => {
            if (dragStateRef.current.isDragging && dragStateRef.current.draggedNode) {
              // Vérifier la position de la souris pour l'autoscroll
              // Note: nous utilisons les événements de souris globaux pour cela
            }
          });

          // Gestionnaire de fin de drag
          networkRef.current.on("dragEnd", (params) => {
            dragStateRef.current.isDragging = false;
            dragStateRef.current.draggedNode = null;

            if (!params.nodes || params.nodes.length === 0) return;
            
            // Clamping final - vérifier que networkRef.current existe
            if (!networkRef.current) return;
            const posAfter = networkRef.current.getPositions(params.nodes);
            params.nodes.forEach(id => {
              const { x, y } = posAfter[id];
              const cx = Math.max(minX, Math.min(maxX, x));
              const cy = Math.max(minY, Math.min(maxY, y));
              if (cx !== x || cy !== y) {
                networkRef.current.moveNode(id, cx, cy);
              }
            });
          });

          // Affichage une fois prêt
          setTimeout(() => setIsGraphReady(true), 100);
        }, 100);

        // Dessin des badges slack
        networkRef.current.on("afterDrawing", function (ctx) {
          const nodePositions = networkRef.current.getPositions();

          tasks.forEach(task => {
            const pos = nodePositions[task.id];
            if (pos) {
              // Ligne de séparation
              ctx.beginPath();
              ctx.strokeStyle = "#64748b";
              ctx.lineWidth = 2;
              ctx.moveTo(pos.x - 37, pos.y);
              ctx.lineTo(pos.x + 37, pos.y);
              ctx.stroke();

              // Badge slack
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

              // Texte du badge
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
  }, [projectId, onDataLoaded, isPointInContainer]);

  useEffect(() => {
    loadCriticalPathData();

    // Ajouter le gestionnaire global de mouvement de souris
    document.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [loadCriticalPathData, handleGlobalMouseMove]);

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
      ref={scrollContainerRef}
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
          overflow: "hidden",
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