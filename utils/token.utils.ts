const TOKEN_KEY = 'mbiyo_auth_token';

/**
 * Récupère le token d'authentification enregistré.
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Enregistre le token d'authentification.
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Supprime le token d'authentification.
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Vérifie si un token est présent.
 */
export function hasToken(): boolean {
  return !!getToken();
}
