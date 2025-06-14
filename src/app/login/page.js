"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
  
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Identifiants incorrects");
        return;
      }
      
      setErrorMessage("");
      
      // Petit délai pour montrer le succès avant la redirection
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
      
    } catch (error) {
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 lg:p-8 bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md transform transition-all duration-500 ease-out animate-fade-in-up">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
          
          {/* Header avec logo */}
          <div className="p-8 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-6 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={48}  
                    height={48} 
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bienvenue
              </h1>
              <p className="text-gray-600 text-sm">Connectez-vous à votre compte</p>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleLogin} className="px-8 pb-8 space-y-6">
            
            {/* Champ nom d'utilisateur */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                className="block w-full pl-12 pr-4 py-4 border-2 text-sm rounded-xl focus:ring-0 focus:outline-none transition-all duration-300 bg-gray-50/50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white placeholder-gray-400 hover:border-gray-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/10 group-focus-within:to-purple-500/10 pointer-events-none transition-all duration-300"></div>
            </div>

            {/* Champ mot de passe */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                <Lock size={20}/>
              </div>
              <input
                type={showPassword ? "text" : "password"} 
                placeholder="Mot de passe"
                className="block w-full pl-12 pr-14 py-4 border-2 text-sm rounded-xl focus:ring-0 focus:outline-none transition-all duration-300 bg-gray-50/50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white placeholder-gray-400 hover:border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/10 group-focus-within:to-purple-500/10 pointer-events-none transition-all duration-300"></div>
            </div>

            {/* Message d'erreur avec animation */}
            {errorMessage && (
              <div className="relative">
                <div className="text-red-500 text-sm text-center p-3 bg-red-50 border border-red-200 rounded-xl animate-shake">
                  <div className="font-medium">{errorMessage}</div>
                </div>
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              className={`w-full py-4 px-6 text-white rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                username && password && !isLoading
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!username || !password || isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </div>
            </button>

            {/* Lien d'inscription */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Pas de compte ?{" "}
                <a 
                  href="/register" 
                  className="text-blue-500 hover:text-blue-600 font-medium hover:underline transition-all duration-200"
                >
                  Créer un compte
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}