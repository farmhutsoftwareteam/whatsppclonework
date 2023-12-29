import React, { useEffect } from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '../config/supabase';
import { router, SplashScreen, Slot } from 'expo-router';
import { config } from '@gluestack-ui/config';
import * as Contacts from 'expo-contacts';
import { ChatProvider } from '../contexts/ChatContext';


SplashScreen.preventAutoHideAsync();

const Layout = () => {
  useEffect(() => {
    const checkSession = async () => {
      const sessionStr = await AsyncStorage.getItem('supabase.auth.token');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      console.log('Session:', session); // Log the session
    
      const permission = await Contacts.getPermissionsAsync();
    
      if  (permission.status !== 'granted') {
        await Contacts.requestPermissionsAsync();
      }
    
      // Check if the session and the user object in the session exist
      if (session && session.user) {
        console.log('Navigating to /home'); // Log the navigation
        router.replace('/home');
      } else {
        console.log('Navigating to /index'); // Log the navigation
        router.replace('/');
      }
    
      // Hide the splash screen after the navigation
      SplashScreen.hideAsync();
    };
  
    checkSession();
  }, []);

  return (
   
    <ChatProvider>
    <GluestackUIProvider config={config}>
      <Slot />
    </GluestackUIProvider>
    </ChatProvider>
   
  );
};

export default Layout;