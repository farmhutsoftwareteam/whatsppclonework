import React, { useEffect, useState } from 'react';
import { FlatList, Text, View,TouchableOpacity } from 'react-native';
import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Box } from '@gluestack-ui/themed';


const ChatItem = ({ item }) => {
  const lastMessage = item.message;
  const timestamp = item.timestamp;

  const getOtherUserId = () => {
    if (item.sender_id !== item.currentUserId) {
      return item.sender_id;
    } else if (item.receiver_id !== item.currentUserId) {
      return item.receiver_id;
    }
  };
  const otherUserId = getOtherUserId();
  console.log("Other User Id:", otherUserId); // Log the other user id to the console

  const fetchPhoneNumber = async () => {
    if (!otherUserId) return; // Add this line

    const { data, error } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', otherUserId)
      .single();

    if (error) {
      console.error("Error fetching phone number:", error);
      return;
    }

    console.log("Phone Number:", data.phone_number); // Log the phone number to the console
    return data.phone_number;
  };

  const handlePress = async () => {
    if (!otherUserId) return; // Add this line

    const phoneNumber = await fetchPhoneNumber();
    router.replace({
      pathname: '/home/inbox',
      params: { id : otherUserId ,phone: phoneNumber },
    }); // Use navigation.replace
  };


  


  

  return (
    <TouchableOpacity onPress={handlePress}>
    <View style={{flexDirection: 'row', padding: 10, borderBottomWidth: 0.5, borderColor: '#ddd'}}>
      <Text style={{fontWeight: 'bold'}}>{item.sender_id === item.currentUserId ? 'You' : item.contactId}</Text>
      <View style={{flexDirection: 'column', marginLeft: 20, flex: 1 }}>
        <Text>{lastMessage}</Text>
        <Text style={{color: 'gray'}}>{timestamp}</Text>
      </View>
    </View>
  </TouchableOpacity>
  );
};

const Chatlist = () => {
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const checkSession = async () => {
    const sessionStr = await AsyncStorage.getItem('supabase.auth.token');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    console.log('Session:', session); // Log the session
  
    // ...
  };
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const sessionStr = await AsyncStorage.getItem('supabase.auth.token');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      console.log('Session:', session); // Log the session

      if (session && session.user) {
        setCurrentUser(session.user);
        console.log("Current User:", session.user); // Log the user to the console
      }
    };

    fetchCurrentUser();
  }, []);



  useEffect(() => {
    const fetchChats = async () => {
      if (currentUser) {
        const { data: sentChats } = await supabase.from('chats').select('*').eq('sender_id', currentUser.id);
        console.log("Sent Chats:", sentChats); // Log the sent chats to the console
  
        const { data: receivedChats } = await supabase.from('chats').select('*').eq('receiver_id', currentUser.id);
        console.log("Received Chats:", receivedChats); // Log the received chats to the console
        
        const allChats = [...sentChats, ...receivedChats];
        const groupedChats = allChats.reduce((groups, chat) => {
          const key = chat.sender_id === currentUser.id ? chat.receiver_id : chat.sender_id;
          if (!groups[key]) {
            groups[key] = [];
          }
          chat.currentUserId = currentUser.id;
          groups[key].push(chat);
          return groups;
        }, {});
  
        console.log("Grouped Chats:", groupedChats); // Log the grouped chats to the console
  
        const chatList = Object.values(groupedChats).map(chatGroup => chatGroup.sort((a, b) => a.timestamp - b.timestamp)[chatGroup.length - 1]);
        console.log("Chat List:", chatList); // Log the chat list to the console
  
        setChats(chatList);
      }
    };
  
    fetchChats();
  
    // Listen for changes in the 'chats' table
    const subscription = supabase
      .channel('chats')
      .on('*', fetchChats)
      .subscribe();
  
    // Clean up the listener when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser]);

  return (
    
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        console.log("Rendering Item:", item); // Log the item to the console
        return <ChatItem item={item} />;
      }}
    />
   
  );
};

export default Chatlist;