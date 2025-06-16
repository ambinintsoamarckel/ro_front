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
    main: 'from-stone-50 via-amber-50/20 to-rose-50/10',
    card: 'bg-white/95',
    header: 'bg-white/90',
    overlay: 'bg-stone-100/30'
  },

  // États des boutons - Accents dorés et cuivrés
  buttons: {
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

  // Textes - Hiérarchie sophistiquée
  text: {
    primary: 'text-slate-800',
    secondary: 'text-stone-600',
    muted: 'text-stone-400',
    placeholder: 'text-amber-400'
  },

  // Durée - Accent doré subtil
  duration: {
    bg: 'from-amber-50 to-rose-50',
    text: 'text-amber-900'
  }
};