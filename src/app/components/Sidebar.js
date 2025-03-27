"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskInitializerModal from "./TaskInitializerModal";
import { Menu, X, BadgePlus, User, Settings, HeartIcon, ChevronDown, ChevronUp  } from "lucide-react";

const Sidebar = ({ setInitialTaskCount, setCurrentProject, setProjectPage, projects, setProjects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  // Charger les projets au montage
  useEffect(() => {
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

    fetchProjects();
  }, [setProjects]); // Se lance uniquement une fois au montage

  const reload = async () => {
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

  const handleShowProjects = () => {
    setShowProjects(!showProjects);
  };

  return (
    <div className={`fixed h-screen flex flex-col transition-all duration-300 ease-in-out bg-gradient-to-b from-white to-gray-100 text-gray-800 ${
      isOpen ? 'w-72' : 'w-20'
    }`}>
      {/* Bouton pour ouvrir le sidebar */}
      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 left-4 p-2 text-gray-700 rounded z-30">
        {isOpen ? <X /> : <Menu size={30} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-grow space-y-2 px-4 mt-10"
          >

            <ul>
              <li className="flex items-center text-2xs cursor-pointer p-3 rounded-xl transition-all duration-300 ease-in-out bg-gray-200 text-black shadow-lg transform hover:scale-105 hover:bg-[#FFAA00] hover:translate-x-2 my-8" onClick={() => setIsModalOpen(true)}>
                <BadgePlus className="mr-2" size={25} /> Nouveau projet
              </li>
              <li className="flex items-center  text-2xs cursor-pointer p-3 rounded-xl transition-all duration-300 ease-in-out bg-gray-200 text-black shadow-lg transform hover:scale-105 hover:bg-[#FFAA00] hover:translate-x-2 my-8 justify-between p-3" onClick={handleShowProjects}>
                <div className="flex items-center">
                  <User className="mr-2" size={25} /> Mes projets
                </div>
                {showProjects ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </li>
                        {/* Liste des projets */}
                {showProjects && (
                  <div className="ml-4 mb-4 p-3 bg-gray-100 rounded-lg shadow-inner max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300">
                    <ul>
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <li
                            key={project.id}
                            className="flex items-center text-2xs bg-gray-50 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:translate-x-1"
                            onClick={() => {
                              setCurrentProject(project);
                              setProjectPage(true);
                              setIsOpen(false);
                              console.log("Projet sélectionné :", project.name);
                            }}
                          >
                            {project.name}
                          </li>
                        ))
                      ) : (
                        <li className="text-2xs text-gray-400 mt-1">Aucun projet trouvé</li>
                      )}
                    </ul>
                  </div>
                )}
              <li className="flex items-center text-2xs cursor-pointer p-3 rounded-xl transition-all duration-300 ease-in-out bg-gray-200 text-black shadow-lg transform hover:scale-105 hover:bg-[#FFAA00] hover:translate-x-2 my-8">
                <HeartIcon className="mr-2" size={25} /> Favoris
              </li>
              <li className="flex items-center ctext-2xs ursor-pointer p-3 rounded-xl transition-all duration-300 ease-in-out bg-gray-200 text-black shadow-lg transform hover:scale-105 hover:bg-[#FFAA00] hover:translate-x-2 my-8">
                <Settings className="mr-2" /> Paramètres
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <TaskInitializerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInitialize={async (count, project) => {
          setInitialTaskCount(count);
          setCurrentProject(project);
          await reload();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default Sidebar;
