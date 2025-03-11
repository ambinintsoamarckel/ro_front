import { useState } from "react";
import { motion } from "framer-motion";

const TaskInitializerModal = ({ isOpen, onClose, onInitialize }) => {
  const [taskCount, setTaskCount] = useState(3);
  const isValid = taskCount !== "" && parseInt(taskCount) >= 3;

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-xl font-semibold mb-4">Initialiser les tâches</h2>
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
        </div>
      </div>
    )
  );
};

export default TaskInitializerModal;
