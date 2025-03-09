import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

const TaskInitializerModal = ({ taskCount, setTaskCount, initializeTasks }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleValidate = () => {
    initializeTasks();
    setIsOpen(false);
  };

  return (
    <div> 
      <Dialog open={isOpen} onClose={() => {}} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4">Nombre initial de tâches</h2>
          <div className="flex justify-center items-center gap-4 mb-4">
            <label className="font-semibold">Tâches :</label>
            <input
              type="number"
              value={taskCount}
              onChange={(e) => setTaskCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="border p-2 rounded w-20 text-center"
            />
          </div>
          <button
            onClick={handleValidate}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Valider
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default TaskInitializerModal;
