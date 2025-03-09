import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isModalOpen, setIsModalOpen, dependencyType, setDependencyType }) => {
  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background Overlay (clic pour fermer) */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)} // Ferme le modal si on clique en dehors
          />

          {/* Modal Content */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-bold mb-4">Ajouter une dépendance</h2>
            <p className="mb-2">Sélectionnez la tâche et son type :</p>
            <select
              value={dependencyType}
              onChange={(e) => setDependencyType(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            >
              <option value="successeur">Successeur</option>
              <option value="antérieur">Antérieur</option>
            </select>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Valider
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
