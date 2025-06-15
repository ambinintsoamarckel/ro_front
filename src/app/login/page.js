"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, Eye, EyeOff, Loader2, Sparkles, Shield, ArrowRight } from "lucide-react";
import { colors } from "../colors"; // adapte le chemin si nécessaire


export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFormValid, setIsFormValid] = useState(false);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setIsFormValid(username.length > 0 && password.length > 0);
  }, [username, password]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      
    } catch (error) {
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
      {hasMounted && [...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${10 + Math.random() * 20}s`
          }}
        />
      ))}

      </div>

      {/* Dynamic gradient orbs */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse-slow"
        style={{
          left: mousePosition.x / 10,
          top: mousePosition.y / 10,
        }}
      />
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 rounded-full blur-3xl animate-bounce-slow" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-spin-slow" />

      {/* Main card container */}
      <div className="w-full max-w-md relative z-10 group">
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-1000 animate-pulse-glow" />
        
        {/* Card */}
        <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden transform transition-all duration-700 hover:scale-[1.02] animate-slide-up">
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent animate-border-flow" />
          </div>

          {/* Success overlay */}
          {isSuccess && (
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/90 to-emerald-500/90 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50 animate-success-overlay">
              <div className="text-center text-white animate-bounce-in">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield size={32} className="animate-check-mark" />
                </div>
                <h3 className="text-xl font-bold mb-2">Connexion réussie !</h3>
                <p className="text-sm opacity-90">Redirection en cours...</p>
              </div>
            </div>
          )}

          {/* Header section */}
          <div className="relative p-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            
            {/* Logo container */}
            <div className="relative mb-6 group/logo">
              <div className="w-24 h-24 mx-auto relative">
                {/* Rotating rings */}
                <div className="absolute inset-0 border-2 border-blue-400/30 rounded-full animate-spin-slow" />
                <div className="absolute inset-2 border-2 border-purple-400/40 rounded-full animate-spin-reverse" />
                <div className="absolute inset-4 border border-pink-400/50 rounded-full animate-pulse" />
                
                {/* Logo */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center transform group-hover/logo:scale-110 transition-transform duration-500">
                  <div className="relative">
                    <Image 
                      src="/logo.png" 
                      alt="Logo" 
                      width={40}  
                      height={40} 
                      className="w-10 h-10 object-contain relative z-10"
                    />
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-twinkle" />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-text-glow">
              Bienvenue
            </h1>
            <p className="text-white/70 text-sm font-medium tracking-wide">
              Accédez à votre espace sécurisé
            </p>
          </div>

          {/* Form section */}
          <form onSubmit={handleLogin} className="px-8 pb-8 space-y-6">
            
            {/* Username field */}
            <div className="relative group/input">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-focus-within/input:opacity-100 transition-all duration-500 blur-sm" />
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/50 group-focus-within/input:text-blue-400 transition-all duration-300">
                  <User size={20} className="transform group-focus-within/input:scale-110 transition-transform duration-300" />
                </div>
                
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  className="block w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading || isSuccess}
                />
                
                {/* Progress indicator */}
                {username && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            {/* Password field */}
            <div className="relative group/input">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-focus-within/input:opacity-100 transition-all duration-500 blur-sm" />
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/50 group-focus-within/input:text-purple-400 transition-all duration-300">
                  <Lock size={20} className="transform group-focus-within/input:scale-110 transition-transform duration-300" />
                </div>
                
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  className="block w-full pl-12 pr-14 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isSuccess}
                />
                
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white/80 transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                  disabled={isLoading || isSuccess}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                
                {/* Progress indicator */}
                {password && (
                  <div className="absolute inset-y-0 right-12 pr-4 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="relative animate-error-shake">
                <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-sm" />
                <div className="relative bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4 text-center">
                  <p className="text-red-300 text-sm font-medium">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Submit button */}
            <div className="relative group/button">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover/button:opacity-100 transition-opacity duration-300" />
              
              <button
                type="submit"
                className={`relative w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-500 overflow-hidden ${
                  isFormValid && !isLoading && !isSuccess
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl"
                    : "bg-gray-600/50 cursor-not-allowed"
                }`}
                disabled={!isFormValid || isLoading || isSuccess}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000" />
                
                <div className="relative flex items-center justify-center">
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin mr-3" size={20} />
                      <span className="animate-pulse">Connexion en cours...</span>
                    </div>
                  ) : isSuccess ? (
                    <div className="flex items-center text-green-300">
                      <Shield className="mr-2 animate-bounce" size={20} />
                      Connecté !
                    </div>
                  ) : (
                    <div className="flex items-center group-hover/button:translate-x-1 transition-transform duration-300">
                      Se connecter
                      <ArrowRight className="ml-2 transform group-hover/button:translate-x-1 transition-transform duration-300" size={20} />
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Register link */}
            <div className="text-center pt-4">
              <p className="text-white/60 text-sm">
                Pas de compte ?{" "}
                <a 
                  href="/register" 
                  className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-all duration-300 transform hover:scale-105 inline-block"
                >
                  Créer un compte
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(50px) rotateX(20deg); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) rotateX(0deg); 
          }
        }
        
        @keyframes border-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes success-overlay {
          0% { 
            opacity: 0; 
            transform: scale(1.2); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes bounce-in {
          0% { 
            opacity: 0; 
            transform: scale(0.3); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.1); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes check-mark {
          0% { 
            transform: rotate(-45deg) scale(0); 
          }
          100% { 
            transform: rotate(0deg) scale(1); 
          }
        }
        
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(147, 197, 253, 0.3); }
          50% { text-shadow: 0 0 40px rgba(147, 197, 253, 0.6), 0 0 60px rgba(196, 181, 253, 0.4); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        
        @keyframes error-shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        
        .animate-float { animation: float 20s infinite linear; }
        .animate-pulse-slow { animation: pulse-slow 4s infinite; }
        .animate-bounce-slow { animation: bounce-slow 6s infinite; }
        .animate-spin-slow { animation: spin-slow 20s infinite linear; }
        .animate-spin-reverse { animation: spin-reverse 15s infinite linear; }
        .animate-pulse-glow { animation: pulse-glow 3s infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-border-flow { animation: border-flow 3s infinite; }
        .animate-success-overlay { animation: success-overlay 0.5s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
        .animate-check-mark { animation: check-mark 0.5s ease-out; }
        .animate-text-glow { animation: text-glow 3s infinite; }
        .animate-twinkle { animation: twinkle 2s infinite; }
        .animate-error-shake { animation: error-shake 0.6s ease-in-out; }
      `}</style>
    </div>
  );
}