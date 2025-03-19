"use client";

import { useState } from "react";
import { Menu, X ,Power} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/logout', { // Mets bien l'URL de ton backend
        method: 'POST',
        credentials: 'include', // Important pour inclure les cookies/session
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirection ou autre action après déconnexion
        window.location.href = '/login'; // Redirection vers la page d'accueil par exemple
      } else {
        const data = await response.json();
        alert(data.message || 'Erreur lors du logout');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  return (
    <header className="bg-gray-800 text-white fixed top-0 left-0 w-full shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        {/* Logo + Titre bien alignés */}
        <div className="flex items-center gap-x-4">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={50}  
            height={50} 
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-3xl font-bold">Ordonnancement des Tâches</h1>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:underline">Accueil</Link>
          <Link href="/profil" className="hover:underline">Profil</Link>
          <Link href="/parametres" className="hover:underline">Paramètres</Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className={`p-2 rounded-full shadow-md transition duration-300 bg-[#EDB640] text-white`}
          >
            <Power size={20} />
          </motion.button>
        </nav>

        {/* Bouton Menu Mobile */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <nav className="md:hidden bg-gray-700 p-4">
          <Link href="/" className="block py-2">Accueil</Link>
          <Link href="/profil" className="block py-2">Profil</Link>
          <Link href="/parametres" className="block py-2">Paramètres</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
