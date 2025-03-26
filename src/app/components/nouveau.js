"use client";

import { useState } from "react";
import { Edit2, Trash2, X, Check, ArrowRight, Plus, Save } from "lucide-react";
import TaskDetailsModal from "./TaskDetailsModal";

const TaskListTable = ({ tasks, setTasks, currentProject, onTaskUpdate, onTaskDelete, onTaskCreate }) => {
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [tempTask, setTempTask] = useState(null);

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
        setTempTask(null);
        await onTaskCreate(tempTask);
        
      } catch (error) {
        console.error("Erreur lors de l'ajout de la tâche", error);
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-end">
        <button
          onClick={handleAddColumn}
          disabled={!!tempTask}
          className={`p-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition disabled:opacity-50`}
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="overflow-x-scroll scrollbar-hidden shadow-md mt-5">
        <h1>{currentProject.name}</h1>
        <table className="min-w-full text-center border-collapse shadow-lg overflow-hidden mt-5 mb-5">
          <thead>
            <tr className="bg-orange-100 text-gray-800 text-xl font-semibold">
              <th className="p-3 border border-orange-200">Tâches</th>
              {tasks.map((task, index) => (
                <th key={index} className="p-3 border border-orange-200">
                  {editingTaskIndex === index ? (
                    <input
                      type="text"
                      value={editedTask.name}
                      onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    task.name
                  )}
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
          </thead>
          <tbody>
            <tr className="bg-white text-xl">
              <th className="p-3 font-bold border-orange-200 text-gray-700">Durée</th>
              {tasks.map((task, index) => (
                <td key={index} className="p-3 border border-orange-200">
                  {editingTaskIndex === index ? (
                    <input
                      type="number"
                      value={editedTask.duration}
                      onChange={(e) => setEditedTask({ ...editedTask, duration: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                      className="w-full p-2 border rounded"
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskListTable;
