"use client";
import React, { useEffect, useState } from 'react';

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
  }, [projects]); // Re-calculer quand les projets changent

  const StatCard = ({ icon, title, value, subtitle, progress, color = "from-slate-700 via-slate-600 to-slate-800" }) => (
    <div className="bg-white/98 backdrop-blur-sm border border-slate-200/50 shadow-sm shadow-slate-500/5 rounded-xl p-6 hover:shadow-md hover:shadow-slate-500/15 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center text-white text-xl shadow-md shadow-slate-500/20`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">{value}</div>
          <div className="text-sm text-slate-600">{subtitle}</div>
        </div>
      </div>
      <h3 className="text-slate-700 font-medium mb-3">{title}</h3>
      {progress !== undefined && (
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div 
            className={`bg-gradient-to-r ${color} h-2 rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      )}
    </div>
  );

  const QuickActionCard = ({ icon, title, description, color, onClick, badge }) => (
    <div 
      onClick={onClick}
      className={`${color.bg} ${color.hover} border ${color.border} rounded-xl p-6 cursor-pointer transition-all duration-300 ${color.shadow} hover:shadow-md ${color.hover.includes('shadow') ? color.hover : 'hover:shadow-slate-500/15'} group transform hover:scale-105 hover:-translate-y-1 relative`}
    >
      {badge && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {badge}
        </div>
      )}
      <div className={`w-12 h-12 ${color.iconBg} rounded-lg flex items-center justify-center ${color.iconColor} text-xl mb-4 group-hover:scale-105 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className={`${color.text} font-semibold mb-2`}>{title}</h3>
      <p className={`${color.text} opacity-80 text-sm`}>{description}</p>
    </div>
  );

  // Générer l'activité récente basée sur les projets et tâches
  const getRecentActivity = () => {
    const activities = [];
    
    if (projects.length > 0) {
      // Projets favoris récents
      const recentFavorites = projects.filter(p => p.isFavorite).slice(0, 2);
      recentFavorites.forEach(project => {
        const taskCount = project.tasks ? project.tasks.length : 0;
        activities.push({
          action: "Projet favori",
          name: `${project.name} (${taskCount} tâches)`,
          time: "Il y a 2h",
          icon: "⭐"
        });
      });

      // Projets avec type d'ordonnancement
      const successorProjects = projects.filter(p => p.isSuccessor).slice(0, 2);
      successorProjects.forEach(project => {
        activities.push({
          action: "Ordonnancement successeur",
          name: project.name,
          time: "Il y a 3h",
          icon: "🔄"
        });
      });

      // Projets avec le plus de tâches
      const projectsWithTasks = projects
        .filter(p => p.tasks && p.tasks.length > 0)
        .sort((a, b) => (b.tasks?.length || 0) - (a.tasks?.length || 0))
        .slice(0, 2);
      
      projectsWithTasks.forEach(project => {
        activities.push({
          action: "Projet actif",
          name: `${project.name} (${project.tasks.length} tâches)`,
          time: "Hier",
          icon: "📋"
        });
      });
    }

    // Activités par défaut si pas de projets
    if (activities.length === 0) {
      return [
        { action: "Bienvenue", name: "Créez votre premier projet", time: "Maintenant", icon: "👋" },
        { action: "Conseil", name: "Organisez vos tâches avec des dépendances", time: "Maintenant", icon: "💡" }
      ];
    }

    return activities.slice(0, 4); // Limiter à 4 activités
  };

  // Calculer les objectifs basés sur les données d'ordonnancement
  const getWeeklyGoals = () => {
    const totalProjects = projects.length;
    const totalTasks = animatedStats.totalTasks;
    const projectsWithTasks = projects.filter(p => p.tasks && p.tasks.length > 0).length;

    return [
      { 
        goal: `Créer ${Math.max(5, totalTasks + 3)} tâches`, 
        progress: Math.min(100, (totalTasks / Math.max(5, totalTasks + 3)) * 100), 
        color: "from-emerald-600 to-emerald-700" 
      },
      { 
        goal: "Définir les dépendances", 
        progress: animatedStats.dependencies > 0 ? Math.min(100, animatedStats.dependencies * 20) : 0, 
        color: "from-blue-600 to-blue-700" 
      },
      { 
        goal: "Organiser les projets", 
        progress: totalProjects > 0 ? Math.min(100, (projectsWithTasks / totalProjects) * 100) : 0, 
        color: "from-amber-600 to-amber-700" 
      },
      { 
        goal: "Optimiser l'ordonnancement", 
        progress: animatedStats.successorProjects > 0 ? Math.min(100, (animatedStats.successorProjects / Math.max(1, totalProjects)) * 100) : 0, 
        color: "from-purple-600 to-purple-700" 
      }
    ];
  };

  return (
    <div className={`w-full mx-auto p-8 shadow-xl rounded-2xl mt-10 transition-all duration-300 ease-in-out min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 ${isSecondSidebarOpen ? 'max-w-[1400px]' : 'max-w-[1600px]'}`}>
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/40 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-2">
                Gestionnaire d'Ordonnancement de Tâches
              </h1>
              <p className="text-slate-600">
                {projects.length > 0 
                  ? `${projects.length} projet${projects.length > 1 ? 's' : ''} • ${animatedStats.totalTasks} tâche${animatedStats.totalTasks > 1 ? 's' : ''} • ${animatedStats.dependencies} dépendance${animatedStats.dependencies > 1 ? 's' : ''}`
                  : "Créez votre premier projet pour commencer l'ordonnancement"
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-4 py-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Système actif</span>
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
            title="Total des tâches"
            value={animatedStats.totalTasks}
            subtitle="tâches créées"
            progress={Math.min(100, animatedStats.totalTasks * 5)}
            color="from-blue-600 to-blue-700"
          />
          <StatCard
            icon="🎯"
            title="Projets actifs"
            value={animatedStats.projects}
            subtitle={`${animatedStats.favorites} favoris`}
            progress={Math.min(100, animatedStats.projects * 15)}
            color="from-emerald-600 to-emerald-700"
          />
          <StatCard
            icon="🔗"
            title="Dépendances"
            value={animatedStats.dependencies}
            subtitle="relations définies"
            progress={Math.min(100, animatedStats.dependencies * 10)}
            color="from-purple-600 to-purple-700"
          />
          <StatCard
            icon="⏱️"
            title="Durée moyenne"
            value={`${animatedStats.avgDuration}j`}
            subtitle="par tâche"
            progress={Math.min(100, animatedStats.avgDuration * 10)}
            color="from-amber-600 to-amber-700"
          />
        </div>

        {/* Statistiques secondaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon="📈"
            title="Taux de complétion"
            value={`${animatedStats.completionRate}%`}
            subtitle="projets avec tâches"
            progress={animatedStats.completionRate}
            color="from-green-600 to-green-700"
          />
          <StatCard
            icon="🔄"
            title="Mode successeur"
            value={animatedStats.successorProjects}
            subtitle={`sur ${animatedStats.projects} projets`}
            progress={animatedStats.projects > 0 ? (animatedStats.successorProjects / animatedStats.projects) * 100 : 0}
            color="from-indigo-600 to-indigo-700"
          />
          <StatCard
            icon="⭐"
            title="Projets favoris"
            value={animatedStats.favorites}
            subtitle="marqués importants"
            progress={animatedStats.projects > 0 ? (animatedStats.favorites / animatedStats.projects) * 100 : 0}
            color="from-yellow-600 to-yellow-700"
          />
        </div>

        {/* Actions rapides */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-slate-700 mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <QuickActionCard
              icon="➕"
              title="Nouveau projet"
              description="Créer un projet d'ordonnancement"
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
              description="Gérer tous les projets"
              badge={animatedStats.projects > 0 ? animatedStats.projects : null}
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
              description="Projets prioritaires"
              badge={animatedStats.favorites > 0 ? animatedStats.favorites : null}
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
              icon="📊"
              title="Ordonnancement"
              description="Visualiser le planning"
              color={{
                bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
                hover: 'hover:from-blue-100 hover:to-indigo-100',
                border: 'border-blue-300/50',
                shadow: 'shadow-sm shadow-blue-500/10',
                iconBg: 'bg-gradient-to-r from-blue-100 to-indigo-100',
                iconColor: 'text-blue-700',
                text: 'text-blue-800'
              }}
              onClick={() => navigateTo('ordonnancement')}
            />
            <QuickActionCard
              icon="⚙️"
              title="Paramètres"
              description="Configuration système"
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

        {/* Section activité récente et objectifs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activité récente */}
          <div className="bg-white/98 backdrop-blur-sm border border-slate-200/50 shadow-sm shadow-slate-500/5 rounded-xl p-6">
            <h3 className="text-lg font-medium text-slate-700 mb-4">Activité récente</h3>
            <div className="space-y-4">
              {getRecentActivity().map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50/50 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-slate-100 to-gray-100 rounded-full flex items-center justify-center text-sm">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 font-medium text-sm">{item.action}</p>
                    <p className="text-slate-500 text-sm truncate">{item.name}</p>
                  </div>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
            {projects.length === 0 && (
              <div className="text-center py-4">
                <p className="text-slate-500 text-sm">Aucune activité pour le moment</p>
                <button 
                  onClick={() => navigateTo('nouveau')}
                  className="mt-2 text-slate-600 hover:text-slate-800 text-sm underline"
                >
                  Créer votre premier projet
                </button>
              </div>
            )}
          </div>

          {/* Objectifs de la semaine */}
          <div className="bg-white/98 backdrop-blur-sm border border-slate-200/50 shadow-sm shadow-slate-500/5 rounded-xl p-6">
            <h3 className="text-lg font-medium text-slate-700 mb-4">Objectifs de la semaine</h3>
            <div className="space-y-4">
              {getWeeklyGoals().map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">{item.goal}</span>
                    <span className="text-slate-500">{Math.round(item.progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.min(item.progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Résumé des projets si disponible */}
        {projects.length > 0 && (
          <div className="mt-8 bg-white/98 backdrop-blur-sm border border-slate-200/50 shadow-sm shadow-slate-500/5 rounded-xl p-6">
            <h3 className="text-lg font-medium text-slate-700 mb-4">Aperçu de vos projets d'ordonnancement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((project) => {
                const taskCount = project.tasks ? project.tasks.length : 0;
                const totalDuration = project.tasks ? project.tasks.reduce((sum, task) => sum + (task.duration || 0), 0) : 0;
                
                return (
                  <div key={project.id} className="bg-slate-50/50 rounded-lg p-4 hover:bg-slate-100/50 transition-colors duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-slate-700 truncate flex-1">{project.name}</h4>
                      <div className="flex space-x-1 ml-2">
                        {project.isFavorite && (
                          <span className="text-amber-500 text-sm">⭐</span>
                        )}
                        {project.isSuccessor && (
                          <span className="text-blue-500 text-sm">🔄</span>
                        )}
                      </div>
                    </div>
                    {project.description && (
                      <p className="text-slate-500 text-sm truncate mb-2">{project.description}</p>
                    )}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>{taskCount} tâche{taskCount > 1 ? 's' : ''}</span>
                        <span>{totalDuration} jour{totalDuration > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.isFavorite && (
                          <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded">Favori</span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${project.isSuccessor 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-100 text-purple-700'
                        }`}>
                          {project.isSuccessor ? 'Successeur' : 'Antérieur'}
                        </span>
                        {taskCount > 0 && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
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
              <div className="mt-4 text-center">
                <button 
                  onClick={() => navigateTo('projets')}
                  className="text-slate-600 hover:text-slate-800 text-sm underline"
                >
                  Voir tous les {projects.length} projets
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;