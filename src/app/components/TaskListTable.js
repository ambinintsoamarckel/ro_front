"use client";

import { useState, useRef , useEffect } from "react";
import { Edit2, Trash2, X, Check, ArrowRight, Plus, Save } from "lucide-react";
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
    try {
      const response = await fetch(`http://localhost:3001/tasks/project/${currentProject.id}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error("Erreur de récupération des tâches.");
      }
    } catch (error) {
      console.error("Erreur API :", error);
    }
  };
  const handleEditStart = (task, index) => {
    setEditingTaskIndex(index);
    setEditedTask({ ...task });
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
        <div className="overflow-x-scroll scrollbar-hidden shadow-md mt-5">
          <h1>{currentProject.name}</h1>
          <table ref={tableRef} className="min-w-full text-center border-collapse shadow-lg overflow-hidden mt-5 mb-5">
            <thead>
              <tr className="bg-orange-100 text-gray-800 text-xl font-semibold">
                <th className="p-3 border border-orange-200">Tâches</th>
                {tasks.map((task, index) => (
                  <th 
                    key={index} 
                    className="p-3 border border-orange-200 relative"
                  >
                    <div className="flex items-center justify-between">
                      {editingTaskIndex === index ? (
                        <input
                          type="text"
                          value={editedTask.name}
                          onChange={(e) => setEditedTask({...editedTask, name: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        task.name
                      )}
                      <div className="flex space-x-2 absolute right-2 top-1/2 transform -translate-y-1/2">
                        {editingTaskIndex === index ? (
                          <>
                            <button 
                              onClick={handleEditSave} 
                              className="text-green-500 hover:bg-green-100 p-1 rounded"
                            >
                              <Check size={20} />
                            </button>
                            <button 
                              onClick={handleEditCancel} 
                              className="text-red-500 hover:bg-red-100 p-1 rounded"
                            >
                              <X size={20} />
                            </button>
                          </>
                        ) : deleteConfirmIndex === index ? (
                          <>
                            <button 
                              onClick={() => handleDeleteConfirm(task.id)} 
                              className="text-red-500 hover:bg-red-100 p-1 rounded"
                            >
                              <Check size={20} />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmIndex(null)} 
                              className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                            >
                              <X size={20} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleEditStart(task, index)} 
                              className="text-blue-500 hover:bg-blue-100 p-1 rounded"
                            >
                              <Edit2 size={20} />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmIndex(index)} 
                              className="text-red-500 hover:bg-red-100 p-1 rounded"
                            >
                              <Trash2 size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
                {tempTask && (
                <th className="p-3 border border-orange-200">
                  <input
                    type="text"
                    value={tempTask.name}
                    onChange={(e) => setTempTask({ ...tempTask, name: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Nouvelle tâche"
                  />
                  <div className="flex space-x-2 mt-2 justify-center">
                    <button onClick={handleSaveTempColumn} disabled={!tempTask.name.trim() || tempTask.duration <= 0} className="text-green-500 hover:bg-green-100 p-1 rounded">
                      <Save size={20} />
                    </button>
                    <button onClick={handleCancelTempColumn} className="text-red-500 hover:bg-red-100 p-1 rounded">
                      <X size={20} />
                    </button>
                  </div>
                </th>
              )}
              </tr>
              <tr className="bg-white text-xl">
                <th className="p-3 font-bold border-orange-200 text-gray-700">Durée</th>
                {tasks.map((task, index) => (
                  <td key={index} className="p-3 border border-orange-200">
                    {editingTaskIndex === index ? (
                      <input
                        type="number"
                        value={editedTask.duration}
                        onChange={(e) => {
                          const value = e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value, 10));
                          setEditedTask({...editedTask, duration: value});
                        }}
                        className="w-full p-2 border rounded"
                        min="1"
                      />
                    ) : (
                      task.duration
                    )}
                  </td>
                ))}
                {tempTask && (
                <td className="p-3 border border-orange-200">
                  <input
                    type="number"
                    value={tempTask.duration}
                    onChange={(e) => setTempTask({ ...tempTask, duration: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                    className="w-full p-2 border rounded"
                    placeholder="Durée"
                  />
                </td>
              )}
              </tr>
              
                <tr className="bg-gray-50 border-orange-200 text-xl">
                  <th className="p-3 font-bold text-gray-700">Tâches {currentProject.isSuccessor ? "successeur" : "antérieur" }</th>
                  {tasks.map((task, index) => (
                    <td
                      key={index}
                      className="p-3 border border-orange-200 cursor-pointer hover:bg-gray-100 transition"
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
        dependencyType={currentProject.isSuccessor ? "successeur" : "antérieur"}
      />
    </div>
  );
};

export default TaskListTable;