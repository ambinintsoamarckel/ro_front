import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from 'lucide-react';

const TaskDetailsModal = ({ isOpen, onClose, task, allTasks }) => {
  const [selectedTaskIndices, setSelectedTaskIndices] = useState([]);
  const [addedTasks, setAddedTasks] = useState([]);

  useEffect(() => {
    // Réinitialiser à chaque ouverture de la modal
    if (isOpen) {
      setSelectedTaskIndices([]);
      setAddedTasks([]);
    }
  }, [isOpen]);

  const handleCheckboxChange = (index) => {
    if (selectedTaskIndices.includes(index)) {
      setSelectedTaskIndices(selectedTaskIndices.filter(i => i !== index));
    } else {
      setSelectedTaskIndices([...selectedTaskIndices, index]);
    }
  };

  const handleAddTasks = () => {
    const newTasks = selectedTaskIndices.map(index => allTasks[index]);
    setAddedTasks(newTasks);
    setSelectedTaskIndices([]); // Optionnel : réinitialise les sélections
  };

  const handleRemoveTask = (indexToRemove) => {
    setAddedTasks(prev => prev.filter((_, i) => i !== indexToRemove));
  };
  

  if (!isOpen) return null;

  // Exclure la tâche actuelle ET celles déjà ajoutées
const otherTasks = allTasks
.map((t, i) => ({ task: t, index: i }))
.filter(({ task: t }) => 
  t.name !== task?.name && 
  !addedTasks.some(added => added.name === t.name)
);


  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <motion.div
          className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg w-96 relative z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Détails de la tâche</h2>
            <button
              onClick={onClose}
              className="text-black hover:text-red-500 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <hr className="w-full my-4 border-gray-300" />

          {/* Conteneur des cartes en flex-row */}
          <div className="flex flex-col gap-4">
            {/* Carte Nom de la tâche + Checkbox */}
            <div className="border p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-700 mb-2">Sélectionner des tâches à lier</h3>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {otherTasks.length === 0 ? (
                  <p className="text-gray-500">Aucune autre tâche disponible</p>
                ) : (
                  otherTasks.map(({ task: t, index }) => (
                    <label key={index} className="flex items-center space-x-2 text-gray-800">
                      <input
                        type="checkbox"
                        checked={selectedTaskIndices.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                        className="accent-blue-500"
                      />
                      <span>{t.name || `Tâche ${index + 1}`}</span>
                    </label>
                  ))
                )}
              </div>
              {/* Bouton Ajouter */}
              <div className="flex justify-end mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTasks}
                  disabled={selectedTaskIndices.length === 0}
                  className={`px-3 py-1 text-sm rounded ${
                    selectedTaskIndices.length > 0 ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Ajouter
                </motion.button>
              </div>
            </div>

            {/* Carte Tâches sélectionnées */}
            <div className="border p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-700 mb-2">Tâches sélectionnées</h3>
              {addedTasks.length === 0 ? (
                <p className="text-gray-500">Aucune tâche sélectionnée</p>
              ) : (
                <ul className="text-gray-900 space-y-2">
                  {addedTasks.map((t, i) => (
                    <li key={i} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
                      <span>{t.name || `Tâche ${i + 1}`}</span>
                      <button onClick={() => handleRemoveTask(i)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>

          <hr className="w-full my-4 border-gray-300" />

          <div className="flex justify-end mt-6 gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-700"
            >
              Valider
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskDetailsModal;
