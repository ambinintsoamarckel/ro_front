import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from 'lucide-react';

const TaskInitializerModal = ({ isOpen, onClose, onInitialize }) => {
  const [taskCount, setTaskCount] = useState(3);
  const isValid = taskCount !== "" && parseInt(taskCount) >= 3;

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
              <label className="font-semibold">Nombre initial de tâches :</label>
              <input
                type="number"
                value={taskCount}
                onChange={(e) => setTaskCount(Math.max(3, parseInt(e.target.value) || 3))}
                className="border p-2 rounded w-full text-center mt-2"
                min="3"
                required
              />
              <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onInitialize(taskCount)}
                disabled={!isValid}
                className={`px-4 py-2 rounded text-white ${isValid ? "bg-green-500 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
              >
                Valider
              </motion.button>
            </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskInitializerModal;
