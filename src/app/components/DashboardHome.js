"use client";
import React, { useEffect, useState } from 'react';
import { colors } from '../colors';

const Dashboard = ({ 
  projects = [],
  secondSidebarOpen,
  setSecondSidebarOpen,
  secondSidebarContent,
  isSecondSidebarOpen,
  setSecondSidebarContent,
  isModalOpen,
  setIsModalOpen
}) => {
  const [animatedStats, setAnimatedStats] = useState({
    totalTasks: 0,
    projects: 0,
    completionRate: 0,
    avgDuration: 0,
    favorites: 0,
    successorProjects: 0,
    dependencies: 0
  });

  // Calculer les statistiques dynamiques basées sur les données réelles
  const calculateStats = () => {
    const totalProjects = projects.length;
    const favoritesCount = projects.filter(project => project.isFavorite).length;
    const successorProjectsCount = projects.filter(project => project.isSuccessor).length;
    
    // Calculer le total des tâches
    const totalTasks = projects.reduce((sum, project) => {
      return sum + (project.tasks ? project.tasks.length : 0);
    }, 0);
    
    // Calculer la durée moyenne des tâches
    const allTasks = projects.flatMap(project => project.tasks || []);
    const avgDuration = allTasks.length > 0 
      ? Math.round(allTasks.reduce((sum, task) => sum + (task.duration || 0), 0) / allTasks.length)
      : 0;
    
    // Calculer le nombre total de dépendances
    const totalDependencies = allTasks.reduce((sum, task) => {
      return sum + (task.dependencies ? task.dependencies.length : 0);
    }, 0);
    
    // Taux de complétion basé sur les projets avec tâches vs projets sans tâches
    const projectsWithTasks = projects.filter(project => project.tasks && project.tasks.length > 0).length;
    const completionRate = totalProjects > 0 ? Math.round((projectsWithTasks / totalProjects) * 100) : 0;
    
    return {
      totalTasks: totalTasks,
      projects: totalProjects,
      completionRate: completionRate,
      avgDuration: avgDuration,
      favorites: favoritesCount,
      successorProjects: successorProjectsCount,
      dependencies: totalDependencies
    };
  };

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
      case 'ordonnancement':
        setSecondSidebarContent('ordonnancement');
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
    // Calculer les statistiques cibles basées sur les données réelles
    const targetStats = calculateStats();
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        totalTasks: Math.floor(targetStats.totalTasks * progress),
        projects: Math.floor(targetStats.projects * progress),
        completionRate: Math.floor(targetStats.completionRate * progress),
        avgDuration: Math.floor(targetStats.avgDuration * progress),
        favorites: Math.floor(targetStats.favorites * progress),
        successorProjects: Math.floor(targetStats.successorProjects * progress),
        dependencies: Math.floor(targetStats.dependencies * progress)
      });

      if (currentStep >= steps) {
        setAnimatedStats(targetStats);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [projects]);

  const StatCard = ({ icon, title, value, subtitle, progress, gradientColor = "from-slate-700 via-slate-600 to-slate-800" }) => (
    <div className={`${colors.background.card} rounded-xl p-6 ${colors.effects.glowHover} transition-all duration-300 group relative overflow-hidden`}>
      {/* Effet de brillance subtil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${gradientColor} rounded-lg flex items-center justify-center text-white text-xl shadow-md shadow-slate-500/20 group-hover:scale-105 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${colors.text.primary} group-hover:scale-105 transition-transform duration-300`}>
            {value}
          </div>
          <div className={`text-sm ${colors.text.secondary}`}>{subtitle}</div>
        </div>
      </div>
      <h3 className={`${colors.text.primary} font-medium mb-3`}>{title}</h3>
      {progress !== undefined && (
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className={`bg-gradient-to-r ${gradientColor} h-2 rounded-full transition-all duration-1000 ease-out relative`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );

  const QuickActionCard = ({ icon, title, description, colorKey, onClick, badge }) => {
    const colorConfig = colors.sidebar.items[colorKey] || colors.sidebar.items.menu;
    
    return (
      <div 
        onClick={onClick}
        className={`${colorConfig.bg} ${colorConfig.hover} border ${colors.primary.border} rounded-xl p-6 cursor-pointer transition-all duration-300 ${colorConfig.shadow} group transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden`}
      >
        {/* Badge de notification */}
        {badge && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md shadow-red-500/20 animate-pulse">
            {badge}
          </div>
        )}
        
        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        
        <div className={`w-12 h-12 ${colors.primary.gradientButton} rounded-lg flex items-center justify-center text-white text-xl mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md shadow-slate-500/20`}>
          {icon}
        </div>
        <h3 className={`${colorConfig.icon} font-semibold mb-2 group-hover:font-bold transition-all duration-200`}>
          {title}
        </h3>
        <p className={`${colors.text.secondary} text-sm group-hover:${colors.text.primary} transition-colors duration-200`}>
          {description}
        </p>
      </div>
    );
  };

  return (
    <div className={`w-full mx-auto p-8 shadow-xl rounded-2xl mt-10 transition-all duration-300 ease-in-out min-h-screen ${colors.background.main} ${isSecondSidebarOpen ? 'max-w-[1400px]' : 'max-w-[1600px]'}`}>
      {/* Header Premium */}
      <div className={`${colors.background.header} px-6 py-8 relative overflow-hidden`}>
        {/* Effet de fond animé */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-transparent to-slate-500/5 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-light ${colors.text.gradient} mb-2 tracking-wide`}>
                Gestionnaire d'Ordonnancement de Tâches
              </h1>
              <p className={`${colors.text.secondary} flex items-center space-x-2`}>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>
                  {projects.length > 0 
                    ? `${projects.length} projet${projects.length > 1 ? 's' : ''} • ${animatedStats.totalTasks} tâche${animatedStats.totalTasks > 1 ? 's' : ''} • ${animatedStats.dependencies} dépendance${animatedStats.dependencies > 1 ? 's' : ''}`
                    : "Créez votre premier projet pour commencer l'ordonnancement"
                  }
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`${colors.background.input} border ${colors.primary.border} rounded-lg px-4 py-2 flex items-center space-x-2 ${colors.effects.glow}`}>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className={`text-sm ${colors.text.secondary}`}>Système actif</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistiques principales avec design premium */}
        <div className="mb-8">
          <h2 className={`text-xl font-medium ${colors.text.primary} mb-6 flex items-center`}>
            <span className="w-1 h-6 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full mr-3"></span>
            Tableau de bord analytique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon="📋"
              title="Total des tâches"
              value={animatedStats.totalTasks}
              subtitle="tâches créées"
              progress={Math.min(100, animatedStats.totalTasks * 5)}
              gradientColor="from-blue-600 to-blue-700"
            />
            <StatCard
              icon="🎯"
              title="Projets actifs"
              value={animatedStats.projects}
              subtitle={`${animatedStats.favorites} favoris`}
              progress={Math.min(100, animatedStats.projects * 15)}
              gradientColor="from-emerald-600 to-emerald-700"
            />
            <StatCard
              icon="🔗"
              title="Dépendances"
              value={animatedStats.dependencies}
              subtitle="relations définies"
              progress={Math.min(100, animatedStats.dependencies * 10)}
              gradientColor="from-purple-600 to-purple-700"
            />
            <StatCard
              icon="⏱️"
              title="Durée moyenne"
              value={`${animatedStats.avgDuration}j`}
              subtitle="par tâche"
              progress={Math.min(100, animatedStats.avgDuration * 10)}
              gradientColor="from-amber-600 to-amber-700"
            />
          </div>
        </div>

        {/* Statistiques secondaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon="📈"
            title="Taux de complétion"
            value={`${animatedStats.completionRate}%`}
            subtitle="projets avec tâches"
            progress={animatedStats.completionRate}
            gradientColor="from-green-600 to-green-700"
          />
          <StatCard
            icon="🔄"
            title="Mode successeur"
            value={animatedStats.successorProjects}
            subtitle={`sur ${animatedStats.projects} projets`}
            progress={animatedStats.projects > 0 ? (animatedStats.successorProjects / animatedStats.projects) * 100 : 0}
            gradientColor="from-indigo-600 to-indigo-700"
          />
          <StatCard
            icon="⭐"
            title="Projets favoris"
            value={animatedStats.favorites}
            subtitle="marqués importants"
            progress={animatedStats.projects > 0 ? (animatedStats.favorites / animatedStats.projects) * 100 : 0}
            gradientColor="from-yellow-600 to-yellow-700"
          />
        </div>

        {/* Actions rapides avec design sophistiqué */}
        <div className="mb-8">
          <h2 className={`text-xl font-medium ${colors.text.primary} mb-6 flex items-center`}>
            <span className="w-1 h-6 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full mr-3"></span>
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              icon="➕"
              title="Nouveau projet"
              description="Créer un projet d'ordonnancement"
              colorKey="nouveau"
              onClick={() => navigateTo('nouveau')}
            />
            <QuickActionCard
              icon="📁"
              title="Mes projets"
              description="Gérer tous les projets"
              colorKey="projects"
              onClick={() => navigateTo('projets')}
            />
            <QuickActionCard
              icon="⭐"
              title="Favoris"
              description="Projets prioritaires"
              colorKey="favoris"
              onClick={() => navigateTo('favoris')}
            />
            <QuickActionCard
              icon="⚙️"
              title="Paramètres"
              description="Configuration système"
              colorKey="parametres"
              onClick={() => navigateTo('parametres')}
            />
          </div>
        </div>

        {/* Résumé des projets avec design premium */}
        {projects.length > 0 && (
          <div className={`mt-8 ${colors.background.card} rounded-xl p-6 relative overflow-hidden`}>
            {/* Effet de fond décoratif */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
            
            <div className="relative z-10">
              <h3 className={`text-lg font-medium ${colors.text.primary} mb-4 flex items-center`}>
                <span className="w-1 h-5 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full mr-3"></span>
                Aperçu de vos projets d'ordonnancement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(0, 6).map((project, index) => {
                  const taskCount = project.tasks ? project.tasks.length : 0;
                  const totalDuration = project.tasks ? project.tasks.reduce((sum, task) => sum + (task.duration || 0), 0) : 0;
                  const colorIndex = index % colors.projects.colors.length;
                  
                  return (
                    <div 
                      key={project.id} 
                      className={`bg-gradient-to-br from-slate-50/80 to-slate-100/40 rounded-lg p-4 hover:from-slate-100/80 hover:to-slate-200/40 transition-all duration-300 border border-slate-200/50 hover:border-slate-300/50 ${colors.effects.glowHover} group relative overflow-hidden`}
                    >
                      {/* Accent coloré */}
                      <div className={`absolute top-0 left-0 w-1 h-full ${colors.projects.colors[colorIndex]} rounded-l-lg`}></div>
                      
                      <div className="flex items-start justify-between mb-2 pl-3">
                        <h4 className={`font-medium ${colors.text.primary} truncate flex-1 group-hover:font-semibold transition-all duration-200`}>
                          {project.name}
                        </h4>
                        <div className="flex space-x-1 ml-2">
                          {project.isFavorite && (
                            <span className="text-amber-500 text-sm animate-pulse">⭐</span>
                          )}
                          {project.isSuccessor && (
                            <span className="text-blue-500 text-sm">🔄</span>
                          )}
                        </div>
                      </div>
                      
                      {project.description && (
                        <p className={`${colors.text.secondary} text-sm truncate mb-2 pl-3`}>
                          {project.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 pl-3">
                        <div className={`flex justify-between text-xs ${colors.text.secondary}`}>
                          <span>{taskCount} tâche{taskCount > 1 ? 's' : ''}</span>
                          <span>{totalDuration} jour{totalDuration > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {project.isFavorite && (
                            <span className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                              Favori
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${project.isSuccessor 
                            ? 'bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700' 
                            : 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700'
                          }`}>
                            {project.isSuccessor ? 'Successeur' : 'Antérieur'}
                          </span>
                          {taskCount > 0 && (
                            <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                              {taskCount} tâches
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {projects.length > 6 && (
                <div className="mt-6 text-center">
                  <button 
                    onClick={() => navigateTo('projets')}
                    className={`${colors.primary.gradientButton} ${colors.primary.gradientHover} text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md shadow-slate-500/20 hover:shadow-lg hover:shadow-slate-500/25 transform hover:scale-105`}
                  >
                    Voir tous les {projects.length} projets
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;