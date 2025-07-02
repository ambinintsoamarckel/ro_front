import { useState } from "react";
import { Trash2, X, AlertTriangle, Shield, Undo2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

// Simulation du fichier colors.js avec les couleurs de suppression
const colors = {
  primary: {
    gradient: 'from-slate-700 via-slate-600 to-slate-800',
  },
  background: {
    card: 'bg-white/98 backdrop-blur-sm border border-slate-200/50 shadow-sm shadow-slate-500/5',
    main: 'from-gray-50 via-slate-50 to-zinc-50',
  },
  buttons: {
    remove: {
      gradient: 'from-red-600 via-red-500 to-red-700',
      hover: 'hover:from-red-700 hover:via-red-600 hover:to-red-800',
      text: 'text-white',
      shadow: 'shadow-md shadow-red-500/20',
      ring: 'focus:ring-4 focus:ring-red-500/15'
    },
    delete: {
      base: 'bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-300/40',
      text: 'text-red-700',
      shadow: 'shadow-sm shadow-red-500/10',
      hover: 'hover:shadow-md hover:shadow-red-500/15'
    },
    cancel: {
      gradient: "from-gray-500 to-slate-600",
      hover: "hover:from-gray-600 hover:to-slate-700",
      text: "text-white",
      shadow: "shadow-md shadow-gray-500/20"
    },
  },
  text: {
    primary: 'text-slate-800',
    secondary: 'text-slate-600',
    muted: 'text-slate-500',
  },
  notifications: {
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50',
      border: 'border-red-300/50',
      text: 'text-red-800',
      iconBg: 'bg-gradient-to-r from-red-100 to-rose-100',
      iconColor: 'text-red-600',
      shadow: 'shadow-md shadow-red-500/15'
    }
  }
};

const ConfirmDeleteModal = ({ isOpen = true, onClose = () => {}, onConfirm = () => {}, projectName = "Mon Projet Exemple" ,projectCount = null}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isMultipleDelete = projectCount !== null && projectCount > 1;

  const handleConfirm = async () => {
    setIsDeleting(true);
    // Simulation de la suppression
    setTimeout(() => {
      onConfirm();
      setIsDeleting(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop avec effet de flou sophistiqué */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-slate-900/40 via-zinc-900/30 to-stone-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal principale avec design élégant */}
      <div
        className={`${colors.background.card} backdrop-blur-md border border-red-200/60 shadow-2xl rounded-2xl w-full max-w-md relative z-50 overflow-hidden`}
      >
        <div className={`bg-gradient-to-r ${colors.buttons.remove.gradient} p-6 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br ${colors.buttons.remove.gradient} p-1.5 sm:p-2 shadow-lg`}
                >
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={40}  
                    height={40} 
                    className="w-full h-full object-contain filter brightness-0 invert"
                  />
                </motion.div>
                <div className={`absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse`}></div>
              </div>
              <div>
                <h1 className="text-xl font-bold">Supprimer le Projet</h1>
                <p className="text-white/80 text-sm">Action irréversible</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <X size={20} />
            </motion.button>
          </div>
        </div>

        {/* Contenu du modal avec background élégant */}
        <div className={`p-6 space-y-6 bg-gradient-to-br ${colors.background.main}`}>
          {/* Icône d'avertissement */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={`w-16 h-16 ${colors.notifications.error.iconBg} rounded-full flex items-center justify-center shadow-lg animate-pulse`}
              >
                <AlertTriangle className={`w-8 h-8 ${colors.notifications.error.iconColor}`} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Message d'avertissement */}
          <div className="text-center space-y-3">
            <p className={`text-lg font-semibold ${colors.text.primary}`}>
              {isMultipleDelete 
                ? `Êtes-vous sûr de vouloir supprimer ces ${projectCount} projets ?`
                : "Êtes-vous sûr de vouloir supprimer ce projet ?"
              }
            </p>
            <div className={`${colors.notifications.error.bg} ${colors.notifications.error.border} border rounded-xl p-4 ${colors.notifications.error.shadow}`}>
              <p className={`${colors.text.secondary} text-sm mb-2`} dangerouslySetInnerHTML={{
                __html: isMultipleDelete 
                  ? `Les <span class="font-bold text-red-600">${projectCount} projets sélectionnés</span> seront définitivement supprimés.`
                  : `Le projet <span class="font-bold text-red-600">${projectName}</span> sera définitivement supprimé.`
              }}>
              </p>
              <p className="text-red-600 text-sm font-medium">
                ⚠️ Cette action est irréversible
              </p>
            </div>
          </div>

          {/* Indicateur de danger */}
          <div className="flex items-center justify-center">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${colors.notifications.error.bg} ${colors.notifications.error.text} ${colors.notifications.error.border} border`}>
              <Shield className="w-4 h-4" />
              <span>Zone de danger</span>
            </div>
          </div>
        </div>

        {/* Actions avec boutons sophistiqués */}
        <div className={`flex justify-end space-x-3 p-6 pt-0 bg-gradient-to-br ${colors.background.main}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            disabled={isDeleting}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r ${colors.buttons.cancel.gradient} ${colors.buttons.cancel.hover} ${colors.buttons.cancel.text} shadow-lg hover:shadow-xl flex items-center space-x-2`}
          >
            <Undo2 className="w-4 h-4" />
            <span>Annuler</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: !isDeleting ? 1.05 : 1 }}
            whileTap={{ scale: !isDeleting ? 0.95 : 1 }}
            onClick={handleConfirm}
            disabled={isDeleting}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 bg-gradient-to-r ${colors.buttons.remove.gradient} ${colors.buttons.remove.hover} ${colors.buttons.remove.text} ${colors.buttons.remove.shadow} hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 relative shadow-lg`}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Suppression...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Supprimer définitivement</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;