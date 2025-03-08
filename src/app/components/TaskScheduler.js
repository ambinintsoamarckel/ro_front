import { useState, useRef, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { Dialog } from "@headlessui/react";

const TaskScheduler = () => {
  const [taskCount, setTaskCount] = useState(1);
  const [tasks, setTasks] = useState([{ name: "", duration: "" }]);
  const [initialized, setInitialized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dependencyType, setDependencyType] = useState("successeur");

  const tableRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(0);

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

  const saveTasks = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      if (response.ok) {
        alert("Tâches enregistrées !");
      } else {
        alert("Erreur lors de l'enregistrement.");
      }
    } catch (error) {
      console.error("Erreur API :", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Ordonnancement des Tâches
      </h1>

      {!initialized ? (
        <div className="mb-4 flex justify-center items-center gap-4">
          <label className="font-semibold">Nombre initial de tâches :</label>
          <input
            type="number"
            value={taskCount}
            onChange={(e) => setTaskCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="border p-2 rounded w-20 text-center"
          />
          <button
            onClick={initializeTasks}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Valider
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="overflow-x-scroll border border-gray-300 shadow-md">
            <table ref={tableRef} className="min-w-full text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 font-bold">Tâches</th>
                  {tasks.map((task, index) => (
                    <th key={index} className="border p-2">
                      <input
                        type="text"
                        value={task.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        placeholder={`Tâche ${index + 1}`}
                        className="w-full border p-1 text-center"
                      />
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-100">
                  <th className="border p-2 font-bold">Durée</th>
                  {tasks.map((task, index) => (
                    <td key={index} className="border p-2">
                      <input
                        type="number"
                        value={task.duration}
                        onChange={(e) => handleDurationChange(index, e.target.value)}
                        className="w-16 border rounded text-center"
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
                className="absolute top-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Plus size={16} className="mx-auto" />
              </button>

              <button
                onClick={removeColumn}
                disabled={tasks.length === 1}
                className={`absolute bottom-0 right-0 w-8 h-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${
                  tasks.length === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-700"
                }`}
              >
                <Minus size={16} className="mx-auto" />
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={saveTasks}
              disabled={!allTasksValid}
              className={`px-4 py-2 rounded text-white ${
                allTasksValid ? "bg-green-500 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Enregistrer les tâches
            </button>

            <button
              onClick={() => openModal(tasks[0])}
              disabled={!allTasksValid}
              className={`px-4 py-2 rounded text-white ${
                allTasksValid ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Ajouter dépendance
            </button>
          </div>
        </div>
      )}

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
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
        </div>
      </Dialog>
    </div>
  );
};

export default TaskScheduler;
