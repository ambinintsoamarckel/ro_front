// utils/auth.js
export async function checkAuthStatus() {
    try {
      const res = await fetch("http://localhost:3001/me", {
        credentials: "include",
      });
  
      if (res.ok) {
        return await res.json(); // L'utilisateur est connecté
      } else {
        return null; // Pas connecté
      }
    } catch (error) {
      console.error("Erreur d'authentification :", error);
      return null;
    }
  }
  