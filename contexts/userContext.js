// UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import getCurrentUser from '../components/getUser'; // Adjust the import path accordingly

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ id: null, name: null });

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser({ id: currentUser.id, name: currentUser.name }); // Assuming 'name' is a property on the user object
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};