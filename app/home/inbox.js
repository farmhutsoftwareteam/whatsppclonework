import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useChatContext } from '../../contexts/ChatContext';
import { supabase } from '../../config/supabase';

const ChatScreen = ({ route }) => {
  const { setChatHeaderInfo } = useChatContext();
  const params = useLocalSearchParams();
  const receiverId = params.id;
  const phoneNumber = params.phone;

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch the current user from Supabase
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error fetching user:', userError.message);
          return;
        }

        setUser(userData.user);

        console.log('Current User:', userData.user);
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    };

    // Fetch user when the component mounts
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!user) {
          // If user is not yet fetched, wait for it
          return;
        }
    
        // Fetch messages where the current user is the sender
        const { data: sentMessages, error: sentError } = await supabase
          .from('chats')
          .select('*')
          .eq('sender_id', user.id)
          .eq('receiver_id', receiverId);
    
        if (sentError) {
          console.error('Error fetching sent messages:', sentError.message);
          return;
        }
    
        // Fetch messages where the current user is the receiver
        const { data: receivedMessages, error: receivedError } = await supabase
          .from('chats')
          .select('*')
          .eq('sender_id', receiverId)
          .eq('receiver_id', user.id);
    
        if (receivedError) {
          console.error('Error fetching received messages:', receivedError.message);
          return;
        }
    
       
        const allMessages = [...sentMessages, ...receivedMessages].sort((a, b) => a.timestamp - b.timestamp);
    
        setMessages(allMessages);
      } catch (error) {
        console.error('Error fetching messages:', error.message);
      }
    };

   
    if (user) {
      fetchMessages();
    }

    
    const subscription = supabase
      .channel('chats')
      .on('INSERT', (payload) => {
       
        const insertedMessage = payload.new;

       
        if ((insertedMessage.sender_id === user?.id && insertedMessage.receiver_id === receiverId) 
            || (insertedMessage.sender_id === receiverId && insertedMessage.receiver_id === user?.id)) {
          setMessages((prevMessages) => [...prevMessages, insertedMessage]);
        }
      })
      .subscribe();

   
    return () => {
      subscription.unsubscribe();
    };
  }, [user, receiverId]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '' && user) {
      // part of the message which we send to the DB
      const messageToDB = {
        message: inputMessage,
        sender_id: user.id,
        receiver_id: receiverId,
        timestamp: new Date(),
      };
  
      // complete message which we add to the local state
      const optimisticMessage = {
        ...messageToDB,
        isSent: false   
      };
    
      setMessages(prevMessages => [...prevMessages, optimisticMessage]);
    
      try {
        const { data: messageFromDB, error } = await supabase
          .from('chats')
          .upsert([messageToDB]);
    
        if (error) {
          console.error('Error sending message:', error.message);
          setMessages(prevMessages => prevMessages.filter(m => m !== optimisticMessage));
          return;
        }
    
        setMessages((prevState) => 
          prevState.map((msg) => 
            msg === optimisticMessage ? { ...msg, isSent: true } : msg
          )
        );
  
        setInputMessage('');
      } catch (error) {
        console.error('Error sending message:', error.message);
      }
    }
  };

  // Set receiver's phone number as chat header info
  useEffect(() => {

    setChatHeaderInfo(phoneNumber);
  }, [phoneNumber, setChatHeaderInfo]);



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={{ flex: 1 }}>
      <FlatList
  data={messages}
  keyExtractor={(item) => item?.id?.toString()}
  renderItem={({ item }) => {   // <----- This is the `renderItem` prop
    if (!item) {
      return null;  
    }

    return (
      <View
        style={{
          padding: 10,
          alignSelf: item.sender_id === user?.id ? 'flex-end' : 'flex-start',
        }}
      >
        <View
          style={{
            backgroundColor:
              item.sender_id === user?.id ? '#DCF8C6' : '#E5E5EA',
            borderRadius: 8,
            padding: 10,
            maxWidth: '80%',
          }}
        >
          <Text>{item.message}</Text>
          {item.isSent && <Text>✔️</Text>}

        </View>
      </View>
    );
  }}
/>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            marginBottom: 15,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderRadius: 5,
              padding: 8,
              marginRight: 10,
            }}
            placeholder="Type your message..."
            value={inputMessage}
            onChangeText={setInputMessage}
          />
          <TouchableOpacity onPress={handleSendMessage}>
            <View
              style={{
                padding: 10,
                backgroundColor: '#4CAF50',
                borderRadius: 5,
              }}
            >
              <Text style={{ color: 'white' }}>Send</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
