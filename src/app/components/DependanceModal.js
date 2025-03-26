"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X } from 'lucide-react';



const Modal = ({ isModalOpen, setIsModalOpen, dependencyType, setDependencyType, projectId }) => {
  const [selectedOption, setSelectedOption] = useState(dependencyType);

  useEffect(() => {
    if (isModalOpen) {
      setSelectedOption(dependencyType); // Remet à jour lors de l'ouverture
    }
  }, [isModalOpen, dependencyType]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    console.log("Choix enregistré :", selectedOption);
    // Mise à jour de la valeur dans TaskScheduler
    if (selectedOption === "antérieur")
    {
      try {
        const isSuccessor=false;
        console.log(projectId);
        const response = await fetch(`http://localhost:3001/projects/${projectId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isSuccessor}),
        });
  
        if (!response.ok) {
          throw new Error("Erreur lors de la maj du projet");
        }
  
        const createdProject = await response.json();
        console.log(createdProject);
  
      } catch (error) {
        console.error(error.message);
        alert("Erreur lors de la création du maj  projet.");
      }
    }
    setDependencyType(selectedOption);
    
    setIsModalOpen(false);
  };  

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">

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
                className={`flex-1 p-2 rounded-lg w-full mt-3 mb-5 transition duration-200 border-2 outline-none
                  ${
                    selectedOption === "successeur" || selectedOption === "antérieur"
                      ? "border-blue-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-300 focus:border-blue-300`}
              >
                <option 
                  className="text-lg p-3 text-gray-700 font-medium text-left bg-white hover:bg-blue-100 hover:text-blue-700"
                >
                </option>
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
              disabled={selectedOption !== "successeur" && selectedOption !== "antérieur"}
              className={`px-4 py-2 rounded-lg w-full relative z-20 transition-colors duration-200 ${
                selectedOption === "successeur" || selectedOption === "antérieur"
                  ? "bg-blue-500 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
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
