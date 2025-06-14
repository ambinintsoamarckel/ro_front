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

const Sidebar = ({ setInitialTaskCount, setCurrentProject, setProjectPage, projects, setProjects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

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

  const sidebarItems = [
    { id: 'nouveau', icon: BadgePlus, label: 'Nouveau', action: () => setIsModalOpen(true) },
    { id: 'home', icon: Home, label: 'Accueil', action: () => setActiveTab('home') },
    { id: 'projects', icon: FolderOpen, label: 'Projets', action: () => setShowProjects(!showProjects) },
    { id: 'favoris', icon: Star, label: 'Favoris', action: () => setActiveTab('favoris') },
    { id: 'parametres', icon: Settings, label: 'Paramètres', action: () => setActiveTab('parametres') },
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

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Mes Projets</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <BadgePlus size={16} className="mr-2" />
                Nouveau
              </motion.button>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center p-4 bg-white rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-slate-50 hover:shadow-md border border-slate-100 hover:border-indigo-200"
                    onClick={() => {
                      setCurrentProject(project);
                      setProjectPage(true);
                      console.log("Projet sélectionné :", project.name);
                    }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center mr-4 shadow-md">
                      <span className="text-white font-bold text-lg">
                        {project.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{project.name}</p>
                      <p className="text-sm text-slate-500">Modifié récemment</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <FolderOpen size={64} className="mx-auto text-slate-300 mb-6" />
                  <p className="text-slate-500 text-lg mb-4">Aucun projet trouvé</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Créer un projet
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        );
      
      case 'favoris':
        return (
          <div className="p-4">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Favoris</h3>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Star size={64} className="mx-auto text-amber-300 mb-6" />
              <p className="text-slate-500 text-lg mb-4">Aucun favori pour le moment</p>
              <p className="text-slate-400 text-sm">Ajoutez vos projets préférés en cliquant sur l'étoile</p>
            </motion.div>
          </div>
        );
      
      case 'parametres':
        return (
          <div className="p-4">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Paramètres</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-700 mb-2">Général</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Thème sombre</span>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-6 bg-slate-200 rounded-full relative"
                    >
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                    </motion.button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Notifications</span>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-6 bg-indigo-500 rounded-full relative"
                    >
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                    </motion.button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-700 mb-2">Compte</h4>
                <div className="space-y-3">
                  <motion.button 
                    whileHover={{ x: 5 }}
                    className="w-full text-left text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Modifier le profil
                  </motion.button>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    className="w-full text-left text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Changer le mot de passe
                  </motion.button>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    className="w-full text-left text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Déconnexion
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Accueil</h3>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <BadgePlus size={22} className="mr-3" />
                <span className="font-semibold">Créer un nouveau projet</span>
              </motion.button>
              
              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-bold text-slate-700 mb-4">Récemment utilisés</h4>
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-slate-50 cursor-pointer transition-all duration-300 border border-slate-100 hover:border-indigo-200"
                      onClick={() => {
                        setCurrentProject(project);
                        setProjectPage(true);
                      }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {project.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-600">{project.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Sidebar fixe style Canva avec décalage vers le bas */}
      <motion.div 
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed left-2 top-20 h-[calc(100vh-6rem)] w-20 z-40 flex flex-col"
      >
        {/* Logo/Menu en haut */}
        <div className="p-4 mb-2">
          <Menu size={24} className="text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors duration-300" />
        </div>
        
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
                isActive={activeTab === item.id || (item.id === 'projects' && showProjects)}
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

      {/* Panel de contenu extensible avec décalage vers le bas */}
      <AnimatePresence>
        {(activeTab === 'projects' && showProjects) || activeTab !== 'home' ? (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-20 top-20 h-[calc(100vh-6rem)] w-80 bg-gradient-to-br from-white to-slate-50 border-r border-slate-200 shadow-xl z-30 overflow-y-auto"
          >
            {/* Header du panel */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white border-b border-indigo-600 p-4 flex items-center justify-between shadow-md">
              <h2 className="font-bold text-lg tracking-wide">
                {sidebarItems.find(item => item.id === activeTab)?.label || 'Contenu'}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setActiveTab('home');
                  setShowProjects(false);
                }}
                className="p-2 hover:bg-indigo-600 rounded-lg transition-colors duration-300"
              >
                <X size={18} className="text-indigo-100" />
              </motion.button>
            </div>
            
            {/* Contenu du panel */}
            {renderContent()}
          </motion.div>
        ) : null}
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