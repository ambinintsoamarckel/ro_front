import React, { useState, useEffect } from 'react';
import { User, Lock, Trash2, Eye, EyeOff, AlertTriangle, Check } from 'lucide-react';
import { colors } from '../colors'; // Ajustez le chemin selon votre structure

const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [user, setUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  // États pour les formulaires
  const [profileForm, setProfileForm] = useState({
    newUsername: '',
    password: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [deleteForm, setDeleteForm] = useState({
    password: ''
  });
  
  // États pour l'affichage des mots de passe
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    delete: false
  });
  
  // États pour les messages
  const [messages, setMessages] = useState({
    type: '', // 'success', 'error'
    text: ''
  });
  
  const [loading, setLoading] = useState(false);

  // Récupérer les informations utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3001/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          setProfileForm(prev => ({ ...prev, newUsername: userData.user.username }));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };
    
    fetchUser();
  }, []);

  // Fonction pour afficher les messages
  const showMessage = (type, text) => {
    setMessages({ type, text });
    setTimeout(() => setMessages({ type: '', text: '' }), 5000);
  };

  // Mise à jour du profil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.newUsername.trim() || !profileForm.password) {
      showMessage('error', 'Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          newUsername: profileForm.newUsername,
          password: profileForm.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        showMessage('success', 'Profil mis à jour avec succès');
        setShowEditProfile(false);
        setProfileForm(prev => ({ ...prev, password: '' }));
      } else {
        showMessage('error', data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      showMessage('error', 'Erreur de connexion au serveur');
    }
    setLoading(false);
  };

  // Changement de mot de passe
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showMessage('error', 'Veuillez remplir tous les champs');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/reset-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', 'Mot de passe mis à jour avec succès');
        setShowPasswordFields(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showMessage('error', data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      showMessage('error', 'Erreur de connexion au serveur');
    }
    setLoading(false);
  };

  // Suppression du compte
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deleteForm.password) {
      showMessage('error', 'Veuillez saisir votre mot de passe');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          password: deleteForm.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', 'Compte supprimé avec succès');
        // Redirection ou fermeture de l'application
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showMessage('error', data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      showMessage('error', 'Erreur de connexion au serveur');
    }
    setLoading(false);
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      showMessage('error', 'Erreur lors de la déconnexion');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="space-y-4">
      {/* Messages */}
      {messages.text && (
        <div
          className={`p-3 rounded-lg flex items-center space-x-2 ${
            messages.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {messages.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
          <span className="text-sm">{messages.text}</span>
        </div>
      )}

      {/* Navigation tabs */}
      <div className={`flex space-x-1 p-1 ${colors.background.overlay} rounded-lg`}>
        {[
          { id: 'account', label: 'Compte' },
          { id: 'security', label: 'Sécurité' },
          { id: 'danger', label: 'Danger' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? `${colors.primary.gradientButton} text-white shadow-sm`
                : `${colors.text.secondary} hover:${colors.background.card}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu des tabs */}
      <div className="space-y-4">
        {/* Tab Compte */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            {/* Informations utilisateur */}
            <div className={`${colors.background.card} rounded-lg p-4 ${colors.primary.border}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 ${colors.primary.gradient} rounded-xl flex items-center justify-center`}>
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold ${colors.text.primary}`}>{user?.username}</h4>
                  <p className={`text-sm ${colors.text.muted}`}>Utilisateur</p>
                </div>
              </div>
              
              {!showEditProfile ? (
                <button
                  onClick={() => setShowEditProfile(true)}
                  className={`w-full px-4 py-2 ${colors.buttons.edit.base} ${colors.buttons.edit.text} rounded-lg ${colors.buttons.edit.hover} transition-colors text-sm`}
                >
                  Modifier le profil
                </button>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-3">
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.secondary} mb-1`}>
                      Nouveau nom 
                    </label>
                    <input
                      type="text"
                      value={profileForm.newUsername}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, newUsername: e.target.value }))}
                      className={`w-full px-3 py-2 ${colors.background.overlay} ${colors.primary.border} rounded-lg ${colors.text.primary} text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50`}
                      placeholder="Nouveau nom d'utilisateur"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.secondary} mb-1`}>
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={profileForm.password}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, password: e.target.value }))}
                        className={`w-full px-3 py-2 pr-10 ${colors.background.overlay} ${colors.primary.border} rounded-lg ${colors.text.primary} text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50`}
                        placeholder="Mot de passe actuel"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colors.text.muted} hover:${colors.text.secondary}`}
                      >
                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 px-4 py-2 ${colors.buttons.save.gradient} text-white rounded-lg ${colors.buttons.save.hover} transition-colors text-sm disabled:opacity-50`}
                    >
                      {loading ? 'Mise à jour...' : 'Sauvegarder'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditProfile(false);
                        setProfileForm(prev => ({ ...prev, password: '' }));
                      }}
                      className={`px-4 py-2 ${colors.background.overlay} ${colors.text.secondary} rounded-lg hover:${colors.background.card} transition-colors text-sm`}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Déconnexion */}
            <div className={`${colors.background.card} rounded-lg p-4 ${colors.primary.border}`}>
              <h4 className={`font-semibold ${colors.text.secondary} mb-3 text-sm`}>Session</h4>
              <button
                onClick={handleLogout}
                className={`w-full px-4 py-2 ${colors.background.overlay} ${colors.text.secondary} rounded-lg hover:${colors.background.card} transition-colors text-sm`}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        )}

        {/* Tab Sécurité */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            {/* Changement de mot de passe */}
            <div className={`${colors.background.card} rounded-lg p-4 ${colors.primary.border}`}>
              <h4 className={`font-semibold ${colors.text.secondary} mb-3 text-sm flex items-center`}>
                <Lock size={16} className="mr-2" />
                Mot de passe
              </h4>
              
              {!showPasswordFields ? (
                <button
                  onClick={() => setShowPasswordFields(true)}
                  className={`w-full px-4 py-2 ${colors.buttons.edit.base} ${colors.buttons.edit.text} rounded-lg ${colors.buttons.edit.hover} transition-colors text-sm`}
                >
                  Changer le mot de passe
                </button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.secondary} mb-1`}>
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className={`w-full px-3 py-2 pr-10 ${colors.background.overlay} ${colors.primary.border} rounded-lg ${colors.text.primary} text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50`}
                        placeholder="Mot de passe actuel"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colors.text.muted} hover:${colors.text.secondary}`}
                      >
                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.secondary} mb-1`}>
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className={`w-full px-3 py-2 pr-10 ${colors.background.overlay} ${colors.primary.border} rounded-lg ${colors.text.primary} text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50`}
                        placeholder="Nouveau mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colors.text.muted} hover:${colors.text.secondary}`}
                      >
                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.secondary} mb-1`}>
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`w-full px-3 py-2 pr-10 ${colors.background.overlay} ${colors.primary.border} rounded-lg ${colors.text.primary} text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50`}
                        placeholder="Confirmer le mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colors.text.muted} hover:${colors.text.secondary}`}
                      >
                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 px-4 py-2 ${colors.buttons.save.gradient} text-white rounded-lg ${colors.buttons.save.hover} transition-colors text-sm disabled:opacity-50`}
                    >
                      {loading ? 'Mise à jour...' : 'Changer le mot de passe'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordFields(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className={`px-4 py-2 ${colors.background.overlay} ${colors.text.secondary} rounded-lg hover:${colors.background.card} transition-colors text-sm`}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Tab Zone dangereuse */}
        {activeTab === 'danger' && (
          <div className="space-y-4">
            {/* Zone dangereuse */}
            <div className={`${colors.background.card} rounded-lg p-4 border border-red-500/20`}>
              <h4 className={`font-semibold text-red-400 mb-3 text-sm flex items-center`}>
                <AlertTriangle size={16} className="mr-2" />
                Zone dangereuse
              </h4>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className={`w-full px-4 py-2 ${colors.buttons.delete.base} ${colors.buttons.delete.text} rounded-lg ${colors.buttons.delete.hover} transition-colors text-sm`}
                >
                  Supprimer le compte
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-xs mb-2">
                      ⚠️ Cette action est irréversible ! Toutes vos données seront définitivement supprimées.
                    </p>
                  </div>
                  
                  <form onSubmit={handleDeleteAccount} className="space-y-3">
                    <div>
                      <label className={`block text-sm font-medium ${colors.text.secondary} mb-1`}>
                        Confirmez avec votre mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.delete ? "text" : "password"}
                          value={deleteForm.password}
                          onChange={(e) => setDeleteForm(prev => ({ ...prev, password: e.target.value }))}
                          className={`w-full px-3 py-2 pr-10 ${colors.background.overlay} border border-red-500/30 rounded-lg ${colors.text.primary} text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                          placeholder="Votre mot de passe"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('delete')}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colors.text.muted} hover:${colors.text.secondary}`}
                        >
                          {showPasswords.delete ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm disabled:opacity-50 flex items-center justify-center`}
                      >
                        <Trash2 size={14} className="mr-2" />
                        {loading ? 'Suppression...' : 'Supprimer définitivement'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteForm({ password: '' });
                        }}
                        className={`px-4 py-2 ${colors.background.overlay} ${colors.text.secondary} rounded-lg hover:${colors.background.card} transition-colors text-sm`}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;