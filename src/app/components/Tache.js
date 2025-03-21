"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DependanceModal from "./DependanceModal";
import CPMGraph from "./CPMGraph";

const Tache = ({ initialTaskCount , currentProject}) => {
  //const [taskCount, setTaskCount] = useState("");
  const [tasks, setTasks] = useState([{ name: "", duration: "" , projectId: currentProject.id}]);
  const [initialized, setInitialized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dependencyType, setDependencyType] = useState("");
  const [showDependencyRow, setShowDependencyRow] = useState(false);
  const [isDependencyModalOpen, setIsDependencyModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");

  const tableRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(0);
  //const isValid = taskCount !== "" && parseInt(taskCount) >= 3;

  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  }, [tasks]);

/*   useEffect(() => {
    const initialTasks = Array.from({ length: initialTaskCount ? initialTaskCount : 3 }, () => ({
      name: "",
      duration: "",
      projectId: currentProject.id
    }));
    setTasks(initialTasks);
  }, [initialTaskCount]); */
  useEffect(() => {
    if (currentProject?.id) {
      fetch(`http://localhost:3001/tasks/project/${currentProject.id}`)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              // Si le serveur renvoie 404, on initialise avec 3 tâches vides
              return [];
            }
            throw new Error(`Erreur ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.length === 0) {
            setTasks(Array.from({ length: 3 }, () => ({ name: "", duration: "", projectId: currentProject.id })));
          } else {
            setTasks(data);
          }
        })
        .catch((error) => console.error("Erreur lors de la récupération des tâches :", error));
    }
  }, [currentProject]);
  
  

  const handleInitializeTasks = (taskCount) => {
    const initialTasks = Array.from({ length: taskCount }, () => ({
      name: "",
      duration: "",
      projectId: currentProject.id
    }));
    setTasks(initialTasks);
    setInitialized(true);
    setIsModalOpen(false);
  };

  const addColumn = () => {
    setTasks([...tasks, { name: "", duration: "" ,projectId: currentProject.id}]);
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
      const response = await fetch("http://localhost:3001/tasks", {
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

  const handleDependencyValidation = (type) => {
    console.log("Type reçu :", type); // Vérification
    setDependencyType(type);
    setShowDependencyRow(true); // Afficher la ligne après validation
    setIsModalOpen(false);
  };
  

  return (
    <div className="w-11/12 max-w-6xl mx-auto bg-white p-8 shadow-md rounded-lg mt-10">
        <div className="relative">
          <div className="overflow-x-scroll scrollbar-hidden shadow-md mt-5">
            <h1>{currentProject.name}{currentProject.description}</h1>
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
                <tr className={`bg-white  text-xl`}>
                  <th className="p-3 font-bold border-orange-200 text-gray-700">Durée</th>
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
                {showDependencyRow && (
                <tr className="bg-gray-50 border-orange-200 text-xl">
                  <th className="p-3 font-bold  text-gray-700">Tâches {dependencyType}</th>
                  {tasks.map((task, index) => (
                    <td key={index} className="p-3 border border-orange-200">
                      {/* Ici, tu peux ajouter un champ de saisie ou une valeur en lecture seule */}
                    </td>
                  ))}
                </tr>
              )}

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
          {!showDependencyRow && (
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
          )}

        </div>

      <DependanceModal
        isModalOpen={isDependencyModalOpen}
        setIsModalOpen={setIsDependencyModalOpen}
        dependencyType={dependencyType}
        setDependencyType={handleDependencyValidation} 
      />
          {/* Graphe CPM */}
    <h2 className="text-xl font-bold mt-8 mb-4">Diagramme du chemin critique</h2>
    <CPMGraph projectId={currentProject.id} />

    </div>
  );
};

export default Tache;
