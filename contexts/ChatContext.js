// ChatContext.js
import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chatHeaderInfo, setChatHeaderInfo] = useState(null);

  return (
    <ChatContext.Provider value={{ chatHeaderInfo, setChatHeaderInfo }}>
      {children}
    </ChatContext.Provider>
  );
};