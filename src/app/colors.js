// colors.js - Palette élégante et sophistiquée - Vision Designer Senior
export const colors = {
  // Couleurs principales - Élégance minimaliste et raffinée
  primary: {
    gradient: 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800',
    gradientBg: 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100',
    gradientButton: 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800',
    gradientHover: 'hover:from-slate-800 hover:via-slate-700 hover:to-slate-900',
    text: 'text-slate-700',
    bg: 'bg-slate-700',
    border: 'border-slate-200',
    focus: 'focus:border-slate-500'
  },

  // Couleurs signature - Élégance professionnelle
  canva: {
    primary: '#475569',      // Slate élégant et moderne
    secondary: '#64748b',    // Gris sophistiqué
    accent: '#94a3b8',       // Accent doux et raffiné
    purple: '#7c3aed',       // Violet discret
    orange: '#ea580c',       // Orange chaleureux
    green: '#059669',        // Vert émeraude élégant
    pink: '#db2777',         // Rose sophistiqué
    yellow: '#d97706'        // Ambre raffiné
  },

  // Couleurs de fond - Minimalisme élégant
  background: {
    main: 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50',
    card: 'bg-white/98 backdrop-blur-sm border border-slate-200/50 shadow-sm shadow-slate-500/5',
    header: 'bg-white/95 backdrop-blur-md border-b border-slate-200/40',
    overlay: 'bg-gradient-to-r from-slate-50/95 via-gray-50/95 to-zinc-50/95',
    input: 'bg-white/90 backdrop-blur-sm',
    inputFocus: 'bg-white'
  },

  // États des boutons - Design sophistiqué
  buttons: {
    add: {
      gradient: 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800',
      hover: 'hover:from-slate-800 hover:via-slate-700 hover:to-slate-900',
      text: 'text-white',
      shadow: 'shadow-md shadow-slate-500/20',
      ring: 'focus:ring-4 focus:ring-slate-500/15'
    },
    remove: {
      gradient: 'bg-gradient-to-r from-red-600 via-red-500 to-red-700',
      hover: 'hover:from-red-700 hover:via-red-600 hover:to-red-800',
      text: 'text-white',
      shadow: 'shadow-md shadow-red-500/20',
      ring: 'focus:ring-4 focus:ring-red-500/15'
    },
    edit: {
      base: 'bg-gradient-to-r from-blue-50 to-slate-50 hover:from-blue-100 hover:to-slate-100 border border-slate-300/40',
      text: 'text-slate-700',
      shadow: 'shadow-sm shadow-slate-500/10',
      hover: 'hover:shadow-md hover:shadow-slate-500/15'
    },
    delete: {
      base: 'bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-300/40',
      text: 'text-red-700',
      shadow: 'shadow-sm shadow-red-500/10',
      hover: 'hover:shadow-md hover:shadow-red-500/15'
    },
    cancel: {
      gradient: "bg-gradient-to-r from-gray-500 to-slate-600",
      hover: "hover:from-gray-600 hover:to-slate-700",
      text: "text-white",
      shadow: "shadow-md shadow-gray-500/20"
    },
    save: {
      gradient: "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700",
      hover: "hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800",
      text: "text-white",
      shadow: "shadow-md shadow-emerald-500/20"
    },
    favorite: {
      active: 'text-amber-600',
      inactive: 'text-slate-400',
      hover: 'hover:text-amber-500 hover:scale-105'
    }
  },

  // Sidebar - Design minimaliste et élégant avec contraste amélioré
  sidebar: {
    main: {
      bg: 'bg-white/98 backdrop-blur-sm',
      border: 'border-r border-slate-200/40',
      shadow: 'shadow-lg shadow-slate-500/8'
    },
    icons: {
      default: 'text-slate-600',
      hover: 'text-slate-800 hover:scale-105',
      active: 'text-slate-800',
      bg: 'bg-transparent',        // Fond transparent par défaut
      bgHover: 'hover:bg-slate-100/70 hover:shadow-sm hover:shadow-slate-500/10',
      bgActive: 'bg-slate-200/80'  // Fond actif plus visible mais doux
    },
    items: {
      menu: {
        icon: 'text-slate-700 hover:text-slate-900',
        bg: 'bg-transparent',
        hover: 'hover:bg-slate-100/80 hover:scale-102 hover:shadow-sm',
        shadow: 'hover:shadow-slate-500/10 transition-all duration-200'
      },
      nouveau: {
        icon: 'text-slate-700 hover:text-slate-900',           // Texte sombre au lieu de blanc
        bg: 'bg-gradient-to-r from-slate-200/60 to-slate-300/60', // Fond plus clair
        hover: 'hover:bg-gradient-to-r hover:from-slate-300/80 hover:to-slate-400/80 hover:scale-102', // Hover plus sombre mais lisible
        shadow: 'shadow-sm shadow-slate-500/15 hover:shadow-md hover:shadow-slate-500/25 transition-all duration-200'
      },
      home: {
        icon: 'text-orange-700 hover:text-orange-800',        // Plus foncé pour le contraste
        bg: 'bg-gradient-to-r from-orange-100/70 to-amber-100/70', // Fond plus opaque
        hover: 'hover:bg-gradient-to-r hover:from-orange-200/90 hover:to-amber-200/90 hover:scale-102',
        shadow: 'hover:shadow-sm hover:shadow-orange-500/15 transition-all duration-200'
      },
      projects: {
        icon: 'text-emerald-700 hover:text-emerald-800',
        bg: 'bg-gradient-to-r from-emerald-100/70 to-teal-100/70',
        hover: 'hover:bg-gradient-to-r hover:from-emerald-200/90 hover:to-teal-200/90 hover:scale-102',
        shadow: 'hover:shadow-sm hover:shadow-emerald-500/15 transition-all duration-200'
      },
      favoris: {
        icon: 'text-amber-700 hover:text-amber-800',
        bg: 'bg-gradient-to-r from-amber-100/70 to-yellow-100/70',
        hover: 'hover:bg-gradient-to-r hover:from-amber-200/90 hover:to-yellow-200/90 hover:scale-102',
        shadow: 'hover:shadow-sm hover:shadow-amber-500/15 transition-all duration-200'
      },
      parametres: {
        icon: 'text-violet-700 hover:text-violet-800',
        bg: 'bg-gradient-to-r from-violet-100/70 to-purple-100/70',
        hover: 'hover:bg-gradient-to-r hover:from-violet-200/90 hover:to-purple-200/90 hover:scale-102',
        shadow: 'hover:shadow-sm hover:shadow-violet-500/15 transition-all duration-200'
      }
    },
    // Section pour les contenus de la deuxième sidebar - Amélioration de la lisibilité
    secondSidebar: {
      bg: 'bg-white/98 backdrop-blur-sm',
      border: 'border-r border-slate-200/40',
      shadow: 'shadow-lg shadow-slate-500/8',
      header: {
        bg: 'bg-gradient-to-r from-slate-50/80 to-gray-50/80',
        border: 'border-b border-slate-200/30'
      }
    }
  },

  // Header - Design minimaliste sophistiqué
  header: {
    logo: {
      bg: 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800',
      accent: 'bg-gradient-to-r from-slate-600 to-slate-700',
      shadow: 'shadow-md shadow-slate-500/20'
    },
    title: {
      gradient: 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800',
      subtitle: 'text-slate-600'
    },
    search: {
      icon: {
        default: 'text-slate-500',
        focus: 'text-slate-700',
        hover: 'text-slate-600'
      },
      input: {
        bg: 'bg-white/90 backdrop-blur-sm',
        bgHover: 'hover:bg-slate-50/80',
        bgFocus: 'focus:bg-white',
        border: 'border-slate-200',
        borderHover: 'hover:border-slate-300',
        borderFocus: 'focus:border-slate-400',
        placeholder: 'placeholder:text-slate-400',
        placeholderHover: 'hover:placeholder:text-slate-500',
        ring: 'focus:ring-slate-500/20'
      },
      effects: {
        shine: 'bg-gradient-to-r from-transparent via-slate-500/5 to-transparent',
        glow: 'bg-gradient-to-r from-slate-600/5 via-transparent to-slate-500/5',
        ring: 'ring-slate-500/15'
      }
    }
  },

  // Table - Design épuré et professionnel
  table: {
    header: {
      primary: 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800',
      secondary: 'bg-gradient-to-r from-slate-50 to-gray-50',
      text: 'text-white',
      textSecondary: 'text-slate-700',
      shadow: 'shadow-md shadow-slate-500/15'
    },
    input: {
      primary: 'bg-slate-500/15 text-white placeholder-slate-300',
      secondary: 'bg-white text-slate-700',
      focus: 'focus:bg-slate-500/20 focus:border-white',
      focusSecondary: 'focus:bg-slate-50 focus:border-slate-400'
    },
    border: 'border-slate-200/50'
  },

  // Favoris - Section élégante et discrète
  favorites: {
    icon: {
      bg: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600',
      text: 'text-white',
      shadow: 'shadow-md shadow-amber-500/20'
    },
    card: {
      bg: 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50',
      border: 'border-amber-200/50',
      hover: 'hover:from-amber-100 hover:via-yellow-100 hover:to-amber-100',
      shadow: 'hover:shadow-md hover:shadow-amber-500/15'
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

  // Projets - Couleurs raffinées et professionnelles
  projects: {
    colors: [
      'bg-gradient-to-r from-slate-700 to-slate-800',
      'bg-gradient-to-r from-blue-600 to-blue-700',
      'bg-gradient-to-r from-emerald-600 to-emerald-700',
      'bg-gradient-to-r from-rose-600 to-rose-700',
      'bg-gradient-to-r from-orange-600 to-orange-700',
      'bg-gradient-to-r from-red-600 to-red-700',
      'bg-gradient-to-r from-violet-600 to-violet-700',
      'bg-gradient-to-r from-teal-600 to-teal-700',
      'bg-gradient-to-r from-amber-600 to-amber-700',
      'bg-gradient-to-r from-pink-600 to-pink-700'
    ],
    shadows: [
      'shadow-md shadow-slate-500/20',
      'shadow-md shadow-blue-500/20',
      'shadow-md shadow-emerald-500/20',
      'shadow-md shadow-rose-500/20',
      'shadow-md shadow-orange-500/20',
      'shadow-md shadow-red-500/20',
      'shadow-md shadow-violet-500/20',
      'shadow-md shadow-teal-500/20',
      'shadow-md shadow-amber-500/20',
      'shadow-md shadow-pink-500/20'
    ]
  },

  // Dépendances - Palette douce et lisible
  dependencies: {
    anterior: {
      bg: 'bg-gradient-to-r from-orange-50 to-amber-50',
      text: 'text-orange-800',
      border: 'border-orange-300/50',
      shadow: 'shadow-sm shadow-orange-500/15'
    },
    successor: {
      bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300/50',
      shadow: 'shadow-sm shadow-emerald-500/15'
    }
  },

  // Notifications - Système doux et professionnel
  notifications: {
    success: {
      bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
      border: 'border-emerald-300/50',
      text: 'text-emerald-800',
      iconBg: 'bg-gradient-to-r from-emerald-100 to-teal-100',
      iconColor: 'text-emerald-600',
      shadow: 'shadow-md shadow-emerald-500/15'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50',
      border: 'border-red-300/50',
      text: 'text-red-800',
      iconBg: 'bg-gradient-to-r from-red-100 to-rose-100',
      iconColor: 'text-red-600',
      shadow: 'shadow-md shadow-red-500/15'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
      border: 'border-amber-300/50',
      text: 'text-amber-800',
      iconBg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
      iconColor: 'text-amber-600',
      shadow: 'shadow-md shadow-amber-500/15'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-slate-50',
      border: 'border-blue-300/50',
      text: 'text-blue-800',
      iconBg: 'bg-gradient-to-r from-blue-100 to-slate-100',
      iconColor: 'text-blue-600',
      shadow: 'shadow-md shadow-blue-500/15'
    },
    network: {
      bg: 'bg-gradient-to-r from-slate-50 to-gray-50',
      border: 'border-slate-300/50',
      text: 'text-slate-800',
      iconBg: 'bg-gradient-to-r from-slate-100 to-gray-100',
      iconColor: 'text-slate-600',
      shadow: 'shadow-md shadow-slate-500/15'
    }
  },

  // Textes - Hiérarchie claire et lisible
  text: {
    primary: 'text-slate-800',
    secondary: 'text-slate-600',
    muted: 'text-slate-500',
    placeholder: 'text-slate-400',
    gradient: 'bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent'
  },

  // Durée - Design subtil et élégant
  duration: {
    bg: 'bg-gradient-to-r from-slate-100 to-gray-100',
    text: 'text-slate-700',
    border: 'border-slate-200/50'
  },

  // Toggle - Design minimaliste
  toggle: {
    container: 'bg-white/98 backdrop-blur-sm border-slate-200/50 shadow-sm',
    active: 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 text-white shadow-md shadow-slate-500/20 transform scale-105',
    inactive: 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
  },

  // Scrollbar - Design épuré
  scrollbar: {
    track: '#f8fafc',           // slate-50
    thumb: '#64748b',           // slate-500
    thumbHover: '#475569',      // slate-600
    thumbActive: '#334155'      // slate-700
  },

  // Effets visuels - Subtilité et élégance
  effects: {
    glow: 'shadow-lg shadow-slate-500/15',
    glowHover: 'hover:shadow-lg hover:shadow-slate-500/25',
    shine: 'bg-gradient-to-r from-transparent via-white/15 to-transparent',
    glassmorphism: 'bg-white/98 backdrop-blur-sm border border-white/40',
    neon: 'shadow-md shadow-slate-500/30 border border-slate-400/40'
  }
};