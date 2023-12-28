import React from 'react'
import { Box, Text, Heading, VStack, HStack, Button, Input, Icon, InputField, Actionsheet } from '@gluestack-ui/themed';
import { Camera, Plus } from 'lucide-react-native';
import { supabase } from '../config/supabase';
import { router } from 'expo-router';

const Header = () => {
    const [showActionsheet, setShowActionsheet] = React.useState(false)

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace('/');
      };
  return (
   <Box flex={1} justifyContent='center'   p={10} >
   
    
    <Heading size='2xl'>Chats</Heading>
   
    <Input>
    <InputField placeholder="Search" />
    </Input>
    <Actionsheet isOpen={showActionsheet}>
        
    </Actionsheet>
   </Box>
  )
}

export default Header