// colors.js - Thème "Pure Elegance" - Minimaliste & Sophistiqué - Version Violet/Indigo
export const colors = {
  // Couleurs principales - Dégradés colorés avec accent violet/indigo
  primary: {
    gradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800',
    gradientBg: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600',
    gradientButton: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    text: 'text-indigo-600',
    bg: 'bg-indigo-500',
    border: 'border-indigo-200',
    focus: 'focus:border-indigo-400'
  },

  // Couleurs de fond - Dégradés colorés subtils
  background: {
    main: 'bg-gradient-to-r from-slate-50 via-indigo-50/30 to-purple-50/20',
    card: 'bg-white/90',
    header: 'bg-white/80',
    overlay: 'bg-white/20',
    input: 'bg-white/90',
    inputFocus: 'bg-white'
  },

  // États des boutons - Accent violet/indigo + neutrals
  buttons: {
    add: {
      gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      hover: 'hover:from-indigo-600 hover:to-purple-600',
      text: 'text-white'
    },
    remove: {
      gradient: 'bg-gradient-to-r from-slate-400 to-slate-500',
      hover: 'hover:from-slate-500 hover:to-slate-600',
      text: 'text-white'
    },
    edit: {
      base: 'bg-white/20 hover:bg-white/30',
      text: 'text-white'
    },
    delete: {
      base: 'bg-white/20 hover:bg-red-500/80',
      text: 'text-white'
    },
    cancel: {
      gradient: "bg-gradient-to-r from-slate-400 to-slate-500",
      hover: "hover:from-slate-500 hover:to-slate-600",
      text: "text-white"
    },
    save: {
      gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
      hover: "hover:from-indigo-600 hover:to-purple-600",
      text: "text-white"
    },
    favorite: {
      active: 'text-yellow-500',
      inactive: 'text-gray-400',
      hover: 'hover:text-yellow-400'
    }
  },

  // Header - Design avec dégradés colorés
  header: {
    logo: {
      bg: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800',
      accent: 'bg-gradient-to-r from-indigo-500 to-purple-500'
    },
    title: {
      gradient: 'bg-gradient-to-r from-slate-700 to-slate-600',
      subtitle: 'text-slate-600'
    },
    search: {
      icon: {
        default: 'text-slate-500',
        focus: 'text-indigo-600',
        hover: 'text-slate-700'
      },
      input: {
        bg: 'bg-white/90',
        bgHover: 'hover:bg-white/95',
        bgFocus: 'focus:bg-white',
        border: 'border-indigo-200',
        borderHover: 'hover:border-indigo-300',
        borderFocus: 'focus:border-indigo-400',
        placeholder: 'placeholder:text-indigo-400',
        placeholderHover: 'hover:placeholder:text-indigo-500',
        ring: 'focus:ring-indigo-500/20'
      },
      effects: {
        shine: 'bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent',
        glow: 'bg-gradient-to-r from-indigo-600/5 via-transparent to-indigo-500/5',
        ring: 'ring-indigo-500/15'
      }
    }
  },

  // Table - Design avec dégradés colorés
  table: {
    header: {
      primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800',
      secondary: 'bg-gradient-to-r from-slate-100 to-indigo-50',
      text: 'text-white',
      textSecondary: 'text-slate-700'
    },
    input: {
      primary: 'bg-white/10 text-white placeholder-indigo-300',
      secondary: 'bg-white/90 text-slate-700',
      focus: 'focus:bg-white/20 focus:border-white',
      focusSecondary: 'focus:bg-white focus:border-indigo-400'
    },
    border: 'border-indigo-200'
  },

  // Favoris - Section des favoris (couleurs neutres)
  favorites: {
    icon: {
      bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
      text: 'text-white'
    },
    card: {
      bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
      border: 'border-gray-200',
      hover: 'hover:from-gray-50 hover:to-slate-100'
    },
    empty: {
      icon: 'text-gray-300',
      text: 'text-gray-600'
    }
  },

  // Dépendances - Dégradés colorés différenciés
  dependencies: {
    anterior: {
      bg: 'bg-gradient-to-r from-amber-100 to-orange-100',
      text: 'text-amber-800',
      border: 'border-amber-200'
    },
    successor: {
      bg: 'bg-gradient-to-r from-emerald-100 to-teal-100',
      text: 'text-emerald-800',
      border: 'border-emerald-200'
    }
  },

  // Notifications - Système cohérent et minimal
  notifications: {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    info: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-800',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    network: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-800',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600'
    }
  },

  // Textes - Hiérarchie claire avec couleurs douces
  text: {
    primary: 'text-slate-700',
    secondary: 'text-slate-600',
    muted: 'text-slate-400',
    placeholder: 'text-indigo-400'
  },

  // Durée - Dégradé violet/indigo subtil
  duration: {
    bg: 'bg-gradient-to-r from-indigo-100 to-purple-100',
    text: 'text-indigo-800'
  },

  // Toggle - Design avec dégradés colorés
  toggle: {
    container: 'bg-white/90 border-indigo-200 shadow-sm',
    active: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md transform scale-105',
    inactive: 'text-slate-600 hover:text-slate-700'
  },

  // Scrollbar - Design avec couleurs violet/indigo
  scrollbar: {
    track: '#f1f5f9',           // slate-100 - Piste douce
    thumb: '#6366f1',           // indigo-500 - Accent violet/indigo
    thumbHover: '#4f46e5',      // indigo-600 - Plus intense au survol
    thumbActive: '#4338ca'      // indigo-700 - Actif
  }
};