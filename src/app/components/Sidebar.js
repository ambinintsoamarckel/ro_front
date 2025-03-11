import { useState } from "react";
import { Menu, X, Home, User, Settings } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Bouton pour ouvrir le sidebar */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed top-4 left-4 p-2 text-white rounded z-50"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-4 
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 ease-in-out`}
      >
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-white p-2 mb-4"
        >
          <X />
        </button>
        
        <ul>
          <li className="flex items-center p-3 hover:bg-gray-700 rounded">
            <Home className="mr-2" /> Accueil
          </li>
          <li className="flex items-center p-3 hover:bg-gray-700 rounded">
            <User className="mr-2" /> Profil
          </li>
          <li className="flex items-center p-3 hover:bg-gray-700 rounded">
            <Settings className="mr-2" /> Paramètres
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
