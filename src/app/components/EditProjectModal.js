import { useState, useEffect } from "react";
import { X, FolderPen, AlignCenter, Save, Undo2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

// Simulation du fichier colors.js
const colors = {
  primary: {
    gradient: 'from-slate-700 via-slate-600 to-slate-800',
  },
  background: {
    card: 'bg-white/98 backdrop-blur-sm border border-slate-200/50 shadow-sm shadow-slate-500/5',
    main: 'from-gray-50 via-slate-50 to-zinc-50',
  },
  buttons: {
    add: {
      gradient: 'from-slate-700 via-slate-600 to-slate-800',
    },
    cancel: {
      gradient: "from-gray-500 to-slate-600",
      hover: "hover:from-gray-600 hover:to-slate-700",
      text: "text-white",
      shadow: "shadow-md shadow-gray-500/20"
    },
    save: {
      gradient: "from-emerald-600 via-teal-600 to-emerald-700",
      hover: "hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800",
      text: "text-white",
      shadow: "shadow-md shadow-emerald-500/20"
    },
  },
  text: {
    primary: 'text-slate-800',
    muted: 'text-slate-500',
    placeholder: 'text-slate-400',
  },
  notifications: {
    success: {
      bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300/50'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
      text: 'text-amber-800',
      border: 'border-amber-300/50'
    }
  }
};

const EditProjectModal = ({ isOpen = true, onClose = () => {}, project = { id: 1, name: "Mon Projet", description: "Description du projet" }, onUpdated = () => {} }) => {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setDescription(project.description || "");
    }
  }, [project]);

  const isValid = name.trim() !== "";

  const autoResizeTextarea = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleUpdate = async () => {
    if (!isValid) return;
    setLoading(true);
    
    // Simulation de la requête
    setTimeout(() => {
      onUpdated({ ...project, name, description });
      onClose();
      setLoading(false);
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
        className={`${colors.background.card} backdrop-blur-md border border-stone-200/40 shadow-2xl rounded-2xl w-full max-w-md relative z-50 overflow-hidden`}
      >
        {/* Header avec logo comme TaskInitializerModal */}
        <div className={`bg-gradient-to-r ${colors.primary.gradient} p-6 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br ${colors.primary.gradient} p-1.5 sm:p-2 shadow-lg`}
                >
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={40}  
                    height={40} 
                    className="w-full h-full object-contain filter brightness-0 invert"
                  />
                </motion.div>
                <div className={`absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r ${colors.buttons.add.gradient} rounded-full animate-pulse`}></div>
              </div>
              <div>
                <h1 className="text-xl font-bold">Modifier le Projet</h1>
                <p className="text-white/80 text-sm">Édition des informations</p>
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

        {/* Contenu du formulaire avec background élégant */}
        <div className={`p-6 space-y-6 bg-gradient-to-br ${colors.background.main}`}>
          {/* Nom du projet */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className={`block text-sm font-semibold ${colors.text.primary}`}>
              Nom du projet
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FolderPen className={`w-5 h-5 ${colors.text.muted} group-focus-within:text-amber-500 transition-colors`} />
              </div>
              <input
                type="text"
                placeholder="Nom du projet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`block w-full pl-12 pr-4 py-3 border-2 border-stone-200/60 text-sm rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all duration-200 bg-white/80 ${colors.text.primary} placeholder:${colors.text.placeholder}`}
                required
              />
            </div>
          </motion.div>

          {/* Description */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className={`block text-sm font-semibold ${colors.text.primary}`}>
              Description du projet
            </label>
            <div className="relative group">
              <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                <AlignCenter className={`w-5 h-5 ${colors.text.muted} group-focus-within:text-amber-500 transition-colors`} />
              </div>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  autoResizeTextarea(e.target);
                }}
                className={`block w-full pl-12 pr-4 py-3 border-2 border-stone-200/60 text-sm rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all duration-200 bg-white/80 ${colors.text.primary} placeholder:${colors.text.placeholder} resize-none overflow-hidden`}
                placeholder="Description du projet (facultatif)"
                rows={1}
              />
            </div>
          </motion.div>

          {/* Indicateur de validation avec couleurs élégantes */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isValid 
                ? `${colors.notifications.success.bg} ${colors.notifications.success.text} ${colors.notifications.success.border} border` 
                : `${colors.notifications.warning.bg} ${colors.notifications.warning.text} ${colors.notifications.warning.border} border`
            }`}>
              <div className={`w-2 h-2 rounded-full ${isValid ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              <span>{isValid ? 'Prêt à modifier' : 'Le nom du projet est requis'}</span>
            </div>
          </motion.div>
        </div>

        {/* Actions avec boutons sophistiqués */}
        <motion.div 
          className={`flex justify-end space-x-3 p-6 pt-0 bg-gradient-to-br ${colors.background.main}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r ${colors.buttons.cancel.gradient} ${colors.buttons.cancel.hover} ${colors.buttons.cancel.text} shadow-lg hover:shadow-xl flex items-center space-x-2`}
          >
            <Undo2 className="w-4 h-4" />
            <span>Annuler</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: isValid && !loading ? 1.05 : 1 }}
            whileTap={{ scale: isValid && !loading ? 0.95 : 1 }}
            onClick={handleUpdate}
            disabled={!isValid || loading}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl ${
            isValid && !loading
              ? `bg-gradient-to-r ${colors.buttons.save.gradient} ${colors.buttons.save.hover} ${colors.buttons.save.text}`
              : 'bg-gradient-to-r from-stone-300 to-slate-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Mise à jour...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Enregistrer</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProjectModal;