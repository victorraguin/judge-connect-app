import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Camera, RotateCcw, X, Send, Zap as Flash, ZapOff as FlashOff, Image as ImageIcon } from 'lucide-react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

interface CameraScreenProps {
  onClose: () => void;
  onCapture: (uri: string) => void;
}

export default function CameraScreen({ onClose, onCapture }: CameraScreenProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    // Request media library permissions on mount
    if (!mediaLibraryPermission?.granted) {
      requestMediaLibraryPermission();
    }
  }, []);

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need your permission to use the camera</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashMode(current => (current === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        });
        if (photo) {
          // Save to device gallery if permission granted
          if (mediaLibraryPermission?.granted) {
            try {
              await MediaLibrary.saveToLibraryAsync(photo.uri);
              Alert.alert('Success', 'Photo saved to gallery');
            } catch (error) {
              console.log('Failed to save to gallery:', error);
            }
          }
          onCapture(photo.uri);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onCapture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}
        flash={flashMode}
      >
        <View style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.controlButton} onPress={onClose}>
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
              {flashMode === 'off' ? (
                <FlashOff size={24} color="#ffffff" />
              ) : (
                <Flash size={24} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <RotateCcw size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
              <ImageIcon size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner}>
                <Camera size={32} color="#ffffff" />
              </View>
            </TouchableOpacity>
            <View style={styles.spacer}>
              <Text style={styles.instructionText}>Tap to capture</Text>
            </View>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
  },
});