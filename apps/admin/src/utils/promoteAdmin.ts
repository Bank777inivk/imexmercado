import { auth, setDocument, getDocument, seedOrders } from "@imexmercado/firebase";

/**
 * Utility to promote the currently logged-in user to Admin.
 */
export async function promoteCurrentUser() {
  const user = auth.currentUser;
  if (!user) {
    console.error("Aucun utilisateur n'est actuellement connecté.");
    return;
  }

  try {
    const profile = await getDocument("users", user.uid);
    await setDocument("users", user.uid, {
      ...profile,
      role: 'admin'
    });
    console.log("Promotion réussie ! Vous êtes maintenant Administrateur.");
    window.location.reload();
  } catch (error) {
    console.error("Erreur lors de la promotion :", error);
  }
}

/**
 * Utility to seed sample orders.
 */
export async function seedDatabase() {
  console.log("Génération des données de test en cours...");
  try {
    await seedOrders();
    console.log("Base de données initialisée avec succès !");
    window.location.reload();
  } catch (error) {
    console.error("Erreur lors du seeding :", error);
  }
}

// Attach to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).promoteMe = promoteCurrentUser;
  (window as any).seedDatabase = seedDatabase;
}
