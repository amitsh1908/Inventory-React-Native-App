// src/components/BarcodeScanner.js
import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export default function BarcodeScanner({onScanned, active=true}) {
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      setHasPermission(result === RESULTS.GRANTED);
    };
    checkPermission();
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', 'code-39', 'code-93', 'codabar', 'upc-a', 'upc-e'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && active) {
        onScanned(codes[0].value);
      }
    }
  });

  if (device == null) return <Text style={styles.center}>No camera device found</Text>;
  if (!hasPermission) return <Text style={styles.center}>Please grant camera permission</Text>;

  return (
    <View style={{flex:1}}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={active}
        codeScanner={codeScanner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center:{flex:1,textAlign:'center',textAlignVertical:'center'}
});