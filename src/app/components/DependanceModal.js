import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X } from 'lucide-react';



const Modal = ({ isModalOpen, setIsModalOpen, dependencyType, setDependencyType }) => {
  const [selectedOption, setSelectedOption] = useState(dependencyType);

  useEffect(() => {
    if (isModalOpen) {
      setSelectedOption(dependencyType); // Remet à jour lors de l'ouverture
    }
  }, [isModalOpen, dependencyType]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    setDependencyType(selectedOption);
    setIsModalOpen(false); // Fermer la modal après avoir enregistré le type de dépendance
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay amélioré */}
          <motion.div
            className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96 relative z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Ajouter une dépendance</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-black hover:text-red-500 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>
            <hr className="w-full my-4  border-gray-300"/>
            <p className="mb-2 text-xs sm:text-xs text-gray-500">Sélectionnez la tâche et son type :</p>
            <div className="relative">
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="flex-1 p-2 rounded-lg w-full mt-3 mb-5 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-200"
              >
                <option 
                  value="successeur"
                  className="text-lg p-3 text-gray-700 font-medium text-left bg-white hover:bg-blue-100 hover:text-blue-700"
                >
                  Successeur
                </option>
                <option 
                  value="antérieur"
                  className="text-lg p-3 text-gray-700 font-medium text-left bg-white hover:bg-blue-100 hover:text-blue-700"
                >
                  Antérieur
                </option>
              </select>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full relative z-20"
            >
              Valider
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
