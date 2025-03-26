import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from 'lucide-react';

const TaskInitializerModal = ({ isOpen, onClose, onInitialize }) => {
  const [taskCount, setTaskCount] = useState(3);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = taskCount !== "" && parseInt(taskCount) >= 3;

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
                <h2 className="text-lg font-bold">Initialiser les tâches</h2>
                <button
                  onClick={onClose}
                  className="text-black hover:text-red-500 transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              <hr className="w-full my-4  border-gray-300"/>

              <div className="space-y-3">

                <div>
                  <label className="font-semibold">Nom du projet :</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Nom du projet"
                    required
                  />
                </div>

  <             div>
                  <label className="font-semibold">Description :</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Description (facultatif)"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="font-semibold">Nombre initial de tâches :</label>
                  <input
                    type="number"
                    value={taskCount}
                    onChange={(e) => setTaskCount(Math.max(3, parseInt(e.target.value) || 3))}
                    className="border p-2 rounded w-20 text-center"
                    min="3" 
                    required
                  />
                </div>
              </div>
              
              <hr className="w-full my-4  border-gray-300"/>

              <div className="flex justify-end mt-6 gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  disabled={loading}
                >
                  Annuler
                </button>
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!isValid || loading}
                className={`px-4 py-2 rounded text-white ${isValid ? "bg-green-500 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
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
