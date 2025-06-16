// colors.js - Configuration centralisée des couleurs élégantes
export const colors = {
  // Couleurs principales - Tons sophistiqués charcoal et or rose
  primary: {
    gradient: 'from-slate-800 via-slate-700 to-zinc-900',
    gradientBg: 'from-slate-700 via-zinc-700 to-slate-800',
    gradientButton: 'from-rose-500 to-amber-500',
    text: 'text-slate-800',
    bg: 'bg-slate-700',
    border: 'border-slate-300',
    focus: 'focus:border-rose-400'
  },

  // Couleurs de fond - Base crème luxueuse
  background: {
    main: 'bg-gradient-to-br from-stone-50 via-amber-50/20 to-rose-50/10',
    card: 'bg-white/95',
    header: 'bg-white/90',
    overlay: 'bg-stone-100/30',
    input: 'bg-white/80',
    inputFocus: 'bg-white/95'
  },

  // États des boutons - Accents dorés et cuivrés
  buttons: {
    add: {
      gradient: 'from-amber-500 to-rose-500',
      hover: 'hover:from-amber-600 hover:to-rose-600',
      text: 'text-white'
    },
    remove: {
      gradient: 'from-stone-400 to-zinc-500',
      hover: 'hover:from-stone-500 hover:to-zinc-600',
      text: 'text-white'
    },
    edit: {
      base: 'bg-amber-100/40 hover:bg-amber-200/60',
      text: 'text-amber-800'
    },
    delete: {
      base: 'bg-rose-100/40 hover:bg-rose-400/70',
      text: 'text-rose-800 hover:text-white'
    },
    cancel: {
      gradient: "from-stone-400 to-zinc-500",
      hover: "hover:from-stone-500 hover:to-zinc-600",
      text: "text-white"
    },
    save: {
      gradient: "from-amber-500 to-rose-500",
      hover: "hover:from-amber-600 hover:to-rose-600",
      text: "text-white"
    },
    favorite: {
      active: 'text-amber-500',
      inactive: 'text-stone-400',
      hover: 'hover:text-amber-400'
    }
  },

  // Header - Couleurs spécifiques pour le header
  header: {
    logo: {
      bg: 'from-slate-800 via-slate-700 to-zinc-900',
      accent: 'from-amber-500 to-rose-500'
    },
    title: {
      gradient: 'from-slate-800 via-slate-700 to-zinc-900',
      subtitle: 'text-stone-600'
    },
    search: {
      icon: {
        default: 'text-stone-400',
        focus: 'text-slate-800',
        hover: 'text-stone-600'
      },
      input: {
        bg: 'bg-white/80',
        bgHover: 'hover:bg-white/90',
        bgFocus: 'focus:bg-white/95',
        border: 'border-slate-300',
        borderHover: 'hover:border-stone-300/80',
        borderFocus: 'focus:border-rose-400',
        placeholder: 'placeholder:text-stone-400',
        placeholderHover: 'hover:placeholder:text-stone-500',
        ring: 'focus:ring-rose-400/30'
      },
      effects: {
        shine: 'from-transparent via-rose-400/5 to-transparent',
        glow: 'from-amber-500/5 via-transparent to-rose-500/5',
        ring: 'ring-rose-400/20'
      }
    }
  },

  // Table - Styling spécifique pour les tableaux
  table: {
    header: {
      primary: 'bg-gradient-to-r from-slate-700 via-zinc-700 to-slate-800',
      secondary: 'bg-gradient-to-r from-white to-stone-50/50',
      text: 'text-white',
      textSecondary: 'text-slate-800'
    },
    input: {
      primary: 'bg-white/20 text-white placeholder-stone-200',
      secondary: 'bg-stone-50 text-slate-800',
      focus: 'focus:bg-white/30 focus:border-white',
      focusSecondary: 'focus:bg-white focus:border-rose-400'
    },
    border: 'border-stone-200'
  },

  // Favoris - Couleurs spécifiques pour l'onglet favoris
  favorites: {
    icon: {
      bg: 'from-amber-400 via-yellow-500 to-amber-600',
      text: 'text-white'
    },
    card: {
      bg: 'bg-gradient-to-br from-amber-50/60 to-yellow-50/40',
      border: 'border-amber-200/50',
      hover: 'hover:from-amber-100/70 hover:to-yellow-100/50'
    },
    empty: {
      icon: 'text-amber-300',
      text: 'text-amber-600'
    }
  },

  // Dépendances - Tons terreux raffinés
  dependencies: {
    anterior: {
      bg: 'from-amber-50 to-orange-50',
      text: 'text-amber-900',
      border: 'border-amber-200'
    },
    successor: {
      bg: 'from-emerald-50 to-teal-50',
      text: 'text-emerald-900',
      border: 'border-emerald-200'
    }
  },

  // Notifications - Système cohérent avec le thème principal
  notifications: {
    success: {
      bg: 'bg-gradient-to-r from-emerald-50/95 to-teal-50/95',
      border: 'border-emerald-200/80',
      text: 'text-emerald-800',
      iconBg: 'bg-emerald-100/80',
      iconColor: 'text-emerald-600'
    },
    error: {
      bg: 'bg-gradient-to-r from-rose-50/95 to-red-50/95',
      border: 'border-rose-200/80',
      text: 'text-rose-800',
      iconBg: 'bg-rose-100/80',
      iconColor: 'text-rose-600'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50/95 to-orange-50/95',
      border: 'border-amber-200/80',
      text: 'text-amber-800',
      iconBg: 'bg-amber-100/80',
      iconColor: 'text-amber-600'
    },
    info: {
      bg: 'bg-gradient-to-r from-amber-50/95 to-rose-50/95',
      border: 'border-amber-200/80',
      text: 'text-amber-800',
      iconBg: 'bg-amber-100/80',
      iconColor: 'text-amber-600'
    },
    network: {
      bg: 'bg-gradient-to-r from-slate-50/95 to-stone-50/95',
      border: 'border-slate-200/80',
      text: 'text-slate-800',
      iconBg: 'bg-slate-100/80',
      iconColor: 'text-slate-600'
    }
  },

  // Textes - Hiérarchie sophistiquée
  text: {
    primary: 'text-slate-800',
    secondary: 'text-stone-600',
    muted: 'text-stone-400',
    placeholder: 'text-stone-400'
  },

  // Durée - Accent doré subtil
  duration: {
    bg: 'from-amber-50 to-rose-50',
    text: 'text-amber-900'
  },
  toggle: {
  container: 'bg-white/95 backdrop-blur-sm border-white/30',
  active: 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg transform scale-105',
  inactive: 'text-stone-600 hover:text-slate-800'
},
  // Scrollbar - Styling cohérent avec le thème principal
  scrollbar: {
    track: '#f1f5f9',           // stone-100 - Piste claire et discrète
    thumb: '#d4a574',           // Couleur dorée harmonieuse avec le thème amber/rose
    thumbHover: '#c2956b',      // Version plus foncée au survol
    thumbActive: '#b8855f'      // Version encore plus foncée lors du clic
  }
};