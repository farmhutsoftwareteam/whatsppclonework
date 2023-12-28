import React from 'react'
import { Tabs } from 'expo-router'
import { ChatProvider ,useChatContext} from '../../contexts/ChatContext'
import { UserProvider } from '../../contexts/userContext'


const Applayout = () => {
  const { chatHeaderInfo } = useChatContext();

  return (
 
<Tabs>
    <Tabs.Screen
    name="index" />
    <Tabs.Screen 
    name="contacts" />
     <Tabs.Screen
    name="inbox"
    options={{ href : null , headerTitle: chatHeaderInfo,}}/> 
   
   
    </Tabs>
    

  )
}

export default Applayout