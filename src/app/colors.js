// colors.js - Palette spectaculaire inspirée de Canva - Version Premium Ultra (Sans flou)
export const colors = {
  // Couleurs principales - Palette Canva moderne spectaculaire
  primary: {
    gradient: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600',
    gradientBg: 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500',
    gradientButton: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600',
    gradientHover: 'hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700',
    text: 'text-violet-600',
    bg: 'bg-violet-600',
    border: 'border-violet-200',
    focus: 'focus:border-violet-500'
  },

  // Couleurs Canva signature - Enrichies
  canva: {
    primary: '#00C4CC',      // Canva Teal
    secondary: '#7B68EE',    // Medium Slate Blue
    accent: '#FF6B6B',       // Coral Red
    purple: '#8B5CF6',       // Violet enrichi
    orange: '#FB923C',       // Orange spectaculaire
    green: '#10B981',        // Emerald moderne
    pink: '#EC4899',         // Pink vibrant
    yellow: '#F59E0B'        // Amber spectaculaire
  },

  // Couleurs de fond - Style Canva moderne spectaculaire (sans flou)
  background: {
    main: 'bg-gradient-to-br from-slate-50 via-violet-50 to-fuchsia-50',
    card: 'bg-white border border-slate-200 shadow-lg shadow-violet-500/10',
    header: 'bg-white border-b border-slate-200',
    overlay: 'bg-gradient-to-r from-violet-50 to-fuchsia-50',
    input: 'bg-white',
    inputFocus: 'bg-white'
  },

  // États des boutons - Palette spectaculaire
  buttons: {
    add: {
      gradient: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600',
      hover: 'hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700',
      text: 'text-white',
      shadow: 'shadow-lg shadow-violet-500/30',
      ring: 'focus:ring-4 focus:ring-violet-500/20'
    },
    remove: {
      gradient: 'bg-gradient-to-r from-rose-500 via-red-500 to-pink-600',
      hover: 'hover:from-rose-600 hover:via-red-600 hover:to-pink-700',
      text: 'text-white',
      shadow: 'shadow-lg shadow-rose-500/30',
      ring: 'focus:ring-4 focus:ring-rose-500/20'
    },
    edit: {
      base: 'bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-300/50',
      text: 'text-blue-700',
      shadow: 'shadow-md shadow-blue-500/10',
      hover: 'hover:shadow-lg hover:shadow-blue-500/20'
    },
    delete: {
      base: 'bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 border border-rose-300/50',
      text: 'text-rose-700',
      shadow: 'shadow-md shadow-rose-500/10',
      hover: 'hover:shadow-lg hover:shadow-rose-500/20'
    },
    cancel: {
      gradient: "bg-gradient-to-r from-slate-500 to-gray-600",
      hover: "hover:from-slate-600 hover:to-gray-700",
      text: "text-white",
      shadow: "shadow-lg shadow-slate-500/30"
    },
    save: {
      gradient: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600",
      hover: "hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700",
      text: "text-white",
      shadow: "shadow-lg shadow-emerald-500/30"
    },
    favorite: {
      active: 'text-amber-500',
      inactive: 'text-slate-400',
      hover: 'hover:text-amber-400'
    }
  },

  // Sidebar - Design spectaculaire avec couleurs pour chaque section (sans flou)
  sidebar: {
    main: {
      bg: 'bg-gradient-to-b from-white via-slate-50 to-violet-50',
      border: 'border-r border-violet-200/50',
      shadow: 'shadow-2xl shadow-violet-500/20'
    },
    icons: {
      default: 'text-slate-600',
      hover: 'text-violet-600',
      active: 'text-white',
      bg: 'bg-violet-100',
      bgHover: 'hover:bg-violet-100',
      bgActive: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600'
    },
    items: {
      menu: {
        icon: 'text-slate-700',
        bg: 'bg-gradient-to-r from-slate-100 to-gray-100',
        hover: 'hover:from-slate-200 hover:to-gray-200',
        shadow: 'hover:shadow-md hover:shadow-slate-500/20'
      },
      nouveau: {
        icon: 'text-white',
        bg: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600',
        hover: 'hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700',
        shadow: 'shadow-lg shadow-violet-500/30'
      },
      home: {
        icon: 'text-orange-700',
        bg: 'bg-gradient-to-r from-orange-100 to-amber-100',
        hover: 'hover:from-orange-200 hover:to-amber-200',
        shadow: 'hover:shadow-md hover:shadow-orange-500/20'
      },
      projects: {
        icon: 'text-emerald-700',
        bg: 'bg-gradient-to-r from-emerald-100 to-teal-100',
        hover: 'hover:from-emerald-200 hover:to-teal-200',
        shadow: 'hover:shadow-md hover:shadow-emerald-500/20'
      },
      favoris: {
        icon: 'text-amber-700',
        bg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
        hover: 'hover:from-amber-200 hover:to-yellow-200',
        shadow: 'hover:shadow-md hover:shadow-amber-500/20'
      },
      parametres: {
        icon: 'text-purple-700',
        bg: 'bg-gradient-to-r from-purple-100 to-violet-100',
        hover: 'hover:from-purple-200 hover:to-violet-200',
        shadow: 'hover:shadow-md hover:shadow-purple-500/20'
      }
    },
    // Nouvelle section pour les contenus de la deuxième sidebar (sans flou)
    secondSidebar: {
      bg: 'bg-gradient-to-b from-white via-slate-50 to-slate-100',
      border: 'border-r border-slate-200/50',
      shadow: 'shadow-2xl shadow-slate-500/15',
      header: {
        bg: 'bg-gradient-to-r from-violet-50 to-fuchsia-50',
        border: 'border-b border-violet-200/50'
      }
    }
  },

  // Header - Design premium spectaculaire (sans flou)
  header: {
    logo: {
      bg: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600',
      accent: 'bg-gradient-to-r from-violet-500 to-purple-600',
      shadow: 'shadow-lg shadow-violet-500/30'
    },
    title: {
      gradient: 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800',
      subtitle: 'text-slate-600'
    },
    search: {
      icon: {
        default: 'text-slate-500',
        focus: 'text-violet-600',
        hover: 'text-slate-700'
      },
      input: {
        bg: 'bg-white',
        bgHover: 'hover:bg-slate-50',
        bgFocus: 'focus:bg-white',
        border: 'border-violet-200',
        borderHover: 'hover:border-violet-300',
        borderFocus: 'focus:border-violet-500',
        placeholder: 'placeholder:text-violet-400',
        placeholderHover: 'hover:placeholder:text-violet-500',
        ring: 'focus:ring-violet-500/25'
      },
      effects: {
        shine: 'bg-gradient-to-r from-transparent via-violet-500/8 to-transparent',
        glow: 'bg-gradient-to-r from-violet-600/8 via-transparent to-fuchsia-500/8',
        ring: 'ring-violet-500/20'
      }
    }
  },

  // Table - Design premium spectaculaire (sans flou)
  table: {
    header: {
      primary: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600',
      secondary: 'bg-gradient-to-r from-violet-50 to-fuchsia-50',
      text: 'text-white',
      textSecondary: 'text-violet-700',
      shadow: 'shadow-lg shadow-violet-500/20'
    },
    input: {
      primary: 'bg-violet-500/20 text-white placeholder-violet-300',
      secondary: 'bg-white text-violet-700',
      focus: 'focus:bg-violet-500/30 focus:border-white',
      focusSecondary: 'focus:bg-slate-50 focus:border-violet-500'
    },
    border: 'border-violet-200/60'
  },

  // Favoris - Section spectaculaire (sans flou)
  favorites: {
    icon: {
      bg: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500',
      text: 'text-white',
      shadow: 'shadow-lg shadow-amber-500/30'
    },
    card: {
      bg: 'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50',
      border: 'border-amber-200/60',
      hover: 'hover:from-amber-100 hover:via-yellow-100 hover:to-orange-100',
      shadow: 'hover:shadow-lg hover:shadow-amber-500/20'
    },
    empty: {
      icon: 'text-amber-300',
      text: 'text-slate-600'
    },
    star: {
      active: 'text-amber-500',
      inactive: 'text-slate-300',
      hover: 'hover:text-amber-400'
    }
  },

  // Projets - Couleurs spectaculaires variées
  projects: {
    colors: [
      'bg-gradient-to-r from-violet-600 to-purple-600',
      'bg-gradient-to-r from-blue-600 to-cyan-600',
      'bg-gradient-to-r from-emerald-600 to-teal-600',
      'bg-gradient-to-r from-rose-600 to-pink-600',
      'bg-gradient-to-r from-orange-600 to-amber-600',
      'bg-gradient-to-r from-red-600 to-rose-600',
      'bg-gradient-to-r from-indigo-600 to-purple-600',
      'bg-gradient-to-r from-green-600 to-emerald-600',
      'bg-gradient-to-r from-yellow-600 to-orange-600',
      'bg-gradient-to-r from-fuchsia-600 to-pink-600'
    ],
    shadows: [
      'shadow-lg shadow-violet-500/30',
      'shadow-lg shadow-blue-500/30',
      'shadow-lg shadow-emerald-500/30',
      'shadow-lg shadow-rose-500/30',
      'shadow-lg shadow-orange-500/30',
      'shadow-lg shadow-red-500/30',
      'shadow-lg shadow-indigo-500/30',
      'shadow-lg shadow-green-500/30',
      'shadow-lg shadow-yellow-500/30',
      'shadow-lg shadow-fuchsia-500/30'
    ]
  },

  // Dépendances - Palette spectaculaire (sans flou)
  dependencies: {
    anterior: {
      bg: 'bg-gradient-to-r from-orange-100 to-amber-100',
      text: 'text-orange-800',
      border: 'border-orange-300/60',
      shadow: 'shadow-md shadow-orange-500/20'
    },
    successor: {
      bg: 'bg-gradient-to-r from-emerald-100 to-teal-100',
      text: 'text-emerald-800',
      border: 'border-emerald-300/60',
      shadow: 'shadow-md shadow-emerald-500/20'
    }
  },

  // Notifications - Système spectaculaire (sans flou)
  notifications: {
    success: {
      bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
      border: 'border-emerald-300/60',
      text: 'text-emerald-800',
      iconBg: 'bg-gradient-to-r from-emerald-100 to-teal-100',
      iconColor: 'text-emerald-600',
      shadow: 'shadow-lg shadow-emerald-500/20'
    },
    error: {
      bg: 'bg-gradient-to-r from-rose-50 to-red-50',
      border: 'border-rose-300/60',
      text: 'text-rose-800',
      iconBg: 'bg-gradient-to-r from-rose-100 to-red-100',
      iconColor: 'text-rose-600',
      shadow: 'shadow-lg shadow-rose-500/20'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
      border: 'border-amber-300/60',
      text: 'text-amber-800',
      iconBg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
      iconColor: 'text-amber-600',
      shadow: 'shadow-lg shadow-amber-500/20'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      border: 'border-blue-300/60',
      text: 'text-blue-800',
      iconBg: 'bg-gradient-to-r from-blue-100 to-cyan-100',
      iconColor: 'text-blue-600',
      shadow: 'shadow-lg shadow-blue-500/20'
    },
    network: {
      bg: 'bg-gradient-to-r from-slate-50 to-gray-50',
      border: 'border-slate-300/60',
      text: 'text-slate-800',
      iconBg: 'bg-gradient-to-r from-slate-100 to-gray-100',
      iconColor: 'text-slate-600',
      shadow: 'shadow-lg shadow-slate-500/20'
    }
  },

  // Textes - Hiérarchie améliorée
  text: {
    primary: 'text-slate-800',
    secondary: 'text-slate-600',
    muted: 'text-slate-500',
    placeholder: 'text-violet-400',
    gradient: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent'
  },

  // Durée - Dégradé spectaculaire (sans flou)
  duration: {
    bg: 'bg-gradient-to-r from-violet-100 to-fuchsia-100',
    text: 'text-violet-800',
    border: 'border-violet-200/60'
  },

  // Toggle - Design spectaculaire (sans flou)
  toggle: {
    container: 'bg-white border-violet-200/60 shadow-lg',
    active: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 transform scale-105',
    inactive: 'text-slate-600 hover:text-slate-800 hover:bg-violet-50'
  },

  // Scrollbar - Design spectaculaire
  scrollbar: {
    track: '#f8fafc',           // slate-50
    thumb: '#8b5cf6',           // violet-500
    thumbHover: '#7c3aed',      // violet-600
    thumbActive: '#6d28d9'      // violet-700
  },

  // Effets visuels (sans flou)
  effects: {
    glow: 'shadow-2xl shadow-violet-500/25',
    glowHover: 'hover:shadow-2xl hover:shadow-violet-500/40',
    shine: 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
    glassmorphism: 'bg-white/95 border border-white/50',
    neon: 'shadow-lg shadow-violet-500/50 border border-violet-400/50'
  }
};