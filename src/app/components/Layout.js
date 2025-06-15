"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
//import Dashboard from "./Dashboard";

const Layout = ({ children, setInitialTaskCount, setCurrentProject, setProjectPage, projects, setProjects }) => {
  // État pour savoir si la deuxième sidebar est ouverte
  const [isSecondSidebarOpen, setIsSecondSidebarOpen] = useState(false);
  
  // Calcul dynamique de la marge gauche
  const getMainContentMargin = () => {
    if (isSecondSidebarOpen) {
      return 'ml-[376px]'; // 24px (première sidebar) + 320px (deuxième sidebar) + 32px (espacement réduit)
    }
    return 'ml-[0px]'; // 24px (première sidebar) + 32px (espacement réduit)
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Prend toute la largeur */}
      <div className="z-40 fixed top-0 left-0 right-0">
        <Header />
      </div>

      {/* Contenu principal avec sidebar */}
      <div className="flex flex-1 pt-[60px] sm:pt-[80px]">
        {/* Sidebar - Position fixe */}
        <div className="z-50 fixed left-0 top-[60px] sm:top-[80px] bottom-0">
          <Sidebar
            setInitialTaskCount={setInitialTaskCount}
            setCurrentProject={setCurrentProject}
            setProjectPage={setProjectPage}
            projects={projects}
            setProjects={setProjects}
            onSecondSidebarToggle={setIsSecondSidebarOpen}
          />
        </div>

        {/* Contenu principal - Marge dynamique */}
        <main className={`flex-1 ${getMainContentMargin()} px-2 sm:px-4 lg:px-6 py-4 transition-all duration-300 ease-in-out`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;