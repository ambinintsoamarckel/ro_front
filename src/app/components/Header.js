"use client";

import { useState } from "react";
import { Menu, X, Power, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Animation de transition avant redirection
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = '/login';
      } else {
        const data = await response.json();
        console.error('Erreur logout:', data.message);
        // Toast ou notification élégante à la place d'alert
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Toast ou notification élégante à la place d'alert
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Ici vous pouvez ajouter la logique de recherche
    console.log('Recherche:', e.target.value);
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-sm text-[#243063] fixed top-0 left-0 w-full shadow-lg border-b border-gray-100 z-50"
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
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-[#243063] to-[#3a4a7a] p-1.5 sm:p-2 shadow-lg"
            >
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={40}  
                height={40} 
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </motion.div>
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-[#EDB640] rounded-full animate-pulse"></div>
          </div>
          
          {/* Titre responsive */}
          <div className="min-w-0 hidden lg:block">
            <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-[#243063] to-[#3a4a7a] bg-clip-text text-transparent whitespace-nowrap">
              Ordonnancement des Tâches
            </h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">Gestion intelligente des tâches</p>
          </div>
        </motion.div>

        {/* Barre de recherche - Légèrement décalée vers le texte */}
        <motion.div
          initial={{ y: -20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex-1 max-w-lg mx-2 sm:mx-4 lg:ml-6 lg:mr-8"
        >
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div 
              className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-[#243063] group-hover:text-[#3a4a7a] transition-all duration-300" />
              </motion.div>
            </motion.div>
            
            <motion.input
              type="text"
              placeholder="Rechercher vos projets..."
              value={searchQuery}
              onChange={handleSearchChange}
              whileFocus={{ scale: 1.01 }}
              className="w-full pl-0 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-gray-50/80 to-white/60 backdrop-blur-sm border border-gray-200/60 rounded-full focus:ring-2 focus:ring-[#243063]/30 focus:border-[#243063] focus:bg-white focus:shadow-lg hover:bg-white/90 hover:border-gray-300/80 hover:shadow-md transition-all duration-300 placeholder:text-gray-400 hover:placeholder:text-gray-500"
            />
            
            {/* Effet de brillance animé */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#243063]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              initial={{ x: "-100%" }}
              whileHover={{ 
                x: "100%",
                transition: { duration: 0.8, ease: "easeInOut" }
              }}
            />
            
            {/* Anneau de focus élégant */}
            <div className="absolute inset-0 rounded-full ring-2 ring-transparent group-focus-within:ring-[#243063]/20 transition-all duration-300 pointer-events-none"></div>
            
            {/* Effet de glow subtil */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#243063]/5 via-transparent to-[#EDB640]/5 opacity-0 group-hover:opacity-60 blur-sm transition-all duration-500 pointer-events-none"></div>
          </motion.div>
        </motion.div>

        {/* Bouton de déconnexion */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="group relative p-2 sm:p-3 bg-gradient-to-r from-[#EDB640] to-[#f5c543] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex-shrink-0"
        >
          <motion.div
            animate={isLoggingOut ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5, repeat: isLoggingOut ? Infinity : 0 }}
          >
            <Power size={18} className="sm:w-5 sm:h-5" />
          </motion.div>
          
          {/* Effet de survol */}
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;