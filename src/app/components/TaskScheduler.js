"use client";

import { useState, useRef, useEffect } from "react";
import { Plus ,Minus} from "lucide-react";
import { motion } from "framer-motion";
import DependanceModal from "./DependanceModal";
import TaskListTable from "./TaskListTable";
import CPMGraph from "./CPMGraph";

const TaskScheduler = ({ currentProject, initialTaskCount }) => {
  const [tasks, setTasks] = useState([{ name: "", duration: "", projectId: currentProject.id }]);
  const [fetchedTasks, setFetchedTasks] = useState([]);
  const [isInitialEntry, setIsInitialEntry] = useState(true);
  const [isDependencyModalOpen, setIsDependencyModalOpen] = useState(false);
  const [dependencyType, setDependencyType] = useState("");
  const tableRef = useRef(null);
  const [project ,setProject] = useState({});
  const [tableHeight, setTableHeight] = useState(0);

  const fetchTasksFromBackend = async () => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/project/${currentProject.id}`);
      if (response.ok) {
        const data = await response.json();
        setFetchedTasks(data);
      } else {
        console.error("Erreur de récupération des tâches.");
      }
    } catch (error) {
      console.error("Erreur API :", error);
    }
  };
  const fetchProject = async (projectId) => {
    try {
      const isSuccessor=false;
      const response = await fetch(`http://localhost:3001/projects/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors du get du projet");
      }

      const createdProject = await response.json();
      console.log(createdProject);
      setProject(createdProject);

      // Appel la fonction parent avec le nom et le nombre de tâches
   

    } catch (error) {
      console.error(error.message);
      alert("Erreur lors de la création du projet.");
    } 
  }
  
  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  }, [tasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentProject?.id) return; // Vérifie que currentProject existe
  
      const initialTasks = Array.from({ length: initialTaskCount || 3 }, () => ({
        name: "",
        duration: "",
        projectId: currentProject.id
      }));
  
      try {
        const response = await fetch(`http://localhost:3001/tasks/project/${currentProject.id}`);
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
          setFetchedTasks(data);
          setIsInitialEntry(false);
        } else {
          setTasks(initialTasks);
          
          setIsInitialEntry(true);
        }
      } catch (error) {
        console.error("Erreur API :", error);
        setTasks(initialTasks);
        
        setIsInitialEntry(true);
      }
    };
  
    fetchTasks();
    fetch
    fetchProject(currentProject.id);
  }, [currentProject]); // Dépendance sur currentProject
  

  const addColumn = () => {
    setTasks([...tasks, { name: "", duration: "", projectId: currentProject.id }]);
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
    if (/^\d*$/.test(value)) {
      const updatedTasks = [...tasks];
      updatedTasks[index].duration = value === "" ? "" : Math.max(1, parseInt(value, 10));
      setTasks(updatedTasks);
    }
  };

  const allTasksValid = tasks.every((task) => task.name.trim() !== "" && task.duration >= 1);

  const handleSaveAndOpenModal = async () => {
    try {
      const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      if (response.ok) {
        const data = await response.json();
        setIsInitialEntry(false);
        setIsDependencyModalOpen(true);
        await fetchTasksFromBackend();
      } else {
        alert("Erreur lors de l'enregistrement.");
      }
    } catch (error) {
      console.error("Erreur API :", error);
    }
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      if (response.ok) {
        await fetchTasksFromBackend();
      } else {
        alert("Erreur lors de la mise à jour de la tâche.");
      }
    } catch (error) {
      console.error("Erreur API :", error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchTasksFromBackend();
      } else {
        alert("Erreur lors de la suppression de la tâche.");
      }
    } catch (error) {
      console.error("Erreur API :", error);
    }
  };

  const handleTaskCreate = async (task) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: [{ name: task.name, duration: task.duration, projectId: currentProject.id }] }), 
      });
      if (response.ok) {
        await fetchTasksFromBackend();
      } else {
        alert("Erreur lors de la création de la tâche.");
      }
    } catch (error) {
      console.error("Erreur API :", error);
    }
  };

  const handleDependencyValidation = async (type) => {
    setDependencyType(type);
    console.log("mandeha ve ");
    await fetchProject(currentProject.id);
    setIsDependencyModalOpen(false);
  };

  return (
    <div className="w-11/12 max-w-6xl mx-auto bg-white p-8 shadow-md rounded-lg mt-10">
      {isInitialEntry ? (
        <div className="relative">
          <div className="overflow-x-scroll scrollbar-hidden shadow-md mt-5">
            <h1>{project.name}</h1>
            <table ref={tableRef} className="min-w-full text-center border-collapse shadow-lg overflow-hidden mt-5 mb-5">
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
                        className="w-full p-3 text-center bg-transparent text-gray-900 placeholder-gray-400 outline-none border-b border-transparent focus:border-gray-600 transition-all"
                      />
                    </th>
                  ))}
                </tr>
                <tr className="bg-white text-xl">
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
      ) : (
        <TaskListTable 
          tasks={fetchedTasks}
          setTasks={setFetchedTasks} 
          currentProject={project}
          setProject={setProject}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskCreate={handleTaskCreate}
          dependencyType={dependencyType}
        />
      )}

      <DependanceModal
        isModalOpen={isDependencyModalOpen}
        setIsModalOpen={setIsDependencyModalOpen}
        dependencyType={dependencyType}
        projectId={currentProject.id}
        setDependencyType={handleDependencyValidation} 
      />
                    {/* Graphe CPM */}
    <h2 className="text-xl font-bold mt-8 mb-4">Diagramme du chemin critique</h2>
    <CPMGraph projectId={currentProject.id} />
    </div>

    
  );
};

export default TaskScheduler;