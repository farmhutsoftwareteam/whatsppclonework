import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { supabase } from '../config/supabase';

const ChatItem = ({ item }) => {
  const lastMessage = item.message;
  const timestamp = item.timestamp;

  return (
    <View style={{flexDirection: 'row', padding: 10, borderBottomWidth: 0.5, borderColor: '#ddd'}}>
      <Text style={{fontWeight: 'bold'}}>{item.sender_id === item.currentUserId ? 'You' : item.contactId}</Text>
      <View style={{flexDirection: 'column', marginLeft: 20, flex: 1 }}>
        <Text>{lastMessage}</Text>
        <Text style={{color: 'gray'}}>{timestamp}</Text>
      </View>
    </View>
  );
};

const Chatlist = () => {
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      if (currentUser) {
        const { data: sentChats } = await supabase.from('chats').select('*').eq('sender_id', currentUser.id);
        const { data: receivedChats } = await supabase.from('chats').select('*').eq('receiver_id', currentUser.id);
        
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

        const chatList = Object.values(groupedChats).map(chatGroup => chatGroup.sort((a, b) => a.timestamp - b.timestamp)[chatGroup.length - 1]);
        setChats(chatList);
      }
    };

    fetchChats();
  }, [currentUser]);

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ChatItem item={item} />}
    />
  );
};

export default Chatlist;