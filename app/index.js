import React, { useState } from 'react';
import { Button, Input, VStack, Text, Heading, InputField } from '@gluestack-ui/themed';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../config/supabase';
import { router} from 'expo-router';

const AuthForm = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSignInWithOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('OTP has been sent to your phone');
      setOtpSent(true);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    const { data , error } = await supabase.auth.verifyOtp({ phone, token: otp ,type:'sms' });
    if (error) {
      Alert.alert(error.message);
    } else if (data?.session) {
      Alert.alert('Successfully signed in');
      router.replace('/home');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        
      <Heading mb={10} textAlign='center'>Please enter your phone number to proceed</Heading>
      <VStack width="90%" space="sm">
        <Input>
          <InputField
            placeholder="Enter your phone number here"
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
            keyboardType="numeric"
          />
        </Input>

        {!otpSent && (
          <Button 
            onPress={handleSignInWithOtp} 
            bg="green" 
            isDisabled={loading || !phone}
          >
            <Text color="white">Send OTP</Text>
          </Button>
        )}

        {otpSent && (
          <>
            <Input>
              <InputField
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter your OTP here"
                keyboardType="numeric"
              />
            </Input>
            <Button 
              onPress={handleVerifyOtp} 
              bg="green" 
              isDisabled={loading || !otp}
            >
              <Text color="white">Verify OTP</Text>
            </Button>
          </>
        )}
      </VStack>
    </KeyboardAvoidingView>
  );
};

export default AuthForm;