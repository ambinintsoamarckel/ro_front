"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskInitializerModal from "./TaskInitializerModal";
import {Menu,X,BadgePlus,User,Settings,Home,FolderOpen,Star,MoreVertical, Edit2, Trash2} from "lucide-react";
import { colors } from "../colors";


const Sidebar = ({ setInitialTaskCount, setCurrentProject, setProjectPage, projects, setProjects, onSecondSidebarToggle, secondSidebarOpen,setSecondSidebarOpen,secondSidebarContent,setSecondSidebarContent,isModalOpen,setIsModalOpen }) => {

  const [showProjects, setShowProjects] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [openDropdownId, setOpenDropdownId] = useState(null);


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
  const ProjectDropdown = ({ onEdit, onDelete }) => (
    <div className={`absolute right-2 top-10 w-32 ${colors.background.card} ${colors.primary.border} rounded-lg ${colors.effects.glow} z-50`}>
      <button
        onClick={onEdit}
        className={`flex items-center w-full px-3 py-2 text-sm ${colors.buttons.edit.text} ${colors.buttons.edit.base} ${colors.buttons.edit.hover} rounded-t-lg transition-all duration-200`}
      >
        <Edit2 size={14} className="mr-2" />
        Modifier
      </button>
      <button
        onClick={onDelete}
        className={`flex items-center w-full px-3 py-2 text-sm ${colors.buttons.delete.text} ${colors.buttons.delete.base} ${colors.buttons.delete.hover} rounded-b-lg transition-all duration-200`}
      >
        <Trash2 size={14} className="mr-2" />
        Supprimer
      </button>
    </div>
  ); 
  const renderProjectCard = (project, index) => (
    <motion.div
      key={project.id}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 4, scale: 1.02 }}
      className={`relative flex items-center justify-between p-3 ${colors.background.card} rounded-lg cursor-pointer transition-all duration-300 ${colors.effects.glowHover} ${colors.primary.border} group`}
    >
      <div
        className="flex items-center flex-1 min-w-0"
        onClick={() => {
          setCurrentProject(project);
          setProjectPage(true);
        }}
      >
        <div className={`w-8 h-8 ${colors.projects.colors[index % colors.projects.colors.length]} rounded-lg flex items-center justify-center mr-3 ${colors.projects.shadows[index % colors.projects.shadows.length]} group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-white font-semibold text-xs">
            {project.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${colors.text.primary} text-sm truncate`}>
            {project.name}
          </p>
          <p className={`text-xs ${colors.text.muted}`}>
            Modifié récemment
          </p>
        </div>
      </div>
  
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropdownId(openDropdownId === project.id ? null : project.id);
          }}
          className={`p-1 rounded-full hover:${colors.background.overlay} transition-all duration-200 ${colors.effects.glowHover}`}
        >
          <MoreVertical size={18} className={colors.text.muted} />
        </button>
  
        {openDropdownId === project.id && (
          <ProjectDropdown
            onEdit={() => {
              console.log("Modifier", project.id);
              setOpenDropdownId(null);
            }}
            onDelete={() => {
              console.log("Supprimer", project.id);
              setOpenDropdownId(null);
            }}
          />
        )}
      </div>
    </motion.div>
  );

  const SidebarIcon = ({ item, isActive }) => {
    // Obtenir les couleurs spécifiques pour chaque item
    const itemColors = colors.sidebar.items[item.id];
    
    return (
      <div
        className={`flex flex-col items-center justify-center p-3 cursor-pointer transition-all duration-300 rounded-xl group relative ${
          isActive 
            ? `${itemColors?.bg || colors.sidebar.icons.bgActive} ${itemColors?.icon === 'text-white' ? 'text-white' : colors.sidebar.icons.active} shadow-lg ${itemColors?.shadow || 'shadow-violet-500/30'} transform scale-105` 
            : `${colors.text.secondary} hover:${itemColors?.bg || colors.sidebar.icons.bgHover} hover:${itemColors?.icon || colors.sidebar.icons.hover} ${itemColors?.hover || ''} hover:shadow-md transition-all duration-300`
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
        
        {/* Tooltip amélioré avec couleurs spécifiques */}
        <div className={`absolute left-full ml-3 px-3 py-2 ${itemColors?.bg || colors.primary.gradientBg} ${itemColors?.icon || 'text-white'} text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 ${itemColors?.shadow || 'shadow-lg shadow-violet-500/30'}`}>
          {item.label}
          <div className={`absolute left-2 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 ${itemColors?.bg || colors.primary.gradientBg} rotate-45`}></div>
        </div>
      </div>
    );
  };

  // Contenu de la deuxième sidebar
  const renderSecondSidebarContent = () => {
    switch (secondSidebarContent) {
      case 'recent':
        return (
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className={`flex items-center justify-between mb-4 p-4 -m-4 ${colors.sidebar.secondSidebar.header.bg} ${colors.sidebar.secondSidebar.header.border} rounded-t-2xl`}>
            <h3 className={`text-lg font-semibold ${colors.text.gradient}`}>Projets récents</h3>
            <button
              onClick={closeSecondSidebar}
              className={`p-2 hover:${colors.background.overlay} rounded-lg transition-colors ${colors.effects.glowHover}`}
            >
              <X size={18} className={colors.text.muted} />
            </button>
          </div>
            <div className="space-y-4">
              {projects.length > 0 ? (
                <div className="space-y-2">
                  {projects.map((project, index) => renderProjectCard(project, index))}

                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <FolderOpen size={48} className={`mx-auto ${colors.text.muted} mb-4`} />
                  <p className={`${colors.text.secondary} text-sm mb-4`}>Aucun projet</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className={`px-4 py-2 ${colors.primary.gradientButton} text-white rounded-lg ${colors.buttons.save.hover} transition-colors text-sm`}
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
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4">
              <div className={`flex items-center justify-between mb-4 p-4 -m-4 ${colors.sidebar.secondSidebar.header.bg} ${colors.sidebar.secondSidebar.header.border} rounded-t-2xl`}>
                <h3 className={`text-lg font-semibold ${colors.text.gradient}`}>Mes Projets</h3>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className={`p-2 ${colors.primary.gradientButton} text-white rounded-lg ${colors.buttons.save.hover} transition-colors`}
                  >
                    <BadgePlus size={16} />
                  </motion.button>
                  <button
                    onClick={closeSecondSidebar}
                    className={`p-2 hover:${colors.background.overlay} rounded-lg transition-colors ${colors.effects.glowHover}`}
                  >
                    <X size={18} className={colors.text.muted} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {projects.length > 0 ? (
                  projects.map((project, index) => renderProjectCard(project, index))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <FolderOpen size={48} className={`mx-auto ${colors.text.muted} mb-4`} />
                    <p className={`${colors.text.secondary} text-sm mb-4`}>Aucun projet</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsModalOpen(true)}
                      className={`px-4 py-2 ${colors.primary.gradientButton} text-white rounded-lg ${colors.buttons.save.hover} transition-colors text-sm`}
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
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className={`flex items-center justify-between mb-4 p-4 -m-4 ${colors.sidebar.secondSidebar.header.bg} ${colors.sidebar.secondSidebar.header.border} rounded-t-2xl`}>
              <h3 className={`text-lg font-semibold ${colors.text.gradient}`}>Favoris</h3>
              <button
                onClick={closeSecondSidebar}
                className={`p-2 hover:${colors.background.overlay} rounded-lg transition-colors ${colors.effects.glowHover}`}
              >
                <X size={18} className={colors.text.muted} />
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
                      className={`flex items-center p-3 ${colors.favorites.card.bg} rounded-lg cursor-pointer transition-all duration-200 ${colors.favorites.card.hover} hover:shadow-sm ${colors.favorites.card.border}`}
                      onClick={() => {
                        setCurrentProject(project);
                        setProjectPage(true);
                        
                      }}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-br ${colors.favorites.icon.bg} rounded-lg flex items-center justify-center mr-3`}>
                        <Star size={14} className={colors.favorites.icon.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${colors.text.primary} text-sm truncate`}>{project.name}</p>
                        <p className={`text-xs ${colors.favorites.empty.text}`}>Favori</p>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <Star size={48} className={`mx-auto ${colors.favorites.empty.icon} mb-4`} />
                  <p className={`${colors.favorites.empty.text} text-sm mb-2`}>Aucun favori</p>
                  <p className={`${colors.text.muted} text-xs`}>Ajoutez vos projets préférés</p>
                </motion.div>
              )}
            </div>

          </div>
        );
      
      case 'parametres':
        return (
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className={`flex items-center justify-between mb-4 p-4 -m-4 ${colors.sidebar.secondSidebar.header.bg} ${colors.sidebar.secondSidebar.header.border} rounded-t-2xl`}>
              <h3 className={`text-lg font-semibold ${colors.text.gradient}`}>Paramètres</h3>
              <button
                onClick={closeSecondSidebar}
                className={`p-2 hover:${colors.background.overlay} rounded-lg transition-colors ${colors.effects.glowHover}`}
              >
                <X size={18} className={colors.text.muted} />
              </button>
            </div>
            <div className="space-y-4">
              <div className={`${colors.background.card} rounded-lg p-4 ${colors.primary.border}`}>
                <h4 className={`font-semibold ${colors.text.secondary} mb-3 text-sm`}>Général</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${colors.text.secondary}`}>Thème sombre</span>
                    <button className={`w-10 h-5 ${colors.background.overlay} rounded-full relative`}>
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform shadow-sm"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${colors.text.secondary}`}>Notifications</span>
                    <button className={`w-10 h-5 ${colors.primary.gradientButton} rounded-full relative`}>
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform shadow-sm"></div>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={`${colors.background.card} rounded-lg p-4 ${colors.primary.border}`}>
                <h4 className={`font-semibold ${colors.text.secondary} mb-3 text-sm`}>Compte</h4>
                <div className="space-y-2">
                  <button className={`w-full text-left text-sm ${colors.text.secondary} ${colors.buttons.favorite.hover} transition-colors py-1`}>
                    Modifier le profil
                  </button>
                  <button className={`w-full text-left text-sm ${colors.text.secondary} ${colors.buttons.favorite.hover} transition-colors py-1`}>
                    Changer le mot de passe
                  </button>
                  <button className={`w-full text-left text-sm ${colors.buttons.delete.text} transition-colors py-1`}>
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default: // home
        return (
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className={`flex items-center justify-between mb-4 p-4 -m-4 ${colors.sidebar.secondSidebar.header.bg} ${colors.sidebar.secondSidebar.header.border} rounded-t-2xl`}>
              <h3 className={`text-lg font-semibold ${colors.text.gradient}`}>Accueil</h3>
              <button
                onClick={closeSecondSidebar}
                className={`p-2 hover:${colors.background.overlay} rounded-lg transition-colors ${colors.effects.glowHover}`}
              >
                <X size={18} className={colors.text.muted} />
              </button>
            </div>
            <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className={`w-full flex items-center justify-center px-4 py-3 ${colors.buttons.add.gradient} ${colors.buttons.add.text} rounded-lg ${colors.buttons.add.hover} transition-all duration-300 ${colors.buttons.add.shadow} ${colors.buttons.add.ring} ${colors.effects.glowHover}`}
            >
              <BadgePlus size={18} className="mr-2" />
              <span className="font-medium text-sm">Nouveau projet</span>
            </motion.button>

              
              {projects.length > 0 && (
                <div className={`border-t ${colors.primary.border} pt-4`}>
                  <h4 className={`font-semibold ${colors.text.secondary} mb-3 text-sm`}>Récents</h4>
                  <div className="space-y-2">
                    {projects.slice(0, 3).map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 4 }}
                        className={`flex items-center p-2 rounded-lg hover:${colors.background.overlay} cursor-pointer transition-all duration-200`}
                        onClick={() => {
                          setCurrentProject(project);
                          setProjectPage(true);

                        }}
                      >
                        <div className={`w-6 h-6 bg-gradient-to-br ${colors.primary.gradientButton} rounded-md flex items-center justify-center mr-3`}>
                          <span className="text-white font-semibold text-xs">
                            {project.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${colors.text.secondary} truncate`}>{project.name}</span>
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
        className={`fixed left-2 top-20 h-[calc(100vh-6rem)] w-20 z-40 flex flex-col ${colors.sidebar.main.bg} ${colors.sidebar.main.border} ${colors.sidebar.main.shadow} rounded-2xl`}
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
          <div className={`w-12 h-12 ${colors.primary.gradient} rounded-xl cursor-pointer hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center ${colors.effects.glow} group`}>
            <User size={20} className="text-white group-hover:scale-110 transition-transform duration-200" />
          </div>
        </motion.div>
      </motion.div>

      <style jsx global>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: ${colors.scrollbar.track};
      border-radius: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(45deg, ${colors.scrollbar.thumb}, ${colors.scrollbar.thumbHover});
      border-radius: 6px;
      border: 2px solid ${colors.scrollbar.track};
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(45deg, ${colors.scrollbar.thumbHover}, ${colors.scrollbar.thumbActive});
    }

    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: ${colors.scrollbar.thumb} ${colors.scrollbar.track};
    }
    
    /* Effet de brillance sur hover */
    .group:hover .shine-effect {
      animation: shine 2s infinite;
    }
    
    @keyframes shine {
      0% {
        transform: translateX(-100%) skewX(-15deg);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translateX(200%) skewX(-15deg);
        opacity: 0;
      }
    }

    /* Effet de pulse pour les éléments actifs */
    .pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite alternate;
    }

    @keyframes pulse-glow {
      from {
        box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
      }
      to {
        box-shadow: 0 0 30px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.3);
      }
    }

    /* Effet de flottement pour les cartes */
    .float-animation {
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-3px);
      }
    }

    /* Effet de gradient animé pour les boutons */
    .gradient-shift {
      background-size: 200% 200%;
      animation: gradient-shift 3s ease infinite;
    }

    @keyframes gradient-shift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    /* Effet de rotation subtile pour les icônes */
    .icon-hover-rotate:hover {
      animation: subtle-rotate 0.3s ease-in-out;
    }

    @keyframes subtle-rotate {
      0% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(5deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }

    /* Effet de bordure animée */
    .border-glow {
      position: relative;
      overflow: hidden;
    }

    .border-glow::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.5), transparent);
      border-radius: inherit;
      z-index: -1;
      animation: border-rotate 3s linear infinite;
    }

    @keyframes border-rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    /* Effet de slide-in pour les dropdowns */
    .slide-in {
      animation: slide-in 0.2s ease-out;
    }

    @keyframes slide-in {
      from {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Effet de text-glow pour les textes importants */
    .text-glow {
      text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
    }

    /* Effet de ripple sur clic */
    .ripple-effect {
      position: relative;
      overflow: hidden;
    }

    .ripple-effect::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .ripple-effect:active::after {
      width: 300px;
      height: 300px;
    }

    /* Animation de chargement */
    .loading-dots {
      animation: loading-dots 1.4s ease-in-out infinite;
    }

    .loading-dots:nth-child(1) {
      animation-delay: -0.32s;
    }

    .loading-dots:nth-child(2) {
      animation-delay: -0.16s;
    }

    @keyframes loading-dots {
      0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Effet de morphing pour les transitions */
    .morph-transition {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Effet de néon pour les éléments actifs */
    .neon-glow {
      box-shadow: 
        0 0 5px rgba(168, 85, 247, 0.5),
        0 0 10px rgba(168, 85, 247, 0.3),
        0 0 15px rgba(168, 85, 247, 0.2),
        inset 0 0 5px rgba(168, 85, 247, 0.1);
    }

    /* Amélioration des performances pour les animations */
    .gpu-accelerated {
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000px;
    }

    /* Media queries pour les animations responsives */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Mode sombre amélioré */
    @media (prefers-color-scheme: dark) {
      .auto-dark {
        filter: brightness(0.9) contrast(1.1);
      }
    }
  `}</style>

      {/* Deuxième sidebar */}
      <AnimatePresence>
        {secondSidebarOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed left-20 top-20 h-[calc(100vh-6rem)] w-80 z-30 overflow-hidden flex flex-col ${colors.sidebar.secondSidebar.bg} ${colors.sidebar.secondSidebar.border} ${colors.sidebar.secondSidebar.shadow} rounded-r-2xl`}
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