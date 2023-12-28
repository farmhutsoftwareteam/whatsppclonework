import React, { useEffect } from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';

import { supabase } from '../config/supabase';
import { router, SplashScreen, Slot } from 'expo-router';
import { config } from '@gluestack-ui/config';
import * as Contacts from 'expo-contacts';
import { ChatProvider } from '../contexts/ChatContext';


SplashScreen.preventAutoHideAsync();

const Layout = () => {
  useEffect(() => {
    const checkSession = async () => {
      const session = supabase.auth.getSession();
      const permission = await Contacts.getPermissionsAsync();

      if  (permission.status !== 'granted') {
        await Contacts.requestPermissionsAsync();
        }


      if (session) {
        console.log('session', session);
        router.replace('/home');
      } else {
        router.replace('/index');
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