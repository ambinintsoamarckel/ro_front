"use client";

import { useState } from "react";
import { Menu, X, Power, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { colors } from "../colors";

const Header = ({ projects = [], setCurrentProject, setProjectPage }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = '/login';
      } else {
        const data = await response.json();
        console.error('Erreur logout:', data.message);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredProjects = searchQuery
    ? projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleProjectClick = (project) => {
    setCurrentProject(project);
    setProjectPage(true);
    setSearchQuery("");
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${colors.background.header} backdrop-blur-sm ${colors.primary.text} fixed top-0 left-0 w-full shadow-lg ${colors.table.border} border-b z-50`}
    >
      <div className="flex justify-between items-center h-16 sm:h-20 px-2 sm:px-4">
        
        {/* Logo + Titre */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2 sm:gap-4 flex-shrink-0"
        >
          <div className="relative">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br ${colors.primary.gradient} p-1.5 sm:p-2 shadow-lg`}
            >
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={40}  
                height={40} 
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </motion.div>
            <div className={`absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r ${colors.buttons.add.gradient} rounded-full animate-pulse`}></div>
          </div>
          <div className="min-w-0 hidden lg:block">
            <h1 className={`text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r ${colors.primary.gradient} bg-clip-text text-transparent whitespace-nowrap`}>
              Ordonnancement des Tâches
            </h1>
            <p className={`text-xs lg:text-sm ${colors.text.secondary} font-medium`}>Gestion intelligente des tâches</p>
          </div>
        </motion.div>

        {/* Barre de recherche */}
        <motion.div
          initial={{ y: -20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex-1 max-w-lg mx-2 sm:mx-3 lg:ml-0 lg:mr-4 relative"
        >
          <motion.div className="relative group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <motion.div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className={`h-4 w-4 sm:h-5 sm:w-5 ${colors.text.muted}`} />
            </motion.div>

            <motion.input
              type="text"
              placeholder="Rechercher vos projets..."
              value={searchQuery}
              onChange={handleSearchChange}
              whileFocus={{ scale: 1.01 }}
              className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base ${colors.background.input} backdrop-blur-sm ${colors.primary.border} rounded-full focus:ring-2 focus:ring-rose-400/30 ${colors.primary.focus} focus:bg-white/95 focus:shadow-lg hover:bg-white/90 hover:border-stone-300/80 hover:shadow-md transition-all duration-300 placeholder:${colors.text.placeholder}`}
            />

            {/* Résultats de recherche */}
            {filteredProjects.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 z-50 rounded-xl bg-white shadow-xl border max-h-72 overflow-y-auto custom-scrollbar">
              <div className="p-2 space-y-2">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    className={`flex items-center p-3 ${colors.background.card} rounded-lg cursor-pointer transition-all duration-200 hover:${colors.background.overlay} hover:shadow-sm ${colors.primary.border}`}
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${colors.primary.gradientButton} rounded-lg flex items-center justify-center mr-3`}>
                      <span className="text-white font-semibold text-xs">
                        {project.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${colors.text.primary} text-sm truncate`}>{project.name}</p>
                      <p className={`text-xs ${colors.text.muted}`}>Modifié récemment</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Custom scrollbar styles */}
              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: ${colors.scrollbar.track};
                  border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: ${colors.scrollbar.thumb};
                  border-radius: 6px;
                  border: 2px solid ${colors.scrollbar.track};
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: ${colors.scrollbar.thumbHover};
                }

                /* Firefox */
                .custom-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: ${colors.scrollbar.thumb} ${colors.scrollbar.track};
                }
              `}</style>
            </div>
          )}

          </motion.div>
        </motion.div>

        {/* Déconnexion */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`group relative p-2 sm:p-3 bg-gradient-to-r ${colors.buttons.add.gradient} ${colors.buttons.add.text} rounded-full shadow-lg hover:shadow-xl ${colors.buttons.add.hover} transition-all duration-300 disabled:opacity-50 flex-shrink-0`}
        >
          <motion.div
            animate={isLoggingOut ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5, repeat: isLoggingOut ? Infinity : 0 }}
          >
            <Power size={18} className="sm:w-5 sm:h-5" />
          </motion.div>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
