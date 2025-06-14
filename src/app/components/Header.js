"use client";

import { useState } from "react";
import { Menu, X, Power } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-sm text-[#243063] fixed top-0 left-0 w-full shadow-lg border-b border-gray-100 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo + Titre */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2 sm:gap-4"
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
            <div className="min-w-0 flex-1">
              {/* Desktop et tablette */}
              <div className="hidden md:block">
                <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-[#243063] to-[#3a4a7a] bg-clip-text text-transparent">
                  Ordonnancement des Tâches
                </h1>
                <p className="text-xs lg:text-sm text-gray-500 font-medium">Gestion intelligente des tâches</p>
              </div>
              
              {/* Tablette petite */}
              <div className="hidden sm:block md:hidden">
                <h1 className="text-lg font-bold text-[#243063]">Ordonnancement</h1>
                <p className="text-xs text-gray-500">Gestion des tâches</p>
              </div>
              
              {/* Mobile */}
              <div className="block sm:hidden">
                <h1 className="text-base font-bold text-[#243063]">Tasks</h1>
              </div>
            </div>
          </motion.div>

          {/* Bouton de déconnexion - Toujours visible à l'extrême droite */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group relative p-2 sm:p-3 bg-gradient-to-r from-[#EDB640] to-[#f5c543] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 ml-4"
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
      </div>
    </motion.header>
  );
};

export default Header;