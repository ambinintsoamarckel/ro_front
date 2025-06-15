"use client";
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "vis-network/styles/vis-network.css";

const CPMGraph = forwardRef(({ projectId, onDataLoaded }, ref) => {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const networkRef = useRef(null);
  const dragStateRef = useRef({ isDragging: false, draggedNode: null });
  const autoscrollIntervalRef = useRef(null);
  const animationRef = useRef(null);
  const criticalPathRef = useRef([]);
  const animationTimeRef = useRef(0);
  const [graphSize, setGraphSize] = React.useState({ width: 1400, height: 1000 });
  const [isGraphReady, setIsGraphReady] = React.useState(false);
  const [selectedNodeId, setSelectedNodeId] = React.useState(null);

  // Animation du chemin critique
  const animateCriticalPath = useCallback(() => {
    if (!networkRef.current || criticalPathRef.current.length === 0) return;
  
    // Utiliser le temps réel au lieu d'un compteur manuel
    const startTime = performance.now();
  
    const animate = () => {
      // Calculer le temps écoulé en millisecondes depuis le début
      const currentTimeMs = performance.now() - startTime;
      // Convertir en secondes avec une vitesse globale constante
      animationTimeRef.current = currentTimeMs * 0.003; // 0.001 = vitesse normale
      
      // Force le redraw pour déclencher afterDrawing
      if (networkRef.current) {
        networkRef.current.redraw();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  }, []);
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Fonction d'autoscroll continue et fluide
  const startAutoscroll = useCallback((mouseX, mouseY) => {
    if (!scrollContainerRef.current || !dragStateRef.current.isDragging) return;

    // Nettoyer l'ancien interval
    if (autoscrollIntervalRef.current) {
      clearInterval(autoscrollIntervalRef.current);
    }

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const scrollZone = 80;
    const maxScrollSpeed = 8;
    const minScrollSpeed = 2;

    let scrollSpeedX = 0;
    let scrollSpeedY = 0;

    if (mouseX < containerRect.left + scrollZone) {
      const distance = Math.max(0, containerRect.left + scrollZone - mouseX);
      const normalizedDistance = Math.min(1, distance / scrollZone);
      scrollSpeedX = -(minScrollSpeed + normalizedDistance * (maxScrollSpeed - minScrollSpeed));
    } else if (mouseX > containerRect.right - scrollZone) {
      const distance = Math.max(0, mouseX - (containerRect.right - scrollZone));
      const normalizedDistance = Math.min(1, distance / scrollZone);
      scrollSpeedX = minScrollSpeed + normalizedDistance * (maxScrollSpeed - minScrollSpeed);
    }

    if (mouseY < containerRect.top + scrollZone) {
      const distance = Math.max(0, containerRect.top + scrollZone - mouseY);
      const normalizedDistance = Math.min(1, distance / scrollZone);
      scrollSpeedY = -(minScrollSpeed + normalizedDistance * (maxScrollSpeed - minScrollSpeed));
    } else if (mouseY > containerRect.bottom - scrollZone) {
      const distance = Math.max(0, mouseY - (containerRect.bottom - scrollZone));
      const normalizedDistance = Math.min(1, distance / scrollZone);
      scrollSpeedY = minScrollSpeed + normalizedDistance * (maxScrollSpeed - minScrollSpeed);
    }

    if (scrollSpeedX !== 0 || scrollSpeedY !== 0) {
      autoscrollIntervalRef.current = setInterval(() => {
        if (!dragStateRef.current.isDragging || !scrollContainerRef.current) {
          clearInterval(autoscrollIntervalRef.current);
          return;
        }

        const currentScrollLeft = container.scrollLeft;
        const currentScrollTop = container.scrollTop;

        container.scrollLeft = Math.max(0, Math.min(
          container.scrollWidth - container.clientWidth,
          currentScrollLeft + scrollSpeedX
        ));
        
        container.scrollTop = Math.max(0, Math.min(
          container.scrollHeight - container.clientHeight,
          currentScrollTop + scrollSpeedY
        ));
      }, 16);
    }
  }, []);

  const stopAutoscroll = useCallback(() => {
    if (autoscrollIntervalRef.current) {
      clearInterval(autoscrollIntervalRef.current);
      autoscrollIntervalRef.current = null;
    }
  }, []);

  const handleGlobalMouseMove = useCallback((e) => {
    if (dragStateRef.current.isDragging) {
      startAutoscroll(e.clientX, e.clientY);
    }
  }, [startAutoscroll]);

  const handleGlobalMouseUp = useCallback(() => {
    if (dragStateRef.current.isDragging) {
      dragStateRef.current.isDragging = false;
      dragStateRef.current.draggedNode = null;
      stopAutoscroll();
    }
  }, [stopAutoscroll]);

  // Fonction pour trouver le chemin critique
  const findCriticalPath = useCallback((tasks, edges) => {
    const criticalNodes = ['start'];
    const criticalEdges = [];
    
    // Trouver tous les nœuds critiques
    tasks.forEach(task => {
      if (task.slack === 0) {
        criticalNodes.push(task.id);
      }
    });
    criticalNodes.push('end');

    // Trouver tous les edges critiques
    edges.forEach(edge => {
      const fromTask = tasks.find(t => t.id === edge.from);
      const toTask = tasks.find(t => t.id === edge.to);
      
      // Edge critique si les deux nœuds sont critiques et connectés logiquement
      if ((edge.from === 'start' && toTask && toTask.slack === 0) ||
          (edge.to === 'end' && fromTask && fromTask.slack === 0) ||
          (fromTask && toTask && fromTask.slack === 0 && toTask.slack === 0 && 
           fromTask.earlyFinish === toTask.earlyStart)) {
        criticalEdges.push(edge);
      }
    });

    return { nodes: criticalNodes, edges: criticalEdges };
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
                },
                isCritical: isCritical
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
              },
              isCritical: isCritical
            };
          })
        ]);

        // Trouver le chemin critique
        criticalPathRef.current = findCriticalPath(tasks, edges.get());

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
          const padding = 200;
          
          const contentWidth = Math.abs(Math.max(...xs) - Math.min(...xs)) + padding * 2;
          const contentHeight = Math.abs(Math.max(...ys) - Math.min(...ys)) + padding * 2;
          
          const minWidth = 1400;
          const minHeight = 1000;
          
          const width = Math.max(minWidth, contentWidth);
          const height = Math.max(minHeight, contentHeight);

          setGraphSize({ width, height });

          // ZOOM FIXE À 0.8
          const applyFixedZoom = () => {
            if (networkRef.current) {
              networkRef.current.moveTo({
                scale: 0.8,
                animation: false
              });
            }
          };

          applyFixedZoom();
          setTimeout(applyFixedZoom, 50);
          setTimeout(applyFixedZoom, 100);
          setTimeout(applyFixedZoom, 200);

          // Limites pour le clamping
          const clampPadding = 40;
          const minX = -width / 2 + clampPadding;
          const maxX = width / 2 - clampPadding;
          const minY = -height / 2 + clampPadding;
          const maxY = height / 2 - clampPadding;

          // Gestionnaires de drag
          networkRef.current.on("dragStart", (params) => {
            if (params.nodes && params.nodes.length > 0) {
              dragStateRef.current.isDragging = true;
              dragStateRef.current.draggedNode = params.nodes[0];
            }
          });

          networkRef.current.on("dragEnd", (params) => {
            dragStateRef.current.isDragging = false;
            dragStateRef.current.draggedNode = null;
            stopAutoscroll();

            if (!params.nodes || params.nodes.length === 0) return;
            
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

            const ensureZoom = () => {
              if (networkRef.current) {
                networkRef.current.moveTo({
                  scale: 0.8,
                  animation: false
                });
              }
            };
            
            setTimeout(ensureZoom, 10);
            setTimeout(ensureZoom, 50);
            setTimeout(ensureZoom, 100);
          });

          // Empêcher le zoom
          networkRef.current.on("zoom", (params) => {
            setTimeout(() => {
              if (networkRef.current) {
                networkRef.current.moveTo({
                  scale: 0.8,
                  animation: false
                });
              }
            }, 1);
          });

          networkRef.current.on("afterDrawing", () => {
            if (networkRef.current) {
              const currentScale = networkRef.current.getScale();
              if (Math.abs(currentScale - 0.8) > 0.01) {
                networkRef.current.moveTo({
                  scale: 0.8,
                  animation: false
                });
              }
            }
          });

          // Démarrer l'animation du chemin critique
          animateCriticalPath();

          setTimeout(() => setIsGraphReady(true), 150);
        }, 100);

        // Dessin avec animations du chemin critique
        // Fonction afterDrawing avec bondissement élégant des badges critiques
        networkRef.current.on("afterDrawing", function (ctx) {
          const nodePositions = networkRef.current.getPositions();
          const currentTime = animationTimeRef.current;

          // 1. Animation des arêtes critiques UNIQUEMENT
          const edges = networkRef.current.body.data.edges.get();
          const criticalEdges = edges.filter(edge => edge.isCritical);
          
          criticalEdges.forEach(edge => {
            const fromPos = nodePositions[edge.from];
            const toPos = nodePositions[edge.to];
            
            if (fromPos && toPos) {
              // Effet de glow pulsant avec vitesse constante
              const glowIntensity = 0.5 + 0.3 * Math.sin(currentTime * 2);
              
              // Dessiner l'effet glow en 3 couches
              for (let i = 0; i < 3; i++) {
                ctx.globalAlpha = glowIntensity * (0.3 - i * 0.1);
                ctx.strokeStyle = "#ff6b6b";
                ctx.lineWidth = (6 - i * 2);
                ctx.shadowColor = "#ff6b6b";
                ctx.shadowBlur = 15 + i * 5;
                
                ctx.beginPath();
                ctx.moveTo(fromPos.x, fromPos.y);
                ctx.lineTo(toPos.x, toPos.y);
                ctx.stroke();
              }
              
              // Particules voyageuses
              const particleSpeed = 0.3;
              const cycleDuration = 3;
              const progress = ((currentTime * particleSpeed) % cycleDuration) / cycleDuration;
              
              const particleX = fromPos.x + (toPos.x - fromPos.x) * progress;
              const particleY = fromPos.y + (toPos.y - fromPos.y) * progress;
              
              // Particule principale
              ctx.globalAlpha = 0.8 + 0.2 * Math.sin(currentTime * 6);
              ctx.fillStyle = "#fff";
              ctx.shadowColor = "#ff6b6b";
              ctx.shadowBlur = 20;
              ctx.beginPath();
              ctx.arc(particleX, particleY, 5, 0, 2 * Math.PI);
              ctx.fill();
              
              // Traînée de particules
              for (let j = 1; j <= 4; j++) {
                const trailDelay = j * 0.08;
                const trailProgress = ((currentTime * particleSpeed - trailDelay) % cycleDuration) / cycleDuration;
                
                if (trailProgress > 0) {
                  const trailX = fromPos.x + (toPos.x - fromPos.x) * trailProgress;
                  const trailY = fromPos.y + (toPos.y - fromPos.y) * trailProgress;
                  
                  ctx.globalAlpha = (0.6 - j * 0.12);
                  ctx.beginPath();
                  ctx.arc(trailX, trailY, 3 - j * 0.5, 0, 2 * Math.PI);
                  ctx.fill();
                }
              }
              
              // Reset des propriétés
              ctx.globalAlpha = 1;
              ctx.shadowColor = "transparent";
              ctx.shadowBlur = 0;
            }
          });

          // 2. Animation des nœuds critiques UNIQUEMENT
          const criticalTasks = tasks.filter(task => task.slack === 0);
          
          criticalTasks.forEach(task => {
            const pos = nodePositions[task.id];
            if (pos) {
              // Effet de halo pulsant
              const haloSize = 45 + 12 * Math.sin(currentTime * 1.5);
              const haloAlpha = 0.2 + 0.15 * Math.sin(currentTime * 1.5);
              
              ctx.globalAlpha = haloAlpha;
              ctx.fillStyle = "#ff6b6b";
              ctx.shadowColor = "#ff6b6b";
              ctx.shadowBlur = 30;
              ctx.beginPath();
              ctx.arc(pos.x, pos.y, haloSize, 0, 2 * Math.PI);
              ctx.fill();
              
              ctx.globalAlpha = 1;
              ctx.shadowColor = "transparent";
              ctx.shadowBlur = 0;
            }
          });

          // 3. Animation spéciale pour start et end
          const startPos = nodePositions["start"];
          const endPos = nodePositions["end"];
          
          if (startPos) {
            // Rotation constante pour le nœud start
            const rotationSpeed = 0.4;
            const rotationAngle = currentTime * rotationSpeed;
            const rayLength = 50;
            
            for (let i = 0; i < 8; i++) {
              const angle = rotationAngle + (i * Math.PI / 4);
              const rayX = startPos.x + Math.cos(angle) * rayLength;
              const rayY = startPos.y + Math.sin(angle) * rayLength;
              
              ctx.globalAlpha = 0.3 + 0.2 * Math.sin(currentTime * 2);
              ctx.strokeStyle = "#4f46e5";
              ctx.lineWidth = 2;
              ctx.shadowColor = "#4f46e5";
              ctx.shadowBlur = 10;
              
              ctx.beginPath();
              ctx.moveTo(startPos.x, startPos.y);
              ctx.lineTo(rayX, rayY);
              ctx.stroke();
            }
          }
          
          if (endPos) {
            // Couronnes concentriques
            for (let ring = 0; ring < 3; ring++) {
              const pulsationSpeed = 1.2;
              const ringRadius = 50 + ring * 20 + 10 * Math.sin(currentTime * pulsationSpeed - ring);
              const ringAlpha = (0.3 - ring * 0.1) * (0.5 + 0.5 * Math.sin(currentTime * pulsationSpeed));
              
              ctx.globalAlpha = ringAlpha;
              ctx.strokeStyle = "#7c3aed";
              ctx.lineWidth = 3 - ring;
              ctx.shadowColor = "#7c3aed";
              ctx.shadowBlur = 15;
              
              ctx.beginPath();
              ctx.arc(endPos.x, endPos.y, ringRadius, 0, 2 * Math.PI);
              ctx.stroke();
            }
          }

          // Reset
          ctx.globalAlpha = 1;
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;

          // 4. Badges avec bondissement TRÈS ÉLÉGANT
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

              // Configuration du badge
              const badgeWidth = 36;
              const badgeHeight = 24;
              const cornerRadius = 12;
              const badgeX = pos.x - badgeWidth / 2;
              const badgeY = pos.y - 55;

              const isCritical = task.slack === 0;
              
              // 🎯 BONDISSEMENT ÉLÉGANT pour les badges critiques
              let badgeYOffset = 0;
              let badgeScale = 1;
              let badgeAlpha = 1;
              
              if (isCritical) {
                // Fonction d'easing élégante (ease-in-out cubic)
                const rawSin = Math.sin(currentTime * 4); // Vitesse rapide
                const normalizedSin = (rawSin + 1) / 2; // Normaliser entre 0 et 1
                
                // Courbe d'easing cubic pour un mouvement fluide
                const easedValue = normalizedSin < 0.5 
                  ? 4 * normalizedSin * normalizedSin * normalizedSin
                  : 1 - Math.pow(-2 * normalizedSin + 2, 3) / 2;
                
                // Bondissement vertical élégant
                badgeYOffset = -8 * easedValue; // Vers le haut (négatif)
                
                // Scaling subtil qui suit le bondissement
                badgeScale = 1 + 0.15 * easedValue;
                
                // Effet de glow pulsant synchronisé
                badgeAlpha = 0.9 + 0.1 * Math.sin(currentTime * 8);
                
                // Ajout d'un effet de rebond secondaire
                const secondaryBounce = 0.3 * Math.sin(currentTime * 12) * easedValue;
                badgeYOffset += secondaryBounce;
              }
              
              // Sauvegarde du contexte pour les transformations
              ctx.save();
              
              // Appliquer les transformations pour le scaling
              ctx.translate(pos.x, badgeY + badgeHeight / 2 + badgeYOffset);
              ctx.scale(badgeScale, badgeScale);
              ctx.translate(-pos.x, -(badgeY + badgeHeight / 2 + badgeYOffset));
              
              // Effet de glow pour les badges critiques
              if (isCritical) {
                ctx.shadowColor = "#ff6b6b";
                ctx.shadowBlur = 12 * badgeScale;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 2;
              }
              
              // Fond du badge avec dégradé dynamique
              const gradient = ctx.createLinearGradient(
                badgeX, 
                badgeY + badgeYOffset, 
                badgeX, 
                badgeY + badgeHeight + badgeYOffset
              );
              
              if (isCritical) {
                // Dégradé dynamique pour les badges critiques
                const glowIntensity = 0.1 + 0.05 * Math.sin(currentTime * 6);
                gradient.addColorStop(0, `rgba(239, 68, 68, ${badgeAlpha - glowIntensity})`);
                gradient.addColorStop(0.5, `rgba(239, 68, 68, ${badgeAlpha})`);
                gradient.addColorStop(1, `rgba(220, 38, 38, ${badgeAlpha})`);
              } else {
                gradient.addColorStop(0, "#10b981");
                gradient.addColorStop(1, "#059669");
              }
              
              ctx.fillStyle = gradient;
              ctx.strokeStyle = isCritical ? "#b91c1c" : "#047857";
              ctx.lineWidth = isCritical ? 2 : 1.5;
              ctx.globalAlpha = badgeAlpha;

              // Dessin du badge arrondi
              ctx.beginPath();
              ctx.moveTo(badgeX + cornerRadius, badgeY + badgeYOffset);
              ctx.lineTo(badgeX + badgeWidth - cornerRadius, badgeY + badgeYOffset);
              ctx.quadraticCurveTo(
                badgeX + badgeWidth, 
                badgeY + badgeYOffset, 
                badgeX + badgeWidth, 
                badgeY + cornerRadius + badgeYOffset
              );
              ctx.lineTo(badgeX + badgeWidth, badgeY + badgeHeight - cornerRadius + badgeYOffset);
              ctx.quadraticCurveTo(
                badgeX + badgeWidth, 
                badgeY + badgeHeight + badgeYOffset, 
                badgeX + badgeWidth - cornerRadius, 
                badgeY + badgeHeight + badgeYOffset
              );
              ctx.lineTo(badgeX + cornerRadius, badgeY + badgeHeight + badgeYOffset);
              ctx.quadraticCurveTo(
                badgeX, 
                badgeY + badgeHeight + badgeYOffset, 
                badgeX, 
                badgeY + badgeHeight - cornerRadius + badgeYOffset
              );
              ctx.lineTo(badgeX, badgeY + cornerRadius + badgeYOffset);
              ctx.quadraticCurveTo(
                badgeX, 
                badgeY + badgeYOffset, 
                badgeX + cornerRadius, 
                badgeY + badgeYOffset
              );
              ctx.closePath();
              
              ctx.fill();
              ctx.stroke();

              // Texte du badge avec effet de rebond
              if (isCritical) {
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 1;
              } else {
                ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 1;
              }
              
              ctx.fillStyle = "#ffffff";
              ctx.font = `bold ${12 * badgeScale}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(
                task.slack.toString(), 
                pos.x, 
                badgeY + badgeHeight / 2 + badgeYOffset
              );
              
              // Restaurer le contexte
              ctx.restore();
              
              // Reset des propriétés
              ctx.globalAlpha = 1;
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
  }, [projectId,  stopAutoscroll, findCriticalPath, animateCriticalPath]);

  useEffect(() => {
    loadCriticalPathData();

    // Ajouter les gestionnaires globaux
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      
      stopAutoscroll();
      stopAnimation();
      
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [loadCriticalPathData, handleGlobalMouseMove, handleGlobalMouseUp, stopAutoscroll, stopAnimation]);

  useImperativeHandle(ref, () => ({
    getNodes: () => networkRef.current?.body.data.nodes || null,
    getEdges: () => networkRef.current?.body.data.edges || null,
    reloadData: () => loadCriticalPathData(),
    fitView: () => {
      if (networkRef.current) {
        networkRef.current.fit();
        // Remettre le zoom à 0.8 après fit
        setTimeout(() => {
          if (networkRef.current) {
            const ensureZoom = () => {
              networkRef.current.moveTo({
                scale: 0.8,
                animation: true
              });
            };
            ensureZoom();
            setTimeout(ensureZoom, 100);
            setTimeout(ensureZoom, 300);
          }
        }, 100);
      }
    },
    toggleAnimation: () => {
      if (animationRef.current) {
        stopAnimation();
      } else {
        animateCriticalPath();
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