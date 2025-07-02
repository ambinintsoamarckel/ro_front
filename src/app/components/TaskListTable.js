"use client";

import { useState, useRef, useEffect } from "react";
import { Edit2, Trash2, X, Check, ArrowRight, Plus, Save, CheckSquare2, SquareX, CheckCircle2, CircleX, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TaskDetailsModal from "./TaskDetailsModal";
import { colors } from "../colors";

const TaskListTable = ({ 
  tasks = [
    { id: 1, name: "Planification", duration: 5, dependencies: [], successors: [] },
    { id: 2, name: "Développement", duration: 15, dependencies: [{ dependsOnId: 1 }], successors: [] },
    { id: 3, name: "Tests", duration: 8, dependencies: [{ dependsOnId: 2 }], successors: [] }
  ],
  setTasks = () => {}, 
  currentProject = { 
    id: 1, 
    name: "Projet Démonstration", 
    description: "Un projet élégant avec un design sophistiqué", 
    isSuccessor: false, 
    isFavorite: false 
  },
  setProject = () => {}, 
  onTaskUpdate = () => {}, 
  onTaskDelete = () => {},
  onTaskCreate = () => {},
  setProjects = () => {},editModalOpen,setEditModalOpen,setProjectPage,deleteModalOpen,setDeleteModalOpen,selectedProject,setSelectedProject
}) => {
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [tempTask, setTempTask] = useState(null);
  const [tableHeight, setTableHeight] = useState(0);
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState(null);
  const tableRef = useRef(null);

  const dependencyType = currentProject.isSuccessor ? "successeur" : "antérieur";

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
      // Optionnel : mettre à jour localement
    } catch (err) {
      console.error(err);
    }
  };
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


  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  }, [tasks]);
  
  const fetchTasksFromBackend = async () => {
    await setTasks();
  };

  // Fonction pour calculer la largeur dynamique d'une colonne
  const getColumnWidth = (task) => {
    const baseName = task.name || "";
    const dependencies = dependencyType === "antérieur" ? task.dependencies : task.successors;
    const depCount = dependencies.length;
    
    // Largeur de base minimale
    let width = Math.max(180, baseName.length * 8 + 60);
    
    // Augmenter la largeur si beaucoup de dépendances
    if (depCount > 2) {
      width += depCount * 25;
    }
    
    return Math.min(width, 350); // Largeur maximale
  };

  const handleAddColumn = () => {
    if (!tempTask) {
      setTempTask({ name: "", duration: "", dependencies: [], successors: [] });
    }
  };

  const handleCancelTempColumn = () => {
    setTempTask(null);
  };

  const handleSaveTempColumn = async () => {
    if (tempTask.name.trim() && tempTask.duration > 0) {
      try {
        await onTaskCreate(tempTask);
        setTempTask(null);
      } catch (error) {
        console.error("Erreur lors de l'ajout de la tâche", error);
      }
    }
  };

  const handleEditCancel = () => {
    setEditingTaskIndex(null);
    setEditedTask(null);
    setActiveTaskIndex(null);
  };

  const handleEditSave = async () => {
    if (editedTask.name.trim() && editedTask.duration >= 1) {
      try {
        await onTaskUpdate(editedTask);
        setEditingTaskIndex(null);
        setEditedTask(null);
        setActiveTaskIndex(null);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche", error);
      }
    }
  };

  const handleEditStart = (task, index) => {
    setEditingTaskIndex(index);
    setEditedTask({ ...task });
    setActiveTaskIndex(index);
  };

  const handleDeleteConfirm = async (taskId) => {
    try {
      await onTaskDelete(taskId);
      setDeleteConfirmIndex(null);
      setActiveTaskIndex(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmIndex(null);
    setActiveTaskIndex(null);
  };

  const openTaskModal = (index) => {
    setSelectedTaskIndex(index);
    setIsTaskModalOpen(true);
  };

  // Gestion des favoris
  const handleToggleFavorite = async () => {
    try {
      const updatedProject = { ...currentProject, isFavorite: !currentProject.isFavorite };
      await onProjectUpdate(updatedProject);
      setProject(updatedProject);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris", error);
    }
  };

  // Gestion du changement de type de dépendance
  const handleDependencyTypeChange = async (newType) => {
    try {
      const isSuccessor = newType === "successeur";
      const updatedProject = { ...currentProject, isSuccessor };
      await onProjectUpdate(updatedProject);
      setProject(updatedProject);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du type de dépendance", error);
    }
  };

  return (
    <div className={`relative ${colors.background.main} `}>
      {/* Header compact */}
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
              className={`text-center text-3xl font-bold ${colors.primary.gradient} bg-clip-text text-transparent`}
            >
              {currentProject.name || "Nouveau Projet"}
            </motion.h1>
            
            {/* Groupe de boutons d'actions */}
            <div className="flex items-center space-x-3">
              {/* Bouton favoris */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleFavorite}
                className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
                  currentProject.isFavorite 
                    ? `${colors.buttons.favorite.active} bg-amber-100/50` 
                    : `${colors.buttons.favorite.inactive} ${colors.buttons.favorite.hover} bg-stone-100/50`
                }`}
              >
                <Star 
                  size={24} 
                  fill={currentProject.isFavorite ? "currentColor" : "none"}
                />
              </motion.button>

              {/* Bouton modifier */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSelectedProject(currentProject);
                  setEditModalOpen(true);
                }}
                className={`p-3 rounded-full transition-all duration-300 shadow-lg ${colors.buttons.edit.base} ${colors.buttons.edit.hover} bg-blue-100/50`}
              >
                <Edit2 size={20} className={colors.buttons.edit.text} />
              </motion.button>

              {/* Bouton supprimer */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSelectedProject(currentProject);
                  setDeleteModalOpen(true);
                }}
                className={`p-3 rounded-full transition-all duration-300 shadow-lg ${colors.buttons.delete.base} ${colors.buttons.delete.hover} bg-red-100/50`}
              >
                <Trash2 size={20} className={colors.buttons.delete.text} />
              </motion.button>
            </div>
          </div>
          
    <motion.p 
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`text-center ${colors.text.secondary} italic mt-2 text-base`}
    >
      {currentProject.description || "Configuration initiale des tâches"}
    </motion.p>
  </div>
</motion.div>
      {/* Switch Toggle pour le type de dépendance */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-full mx-auto px-2 py-4"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className={`flex items-center ${colors.toggle.container} rounded-full p-1 shadow-lg border`}>
              <input
                type="radio"
                id="anterieur"
                name="dependencyType"
                value="antérieur"
                checked={dependencyType === "antérieur"}
                onChange={(e) => handleDependencyTypeChange(e.target.value)}
                className="sr-only"
              />
              <label
                htmlFor="anterieur"
                className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 ${
                  dependencyType === "antérieur"
                    ? colors.toggle.active
                    : colors.toggle.inactive
                }`}
              >
                Tâches antérieures
              </label>
              
              <input
                type="radio"
                id="successeur"
                name="dependencyType"
                value="successeur"
                checked={dependencyType === "successeur"}
                onChange={(e) => handleDependencyTypeChange(e.target.value)}
                className="sr-only"
              />
              <label
                htmlFor="successeur"
                className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 ${
                  dependencyType === "successeur"
                    ? colors.toggle.active
                    : colors.toggle.inactive
                }`}
              >
                Tâches successeurs
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Container principal */}
      <div className="max-w-full mx-auto px-4 pb-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative"
        >
          {/* Table avec scrollbars visibles */}
          <div className="overflow-x-auto custom-scrollbar" >
            <div className={`backdrop-blur-xl ${colors.background.card} rounded-2xl shadow-2xl border border-white/30 overflow-hidden min-w-max`}>
              <table ref={tableRef} className="w-full">
                <thead>
                  {/* Header des tâches */}
                  <tr className={`${colors.table.header.primary} ${colors.table.header.text}`}>
                    <th className="p-4 text-left font-semibold tracking-wide min-w-[200px]">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 ${colors.primary.bg} rounded-full`}></div>
                        <span>Tâches</span>
                      </div>
                    </th>
                    {tasks.map((task, index) => {
                      const columnWidth = getColumnWidth(task);
                      return (
                        <th 
                          key={index} 
                          className="p-4 relative group"
                          style={{ width: `${columnWidth}px`, minWidth: `${columnWidth}px` }}
                          onMouseEnter={() => setHoveredColumnIndex(index)}
                          onMouseLeave={() => setHoveredColumnIndex(null)}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            {editingTaskIndex === index ? (
                              <motion.input
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                type="text"
                                value={editedTask.name}
                                onChange={(e) => setEditedTask({...editedTask, name: e.target.value})}
                                className={`w-full p-2 text-center ${colors.table.input.primary} outline-none border border-white/30 rounded-lg ${colors.table.input.focus} transition-all backdrop-blur-sm text-sm`}
                                placeholder="Nom de la tâche"
                              />
                            ) : (
                              <span className="text-center font-medium text-base leading-tight">{task.name}</span>
                            )}
                            
                            {/* Boutons d'action */}
                            {editingTaskIndex !== index && deleteConfirmIndex !== index && activeTaskIndex === null && hoveredColumnIndex === index && (
                              <>
                                <motion.button
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`absolute top-2 left-2 p-1.5 ${colors.buttons.edit.base} rounded-lg backdrop-blur-sm border border-white/30 transition-all duration-300`}
                                  onClick={() => handleEditStart(task, index)}
                                >
                                  <Edit2 size={16} className={colors.buttons.edit.text} />
                                </motion.button>
                                <motion.button
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`absolute top-2 right-2 p-1.5 ${colors.buttons.delete.base} rounded-lg backdrop-blur-sm border border-white/30 transition-all duration-300`}
                                  onClick={() => {
                                    setDeleteConfirmIndex(index);
                                    setActiveTaskIndex(index);
                                  }}
                                >
                                  <Trash2 size={16} className={colors.buttons.delete.text} />
                                </motion.button>
                              </>
                            )}
                          </div>
                        </th>
                      );
                    })}
                    
                    {tempTask && (
                      <th className="p-4" style={{ width: '200px', minWidth: '200px' }}>
                        <motion.input
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          type="text"
                          value={tempTask.name}
                          onChange={(e) => setTempTask({ ...tempTask, name: e.target.value })}
                          className={`w-full p-2 text-center ${colors.table.input.primary} outline-none border border-white/30 rounded-lg ${colors.table.input.focus} transition-all backdrop-blur-sm text-sm`}
                          placeholder="Nouvelle tâche"
                        />
                      </th>
                    )}
                  </tr>

                  {/* Row des durées */}
                  <tr className={`${colors.table.header.secondary} border-b ${colors.table.border}`}>
                    <th className={`p-4 text-left font-semibold ${colors.table.header.textSecondary}`}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 ${colors.primary.bg} rounded-full`}></div>
                        <span>Durée </span>
                      </div>
                    </th>
                    {tasks.map((task, index) => {
                      const columnWidth = getColumnWidth(task);
                      return (
                        <td 
                          key={index} 
                          className="p-4 group"
                          style={{ width: `${columnWidth}px`, minWidth: `${columnWidth}px` }}
                          onMouseEnter={() => setHoveredColumnIndex(index)}
                          onMouseLeave={() => setHoveredColumnIndex(null)}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            {editingTaskIndex === index ? (
                              <motion.input
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                type="number"
                                value={editedTask.duration}
                                onChange={(e) => {
                                  const value = e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value, 10));
                                  setEditedTask({ ...editedTask, duration: value });
                                }}
                                className={`w-20 p-2 text-center ${colors.table.input.secondary} outline-none border ${colors.primary.border} rounded-lg ${colors.table.input.focusSecondary} transition-all text-sm`}
                                min="1"
                              />
                            ) : (
                              <div className={`px-3 py-1.5 ${colors.duration.bg} ${colors.duration.text} font-semibold rounded-lg text-sm shadow-sm`}>
                                {task.duration}
                              </div>
                            )}

                            {/* Boutons de confirmation pour édition */}
                            {editingTaskIndex === index && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex space-x-1"
                              >
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleEditSave}
                                  className={`p-1.5 ${colors.buttons.save.gradient} ${colors.buttons.save.text} rounded-lg ${colors.buttons.save.hover} transition-all shadow-lg`}
                                >
                                  <CheckSquare2 size={18} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleEditCancel}
                                  className={`p-1.5 ${colors.buttons.cancel.gradient} ${colors.buttons.cancel.text} rounded-lg ${colors.buttons.cancel.hover} transition-all shadow-lg`}
                                >
                                  <SquareX size={18} />
                                </motion.button>
                              </motion.div>
                            )}

                            {/* Boutons de confirmation pour suppression */}
                            {deleteConfirmIndex === index && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col space-y-2 items-center"
                              >
                                <span className={`text-xs ${colors.text.secondary} font-medium`}>Confirmer ?</span>
                                <div className="flex space-x-1">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDeleteConfirm(task.id)}
                                    className={`p-1.5 ${colors.buttons.delete.base.replace('bg-rose-100/40 hover:bg-rose-400/70', colors.buttons.cancel.gradient)} ${colors.buttons.cancel.text} rounded-lg ${colors.buttons.cancel.hover} transition-all shadow-lg`}
                                  >
                                    <CheckSquare2 size={18} />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDeleteCancel}
                                    className={`p-1.5 ${colors.buttons.remove.gradient} ${colors.buttons.remove.text} rounded-lg ${colors.buttons.remove.hover} transition-all shadow-lg`}
                                  >
                                    <SquareX size={18} />
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    
                    {tempTask && (
                      <td className="p-4" style={{ width: '200px', minWidth: '200px' }}>
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex flex-col items-center space-y-2"
                        >
                          <input
                            type="number"
                            value={tempTask.duration}
                            onChange={(e) => setTempTask({ ...tempTask, duration: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                            className={`w-20 p-2 text-center ${colors.table.input.secondary} outline-none border ${colors.primary.border} rounded-lg ${colors.table.input.focusSecondary} transition-all text-sm`}
                            placeholder="Durée"
                          />
                          <div className="flex space-x-1">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleSaveTempColumn}
                              disabled={!tempTask.name.trim() || tempTask.duration <= 0}
                              className={`p-1.5 ${colors.buttons.save.gradient} ${colors.buttons.save.text} rounded-lg ${colors.buttons.save.hover} transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <Save size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleCancelTempColumn}
                              className={`p-1.5 ${colors.buttons.cancel.gradient} ${colors.buttons.cancel.text} rounded-lg ${colors.buttons.cancel.hover} transition-all shadow-lg`}
                            >
                              <SquareX size={18} />
                            </motion.button>
                          </div>
                        </motion.div>
                      </td>
                    )}
                  </tr>

                  {/* Row des dépendances */}
                  <tr className={`${colors.table.header.secondary} border-b ${colors.table.border}`}>
                    <th className={`p-4 text-left font-semibold ${colors.table.header.textSecondary}`}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 ${colors.primary.bg} rounded-full`}></div>
                        <span>Tâches {dependencyType}</span>
                      </div>
                    </th>
                    {tasks.map((task, index) => {
                      const columnWidth = getColumnWidth(task);
                      return (
                        <td
                          key={index}
                          className="p-4 cursor-pointer hover:bg-indigo-50/70 transition-all duration-300 group"
                          style={{ width: `${columnWidth}px`, minWidth: `${columnWidth}px` }}
                          onClick={() => openTaskModal(index)}
                          onMouseEnter={() => setHoveredColumnIndex(index)}
                          onMouseLeave={() => setHoveredColumnIndex(null)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="min-h-[50px] flex items-center justify-center"
                          >
                            {dependencyType === "antérieur" && task.dependencies.length > 0 ? (
                              <div className="flex flex-wrap gap-1 justify-center">
                                {task.dependencies
                                  .map(dep => {
                                    const dependentTask = tasks.find(t => t.id === dep.dependsOnId);
                                    return dependentTask ? dependentTask.name : "Tâche inconnue";
                                  })
                                  .map((name, idx) => (
                                    <span key={idx} className={`px-2 py-1 ${colors.dependencies.anterior.bg} ${colors.dependencies.anterior.text} text-xs font-medium rounded-full border ${colors.dependencies.anterior.border}`}>
                                      {name}
                                    </span>
                                  ))}
                              </div>
                            ) : dependencyType === "successeur" && task.successors.length > 0 ? (
                              <div className="flex flex-wrap gap-1 justify-center">
                                {task.successors
                                  .map(succ => {
                                    const successorTask = tasks.find(t => t.id === succ.taskId);
                                    return successorTask ? successorTask.name : "Tâche inconnue";
                                  })
                                  .map((name, idx) => (
                                    <span key={idx} className={`px-2 py-1 ${colors.dependencies.successor.bg} ${colors.dependencies.successor.text} text-xs font-medium rounded-full border ${colors.dependencies.successor.border}`}>
                                      {name}
                                    </span>
                                  ))}
                              </div>
                            ) : (
                              <div className={`${colors.text.muted} italic text-center group-hover:${colors.text.placeholder} transition-colors text-sm`}>
                                Cliquez pour modifier
                              </div>
                            )}
                          </motion.div>
                        </td>
                      );
                    })}
                  </tr>
                </thead>
              </table>
            </div>
          </div>

              {/* Groupe de boutons Ajouter / Supprimer une colonne */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute top-6 -right-16 flex flex-col items-center space-y-3"
              >
                {/* Bouton Ajouter */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddColumn}
                  disabled={!!tempTask}
                  className={`
                    relative group w-12 h-12
                    bg-gradient-to-br ${colors.buttons.add.gradient}
                    ${colors.buttons.add.text}
                    rounded-full shadow-lg hover:shadow-xl
                    transition-all duration-500 ease-out
                    border border-white/20 backdrop-blur-sm
                    ${colors.buttons.add.hover}
                    before:absolute before:inset-0
                    before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent
                    before:rounded-full before:opacity-0 before:transition-opacity before:duration-300
                    hover:before:opacity-100
                  `}
                >
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <Plus 
                      size={20} 
                      className="transition-transform duration-300 group-hover:scale-110" 
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent opacity-60"></div>
                  </div>
                </motion.button>
                {/* Indicateur décoratif */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className={`w-1 h-8 bg-gradient-to-b from-transparent via-stone-300/50 to-transparent rounded-full`}></div>
                  <div className={`w-2 h-2 bg-gradient-to-br ${colors.buttons.add.gradient} rounded-full opacity-60 animate-pulse`}></div>
                </motion.div>
              </motion.div>
        </motion.div>
      </div>

      {/* Modal pour les dépendances - composant original */}
      <AnimatePresence>
      <TaskDetailsModal
        isOpen={isTaskModalOpen}
        onClose={() => {setIsTaskModalOpen(false);fetchTasksFromBackend();}}
        task={tasks[selectedTaskIndex]}
        allTasks={tasks}
        projectId={currentProject.id}
        dependencyType={currentProject.isSuccessor ? "successeur" : "antérieur"}
      />
      </AnimatePresence>

      {/* Styles pour scrollbars webkit */}
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

export default TaskListTable;