"use client";
import React, { useEffect, useState } from 'react';

const Dashboard = ({ secondSidebarOpen,setSecondSidebarOpen,secondSidebarContent,setSecondSidebarContent,isModalOpen,setIsModalOpen
}) => {
  const [animatedStats, setAnimatedStats] = useState({
    tasks: 0,
    projects: 0,
    productivity: 0,
    streak: 0
  });

  const navigateTo = (section) => {
    console.log('Navigation vers:', section);
    
    switch(section) {
      case 'nouveau':
          setIsModalOpen(true);       
        break;
      case 'projets':

          setSecondSidebarContent('projects');
          setSecondSidebarOpen(true);
        
        break;
      case 'favoris':
    
          setSecondSidebarContent('favoris');
          setSecondSidebarOpen(true);
        
        break;
      case 'parametres':

          setSecondSidebarContent('parametres');
          setSecondSidebarOpen(true);
        
        break;
      default:
        console.log('Action non définie pour:', section);
    }
  };

  useEffect(() => {
    // Animation des statistiques
    const targetStats = { tasks: 8, projects: 3, productivity: 92, streak: 12 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        tasks: Math.floor(targetStats.tasks * progress),
        projects: Math.floor(targetStats.projects * progress),
        productivity: Math.floor(targetStats.productivity * progress),
        streak: Math.floor(targetStats.streak * progress)
      });

      if (currentStep >= steps) {
        setAnimatedStats(targetStats);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const StatCard = ({ icon, title, value, subtitle, progress }) => (
    <div className="bg-white/98 backdrop-blur-sm border border-slate-200/50 shadow-sm shadow-slate-500/5 rounded-xl p-6 hover:shadow-md hover:shadow-slate-500/15 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 rounded-lg flex items-center justify-center text-white text-xl shadow-md shadow-slate-500/20">
          {icon}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">{value}</div>
          <div className="text-sm text-slate-600">{subtitle}</div>
        </div>
      </div>
      <h3 className="text-slate-700 font-medium mb-3">{title}</h3>
      {progress && (
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );

  const QuickActionCard = ({ icon, title, description, color, onClick }) => (
    <div 
      onClick={onClick}
      className={`${color.bg} ${color.hover} border ${color.border} rounded-xl p-6 cursor-pointer transition-all duration-300 ${color.shadow} hover:shadow-md ${color.hover.includes('shadow') ? color.hover : 'hover:shadow-slate-500/15'} group transform hover:scale-105 hover:-translate-y-1`}
    >
      <div className={`w-12 h-12 ${color.iconBg} rounded-lg flex items-center justify-center ${color.iconColor} text-xl mb-4 group-hover:scale-105 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className={`${color.text} font-semibold mb-2`}>{title}</h3>
      <p className={`${color.text} opacity-80 text-sm`}>{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/40 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-2">
              Bienvenue dans votre espace de travail
              </h1>
              <p className="text-slate-600">Organisez, planifiez et accomplissez vos projets en ordre ...</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-4 py-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-slate-600">En ligne</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="📋"
            title="Tâches du jour"
            value={animatedStats.tasks}
            subtitle="en cours"
            progress={65}
          />
          <StatCard
            icon="🎯"
            title="Projets actifs"
            value={animatedStats.projects}
            subtitle="projets"
            progress={80}
          />
          <StatCard
            icon="📈"
            title="Productivité"
            value={`${animatedStats.productivity}%`}
            subtitle="cette semaine"
            progress={animatedStats.productivity}
          />
          <StatCard
            icon="🔥"
            title="Série active"
            value={animatedStats.streak}
            subtitle="jours"
            progress={75}
          />
        </div>

        {/* Actions rapides */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-slate-700 mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              icon="➕"
              title="Nouveau projet"
              description="Créer un nouveau projet"
              color={{
                bg: 'bg-gradient-to-r from-slate-50 to-gray-50',
                hover: 'hover:from-slate-100 hover:to-gray-100',
                border: 'border-slate-200/50',
                shadow: 'shadow-sm shadow-slate-500/10',
                iconBg: 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800',
                iconColor: 'text-white',
                text: 'text-slate-700'
              }}
              onClick={() => navigateTo('nouveau')}
            />
            <QuickActionCard
              icon="📁"
              title="Mes projets"
              description="Voir tous les projets"
              color={{
                bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
                hover: 'hover:from-emerald-100 hover:to-teal-100',
                border: 'border-emerald-300/50',
                shadow: 'shadow-sm shadow-emerald-500/10',
                iconBg: 'bg-gradient-to-r from-emerald-100 to-teal-100',
                iconColor: 'text-emerald-700',
                text: 'text-emerald-800'
              }}
              onClick={() => navigateTo('projets')}
            />
            <QuickActionCard
              icon="⭐"
              title="Favoris"
              description="Éléments favoris"
              color={{
                bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
                hover: 'hover:from-amber-100 hover:to-yellow-100',
                border: 'border-amber-300/50',
                shadow: 'shadow-sm shadow-amber-500/10',
                iconBg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
                iconColor: 'text-amber-700',
                text: 'text-amber-800'
              }}
              onClick={() => navigateTo('favoris')}
            />
            <QuickActionCard
              icon="⚙️"
              title="Paramètres"
              description="Configuration"
              color={{
                bg: 'bg-gradient-to-r from-violet-50 to-purple-50',
                hover: 'hover:from-violet-100 hover:to-purple-100',
                border: 'border-violet-300/50',
                shadow: 'shadow-sm shadow-violet-500/10',
                iconBg: 'bg-gradient-to-r from-violet-100 to-purple-100',
                iconColor: 'text-violet-700',
                text: 'text-violet-800'
              }}
              onClick={() => navigateTo('parametres')}
            />
          </div>
        </div>

        {/* Section activité récente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activité récente */}
          <div className="bg-white/98 backdrop-blur-sm border border-slate-200/50 shadow-sm shadow-slate-500/5 rounded-xl p-6">
            <h3 className="text-lg font-medium text-slate-700 mb-4">Activité récente</h3>
            <div className="space-y-4">
              {[
                { action: "Projet terminé", name: "Site web personnel", time: "Il y a 2h", icon: "✅" },
                { action: "Nouvelle tâche", name: "Révision du code", time: "Il y a 4h", icon: "📝" },
                { action: "Mise à jour", name: "Dashboard design", time: "Hier", icon: "🔄" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50/50 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-slate-100 to-gray-100 rounded-full flex items-center justify-center text-sm">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 font-medium text-sm">{item.action}</p>
                    <p className="text-slate-500 text-sm">{item.name}</p>
                  </div>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Aperçu des objectifs */}
          <div className="bg-white/98 backdrop-blur-sm border border-slate-200/50 shadow-sm shadow-slate-500/5 rounded-xl p-6">
            <h3 className="text-lg font-medium text-slate-700 mb-4">Objectifs de la semaine</h3>
            <div className="space-y-4">
              {[
                { goal: "Finaliser 3 projets", progress: 66, color: "from-emerald-600 to-emerald-700" },
                { goal: "Code review quotidien", progress: 85, color: "from-blue-600 to-blue-700" },
                { goal: "Documentation", progress: 45, color: "from-amber-600 to-amber-700" }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">{item.goal}</span>
                    <span className="text-slate-500">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;