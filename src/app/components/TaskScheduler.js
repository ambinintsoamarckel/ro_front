"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Minus, Star, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TaskListTable from "./TaskListTable";
import CPMGraph from "./CPMGraph";
import { ReactFlowProvider } from "reactflow";
import { colors } from "../colors";

const TaskScheduler = ({ currentProject, initialTaskCount , isSecondSidebarOpen }) => {
  const [tasks, setTasks] = useState([{ name: "", duration: "", projectId: currentProject.id }]);
  const [fetchedTasks, setFetchedTasks] = useState([]);
  const [isInitialEntry, setIsInitialEntry] = useState(true);
  const [isDependencyModalOpen, setIsDependencyModalOpen] = useState(false);
  const [dependencyType, setDependencyType] = useState("");
  const tableRef = useRef(null);
  const [project, setProject] = useState({});
  const [tableHeight, setTableHeight] = useState(0);
  const cpmGraphRef = useRef(null);
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState(null);

  const fetchTasksFromBackend = async () => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/project/${currentProject.id}`);
      if (response.ok) {
        const data = await response.json();
        setFetchedTasks(data);
        if (cpmGraphRef.current && typeof cpmGraphRef.current.reloadData === 'function') {
          cpmGraphRef.current.reloadData(); // Correct
        }
        
      } else {
        console.error("Erreur de récupération des tâches.");
      }
    } catch (error) {
      console.error("Erreur API :", error);
    }
  };

  const fetchProject = async (projectId) => {
    try {
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
    } catch (error) {
      console.error(error.message);
      alert("Erreur lors de la création du projet.");
    }
  };

  const onProjectUpdate = async (updatedProject) => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${updatedProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du projet");
      }

      const data = await response.json();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const updatedProject = { ...project, isFavorite: !project.isFavorite };
      await onProjectUpdate(updatedProject);
      setProject(updatedProject);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris", error);
    }
  };

  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  }, [tasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentProject?.id) return;

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
    fetchProject(currentProject.id);
  }, [currentProject, initialTaskCount]);

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
    await fetchProject(currentProject.id);
    setIsDependencyModalOpen(false);
  };

  return (
<div
  className={`w-full mx-auto p-8 shadow-md rounded-lg mt-10 transition-all duration-300 ease-in-out ${colors.background.main} ${
    isSecondSidebarOpen ? 'max-w-[1400px]' : 'max-w-[1600px]'
  }`}
> 
      {isInitialEntry ? (
        <div className="w-full max-w-[1600px] mx-auto">
          {/* Header moderne comme TaskListTable */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`sticky top-0 left-0 w-full z-10 backdrop-blur-xl ${colors.background.header} border-b border-white/20 shadow-lg`}
          >
            <div className="max-w-full mx-auto px-4 py-3">
              <div className="flex items-center justify-center space-x-4">
                <motion.h1 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`text-center text-2xl font-bold bg-gradient-to-r ${colors.primary.gradient} bg-clip-text text-transparent`}
                >
                  {project.name || "Nouveau Projet"}
                </motion.h1>
                
                {/* Bouton favoris */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    project.isFavorite 
                      ? colors.buttons.favorite.active 
                      : `${colors.buttons.favorite.inactive} ${colors.buttons.favorite.hover}`
                  }`}
                >
                  <Star 
                    size={24} 
                    fill={project.isFavorite ? "currentColor" : "none"}
                  />
                </motion.button>
              </div>
              
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`text-center ${colors.text.secondary} italic mt-1 text-sm`}
              >
                {project.description || "Configuration initiale des tâches"}
              </motion.p>
            </div>
          </motion.div>

          {/* Container principal */}
          <div className="max-w-full mx-auto px-2 pb-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative mt-6"
            >
              {/* Table avec scrollbars visibles */}
              <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#a5b4fc #f1f5f9' }}>
                <div className={`backdrop-blur-xl ${colors.background.card} rounded-2xl shadow-2xl border border-white/30 overflow-hidden min-w-max`}>
                  <table ref={tableRef} className="w-full">
                    <thead>
                      {/* Header des tâches */}
                      <tr className={`bg-gradient-to-r ${colors.primary.gradientBg} text-white`}>
                        <th className="p-4 text-left font-semibold tracking-wide min-w-[200px]">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <span>Tâches</span>
                          </div>
                        </th>
                        {tasks.map((task, index) => (
                          <th 
                            key={index} 
                            className="p-4 relative group"
                            style={{ width: '250px', minWidth: '250px' }}
                            onMouseEnter={() => setHoveredColumnIndex(index)}
                            onMouseLeave={() => setHoveredColumnIndex(null)}
                          >
                            <motion.input
                              initial={{ scale: 0.95 }}
                              animate={{ scale: 1 }}
                              type="text"
                              value={task.name}
                              onChange={(e) => handleNameChange(index, e.target.value)}
                              placeholder={`Tâche ${index + 1}`}
                              className={`w-full p-2 text-center ${colors.background.overlay} text-white placeholder-indigo-200 outline-none border border-white/30 rounded-lg focus:border-white focus:bg-white/30 transition-all backdrop-blur-sm text-sm`}
                            />
                          </th>
                        ))}
                      </tr>

                      {/* Row des durées */}
                      <tr className="bg-gradient-to-r from-white to-indigo-50/50 border-b border-indigo-100">
                        <th className={`p-4 text-left font-semibold ${colors.text.primary}`}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 ${colors.primary.bg} rounded-full`}></div>
                            <span>Durée (jours)</span>
                          </div>
                        </th>
                        {tasks.map((task, index) => (
                          <td 
                            key={index} 
                            className="p-4 group"
                            style={{ width: '250px', minWidth: '250px' }}
                            onMouseEnter={() => setHoveredColumnIndex(index)}
                            onMouseLeave={() => setHoveredColumnIndex(null)}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <motion.input
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                type="number"
                                value={task.duration}
                                onChange={(e) => handleDurationChange(index, e.target.value)}
                                className={`w-20 p-2 text-center bg-indigo-50 text-slate-800 outline-none border ${colors.primary.border} rounded-lg ${colors.primary.focus} focus:bg-white transition-all text-sm`}
                                min="1"
                                placeholder="Durée"
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>

              {/* Boutons d'action repositionnés comme TaskListTable */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute top-6 -right-20 flex flex-col items-center space-y-3"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={addColumn}
                  className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white backdrop-blur-sm"
                >
                  <Plus size={24} className="mx-auto" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: -90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={removeColumn}
                  disabled={tasks.length === 1}
                  className={`w-12 h-12 rounded-full shadow-xl transition-all duration-300 border-2 border-white backdrop-blur-sm ${
                    tasks.length === 1
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-2xl"
                  }`}
                >
                  <Minus size={24} className="mx-auto" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Bouton de validation moderne */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveAndOpenModal}
                disabled={!allTasksValid}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-all duration-300 ${
                  allTasksValid 
                    ? `bg-gradient-to-r ${colors.buttons.save.gradient} ${colors.buttons.save.text} ${colors.buttons.save.hover} transform hover:scale-105`
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Save size={20} />
                  <span>Ajouter dépendances</span>
                </div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      ) : (
        <TaskListTable 
          tasks={fetchedTasks}
          setTasks={fetchTasksFromBackend} 
          currentProject={project}
          setProject={setProject}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskCreate={handleTaskCreate}
          dependencyType={dependencyType}
        />
      )}


      {/* Section CPM avec styling moderne */}
      {!isInitialEntry && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className={`mt-8 backdrop-blur-xl ${colors.background.card} rounded-2xl shadow-2xl border border-white/30 p-6`}
        >
          <motion.h2 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className={`text-2xl font-bold bg-gradient-to-r ${colors.primary.gradient} bg-clip-text text-transparent mb-6`}
          >
            Diagramme du chemin critique
          </motion.h2>

          <CPMGraph 
            ref={cpmGraphRef}
            projectId={currentProject.id} 
            onDataLoaded={(data) => {
              console.log("Données du chemin critique chargées", data);
            }}
          />
        </motion.div>
      )}

      {/* Styles pour scrollbars webkit */}
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #a5b4fc;
          border-radius: 4px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6;
        }
      `}</style>
    </div>
  );
};

export default TaskScheduler;