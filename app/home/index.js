import React ,{ useEffect} from 'react'
import { Box, Button, Input, VStack, Text} from '@gluestack-ui/themed';
import Header from '../../components/header';
import Chatlist from '../../components/chats';
import { supabase } from '../../config/supabase';
import { router } from 'expo-router';
import * as Contacts from 'expo-contacts';



const Home = () => {

  
  return (
    <Box flex={1}>
    
        <Box h="$1/6" mb={0}>
        <Header />
        </Box>
    
       <Chatlist />
    </Box>
  )
}

export default Home