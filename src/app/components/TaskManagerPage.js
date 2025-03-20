"use client";

import { useState } from "react";
import TaskInitializerModal from "./TaskInitializerModal";
import TaskScheduler from "./TaskScheduler";
import { Button } from "@/components/ui/button"; // ou remplace par ton bouton custom

const TaskManagerPage = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showTaskScheduler, setShowTaskScheduler] = useState(false);
  const [taskCount, setTaskCount] = useState(0);

  const handleInitializeTasks = (count) => {
    setTaskCount(count);
    setIsTaskModalOpen(false);
    setShowTaskScheduler(true); // Affiche le tableau
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white h-screen p-4">
        <Button onClick={() => setIsTaskModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 w-full">
          Initialiser les tâches
        </Button>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6">
        {/* Modal */}
        <TaskInitializerModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onInitialize={handleInitializeTasks}
        />

        {/* Affiche TaskScheduler après validation */}
        {showTaskScheduler && <TaskScheduler initialTaskCount={taskCount} />}
      </div>
    </div>
  );
};

export default TaskManagerPage;
