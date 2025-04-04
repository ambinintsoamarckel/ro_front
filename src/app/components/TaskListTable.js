"use client";

import { useState, useRef , useEffect } from "react";
import { Edit2, Trash2, X, Check, ArrowRight, Plus, Save , CheckSquare2, SquareX, CheckCircle2, CircleX } from "lucide-react";
import TaskDetailsModal from "./TaskDetailsModal";

const TaskListTable = ({ 
  tasks,
  setTasks, 
  currentProject,
  setProject, 
  onTaskUpdate, 
  onTaskDelete,
  onTaskCreate 

}) => {
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [tempTask, setTempTask] = useState(null);
  const [tableHeight, setTableHeight] = useState(0);
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);
  const tableRef = useRef(null);
  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  }, [tasks]);
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
  
  const fetchTasksFromBackend = async () => {
  await setTasks ();
  };

  const handleEditCancel = () => {
    setEditingTaskIndex(null);
    setEditedTask(null);
  };

  const handleEditSave = async () => {
    if (editedTask.name.trim() && editedTask.duration >= 1) {
      try {
        await onTaskUpdate(editedTask);
        setEditingTaskIndex(null);
        setEditedTask(null);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche", error);
      }
    }
  };
  const handleEditStart = (task, index) => {
    setEditingTaskIndex(index);
    setEditedTask({ ...task });
  };
  const handleDeleteConfirm = async (taskId) => {
    try {
      await onTaskDelete(taskId);
      setDeleteConfirmIndex(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche", error);
    }
  };

  const openTaskModal = (index) => {
    setSelectedTaskIndex(index);
    setIsTaskModalOpen(true);
  };

  return (

      <div className="relative">
        <div className="sticky top-0 left-0 w-full ">
          <h1 className="text-center text-3xl font-bold">{currentProject.name}</h1>
          <p className="text-center text-gray-500 italic mt-1">{currentProject.description}</p>
        </div>
        <div className="overflow-x-scroll scrollbar-hidden shadow-md mt-5">
          <table ref={tableRef} className="min-w-full text-center border-collapse shadow-lg overflow-hidden mt-5 mb-5">
            <thead>
              <tr className="bg-orange-100 text-gray-800 text-xl font-semibold">
                <th className="p-3 border border-orange-200">Tâches</th>
                {tasks.map((task, index) => (
                  <th 
                    key={index} 
                    className={`p-3 border border-orange-200 relative w-[200px] min-w-[200px] whitespace-nowrap text-center group`}
                    onMouseEnter={() => activeTaskIndex === null && setActiveTaskIndex(null)} // Désactive si aucun bouton actif
                  >
                    <div className="flex flex-col items-center">
                      {editingTaskIndex === index ? (
                        <input
                          type="text"
                          value={editedTask.name}
                          onChange={(e) => setEditedTask({...editedTask, name: e.target.value})}
                          className="w-full p-3 text-center bg-transparent text-gray-900 placeholder-gray-400 outline-none border-b border-transparent focus:border-gray-600 transition-all w-[200px] min-w-[200px] whitespace-nowrap"
                        />
                      ) : (
                        <span className="text-center">{task.name}</span>
                      )}
                      {editingTaskIndex !== index && activeTaskIndex === null && (
                        <>
                          <div className="absolute top-2 left-2 group">
                            <button 
                              onClick={() => {
                                handleEditStart(task, index);
                                setActiveTaskIndex(index);
                              }} 
                              className=" relative group text-blue-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit2 size={30} className="fill-none hover:fill-blue-300 transition" />
                            </button>
                            <span className="absolute mt-2 left-1/2 top-8 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                              Modifier
                            </span>
                          </div>
                          <div className="absolute top-2 right-2 group">
                            <button 
                              onClick={() => {
                                setDeleteConfirmIndex(index);
                                setActiveTaskIndex(index);
                              }} 
                              className="relative group text-red-500  p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={30} className="fill-none hover:fill-red-300 transition" />
                            </button>
                            <span className="absolute mt-2 left-1/2 top-8 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                              Supprimer
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </th>
                ))}
                
                {tempTask && (
                  <th className="p-3 border border-orange-200">
                    <input
                      type="text"
                      value={tempTask.name}
                      onChange={(e) => setTempTask({ ...tempTask, name: e.target.value })}
                      className="w-full p-3 text-center bg-transparent text-gray-900 placeholder-gray-400 outline-none border-b border-transparent focus:border-gray-600 transition-all w-[200px] min-w-[200px] whitespace-nowrap"
                      placeholder="Nouvelle tâche"
                    />
                  </th>
                )}
              </tr>
              <tr className="bg-white text-xl">
                <th className="p-3 font-bold border-orange-200 text-gray-700">Durée</th>
                  {tasks.map((task, index) => (
                    <td key={index} className="p-3 border border-orange-200 w-[200px] min-w-[200px] whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        {editingTaskIndex === index ? (
                          <input
                            type="number"
                            value={editedTask.duration}
                            onChange={(e) => {
                              const value = e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value, 10));
                              setEditedTask({ ...editedTask, duration: value });
                            }}
                            className="w-full text-center bg-transparent text-gray-900 outline-none border-b border-transparent focus:border-gray-600 transition-all"
                            min="1"
                          />
                        ) : (
                          <span className="text-center">{task.duration}</span> 
                        )}

                        {editingTaskIndex === index ? (
                          <>
                            <div className="flex space-x-30 mt-5">
                              <div className="relative group">
                                <button 
                                  onClick={handleEditSave} 
                                  className="text-green-500  p-1 rounded"
                                >
                                  <CheckSquare2 size={30} className="fill-none hover:fill-green-300 transition"  />
                                </button>
                                <span className="absolute mt-2 left-1/2 top-8 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                  Sauvegarder
                                </span>
                              </div>
                              <div className="relative group">
                                <button 
                                  onClick={handleEditCancel} 
                                  className="text-red-500  p-1 rounded"
                                >
                                  <SquareX size={30} className="fill-none hover:fill-red-300 transition"/>
                                </button>
                                <span className="absolute mt-2 left-1/2 top-8 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                  Annuler
                                </span>
                              </div>
                            </div>
                          </>
                        ) : deleteConfirmIndex === index ? (
                          <>
                            <div className="flex space-x-30 mt-5">
                              <div className="relative group">
                                <button 
                                  onClick={() => handleDeleteConfirm(task.id)} 
                                  className="text-red-500  p-1 rounded"
                                >
                                  <CheckSquare2 size={30} className="fill-none hover:fill-red-300 transition"/>
                                </button>
                                <span className="absolute mt-2 left-1/2 top-8 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                  Sauvegarder
                                </span>
                              </div>
                              <div className="relative group">
                                <button 
                                  onClick={() => setDeleteConfirmIndex(null)} 
                                  className="text-gray-500  p-1 rounded"
                                >
                                  <SquareX size={30} className="fill-none hover:fill-gray-300 transition"/>
                                </button>
                                <span className="absolute mt-2 left-1/2 top-8 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                  Annuler
                                </span>
                              </div>
                            </div>
                          </>
                        ) : null }
                      </div>
                    </td>
                  ))}
                  {tempTask && (
                    <td className="p-3 border border-orange-200 w-[200px] min-w-[200px] whitespace-nowrap">
                      <input
                        type="number"
                        value={tempTask.duration}
                        onChange={(e) => setTempTask({ ...tempTask, duration: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                        className="w-full text-center bg-transparent text-gray-900 outline-none border-b border-transparent focus:border-gray-600 transition-all"
                        placeholder="Durée"
                      />
                      <div className="flex space-x-30 mt-5 justify-center">
                        <div className="relative group">
                          <button onClick={handleSaveTempColumn} disabled={!tempTask.name.trim() || tempTask.duration <= 0} className="text-green-500  p-1 rounded">
                            <Save size={30} className="fill-none hover:fill-green-300 transition"/>
                          </button>
                          <span className="absolute mt-2 left-1/2 top-8 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                            Enregistrer
                          </span>
                        </div>
                        <div className="relative group">
                          <button onClick={handleCancelTempColumn} className="text-red-500 p-1 rounded">
                            <SquareX size={30} className="fill-none hover:fill-red-300 transition" />
                          </button>
                          <span className="absolute mt-2 left-1/2 top-8 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                            Annuler
                          </span>
                        </div>
                      </div>
                    </td>
                  )}
                </tr>

              
                <tr className="bg-gray-50 border-orange-200 text-xl">
                  <th className="p-3 font-bold text-gray-700 whitespace-nowrap w-[200px]">Tâches {currentProject.isSuccessor ? "successeur" : "antérieur" }</th>
                  {tasks.map((task, index) => (
                    <td
                      key={index}
                      className="p-3 border border-orange-200 cursor-pointer hover:bg-gray-100 transition w-[200px] min-w-[200px] whitespace-nowrap"
                      onClick={() => openTaskModal(index)}
                    >
                      {!currentProject.isSuccessor && task.dependencies.length > 0 ? (
                        <div className="text-gray-800">
                          {task.dependencies
                            .map(dep => {
                              const dependentTask = tasks.find(t => t.id === dep.dependsOnId);
                              return dependentTask ? dependentTask.name : "Tâche inconnue";
                            })
                            .join(", ")}
                        </div>
                      ) : currentProject.isSuccessor && task.successors.length > 0 ? (
                        <div className="text-gray-800">
                          {task.successors
                            .map(succ => {
                              const successorTask = tasks.find(t => t.id === succ.taskId);
                              return successorTask ? successorTask.name : "Tâche inconnue";
                            })
                            .join(", ")}
                        </div>
                      ) : (
                        <div className="text-gray-400 italic">-</div>
                      )}
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
              onClick={handleAddColumn}
              disabled={!!tempTask}
                className="absolute top-0 right-0 w-8 h-8 text-blue-500 rounded-full shadow-md border border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500 hover:text-white"
              >
                <Plus size={20} className="mx-auto" />
              </button>
            </div>
          </div>
      <TaskDetailsModal
        isOpen={isTaskModalOpen}
        onClose={() => {setIsTaskModalOpen(false);fetchTasksFromBackend();}}
        task={tasks[selectedTaskIndex]}
        allTasks={tasks}
        projectId={currentProject.id}
        dependencyType={currentProject.isSuccessor ? "successeur" : "antérieur"}
      />
    </div>
  );
};

export default TaskListTable;