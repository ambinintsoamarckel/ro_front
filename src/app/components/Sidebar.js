"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskInitializerModal from "./TaskInitializerModal";
import { 
  Menu, 
  X, 
  BadgePlus, 
  User, 
  Settings, 
  Home,
  FolderOpen,
  Star
} from "lucide-react";

const Sidebar = ({ setInitialTaskCount, setCurrentProject, setProjectPage, projects, setProjects, onSecondSidebarToggle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  // Nouvel état pour la deuxième sidebar
  const [secondSidebarOpen, setSecondSidebarOpen] = useState(false);
  const [secondSidebarContent, setSecondSidebarContent] = useState('');

  // Informer le parent quand l'état de la deuxième sidebar change
  useEffect(() => {
    if (onSecondSidebarToggle) {
      onSecondSidebarToggle(secondSidebarOpen);
    }
  }, [secondSidebarOpen, onSecondSidebarToggle]);

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
  }, [setProjects]);

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

  // Fonction pour ouvrir la deuxième sidebar
  const openSecondSidebar = (content) => {
    setSecondSidebarContent(content);
    setSecondSidebarOpen(true);
  };

  // Fonction pour fermer la deuxième sidebar
  const closeSecondSidebar = () => {
    setSecondSidebarOpen(false);
  };

  // Fonction pour le bouton Menu
  const handleMenuClick = () => {
    if (secondSidebarOpen) {
      closeSecondSidebar();
    } else {
      openSecondSidebar('recent');
    }
  };

  const sidebarItems = [
    { id: 'menu', icon:Menu, label: 'Menu', action: () => handleMenuClick() },
    { id: 'nouveau', icon: BadgePlus, label: 'Nouveau', action: () => setIsModalOpen(true) },
    { id: 'home', icon: Home, label: 'Accueil', action: () => openSecondSidebar('home') },
    { id: 'projects', icon: FolderOpen, label: 'Projets', action: () => openSecondSidebar('projects') },
    { id: 'favoris', icon: Star, label: 'Favoris', action: () => openSecondSidebar('favoris') },
    { id: 'parametres', icon: Settings, label: 'Paramètres', action: () => openSecondSidebar('parametres') },
  ];

  const SidebarIcon = ({ item, isActive }) => (
    <div
      className={`flex flex-col items-center justify-center p-3 cursor-pointer transition-all duration-300 rounded-xl group relative ${
        isActive 
          ? 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-800 shadow-md border border-indigo-200' 
          : 'text-slate-600 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:text-indigo-700 hover:shadow-sm'
      }`}
      onClick={item.action}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <item.icon size={22} className="mb-1" />
      </motion.div>
      <span className="text-xs font-semibold tracking-wide">{item.label}</span>
      
      {/* Tooltip pour les icônes */}
      <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg">
        {item.label}
        <div className="absolute left-2 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
      </div>
    </div>
  );

  // Contenu de la deuxième sidebar
  const renderSecondSidebarContent = () => {
    switch (secondSidebarContent) {
      case 'recent':
        return (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Projets récents</h3>
              <button
                onClick={closeSecondSidebar}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="space-y-4">
              {projects.length > 0 ? (
                <div className="space-y-2">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center p-3 bg-white rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:shadow-sm border border-slate-100"
                      onClick={() => {
                        setCurrentProject(project);
                        setProjectPage(true);
                        closeSecondSidebar();
                      }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-xs">
                          {project.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">{project.name}</p>
                        <p className="text-xs text-slate-500">Modifié récemment</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <FolderOpen size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 text-sm mb-4">Aucun projet</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    Créer un projet
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        );
      
      case 'projects':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Mes Projets</h3>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <BadgePlus size={16} />
                  </motion.button>
                  <button
                    onClick={closeSecondSidebar}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={16} className="text-slate-500" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center p-3 bg-white rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:shadow-sm border border-slate-100"
                      onClick={() => {
                        setCurrentProject(project);
                        setProjectPage(true);
                        closeSecondSidebar();
                      }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-xs">
                          {project.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">{project.name}</p>
                        <p className="text-xs text-slate-500">Modifié récemment</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <FolderOpen size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 text-sm mb-4">Aucun projet</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      Créer un projet
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'favoris':
        return (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Favoris</h3>
              <button
                onClick={closeSecondSidebar}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="space-y-2">
              {projects.filter(p => p.isFavorite).length > 0 ? (
                projects
                  .filter(project => project.isFavorite)
                  .map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center p-3 bg-white rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:shadow-sm border border-slate-100"
                      onClick={() => {
                        setCurrentProject(project);
                        setProjectPage(true);
                        closeSecondSidebar();
                      }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center mr-3">
                        <Star size={14} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">{project.name}</p>
                        <p className="text-xs text-slate-500">Favori</p>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <Star size={48} className="mx-auto text-amber-300 mb-4" />
                  <p className="text-slate-500 text-sm mb-2">Aucun favori</p>
                  <p className="text-slate-400 text-xs">Ajoutez vos projets préférés</p>
                </motion.div>
              )}
            </div>

          </div>
        );
      
      case 'parametres':
        return (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Paramètres</h3>
              <button
                onClick={closeSecondSidebar}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-700 mb-3 text-sm">Général</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Thème sombre</span>
                    <button className="w-10 h-5 bg-slate-200 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform shadow-sm"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Notifications</span>
                    <button className="w-10 h-5 bg-indigo-500 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform shadow-sm"></div>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-700 mb-3 text-sm">Compte</h4>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-slate-600 hover:text-indigo-600 transition-colors py-1">
                    Modifier le profil
                  </button>
                  <button className="w-full text-left text-sm text-slate-600 hover:text-indigo-600 transition-colors py-1">
                    Changer le mot de passe
                  </button>
                  <button className="w-full text-left text-sm text-red-600 hover:text-red-700 transition-colors py-1">
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default: // home
        return (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Accueil</h3>
              <button
                onClick={closeSecondSidebar}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-sm"
              >
                <BadgePlus size={18} className="mr-2" />
                <span className="font-medium text-sm">Nouveau projet</span>
              </motion.button>
              
              {projects.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="font-semibold text-slate-700 mb-3 text-sm">Récents</h4>
                  <div className="space-y-2">
                    {projects.slice(0, 3).map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 4 }}
                        className="flex items-center p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-all duration-200"
                        onClick={() => {
                          setCurrentProject(project);
                          setProjectPage(true);
                          closeSecondSidebar();
                        }}
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center mr-3">
                          <span className="text-white font-semibold text-xs">
                            {project.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-600 truncate">{project.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Sidebar principale */}
      <motion.div 
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed left-2 top-20 h-[calc(100vh-6rem)] w-20 z-40 flex flex-col"
      >
        {/* Icônes de navigation */}
        <div className="flex-1 py-4 space-y-1">
          {sidebarItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
            >
              <SidebarIcon
                item={item}
                isActive={secondSidebarContent === item.id && secondSidebarOpen}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Profil utilisateur en bas */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="p-4 mt-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-full cursor-pointer hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </motion.div>
      </motion.div>

      {/* Deuxième sidebar */}
      <AnimatePresence>
        {secondSidebarOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-20 top-20 h-[calc(100vh-6rem)] w-80 z-30 overflow-hidden flex flex-col"
          >
            {renderSecondSidebarContent()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal pour créer un nouveau projet */}
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
    </>
  );
};

export default Sidebar;