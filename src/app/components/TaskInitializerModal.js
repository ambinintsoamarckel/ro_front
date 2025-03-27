import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X , FolderPen, AlignCenter , FileDigit} from 'lucide-react';

const TaskInitializerModal = ({ isOpen, onClose, onInitialize }) => {
  const [taskCount, setTaskCount] = useState(3);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = name.trim() !== "" && taskCount !== "" && parseInt(taskCount) >= 3;

  const autoResizeTextarea = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  
  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du projet");
      }

      const createdProject = await response.json();
      console.log(createdProject);

      // Appel la fonction parent avec le nom et le nombre de tâches
      await onInitialize( taskCount, createdProject);

      // Reset et close
      onClose();
      setName("");
      setDescription("");
      setIsFavorite(false);

    } catch (error) {
      console.error(error.message);
      alert("Erreur lors de la création du projet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
              <h1 className="text-2xl font-black mb-2 text-gray-800 tracking-tight">Initialiser les tâches</h1>
                <button
                  onClick={onClose}
                  className="text-black hover:text-red-500 transition-colors duration-200"
                >
                  <X size={25} />
                </button>
              </div>

              <hr className="w-full my-4  border-gray-300"/>

              <div className="space-y-4">
                <div className="mt-5 mb-5">
                  <label className="font-semibold">Nom du projet :</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
                      <FolderPen size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Nom du projet"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 border text-sm rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              

                <div className="mt-5 mb-5">
                  <label className="font-semibold">Description du projet :</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
                      <AlignCenter size={20} />
                    </div>
                    <textarea
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        autoResizeTextarea(e.target); // Ajuste la hauteur automatiquement
                      }}
                      className="block w-full pl-10 pr-12 py-3 border text-sm rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 overflow-hidden"
                      placeholder="(facultatif)"
                      rows={1}
                    />
                  </div>
                </div>

                <div className="mt-5 mb-2">
                  <label className="font-semibold">Nombre initial de tâches :</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
                      <FileDigit size={20} />
                    </div>
                      <input
                        type="number"
                        value={taskCount}
                        onChange={(e) => setTaskCount(Math.max(3, parseInt(e.target.value) || 3))}
                        className="block  pl-10 pr-4 py-3 border text-sm text-center rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 w-30"
                        min="3" 
                        required
                      />
                    </div>
                </div>
              </div>
              
              <hr className="w-full my-4  border-gray-300"/>

              <div className="flex justify-end mt-6 gap-2">
                <button
                  onClick={onClose}
                  className="w-40 py-3 px-4 text-white rounded-lg font-medium transition-all duration-300 bg-gray-400 hover:bg-gray-500"
                  disabled={loading}
                >
                  Annuler
                </button>
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!isValid || loading}
                className={`w-40 py-3 px-4 text-white rounded-lg font-medium transition-all duration-300 ${isValid ? "bg-green-600 hover:bg-green-800" : "bg-green-500 cursor-not-allowed"}`}
                >
                  {loading ? "Création..." : "Créer"}
                </motion.button>
            </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskInitializerModal;
