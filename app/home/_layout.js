import React from 'react'
import { Tabs } from 'expo-router'
import { ChatProvider ,useChatContext} from '../../contexts/ChatContext'
import { UserProvider } from '../../contexts/userContext'
import { MessageCircle, ChevronLeft ,Contact2, LogOut } from 'lucide-react-native'
import { Box } from '@gluestack-ui/themed'
import { TouchableOpacity, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { supabase } from '../../config/supabase'


const Applayout = () => {
  const { chatHeaderInfo } = useChatContext();


  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error during sign out:', error);
    } else {
      try {
        await AsyncStorage.removeItem('supabase.auth.token');
        router.replace('/');
      } catch (e) {
        console.error('Error removing token from AsyncStorage:', e);
      }
    }
  };
  return (
 

 
<Tabs screenOptions={{ headerStyle: { backgroundColor: 'white' } }}>
    <Tabs.Screen
      name="index"
      options={{
        headerTitle: '',
        tabBarLabel: 'Chats',
        tabBarIcon: () => <MessageCircle />,
        headerRight: () => (
          <TouchableOpacity onPress={() => logout()}>
          <Box p={10}>
          <LogOut size={24}  />
          </Box>
        </TouchableOpacity>
        ),
      }}
    />
    <Tabs.Screen 
    name="contacts" options={{tabBarLabel : 'People' , tabBarIcon : () =><Contact2 />}} />
     <Tabs.Screen
       name="inbox"
       options={{
         headerTitle: '',
         href: null,
                  headerLeft: () => (
           <TouchableOpacity  onPress={() => router.back()}>
           <ChevronLeft size={24} />
           </TouchableOpacity>
         ),
       }}
     />
   
   
    </Tabs>
   
    

  )
}

export default Applayout