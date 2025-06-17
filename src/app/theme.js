// Thème de graphe harmonisé avec la palette globale Canva spectaculaire
const GRAPH_THEME = {
    // Couleurs principales - Alignées sur la palette globale
    primary: { 
      base: "#8b5cf6",    // violet-500 - Couleur principale de votre palette
      light: "#a78bfa",   // violet-400
      dark: "#7c3aed"     // violet-600
    },
    
    secondary: { 
      base: "#ec4899",    // pink-500 - Accent fuchsia de votre palette
      light: "#f472b6",   // pink-400
      dark: "#db2777"     // pink-600
    },
    
    accent: { 
      base: "#00c4cc",    // Canva Teal - Couleur signature
      light: "#22d3ee",   // cyan-400
      dark: "#0891b2"     // cyan-600
    },
    
    // États critiques et de succès - Cohérents avec votre système de notifications
    critical: { 
      base: "#ef4444",    // red-500 - Cohérent avec vos boutons remove
      light: "#f87171",   // red-400
      dark: "#dc2626"     // red-600
    },
    
    success: { 
      base: "#10b981",    // emerald-500 - Cohérent avec vos boutons save
      light: "#34d399",   // emerald-400
      dark: "#059669"     // emerald-600
    },
    
    warning: {
      base: "#f59e0b",    // amber-500 - Cohérent avec vos favoris
      light: "#fbbf24",   // amber-400
      dark: "#d97706"     // amber-600
    },
    
    // Couleurs neutres - Harmonisées avec votre palette de texte
    neutral: { 
      base: "#64748b",    // slate-500 - Cohérent avec text.secondary
      light: "#94a3b8",   // slate-400
      dark: "#475569"     // slate-600
    },
    
    // Arrière-plans - Cohérents avec votre système de background
    background: {
      main: "#ffffff",           // Blanc pur pour le graphe
      secondary: "#f8fafc",      // slate-50 - Cohérent avec votre background
      overlay: "#faf5ff",        // violet-50 - Cohérent avec vos overlays
      card: "#ffffff"            // Blanc pour les cartes de nœuds
    },
    
    // Bordures et séparateurs - Harmonisés
    borders: {
      light: "#e2e8f0",     // slate-200 - Cohérent avec vos borders
      medium: "#cbd5e1",    // slate-300
      dark: "#94a3b8",      // slate-400
      accent: "#ddd6fe"     // violet-200 - Cohérent avec vos borders violets
    },
    
    // Configuration vis-network - Adaptée à votre palette spectaculaire
    visNetwork: {
      nodes: {
        // Nœuds principaux - Style spectaculaire
        default: {
          color: {
            background: "#8b5cf6",      // violet-500
            border: "#7c3aed",          // violet-600
            highlight: {
              background: "#a78bfa",     // violet-400
              border: "#6d28d9"          // violet-700
            },
            hover: {
              background: "#a78bfa",     // violet-400
              border: "#7c3aed"          // violet-600
            }
          },
          font: {
            color: "#ffffff",
            size: 14,
            face: "system-ui, -apple-system, sans-serif"
          },
          shadow: {
            enabled: true,
            color: "rgba(139, 92, 246, 0.3)",  // violet-500/30
            size: 8,
            x: 2,
            y: 2
          }
        },
        
        // Nœuds critiques - Style rose/fuchsia
        critical: {
          color: {
            background: "#ec4899",      // pink-500
            border: "#db2777",          // pink-600
            highlight: {
              background: "#f472b6",     // pink-400
              border: "#be185d"          // pink-700
            }
          },
          shadow: {
            color: "rgba(236, 72, 153, 0.3)"  // pink-500/30
          }
        },
        
        // Nœuds de succès - Style émeraude
        success: {
          color: {
            background: "#10b981",      // emerald-500
            border: "#059669",          // emerald-600
            highlight: {
              background: "#34d399",     // emerald-400
              border: "#047857"          // emerald-700
            }
          },
          shadow: {
            color: "rgba(16, 185, 129, 0.3)"  // emerald-500/30
          }
        },
        
        // Nœuds d'avertissement - Style ambre
        warning: {
          color: {
            background: "#f59e0b",      // amber-500
            border: "#d97706",          // amber-600
            highlight: {
              background: "#fbbf24",     // amber-400
              border: "#b45309"          // amber-700
            }
          },
          shadow: {
            color: "rgba(245, 158, 11, 0.3)"  // amber-500/30
          }
        }
      },
      
      edges: {
        // Arêtes par défaut - Style violet subtil
        default: {
          color: {
            color: "#c4b5fd",           // violet-300
            highlight: "#8b5cf6",       // violet-500
            hover: "#a78bfa",           // violet-400
            inherit: false
          },
          width: 2,
          smooth: {
            enabled: true,
            type: "continuous",
            roundness: 0.1
          },
          shadow: {
            enabled: false
          }
        },
        
        // Arêtes critiques - Style rose
        critical: {
          color: {
            color: "#f9a8d4",           // pink-300
            highlight: "#ec4899",       // pink-500
            hover: "#f472b6"            // pink-400
          },
          width: 3,
          dashes: [5, 5]
        },
        
        // Arêtes de dépendance - Style teal (Canva)
        dependency: {
          color: {
            color: "#67e8f9",           // cyan-300
            highlight: "#00c4cc",       // Canva teal
            hover: "#22d3ee"            // cyan-400
          },
          width: 2,
          arrows: {
            to: {
              enabled: true,
              scaleFactor: 1.2,
              type: "arrow"
            }
          }
        }
      },
      
      // Configuration générale - Cohérente avec votre design
      layout: {
        improvedLayout: true,
        clusterThreshold: 150,
        hierarchical: {
          enabled: false,
          levelSeparation: 150,
          nodeSpacing: 100,
          treeSpacing: 200,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          direction: 'UD',
          sortMethod: 'hubsize',
          shakeTowards: 'roots'
        }
      },
      
      // Physique - Optimisée pour un rendu fluide
      physics: {
        enabled: true,
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 25,
          onlyDynamicEdges: false,
          fit: true
        },
        barnesHut: {
          theta: 0.5,
          gravitationalConstant: -8000,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.1
        }
      },
      
      // Interaction - Expérience utilisateur premium
      interaction: {
        dragNodes: true,
        dragView: true,
        hideEdgesOnDrag: false,
        hideNodesOnDrag: false,
        hover: true,
        hoverConnectedEdges: true,
        keyboard: {
          enabled: false
        },
        multiselect: true,
        navigationButtons: false,
        selectable: true,
        selectConnectedEdges: true,
        tooltipDelay: 300,
        zoomView: true,
        zoomSpeed: 1
      }
    },
    
    // Scrollbar - Intégration directe de votre palette
    scrollbar: {
      track: "#f8fafc",      // slate-50
      thumb: "#8b5cf6",      // violet-500
      thumbHover: "#7c3aed", // violet-600
      thumbActive: "#6d28d9" // violet-700
    },
    
    // Animations et transitions - Style spectaculaire
    animations: {
      duration: 300,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)", // ease-out
      hover: {
        duration: 200,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" // ease-out-quad
      }
    },
    
    // Ombres et effets - Cohérents avec votre système d'effects
    effects: {
      glow: "0 0 20px rgba(139, 92, 246, 0.25)",           // Effet glow violet
      glowHover: "0 0 30px rgba(139, 92, 246, 0.4)",       // Glow au survol
      cardShadow: "0 10px 25px rgba(139, 92, 246, 0.1)",   // Ombre de carte
      focusRing: "0 0 0 4px rgba(139, 92, 246, 0.2)"       // Ring de focus
    },
    
    // Palette de couleurs étendues pour les nœuds - Inspirée de vos projets
    nodeColors: [
      "#8b5cf6", // violet-500
      "#ec4899", // pink-500
      "#06b6d4", // cyan-500
      "#10b981", // emerald-500
      "#f59e0b", // amber-500
      "#ef4444", // red-500
      "#6366f1", // indigo-500
      "#22c55e", // green-500
      "#eab308", // yellow-500
      "#d946ef"  // fuchsia-500
    ],
    
    // Ombres correspondantes pour les nœuds
    nodeShadows: [
      "rgba(139, 92, 246, 0.3)",  // violet
      "rgba(236, 72, 153, 0.3)",  // pink
      "rgba(6, 182, 212, 0.3)",   // cyan
      "rgba(16, 185, 129, 0.3)",  // emerald
      "rgba(245, 158, 11, 0.3)",  // amber
      "rgba(239, 68, 68, 0.3)",   // red
      "rgba(99, 102, 241, 0.3)",  // indigo
      "rgba(34, 197, 94, 0.3)",   // green
      "rgba(234, 179, 8, 0.3)",   // yellow
      "rgba(217, 70, 239, 0.3)"   // fuchsia
    ]
  };
  
  // Export pour utilisation - Compatible avec votre code existant
  export const THEME = GRAPH_THEME;
  export default GRAPH_THEME;