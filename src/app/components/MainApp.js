"use client";

import React, { useState, useRef } from 'react';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';

const MainApp = () => {
  // États partagés
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectPage, setProjectPage] = useState(false);
  const [initialTaskCount, setInitialTaskCount] = useState(0);
  
  // États pour gérer la sidebar
  const [secondSidebarOpen, setSecondSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Références pour accéder aux méthodes de la Sidebar
  const sidebarRef = useRef(null);

  // Fonctions pour contrôler la sidebar depuis le Dashboard
  const handleOpenSecondSidebar = (content) => {
    // Simuler le clic sur le bon bouton de la sidebar
    if (sidebarRef.current && sidebarRef.current.openSecondSidebar) {
      sidebarRef.current.openSecondSidebar(content);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleSecondSidebarToggle = (isOpen) => {
    setSecondSidebarOpen(isOpen);
  };

  return (
    <div className="relative min-h-screen">
      {/* Dashboard */}
      <Dashboard
        onOpenSecondSidebar={handleOpenSecondSidebar}
        onOpenModal={handleOpenModal}
        projects={projects}
      />
      
      {/* Sidebar */}
      <Sidebar
        ref={sidebarRef}
        setInitialTaskCount={setInitialTaskCount}
        setCurrentProject={setCurrentProject}
        setProjectPage={setProjectPage}
        projects={projects}
        setProjects={setProjects}
        onSecondSidebarToggle={handleSecondSidebarToggle}
      />
    </div>
  );
};

export default MainApp;