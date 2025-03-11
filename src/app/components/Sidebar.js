import { useState } from "react";
import { Menu, X, BadgePlus, User, Settings , HeartIcon} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Bouton pour ouvrir le sidebar */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed top-4 left-4 p-2 text-white rounded z-50"
      >
        {isOpen ? <X /> : <Menu size={30}/>}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-70 p-4 
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
          <li className="flex items-center p-3 hover:bg-gray-700 text-xl rounded mt-10 mb-5">
            <BadgePlus className="mr-2" size={25} /> Nouveau projet
          </li>
          <li className="flex items-center p-3 hover:bg-gray-700 text-xl rounded mt-10 mb-5">
            <User className="mr-2"size={25} /> Mon projet
          </li>
          <li className="flex items-center p-3 hover:bg-gray-700 text-xl rounded mt-10 mb-5">
            <HeartIcon className="mr-2"size={25} /> Favoris
          </li>
          <li className="flex items-center p-3 hover:bg-gray-700 text-xl rounded mt-10 mb-5">
            <Settings className="mr-2" /> Paramètres
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
