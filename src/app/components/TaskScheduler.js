"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Minus, Star, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TaskListTable from "./TaskListTable";
import CPMGraph from "./CPMGraph";
import { ReactFlowProvider } from "reactflow";
import { colors } from "../colors";

const TaskScheduler = ({ currentProject, initialTaskCount , isSecondSidebarOpen, setProjects }) => {
  const [tasks, setTasks] = useState([{ name: "", duration: "", projectId: currentProject.id }]);
  const [fetchedTasks, setFetchedTasks] = useState([]);
  const [isInitialEntry, setIsInitialEntry] = useState(true);
  const [dependencyType, setDependencyType] = useState("");
  const tableRef = useRef(null);
  const [project, setProject] = useState({});
  const [tableHeight, setTableHeight] = useState(0);
  const cpmGraphRef = useRef(null);
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:3001/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else if (response.status === 404) {
        setProjects([]);
        console.log("Aucun projet trouvé.");
      } else {
        console.error("Erreur serveur :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur API :", error);
    }
  };

  const fetchTasksFromBackend = async () => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/project/${currentProject.id}`);
      if (response.ok) {
        const data = await response.json();
        setFetchedTasks(data);
        if (cpmGraphRef.current && typeof cpmGraphRef.current.reloadData === 'function') {
          cpmGraphRef.current.reloadData();
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
      await fetchProjects();
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

  return (
    <div
      className={`w-full mx-auto p-8 shadow-xl rounded-2xl mt-10 transition-all duration-300 ease-in-out ${colors.background.main} ${
        isSecondSidebarOpen ? 'max-w-[1400px]' : 'max-w-[1600px]'
      }`}
    > 
      {isInitialEntry ? (
        <div className="w-full max-w-[1600px] mx-auto">
          {/* Header moderne */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`sticky top-0 left-0 w-full z-10 backdrop-blur-xl ${colors.background.header} border-b ${colors.table.border} shadow-2xl rounded-t-2xl`}
          >
            <div className="max-w-full mx-auto px-6 py-4">
              <div className="flex items-center justify-center space-x-4">
                <motion.h1 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`text-center text-3xl font-bold bg-gradient-to-r ${colors.primary.gradient} bg-clip-text text-transparent`}
                >
                  {project.name || "Nouveau Projet"}
                </motion.h1>
                
                {/* Bouton favoris */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
                    project.isFavorite 
                      ? `${colors.buttons.favorite.active} bg-amber-100/50` 
                      : `${colors.buttons.favorite.inactive} ${colors.buttons.favorite.hover} bg-stone-100/50`
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
                className={`text-center ${colors.text.secondary} italic mt-2 text-base`}
              >
                {project.description || "Configuration initiale des tâches"}
              </motion.p>
            </div>
          </motion.div>

          {/* Container principal */}
          <div className="max-w-full mx-auto px-4 pb-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative mt-8"
            >
              {/* Table avec scrollbars personnalisées */}
              <div className="overflow-x-auto custom-scrollbar">
                <div className={`backdrop-blur-xl ${colors.background.card} rounded-2xl shadow-2xl border border-stone-200/50 overflow-hidden min-w-max`}>
                  <table ref={tableRef} className="w-full">
                    <thead>
                      {/* Header des tâches */}
                      <tr className={`${colors.table.header.primary} ${colors.table.header.text}`}>
                        <th className="p-5 text-left font-semibold tracking-wide min-w-[200px]">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-amber-400 rounded-full shadow-sm"></div>
                            <span className="text-lg">Tâches</span>
                          </div>
                        </th>
                        {tasks.map((task, index) => (
                          <th 
                            key={index} 
                            className="p-4 relative group"
                            style={{ width: '280px', minWidth: '280px' }}
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
                              className={`w-full p-3 text-center ${colors.table.input.primary} border border-white/40 rounded-xl ${colors.table.input.focus} transition-all backdrop-blur-sm text-base font-medium placeholder-stone-300`}
                            />
                          </th>
                        ))}
                      </tr>

                      {/* Row des durées */}
                      <tr className={`${colors.table.header.secondary} border-b ${colors.table.border}`}>
                        <th className={`p-5 text-left font-semibold ${colors.table.header.textSecondary}`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 bg-gradient-to-r ${colors.duration.bg} rounded-full shadow-sm`}></div>
                            <span className="text-lg">Durée (jours)</span>
                          </div>
                        </th>
                        {tasks.map((task, index) => (
                          <td 
                            key={index} 
                            className="p-4 group"
                            style={{ width: '280px', minWidth: '280px' }}
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
                                className={`w-24 p-3 text-center ${colors.table.input.secondary} ${colors.duration.text} border ${colors.primary.border} rounded-xl ${colors.table.input.focusSecondary} transition-all text-base font-medium shadow-sm`}
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

              {/* Boutons d'action repositionnés */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute top-8 -right-24 flex flex-col items-center space-y-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={addColumn}
                  className={`w-14 h-14 bg-gradient-to-r ${colors.buttons.add.gradient} ${colors.buttons.add.text} rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/50 backdrop-blur-sm ${colors.buttons.add.hover}`}
                >
                  <Plus size={26} className="mx-auto" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: -90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={removeColumn}
                  disabled={tasks.length === 1}
                  className={`w-14 h-14 rounded-full shadow-xl transition-all duration-300 border-2 border-white/50 backdrop-blur-sm ${
                    tasks.length === 1
                      ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                      : `bg-gradient-to-r ${colors.buttons.remove.gradient} ${colors.buttons.remove.text} hover:shadow-2xl ${colors.buttons.remove.hover}`
                  }`}
                >
                  <Minus size={26} className="mx-auto" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Bouton de validation moderne */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center mt-10"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveAndOpenModal}
                disabled={!allTasksValid}
                className={`px-10 py-5 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 ${
                  allTasksValid 
                    ? `bg-gradient-to-r ${colors.buttons.save.gradient} ${colors.buttons.save.text} ${colors.buttons.save.hover} transform hover:scale-105 border border-white/30`
                    : "bg-stone-300 text-stone-500 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Save size={22} />
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
          setProjects={setProjects}
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
          className={`mt-10 backdrop-blur-xl ${colors.background.card} rounded-2xl shadow-2xl border border-stone-200/50 p-8`}
        >
          <motion.h2 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className={`text-3xl font-bold bg-gradient-to-r ${colors.primary.gradient} bg-clip-text text-transparent mb-8`}
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

      {/* Styles pour scrollbars personnalisées */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${colors.scrollbar.track};
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.scrollbar.thumb};
          border-radius: 6px;
          border: 2px solid ${colors.scrollbar.track};
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${colors.scrollbar.thumbHover};
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${colors.scrollbar.thumb} ${colors.scrollbar.track};
        }
      `}</style>
    </div>
  );
};

export default TaskScheduler;