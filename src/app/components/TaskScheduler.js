import { useState, useRef, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
//import TaskInitializerModal from "./TaskInitializerModal";
import DependanceModal from "./DependanceModal";


const TaskScheduler = () => {
  const [taskCount, setTaskCount] = useState("");
  const [tasks, setTasks] = useState([{ name: "", duration: "" }]);
  const [initialized, setInitialized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dependencyType, setDependencyType] = useState("successeur");

  const tableRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(0);
  const isValid = taskCount !== "" && parseInt(taskCount) >= 3;

  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  }, [tasks]);

  const initializeTasks = () => {
    const initialTasks = Array.from({ length: taskCount }, () => ({
      name: "",
      duration: "",
    }));
    setTasks(initialTasks);
    setInitialized(true);
  };

  const addColumn = () => {
    setTasks([...tasks, { name: "", duration: "" }]);
  };

  const removeColumn = () => {
    if (tasks.length > 1) {
      setTasks(tasks.slice(0, -1));
    }
  };

  const handleNameChange = (index, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].name = value;
    setTasks(updatedTasks);
  };

  const handleDurationChange = (index, value) => {
    if (/^\d*$/.test(value)) { // N'accepte que les chiffres
      const updatedTasks = [...tasks];
      updatedTasks[index].duration = value === "" ? "" : Math.max(1, parseInt(value, 10)); // Min 1
      setTasks(updatedTasks);
    }
  };

  const allTasksValid = tasks.every((task) => task.name.trim() !== "" && task.duration >= 1);

  const openModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveAndOpenModal = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      if (response.ok) {
        alert("Tâches enregistrées !");
        setIsModalOpen(true); // Ouvre la modal après succès
      } else {
        alert("Erreur lors de l'enregistrement.");
      }
    } catch (error) {
      console.error("Erreur API :", error);
    }
  };

  return (
    <div className="w-11/12 max-w-6xl mx-auto bg-white p-8 shadow-md rounded-lg mt-10">

        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold mb-5">Ordonnancement des Tâches</h1>
        </div>
        
        {!initialized ? (
        <div className="mb-4 flex justify-center items-center gap-4">
          <label className="font-semibold">Nombre initial de tâches :</label>
          <input
            type="number"
            value={taskCount}
            onChange={(e) => setTaskCount(Math.max(3, parseInt(e.target.value) || 3))}
            className="border p-2 rounded w-20 text-center"
            min="3" 
            required
          />
          <button
            onClick={initializeTasks}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={!isValid} // Désactive si l'input est vide ou < 3
          >
            Valider
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="overflow-x-scroll scrollbar-hidden shadow-md mt-5">
            <table ref={tableRef} className="min-w-full text-center border-collapse shadow-lg  overflow-hidden mt-5 mb-5">
              <thead>
                <tr className="bg-orange-100 text-gray-800 text-xl font-semibold">
                  <th className="p-3 border border-orange-200">Tâches</th>
                  {tasks.map((task, index) => (
                    <th key={index} className="p-3">
                      <input
                        type="text"
                        value={task.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        placeholder={`Tâche ${index + 1}`}
                        className="w-full p-3 text-center bg-transparent text-gray-900 placeholder-gray-400 outline-none border-b border-transparent focus:border-gray-600 transition-all "
                      />
                    </th>
                  ))}
                </tr>
                <tr className={`bg-white border-t border-gray-300 text-xl`}>
                  <th className="p-3 font-bold text-gray-700">Durée</th>
                  {tasks.map((task, index) => (
                    <td key={index} className="p-3 border border-orange-200">
                      <input
                        type="number"
                        value={task.duration}
                        onChange={(e) => handleDurationChange(index, e.target.value)}
                        className="w-full text-center bg-transparent text-gray-900 outline-none border-b border-transparent focus:border-gray-600 transition-all"
                        min="1"
                      />
                    </td>
                  ))}
                </tr>
              </thead>
            </table>
          </div>

          <div
            className="absolute top-0 right-0 w-8"
            style={{ height: tableHeight }}
          >
            <div className="relative h-full group">
              <button
                onClick={addColumn}
                className="absolute top-0 right-0 w-8 h-8 text-blue-500 rounded-full shadow-md border border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500 hover:text-white"
              >
                <Plus size={20} className="mx-auto" />
              </button>

              <button
                onClick={removeColumn}
                disabled={tasks.length === 1}
                className={`absolute bottom-0 right-0 w-8 h-8 rounded-full shadow-md border opacity-0 group-hover:opacity-100 transition-opacity ${
                  tasks.length === 1
                    ? "border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                }`}
              >
                <Minus size={20} className="mx-auto" />
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveAndOpenModal}
              disabled={!allTasksValid}
              className={`px-4 py-2 rounded-lg text-white mt-5 ${
                allTasksValid ? "bg-green-500 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Ajouter dépendance
            </motion.button>
          </div>
        </div>
      )}
      <DependanceModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        dependencyType={dependencyType}
        setDependencyType={setDependencyType}
      />

    </div>
  );
};

export default TaskScheduler;
