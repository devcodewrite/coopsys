import React, { useState } from 'react';
import { View } from 'react-native';
import OTPInput from '@/components/inputs/OTPInput';
import { Button } from '@rneui/themed';

const OTPVerificationScreen = () => {
  const [code, setCode] = useState('');

  const handleVerify = () => {
    // Add your OTP verification logic here
    console.log('OTP verified');
  };

  return (
    <View style={{ padding: 20 }}>
      <OTPInput code={code} setCode={setCode} />
      <Button title="Verify OTP" onPress={handleVerify} />
    </View>
  );
};

export default OTPVerificationScreen;
