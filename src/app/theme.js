// Thème de graphe CPM harmonisé avec la palette globale élégante et sophistiquée
const GRAPH_THEME = {
  // Couleurs principales - Alignées sur la palette slate élégante
  primary: { 
    base: "#475569",    // slate-600 - Couleur principale de votre palette canva
    light: "#64748b",   // slate-500 
    dark: "#334155"     // slate-700
  },
  
  secondary: { 
    base: "#94a3b8",    // slate-400 - Accent doux et raffiné de votre palette
    light: "#cbd5e1",   // slate-300
    dark: "#64748b"     // slate-500
  },
  
  accent: { 
    base: "#7c3aed",    // violet-600 - Violet discret de votre palette canva
    light: "#8b5cf6",   // violet-500
    dark: "#6d28d9"     // violet-700
  },
   
  // États critiques et de succès - Cohérents avec votre système de notifications
  critical: { 
    base: "#dc2626",    // red-600 - Cohérent avec vos boutons remove
    light: "#ef4444",   // red-500
    dark: "#b91c1c",     // red-700
    font: "#ffffff"
  },
  
  success: { 
    base: "#059669",    // emerald-600 - Cohérent avec vos boutons save et vert émeraude élégant
    light: "#10b981",   // emerald-500
    dark: "#047857"     // emerald-700
  },
  
  warning: {
    base: "#d97706",    // amber-600 - Cohérent avec vos favoris et ambre raffiné
    light: "#f59e0b",   // amber-500
    dark: "#b45309"     // amber-700
  },
  
  // Couleurs neutres - Harmonisées avec votre palette de texte slate
  neutral: { 
    base: "#64748b",    // slate-500 - Cohérent avec text.secondary
    light: "#94a3b8",   // slate-400
    dark: "#475569"     // slate-600 - Couleur signature
  },
  
  // Couleurs supplémentaires de votre palette canva
  orange: {
    base: "#ea580c",    // Orange chaleureux de votre palette
    light: "#fb923c",   // orange-400
    dark: "#c2410c"     // orange-700
  },
  
  pink: {
    base: "#db2777",    // Rose sophistiqué de votre palette
    light: "#ec4899",   // pink-500
    dark: "#be185d"     // pink-700
  },
  
  // Arrière-plans - Cohérents avec votre système de background minimaliste
  background: {
    main: "#ffffff",                    // Blanc pur pour le graphe
    secondary: "#f8fafc",              // slate-50 - Cohérent avec votre background
    overlay: "#f1f5f9",                // slate-100 - Cohérent avec vos overlays
    card: "rgba(255, 255, 255, 0.98)", // Blanc avec transparence comme vos cartes
    gradient: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" // Gradient minimaliste
  },
  
  // Bordures et séparateurs - Harmonisés avec votre design épuré
  borders: {
    light: "#e2e8f0",     // slate-200 - Cohérent avec vos borders
    medium: "#cbd5e1",    // slate-300
    dark: "#94a3b8",      // slate-400
    accent: "#ddd6fe",    // violet-200 - Cohérent avec vos borders violets
    primary: "rgba(71, 85, 105, 0.2)" // slate-600/20 - Border principale subtile
  },
  
  // Configuration vis-network - Adaptée à votre palette sophistiquée
  visNetwork: {
    nodes: {
      // Nœuds principaux - Style élégant et minimaliste
      default: {
        color: {
          background: "#475569",          // slate-600 - Couleur signature
          border: "#334155",              // slate-700
          highlight: {
            background: "#64748b",         // slate-500
            border: "#1e293b"              // slate-800
          },
          hover: {
            background: "#64748b",         // slate-500
            border: "#475569"              // slate-600
          }
        },
        font: {
          color: "#ffffff",
          size: 14,
          face: "system-ui, -apple-system, sans-serif",
          strokeWidth: 1,
          strokeColor: "#1e293b"          // slate-800 pour lisibilité
        },
        shadow: {
          enabled: true,
          color: "rgba(71, 85, 105, 0.2)",  // slate-600/20 - Ombre subtile
          size: 8,
          x: 2,
          y: 2
        },
        borderWidth: 2,
        borderWidthSelected: 3
      },
      
      // Nœuds critiques - Style rouge élégant
      critical: {
        color: {
          background: "#dc2626",          // red-600
          border: "#b91c1c",              // red-700
          highlight: {
            background: "#ef4444",         // red-500
            border: "#991b1b"              // red-800
          }
        },
        shadow: {
          color: "rgba(220, 38, 38, 0.25)"  // red-600/25
        }
      },
      
      // Nœuds de succès - Style émeraude élégant
      success: {
        color: {
          background: "#059669",          // emerald-600
          border: "#047857",              // emerald-700
          highlight: {
            background: "#10b981",         // emerald-500
            border: "#065f46"              // emerald-800
          }
        },
        shadow: {
          color: "rgba(5, 150, 105, 0.25)"  // emerald-600/25
        }
      },
      
      // Nœuds d'avertissement - Style ambre élégant
      warning: {
        color: {
          background: "#d97706",          // amber-600
          border: "#b45309",              // amber-700
          highlight: {
            background: "#f59e0b",         // amber-500
            border: "#92400e"              // amber-800
          }
        },
        shadow: {
          color: "rgba(217, 119, 6, 0.25)"  // amber-600/25
        }
      },
      
      // Nœuds de démarrage - Style violet discret
      start: {
        color: {
          background: "#7c3aed",          // violet-600
          border: "#6d28d9",              // violet-700
          highlight: {
            background: "#8b5cf6",         // violet-500
            border: "#5b21b6"              // violet-800
          }
        },
        shadow: {
          color: "rgba(124, 58, 237, 0.25)"  // violet-600/25
        }
      },
      
      // Nœuds de fin - Style orange chaleureux
      end: {
        color: {
          background: "#ea580c",          // orange-600
          border: "#c2410c",              // orange-700
          highlight: {
            background: "#fb923c",         // orange-400
            border: "#9a3412"              // orange-800
          }
        },
        shadow: {
          color: "rgba(234, 88, 12, 0.25)"  // orange-600/25
        }
      }
    },
    
    edges: {
      // Arêtes par défaut - Style slate subtil et élégant
      default: {
        color: {
          color: "#cbd5e1",               // slate-300 - Couleur subtile
          highlight: "#475569",           // slate-600 - Couleur signature
          hover: "#64748b",               // slate-500
          inherit: false
        },
        width: 2,
        smooth: {
          enabled: true,
          type: "continuous",
          roundness: 0.15
        },
        shadow: {
          enabled: false
        },
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 1,
            type: "arrow"
          }
        }
      },
      
      // Arêtes critiques - Style rouge pour chemin critique
      critical: {
        color: {
          color: "#dc2626",               // red-600
          highlight: "#b91c1c",           // red-700
          hover: "#ef4444"                // red-500
        },
        width: 4,
        dashes: false,
        shadow: {
          enabled: true,
          color: "rgba(220, 38, 38, 0.3)",
          size: 3,
          x: 1,
          y: 1
        }
      },
      
      // Arêtes de dépendance - Style émeraude élégant
      dependency: {
        color: {
          color: "#10b981",               // emerald-500
          highlight: "#059669",           // emerald-600
          hover: "#34d399"                // emerald-400
        },
        width: 2,
        dashes: [8, 4],
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 1.2,
            type: "arrow"
          }
        }
      },
      
      // Arêtes de marge libre - Style ambre subtil
      slack: {
        color: {
          color: "#f59e0b",               // amber-500
          highlight: "#d97706",           // amber-600
          hover: "#fbbf24"                // amber-400
        },
        width: 1,
        dashes: [4, 4],
        opacity: 0.7
      }
    },
    
    // Configuration générale - Cohérente avec votre design minimaliste
    layout: {
      improvedLayout: true,
      clusterThreshold: 150,
      hierarchical: {
        enabled: false,
        levelSeparation: 180,
        nodeSpacing: 120,
        treeSpacing: 220,
        blockShifting: true,
        edgeMinimization: true,
        parentCentralization: true,
        direction: 'LR',              // Left to Right pour CPM
        sortMethod: 'directed',
        shakeTowards: 'leaves'
      }
    },
    
    // Physique - Optimisée pour un rendu fluide et professionnel
    physics: {
      enabled: true,
      stabilization: {
        enabled: true,
        iterations: 1200,
        updateInterval: 25,
        onlyDynamicEdges: false,
        fit: true
      },
      barnesHut: {
        theta: 0.4,
        gravitationalConstant: -12000,
        centralGravity: 0.15,
        springLength: 120,
        springConstant: 0.05,
        damping: 0.15,
        avoidOverlap: 0.2
      }
    },
    
    // Interaction - Expérience utilisateur premium et sophistiquée
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
      tooltipDelay: 200,
      zoomView: true,
      zoomSpeed: 1.2
    },
    
    // Configuration avancée pour le rendu
    configure: {
      enabled: false,
      filter: 'nodes,edges',
      container: undefined,
      showButton: true
    }
  },
  
  // Scrollbar - Intégration directe de votre palette
  scrollbar: {
    track: "#f8fafc",      // slate-50
    thumb: "#64748b",      // slate-500
    thumbHover: "#475569", // slate-600
    thumbActive: "#334155" // slate-700
  },
  
  // Animations et transitions - Style sophistiqué
  animations: {
    duration: 400,
    easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // ease-out-quad
    hover: {
      duration: 200,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)" // ease-out
    },
    selection: {
      duration: 300,
      easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)" // ease-out-back
    }
  },
  
  // Ombres et effets - Cohérents avec votre système d'effects élégant
  effects: {
    glow: "0 8px 25px rgba(71, 85, 105, 0.15)",          // Effet glow slate subtil
    glowHover: "0 12px 35px rgba(71, 85, 105, 0.25)",    // Glow au survol
    cardShadow: "0 10px 25px rgba(71, 85, 105, 0.08)",   // Ombre de carte minimaliste
    focusRing: "0 0 0 3px rgba(71, 85, 105, 0.15)",      // Ring de focus élégant
    glassmorphism: "rgba(255, 255, 255, 0.98)",          // Effet verre comme vos cardes
    backdrop: "backdrop-blur-sm"                          // Effet backdrop-blur
  },
  
  // Palette de couleurs étendues pour les nœuds - Inspirée de votre palette projets
  nodeColors: [
    "#475569", // slate-600 - Couleur signature
    "#7c3aed", // violet-600 - Violet discret
    "#059669", // emerald-600 - Vert émeraude élégant
    "#db2777", // pink-600 - Rose sophistiqué
    "#ea580c", // orange-600 - Orange chaleureux
    "#dc2626", // red-600 - Rouge élégant
    "#0891b2", // cyan-600 - Cyan raffiné
    "#ca8a04", // yellow-600 - Jaune sophistiqué
    "#9333ea", // purple-600 - Pourpre élégant
    "#0d9488"  // teal-600 - Sarcelle raffinée
  ],
  
  // Ombres correspondantes pour les nœuds - Subtiles et élégantes
  nodeShadows: [
    "rgba(71, 85, 105, 0.2)",   // slate
    "rgba(124, 58, 237, 0.2)",  // violet
    "rgba(5, 150, 105, 0.2)",   // emerald
    "rgba(219, 39, 119, 0.2)",  // pink
    "rgba(234, 88, 12, 0.2)",   // orange
    "rgba(220, 38, 38, 0.2)",   // red
    "rgba(8, 145, 178, 0.2)",   // cyan
    "rgba(202, 138, 4, 0.2)",   // yellow
    "rgba(147, 51, 234, 0.2)",  // purple
    "rgba(13, 148, 136, 0.2)"   // teal
  ],
  
  // Styles spécifiques pour le graphe CPM
  cpm: {
    // Nœuds de tâches critiques
    criticalPath: {
      nodeColor: "#dc2626",           // red-600
      edgeColor: "#dc2626",           // red-600
      edgeWidth: 4,
      nodeSize: 35,
      fontColor: "#ffffff",
      shadow: "rgba(220, 38, 38, 0.3)"
    },
    
    // Nœuds de tâches non-critiques
    normalPath: {
      nodeColor: "#475569",           // slate-600
      edgeColor: "#cbd5e1",           // slate-300
      edgeWidth: 2,
      nodeSize: 30,
      fontColor: "#ffffff",
      shadow: "rgba(71, 85, 105, 0.2)"
    },
    
    // Indicateurs de temps
    timeLabels: {
      early: {
        color: "#059669",             // emerald-600
        background: "rgba(5, 150, 105, 0.1)"
      },
      late: {
        color: "#d97706",             // amber-600
        background: "rgba(217, 119, 6, 0.1)"
      },
      slack: {
        color: "#6b7280",             // gray-500
        background: "rgba(107, 114, 128, 0.1)"
      }
    }
  }
};

// Export pour utilisation - Compatible avec votre code existant
export const THEME = GRAPH_THEME;
export default GRAPH_THEME;