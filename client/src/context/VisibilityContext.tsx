import React, { createContext, useContext, useState, ReactNode } from "react";

const VisibilityContext = createContext<any>(null);

interface VisibilityProviderProps {
  children: ReactNode; 
}

export const VisibilityProvider: React.FC<VisibilityProviderProps> = ({ children }) => {
  const [visibleComponent, setVisibleComponent] = useState<string>("home");

  const setVisibility = (component: string) => {
    setVisibleComponent(component);
  };

  return (
    <VisibilityContext.Provider value={{ visibleComponent, setVisibility }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = () => useContext(VisibilityContext);
