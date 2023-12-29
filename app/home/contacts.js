import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Box, VStack, Text } from '@gluestack-ui/themed';
import * as Contacts from 'expo-contacts';
import { supabase } from '../../config/supabase';
import { useNavigation, router ,useLocalSearchParams } from 'expo-router';  // Correct import

const ContactsComponent = () => {
  const [matchingContacts, setMatchingContacts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const navigation = useNavigation();  // Use useNavigation to get navigation object

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === 'granted') {
        const { data: deviceContacts } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        const { data: supabaseProfiles, error } = await supabase.from('profiles').select('*');

        if (error) {
          console.log("Error fetching profiles:", error.message);
          return;
        }

        const supabasePhoneNumbers = supabaseProfiles.map(profile => profile.phone);

        const matchingContacts = deviceContacts.map(contact => {
          const phoneNumber = contact.phoneNumbers?.[0]?.number.replace(/[^0-9]/g, "");
          const matchingProfile = supabaseProfiles.find(profile => profile.phone === phoneNumber);
          return {
            ...contact,
            id: matchingProfile?.id || null,
          };
        });

        setMatchingContacts(matchingContacts);
      }
    })();
  }, []);

  const filteredContacts = matchingContacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchInput.toLowerCase())
  );

  const renderItem = ({ item, index }) => (
    <TouchableOpacity key={`${item.id}-${index}`} onPress={() => handleContactPress(item)}>
      <Box borderBottomWidth={0.5} borderBottomColor="gray.200" p={3}>
        <VStack space={2}>
          <Text fontWeight="bold">{item.name ?? ''}</Text>
          {item.phoneNumbers && (
            <Text color="gray">{item.phoneNumbers[0]?.number ?? ''}</Text>
          )}
          {item.emails && (
            <Text color="gray.500">{item.emails[0]?.email ?? ''}</Text>
          )}
        </VStack>
      </Box>
    </TouchableOpacity>
  );

  const handleContactPress = (contact) => {
    if (contact.id) {
      console.log("Initiate chat with user ID:", contact.id);
      router.replace({
        pathname: '/home/inbox',
        params: { id : contact.id ,phone: contact.phoneNumbers[0]?.number },
      }); // Use navigation.replace

      // Implement your navigation logic here
    } else {
      Alert.alert("User Not Registered", "This user is not registered on the application.");

      console.log("User ID not found for contact:", contact);
    }
  };

  return (
    <Box p={10}>
      <TextInput
        placeholder="Search contacts..."
        value={searchInput}
        onChangeText={setSearchInput}
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 10 , borderRadius: 5}}
      />
      <FlatList
    data={filteredContacts}
    keyExtractor={(item, index) => `${item.id}-${item.name}-${index}`}
    renderItem={renderItem}
  />
    </Box>
  );
};

export default ContactsComponent;
