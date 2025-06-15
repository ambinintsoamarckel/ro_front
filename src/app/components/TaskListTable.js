"use client";

import { useState, useRef, useEffect } from "react";
import { Edit2, Trash2, X, Check, ArrowRight, Plus, Save, CheckSquare2, SquareX, CheckCircle2, CircleX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TaskDetailsModal from "./TaskDetailsModal";



const TaskListTable = ({ 
  tasks = [
    { id: 1, name: "Planification", duration: 5, dependencies: [], successors: [] },
    { id: 2, name: "Développement", duration: 15, dependencies: [{ dependsOnId: 1 }], successors: [] },
    { id: 3, name: "Tests", duration: 8, dependencies: [{ dependsOnId: 2 }], successors: [] }
  ],
  setTasks, 
  currentProject = { id: 1, name: "Projet Demo", description: "Un projet de démonstration", isSuccessor: false },
  setProject, 
  onTaskUpdate = () => {}, 
  onTaskDelete = () => {},
  onTaskCreate = () => {}
}) => {
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [tempTask, setTempTask] = useState(null);
  const [tableHeight, setTableHeight] = useState(0);
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);
  const [dependencyType, setDependencyType] = useState("antérieur");
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  }, [tasks]);
  
  const fetchTasksFromBackend = async () => {
  await setTasks ();
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

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 min-h-screen">
      {/* Header compact */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 left-0 w-full z-10 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg"
      >
        <div className="max-w-full mx-auto px-6 py-4">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent"
          >
            {currentProject.name}
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-slate-600 italic mt-1"
          >
            {currentProject.description}
          </motion.p>
        </div>
      </motion.div>

      {/* Switch Toggle pour le type de dépendance */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-full mx-auto px-6 py-6"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-white/30">
              <input
                type="radio"
                id="anterieur"
                name="dependencyType"
                value="antérieur"
                checked={dependencyType === "antérieur"}
                onChange={(e) => setDependencyType(e.target.value)}
                className="sr-only"
              />
              <label
                htmlFor="anterieur"
                className={`px-6 py-3 rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 ${
                  dependencyType === "antérieur"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105"
                    : "text-slate-600 hover:text-indigo-600"
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
                onChange={(e) => setDependencyType(e.target.value)}
                className="sr-only"
              />
              <label
                htmlFor="successeur"
                className={`px-6 py-3 rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 ${
                  dependencyType === "successeur"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105"
                    : "text-slate-600 hover:text-indigo-600"
                }`}
              >
                Tâches successeurs
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Container principal - largeur augmentée */}
      <div className="max-w-full mx-auto px-6 pb-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative"
        >
          {/* Table avec scrollbars visibles */}
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#a5b4fc #f1f5f9' }}>
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/30 overflow-hidden min-w-max">
              <table ref={tableRef} className="w-full">
                <thead>
                  {/* Header des tâches */}
                  <tr className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white">
                    <th className="p-6 text-left font-semibold tracking-wide min-w-[300px]">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>Tâches</span>
                      </div>
                    </th>
                    {tasks.map((task, index) => (
                      <th 
                        key={index} 
                        className="p-6 relative w-[320px] min-w-[320px] group"
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
                              className="w-full p-3 text-center bg-white/20 text-white placeholder-indigo-200 outline-none border border-white/30 rounded-xl focus:border-white focus:bg-white/30 transition-all backdrop-blur-sm"
                              placeholder="Nom de la tâche"
                            />
                          ) : (
                            <span className="text-center font-medium text-lg">{task.name}</span>
                          )}
                          
                          {/* Boutons d'action - apparaissent au survol de la colonne */}
                          {editingTaskIndex !== index && deleteConfirmIndex !== index && activeTaskIndex === null && hoveredColumnIndex === index && (
                            <>
                              <motion.button
                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute top-3 left-3 p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm border border-white/30 transition-all duration-300"
                                onClick={() => handleEditStart(task, index)}
                              >
                                <Edit2 size={18} className="text-white" />
                              </motion.button>
                              <motion.button
                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-red-500/80 rounded-xl backdrop-blur-sm border border-white/30 transition-all duration-300"
                                onClick={() => {
                                  setDeleteConfirmIndex(index);
                                  setActiveTaskIndex(index);
                                }}
                              >
                                <Trash2 size={18} className="text-white" />
                              </motion.button>
                            </>
                          )}
                        </div>
                      </th>
                    ))}
                    
                    {tempTask && (
                      <th className="p-6 w-[320px] min-w-[320px]">
                        <motion.input
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          type="text"
                          value={tempTask.name}
                          onChange={(e) => setTempTask({ ...tempTask, name: e.target.value })}
                          className="w-full p-3 text-center bg-white/20 text-white placeholder-indigo-200 outline-none border border-white/30 rounded-xl focus:border-white focus:bg-white/30 transition-all backdrop-blur-sm"
                          placeholder="Nouvelle tâche"
                        />
                      </th>
                    )}
                  </tr>

                  {/* Row des durées */}
                  <tr className="bg-gradient-to-r from-white to-indigo-50/50 border-b border-indigo-100">
                    <th className="p-6 text-left font-semibold text-slate-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span>Durée (jours)</span>
                      </div>
                    </th>
                    {tasks.map((task, index) => (
                      <td 
                        key={index} 
                        className="p-6 w-[320px] min-w-[320px] group"
                        onMouseEnter={() => setHoveredColumnIndex(index)}
                        onMouseLeave={() => setHoveredColumnIndex(null)}
                      >
                        <div className="flex flex-col items-center space-y-3">
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
                              className="w-24 p-3 text-center bg-indigo-50 text-slate-800 outline-none border border-indigo-200 rounded-xl focus:border-indigo-400 focus:bg-white transition-all"
                              min="1"
                            />
                          ) : (
                            <div className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 font-semibold rounded-xl text-lg">
                              {task.duration}
                            </div>
                          )}

                          {/* Boutons de confirmation pour édition */}
                          {editingTaskIndex === index && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex space-x-2"
                            >
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleEditSave}
                                className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                              >
                                <CheckSquare2 size={20} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleEditCancel}
                                className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                              >
                                <SquareX size={20} />
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
                              <span className="text-sm text-red-600 font-medium">Confirmer ?</span>
                              <div className="flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteConfirm(task.id)}
                                  className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                                >
                                  <CheckSquare2 size={20} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={handleDeleteCancel}
                                  className="p-2 bg-gradient-to-r from-slate-400 to-slate-500 text-white rounded-xl hover:from-slate-500 hover:to-slate-600 transition-all shadow-lg"
                                >
                                  <SquareX size={20} />
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </td>
                    ))}
                    
                    {tempTask && (
                      <td className="p-6 w-[320px] min-w-[320px]">
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex flex-col items-center space-y-3"
                        >
                          <input
                            type="number"
                            value={tempTask.duration}
                            onChange={(e) => setTempTask({ ...tempTask, duration: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                            className="w-24 p-3 text-center bg-indigo-50 text-slate-800 outline-none border border-indigo-200 rounded-xl focus:border-indigo-400 focus:bg-white transition-all"
                            placeholder="Durée"
                          />
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleSaveTempColumn}
                              disabled={!tempTask.name.trim() || tempTask.duration <= 0}
                              className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Save size={20} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleCancelTempColumn}
                              className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                            >
                              <SquareX size={20} />
                            </motion.button>
                          </div>
                        </motion.div>
                      </td>
                    )}
                  </tr>

                  {/* Row des dépendances */}
                  <tr className="bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b border-indigo-100">
                    <th className="p-6 text-left font-semibold text-slate-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Tâches {dependencyType}</span>
                      </div>
                    </th>
                    {tasks.map((task, index) => (
                      <td
                        key={index}
                        className="p-6 cursor-pointer hover:bg-indigo-50/70 transition-all duration-300 group w-[320px] min-w-[320px]"
                        onClick={() => openTaskModal(index)}
                        onMouseEnter={() => setHoveredColumnIndex(index)}
                        onMouseLeave={() => setHoveredColumnIndex(null)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="min-h-[60px] flex items-center justify-center"
                        >
                          {dependencyType === "antérieur" && task.dependencies.length > 0 ? (
                            <div className="flex flex-wrap gap-2 justify-center">
                              {task.dependencies
                                .map(dep => {
                                  const dependentTask = tasks.find(t => t.id === dep.dependsOnId);
                                  return dependentTask ? dependentTask.name : "Tâche inconnue";
                                })
                                .map((name, idx) => (
                                  <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-sm font-medium rounded-full border border-amber-200">
                                    {name}
                                  </span>
                                ))}
                            </div>
                          ) : dependencyType === "successeur" && task.successors.length > 0 ? (
                            <div className="flex flex-wrap gap-2 justify-center">
                              {task.successors
                                .map(succ => {
                                  const successorTask = tasks.find(t => t.id === succ.taskId);
                                  return successorTask ? successorTask.name : "Tâche inconnue";
                                })
                                .map((name, idx) => (
                                  <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-sm font-medium rounded-full border border-emerald-200">
                                    {name}
                                  </span>
                                ))}
                            </div>
                          ) : (
                            <div className="text-slate-400 italic text-center group-hover:text-indigo-400 transition-colors">
                              Cliquez pour modifier
                            </div>
                          )}
                        </motion.div>
                      </td>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          {/* Bouton d'ajout de colonne - repositionné */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute top-6 -right-16 flex items-start"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddColumn}
              disabled={!!tempTask}
              className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              <Plus size={24} className="mx-auto" />
            </motion.button>
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

export default TaskListTable;