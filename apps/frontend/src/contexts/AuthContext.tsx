import React, { createContext, useContext } from 'react';

type CurrentUser = {
  fullName: string;
  email: string;
  role: string;
};

type AuthContextValue = {
  user: CurrentUser;
  initials: string;
};

const defaultUser: CurrentUser = {
  fullName: 'Jennifer Smith',
  email: 'jennifer.smith@hospital.com',
  role: 'Administrator',
};

const computeInitials = (name: string): string => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0]!)
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const AuthContext = createContext<AuthContextValue>({
  user: defaultUser,
  initials: computeInitials(defaultUser.fullName),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In a real app, load from auth state / token
  const user = defaultUser;
  const initials = computeInitials(user.fullName);
  return (
    <AuthContext.Provider value={{ user, initials }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => useContext(AuthContext);


