import { User } from '../types';
import { StorageService, DEMO_USER } from './storageService';

const SESSION_KEY = 'personalized_trip_planner_current_user';

// Simple deterministic string hash for demo/academic verification
export function mockHashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}_${password.length}`;
}

export const AuthService = {
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) {
        return null;
      }
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const users = StorageService.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'No account registered with this email address.' };
    }

    // Check either mock hash or demo user password
    if (password === 'Password@123' || found.password_hash === mockHashPassword(password)) {
      this.setCurrentUser(found);
      return { success: true, user: found };
    }

    return { success: false, error: 'Incorrect password. Please try again.' };
  },

  register(
    fullName: string,
    email: string,
    password: string
  ): { success: boolean; user?: User; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, error: 'All fields are required.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const users = StorageService.getUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists. Please login instead.' };
    }

    const newUser: User = {
      user_id: `user-${Date.now()}`,
      full_name: cleanName,
      email: cleanEmail,
      password_hash: mockHashPassword(password),
      created_at: new Date().toISOString(),
    };

    StorageService.saveUser(newUser);
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  updateProfile(fullName: string): { success: boolean; user?: User; error?: string } {
    const current = this.getCurrentUser();
    if (!current) return { success: false, error: 'Not logged in.' };

    const updated: User = {
      ...current,
      full_name: fullName.trim(),
    };

    StorageService.saveUser(updated);
    this.setCurrentUser(updated);
    return { success: true, user: updated };
  },

  changePassword(oldPassword: string, newPassword: string): { success: boolean; error?: string } {
    const current = this.getCurrentUser();
    if (!current) return { success: false, error: 'Not logged in.' };

    // Validate old password
    const isOldValid =
      oldPassword === 'Password@123' || current.password_hash === mockHashPassword(oldPassword);
    if (!isOldValid) {
      return { success: false, error: 'Current password does not match.' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    const updated: User = {
      ...current,
      password_hash: mockHashPassword(newPassword),
    };

    StorageService.saveUser(updated);
    this.setCurrentUser(updated);
    return { success: true };
  },

  logout(): void {
    this.setCurrentUser(null);
  },
};
