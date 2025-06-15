import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, CheckCircle, Users, AlertCircle, CheckCircle2, Wifi, WifiOff } from 'lucide-react';

// Simulation des couleurs (à remplacer par votre fichier colors.js)
const colors = {
  primary: {
    gradient: "from-indigo-600 to-purple-600",
    gradientButton: "from-indigo-500 to-purple-500",
  },
  dependencies: {
    successor: {
      bg: "from-emerald-50 to-green-50",
      border: "border-emerald-200",
      text: "text-emerald-700"
    },
    anterior: {
      bg: "from-blue-50 to-indigo-50", 
      border: "border-blue-200",
      text: "text-blue-700"
    }
  },
  buttons: {
    cancel: {
      gradient: "from-slate-400 to-slate-500",
      hover: "hover:from-slate-500 hover:to-slate-600",
      text: "text-white"
    },
    save: {
      gradient: "from-indigo-500 to-purple-500",
      hover: "hover:from-indigo-600 hover:to-purple-600", 
      text: "text-white"
    }
  }
};

// Composant de notification réutilisable
const NotificationSystem = ({ notification, onClose }) => {
  if (!notification) return null;

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-50/95 to-green-50/95',
          border: 'border-emerald-200/80',
          text: 'text-emerald-800',
          iconBg: 'bg-emerald-100/80',
          iconColor: 'text-emerald-600',
          icon: CheckCircle2
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-50/95 to-rose-50/95',
          border: 'border-red-200/80',
          text: 'text-red-800',
          iconBg: 'bg-red-100/80',
          iconColor: 'text-red-600',
          icon: AlertCircle
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-50/95 to-yellow-50/95',
          border: 'border-amber-200/80',
          text: 'text-amber-800',
          iconBg: 'bg-amber-100/80',
          iconColor: 'text-amber-600',
          icon: AlertCircle
        };
      case 'network':
        return {
          bg: 'bg-gradient-to-r from-slate-50/95 to-gray-50/95',
          border: 'border-slate-200/80',
          text: 'text-slate-800',
          iconBg: 'bg-slate-100/80',
          iconColor: 'text-slate-600',
          icon: WifiOff
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-indigo-50/95 to-purple-50/95',
          border: 'border-indigo-200/80',
          text: 'text-indigo-800',
          iconBg: 'bg-indigo-100/80',
          iconColor: 'text-indigo-600',
          icon: CheckCircle
        };
    }
  };

  const styles = getNotificationStyles(notification.type);
  const IconComponent = styles.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-4 right-4 z-[60] max-w-md"
    >
      <div className={`
        ${styles.bg} ${styles.border} ${styles.text}
        rounded-xl shadow-2xl border backdrop-blur-md p-4 
        flex items-center space-x-3 relative overflow-hidden
      `}>
        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
        
        <div className={`p-2 rounded-full ${styles.iconBg} relative z-10`}>
          <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
        
        <div className="flex-1 relative z-10">
          <p className="font-medium text-sm">{notification.message}</p>
          {notification.details && (
            <p className="text-xs opacity-80 mt-1">{notification.details}</p>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className={`
            p-1 rounded-full hover:bg-white/30 transition-colors relative z-10
            ${styles.iconColor}
          `}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const TaskDetailsModal = ({ isOpen, onClose, task, allTasks, dependencyType, projectId }) => {
  const [selectedTaskIndices, setSelectedTaskIndices] = useState([]);
  const [addedTasks, setAddedTasks] = useState([]);
  const [notification, setNotification] = useState(null);

  // Fonction pour afficher les notifications avec plus d'options
  const showNotification = (message, type = 'success', details = null, duration = 4000) => {
    setNotification({ message, type, details });
    setTimeout(() => setNotification(null), duration);
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedTaskIndices([]);
      
      if (dependencyType === "successeur" && task && task.successors) {
        const existingSuccessors = task.successors.map(succ => {
          const matchingTask = allTasks.find(t => t.id === succ.taskId);
          return matchingTask;
        }).filter(t => t !== undefined);
        setAddedTasks(existingSuccessors);
      }
      
      if (dependencyType === "antérieur" && task && task.dependencies) {
        const existingDeps = task.dependencies.map(dep => {
          const matchingTask = allTasks.find(t => t.id === dep.dependsOnId);
          return matchingTask;
        }).filter(t => t !== undefined);
        setAddedTasks(existingDeps);
      }
    }
  }, [isOpen, task, dependencyType, allTasks]);

  const handleCheckboxChange = (index) => {
    if (selectedTaskIndices.includes(index)) {
      setSelectedTaskIndices(selectedTaskIndices.filter(i => i !== index));
    } else {
      setSelectedTaskIndices([...selectedTaskIndices, index]);
    }
  };

  const handleAddTasks = () => {
    const newTasks = selectedTaskIndices.map(index => allTasks[index]);
    setAddedTasks(prev => [...prev, ...newTasks]);
    setSelectedTaskIndices([]);
    
    // Notification de succès pour l'ajout

  };

  const handleRemoveTask = (indexToRemove) => {
    const removedTask = addedTasks[indexToRemove];
    setAddedTasks(prev => prev.filter((_, i) => i !== indexToRemove));
    

  };
  
  const handleValidate = async () => {
    const taskId = task?.id;
    const dependencyIds = addedTasks.map(t => t.id);
  
    const payload = dependencyType === "successeur"
      ? { taskId, successorIds: dependencyIds }
      : { taskId, dependsOnIds: dependencyIds };
  
    // Notification de chargement
    showNotification(
      'Enregistrement en cours...',
      'info',
      'Mise à jour des dépendances',
      2000
    );
  
    try {
      const response = await fetch(`http://localhost:3001/dependencies/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        showNotification(
          'Erreur lors de l\'enregistrement',
          'error',
          result.error || 'Une erreur est survenue',
          6000
        );
      } else {
        // Message différent selon le nombre de dépendances
        const successMessage = addedTasks.length === 0
          ? 'Toutes les dépendances ont été supprimées.'
          : `${addedTasks.length} dépendance${addedTasks.length > 1 ? 's' : ''} mise${addedTasks.length > 1 ? 's' : ''} à jour`;
  
        showNotification(
          'Dépendances enregistrées avec succès !',
          'success',
          successMessage,
          3000
        );
  
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      showNotification(
        'Erreur de connexion',
        'network',
        `Impossible de joindre le serveur: ${err.message}`,
        6000
      );
    }
  };
  
  if (!isOpen) return null;

  const otherTasks = allTasks
    .map((t, i) => ({ task: t, index: i }))
    .filter(({ task: t }) => 
      t.name !== task?.name && 
      !addedTasks.some(added => added.name === t.name)
    );

  const dependencyConfig = dependencyType === "successeur" 
    ? colors.dependencies.successor 
    : colors.dependencies.anterior;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        {/* Backdrop avec effet de flou */}
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-slate-900/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Modal principale */}
        <motion.div
          className="bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl w-full max-w-4xl relative z-50 overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header avec gradient */}
          <div className={`bg-gradient-to-r ${colors.primary.gradient} p-6 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Gestion des dépendances</h2>
                  <p className="text-white/80 text-sm">
                    {task?.name} - {dependencyType === "successeur" ? "Successeurs" : "Prédécesseurs"}
                  </p>
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

          {/* Contenu principal */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Section de sélection */}
              <motion.div 
                className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 rounded-xl p-6 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-slate-800">Tâches disponibles</h3>
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2 mb-4 custom-scrollbar">
                  {otherTasks.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Aucune tâche disponible</p>
                    </div>
                  ) : (
                    otherTasks.map(({ task: t, index }) => (
                      <motion.label 
                        key={index} 
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-50/50 cursor-pointer transition-all duration-200 group"
                        whileHover={{ scale: 1.02 }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTaskIndices.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                          className="w-4 h-4 text-indigo-600 border-2 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2"
                        />
                        <span className="text-slate-700 group-hover:text-indigo-700 font-medium">
                          {t.name || `Tâche ${index + 1}`}
                        </span>
                      </motion.label>
                    ))
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTasks}
                  disabled={selectedTaskIndices.length === 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    selectedTaskIndices.length > 0 
                      ? `bg-gradient-to-r ${colors.primary.gradientButton} text-white shadow-lg hover:shadow-xl` 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter ({selectedTaskIndices.length})</span>
                </motion.button>
              </motion.div>

              {/* Section des tâches sélectionnées */}
              <motion.div 
                className={`bg-gradient-to-br ${dependencyConfig.bg} border ${dependencyConfig.border} rounded-xl p-6 shadow-sm`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className={`w-5 h-5 ${dependencyConfig.text}`} />
                  <h3 className={`font-semibold ${dependencyConfig.text}`}>
                    Tâches sélectionnées ({addedTasks.length})
                  </h3>
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
                  {addedTasks.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Aucune tâche sélectionnée</p>
                    </div>
                  ) : (
                    addedTasks.map((t, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex justify-between items-center bg-white/60 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-white/40"
                      >
                        <span className="font-medium text-slate-700">
                          {t.name || `Tâche ${i + 1}`}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveTask(i)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-all duration-200"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <motion.div 
              className="flex justify-end space-x-4 mt-8 pt-6 border-t border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r ${colors.buttons.cancel.gradient} ${colors.buttons.cancel.hover} ${colors.buttons.cancel.text} shadow-lg hover:shadow-xl`}
              >
                Annuler
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleValidate}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r ${colors.buttons.save.gradient} ${colors.buttons.save.hover} ${colors.buttons.save.text} shadow-lg hover:shadow-xl flex items-center space-x-2`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Valider les modifications</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Système de notifications */}
        <AnimatePresence>
          <NotificationSystem
            notification={notification}
            onClose={() => setNotification(null)}
          />
        </AnimatePresence>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(99, 102, 241, 0.5);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.7);
          }
        `}</style>
      </div>
    </AnimatePresence>
  );
};

export default TaskDetailsModal;