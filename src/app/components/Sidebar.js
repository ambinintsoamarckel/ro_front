"use client";

import { useState, useEffect } from "react";
import TaskInitializerModal from "./TaskInitializerModal";
import { Menu, X, BadgePlus, User, Settings, HeartIcon } from "lucide-react";

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
    <div className="flex">
      {/* Bouton pour ouvrir le sidebar */}
      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 left-4 p-2 text-white rounded z-50">
        {isOpen ? <X /> : <Menu size={30} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-70 p-4 
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 ease-in-out`}
      >
        <button onClick={() => setIsOpen(false)} className="text-white p-2 mb-4">
          <X />
        </button>

        <ul>
          <li className="flex items-center p-3 hover:bg-gray-700 text-xl rounded mt-10 mb-5" onClick={() => setIsModalOpen(true)}>
            <BadgePlus className="mr-2" size={25} /> Nouveau projet
          </li>

          <li className="flex items-center p-3 hover:bg-gray-700 text-xl rounded mt-10 mb-5" onClick={handleShowProjects}>
            <User className="mr-2" size={25} /> Mon projet
          </li>

          {/* Liste des projets */}
          {showProjects && (
            <ul className="ml-6 mb-4">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <li
                    key={project.id}
                    className="text-sm hover:text-gray-400 cursor-pointer mt-1"
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
                <li className="text-sm text-gray-400 mt-1">Aucun projet trouvé</li>
              )}
            </ul>
          )}

          <li className="flex items-center p-3 hover:bg-gray-700 text-xl rounded mt-10 mb-5">
            <HeartIcon className="mr-2" size={25} /> Favoris
          </li>
          <li className="flex items-center p-3 hover:bg-gray-700 text-xl rounded mt-10 mb-5">
            <Settings className="mr-2" /> Paramètres
          </li>
        </ul>
      </div>

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
