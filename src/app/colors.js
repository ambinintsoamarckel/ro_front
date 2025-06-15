// colors.js - Configuration centralisée des couleurs
export const colors = {
    // Couleurs principales
    primary: {
      gradient: 'from-indigo-600 via-purple-600 to-indigo-800',
      gradientBg: 'from-indigo-500 via-purple-500 to-indigo-600',
      gradientButton: 'from-indigo-500 to-purple-500',
      text: 'text-indigo-600',
      bg: 'bg-indigo-500',
      border: 'border-indigo-200',
      focus: 'focus:border-indigo-400'
    },
  
    // Couleurs de fond
    background: {
      main: 'from-slate-50 via-indigo-50/30 to-purple-50/20',
      card: 'bg-white/90',
      header: 'bg-white/80',
      overlay: 'bg-white/20'
    },
  
    // États des boutons
    buttons: {
      edit: {
        base: 'bg-white/20 hover:bg-white/30',
        text: 'text-white'
      },
      delete: {
        base: 'bg-white/20 hover:bg-red-500/80',
        text: 'text-white'
      },
      save: {
        gradient: 'from-green-500 to-emerald-500',
        hover: 'hover:from-green-600 hover:to-emerald-600',
        text: 'text-white'
      },
      cancel: {
        gradient: 'from-red-500 to-pink-500',
        hover: 'hover:from-red-600 hover:to-pink-600',
        text: 'text-white'
      },
      favorite: {
        active: 'text-yellow-500',
        inactive: 'text-gray-400',
        hover: 'hover:text-yellow-400'
      }
    },
  
    // Dépendances
    dependencies: {
      anterior: {
        bg: 'from-amber-100 to-orange-100',
        text: 'text-amber-800',
        border: 'border-amber-200'
      },
      successor: {
        bg: 'from-emerald-100 to-teal-100',
        text: 'text-emerald-800',
        border: 'border-emerald-200'
      }
    },
  
    // Textes
    text: {
      primary: 'text-slate-700',
      secondary: 'text-slate-600',
      muted: 'text-slate-400',
      placeholder: 'text-indigo-400'
    },
  
    // Durée
    duration: {
      bg: 'from-indigo-100 to-purple-100',
      text: 'text-indigo-800'
    }
  };