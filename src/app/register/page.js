"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 

  const togglePassword = () => setShowPassword(!showPassword);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const signupResponse = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Important pour garder la session active
      });
  
      if (!signupResponse.ok) {
        const errorData = await signupResponse.json();
        setErrorMessage(errorData.message || "Erreur lors de l'inscription");
        return;
      }
  
      setErrorMessage("");
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
    }
  };
  
  

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-md transform transition-all duration-300 ease-in-out bg-[#F3F5FA] rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl">
        <div className="p-8 text-center">
          <div className="relative w-24 h-24 mx-auto mb-4 transform hover:scale-105 transition-transform duration-300">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={24}  
              height={24} 
              className="mx-auto w-24 h-auto mb-4"
            />
          </div>
          <h1 className="text-3xl font-black mb-2 text-gray-800 tracking-tight">Créer un compte</h1>
        </div>
          <form
            onSubmit={handleRegister}
            className="px-8 pb-8 space-y-6"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                className="block w-full pl-10 pr-4 py-3 border text-sm rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600 ">
                <Lock size={20}/>
              </div>
              <input
                type="password"
                placeholder="Mot de passe"
                className="block w-full pl-10 pr-12 py-3 border text-sm rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className={"absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Message d'erreur */}
            {errorMessage && (
              <div className="text-red-500 text-sm text-center animate-shake">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 px-4 text-white rounded-lg font-medium transition-all duration-300 ${
                username && password
                  ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }transform hover:scale-[1.02] active:scale-[0.98]`}
              disabled={!username || !password}
            >
              S'inscrire
            </button>
            <p className="mt-4 text-center text-sm">
              Déjà un compte ?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Se connecter
              </a>
            </p>
          </form>
      </div>
    </div>
  );
}
