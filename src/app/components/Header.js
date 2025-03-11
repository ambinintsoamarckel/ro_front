import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white fixed top-0 left-0 w-full shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold mb-5">Ordonnancement des Tâches</h1>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:underline">Accueil</Link>
          <Link href="/profil" className="hover:underline">Profil</Link>
          <Link href="/parametres" className="hover:underline">Paramètres</Link>
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
        <nav className="md:hidden bg-blue-700 p-4">
          <Link href="/" className="block py-2">Accueil</Link>
          <Link href="/profil" className="block py-2">Profil</Link>
          <Link href="/parametres" className="block py-2">Paramètres</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
