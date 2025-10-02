// src/components/BarcodeScanner.js
import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { CodeScanner, BarcodeFormat } from 'react-native-vision-camera/frame-processors';
import { runOnJS } from 'react-native-reanimated';

export default function BarcodeScanner({onScanned, active=true}) {
  const devices = useCameraDevices();
  const device = devices.back;
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(()=>{
    Camera.requestCameraPermission().then(status => setHasPermission(status === 'authorized'));
  },[]);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const codes = CodeScanner.scan(frame, [BarcodeFormat.ALL_FORMATS]);
    if (codes && codes.length > 0) {
      runOnJS(onScanned)(codes[0].displayValue || codes[0].rawValue);
    }
  }, []);

  if (!device) return <Text style={styles.center}>Loading camera...</Text>;
  if (!hasPermission) return <Text style={styles.center}>Please grant camera permission</Text>;

  return (
    <View style={{flex:1}}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={active}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center:{flex:1,textAlign:'center',textAlignVertical:'center'}
});