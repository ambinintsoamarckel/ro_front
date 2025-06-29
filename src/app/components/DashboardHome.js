"use client";
import React, { useEffect } from 'react';

const Dashboard = () => {
  const navigateTo = (section) => {
    console.log('Navigation vers:', section);
    // Ici vous pouvez ajouter la logique de navigation
    // Par exemple: router.push(`/${section}`);
  };

  useEffect(() => {
    // Animation des statistiques au chargement
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = width;
      }, 500);
    });

    // Animation des nombres
    const numbers = document.querySelectorAll('.stats-number');
    numbers.forEach(num => {
      const finalValue = parseInt(num.textContent);
      if (!isNaN(finalValue)) {
        let currentValue = 0;
        const increment = finalValue / 20;
        
        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= finalValue) {
            currentValue = finalValue;
            clearInterval(timer);
          }
          num.textContent = Math.floor(currentValue) + (num.textContent.includes('%') ? '%' : '');
        }, 50);
      }
    });
  }, []);

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: #333;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
          color: white;
        }

        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 300;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .header p {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 48px rgba(0,0,0,0.15);
        }

        .card-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          color: white;
        }

        .card h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .card p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .stats-number {
          font-size: 2rem;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .welcome-section {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }

        .welcome-section h2 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.8rem;
          font-weight: 300;
        }

        .welcome-section p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .quick-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .btn {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .floating-circle:nth-child(1) {
          width: 80px;
          height: 80px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-circle:nth-child(2) {
          width: 120px;
          height: 120px;
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .floating-circle:nth-child(3) {
          width: 60px;
          height: 60px;
          top: 80%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          
          .header h1 {
            font-size: 2rem;
          }
          
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .card {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="dashboard-body">
        <div className="floating-elements">
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
        </div>

        <div className="container">
          <div className="header">
            <h1>Bienvenue dans votre espace de travail</h1>
            <p>Organisez, planifiez et accomplissez vos objectifs avec élégance</p>
          </div>

          <div className="welcome-section">
            <h2>🎯 Tableau de bord personnel</h2>
            <p>Votre centre de contrôle pour une gestion intelligente des tâches. Suivez vos progrès, planifiez vos projets et restez productif avec notre interface intuitive.</p>
            
            <div className="quick-actions">
              <button className="btn" onClick={() => navigateTo('nouveau')}>➕ Nouvelle projet</button>
              <button className="btn" onClick={() => navigateTo('projets')}>📁 Mes projets</button>
              <button className="btn" onClick={() => navigateTo('favoris')}>⭐ Favoris</button>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <div className="card-icon">📋</div>
              <h3>Tâches du jour</h3>
              <div className="stats-number">8</div>
              <p>Tâches planifiées pour aujourd'hui</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '65%'}}></div>
              </div>
            </div>

            <div className="card">
              <div className="card-icon">🎯</div>
              <h3>Projets actifs</h3>
              <div className="stats-number">3</div>
              <p>Projets en cours de réalisation</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '80%'}}></div>
              </div>
            </div>

            <div className="card">
              <div className="card-icon">⏰</div>
              <h3>Productivité</h3>
              <div className="stats-number">92%</div>
              <p>Taux de completion cette semaine</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '92%'}}></div>
              </div>
            </div>

            <div className="card">
              <div className="card-icon">🔥</div>
              <h3>Série active</h3>
              <div className="stats-number">12</div>
              <p>Jours consécutifs d'accomplissement</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '75%'}}></div>
              </div>
            </div>

            <div className="card">
              <div className="card-icon">📈</div>
              <h3>Tendance mensuelle</h3>
              <p>Vos performances s'améliorent constamment. Continuez sur cette lancée pour atteindre vos objectifs !</p>
            </div>

            <div className="card">
              <div className="card-icon">💡</div>
              <h3>Astuce du jour</h3>
              <p>Organisez vos tâches par priorité pour maximiser votre efficacité. Commencez par le plus important !</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;