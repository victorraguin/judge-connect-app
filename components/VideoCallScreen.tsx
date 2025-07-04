import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff, RotateCcw, Speaker, ExternalLink } from 'lucide-react-native';

interface VideoCallScreenProps {
  onEndCall: () => void;
  judgeInfo: {
    name: string;
    avatar: string;
  };
  phoneNumber?: string;
}

export default function VideoCallScreen({ onEndCall, judgeInfo, phoneNumber }: VideoCallScreenProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    // Check if we're on a real device and immediately offer video call options
    if ((Platform.OS === 'android' || Platform.OS === 'ios') && phoneNumber) {
      setTimeout(() => {
        initiateRealVideoCall();
      }, 500);
    }
  }, []);

  useEffect(() => {
    // Simulate connection process
    const connectTimer = setTimeout(() => {
      setIsConnecting(false);
    }, 3000);

    // Call duration timer
    const durationTimer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(durationTimer);
    };
  }, []);

  const initiateRealVideoCall = () => {
    Alert.alert(
      `Appel vidéo avec ${judgeInfo.name}`,
      'Choisissez votre méthode d\'appel vidéo :',
      [
        { text: 'Annuler', style: 'cancel', onPress: onEndCall },
        { 
          text: 'WhatsApp Vidéo', 
          onPress: () => openWhatsAppVideo() 
        },
        { 
          text: 'FaceTime', 
          onPress: () => openFaceTime() 
        },
        { 
          text: 'Google Meet', 
          onPress: () => openGoogleMeet() 
        },
        { 
          text: 'Interface Démo', 
          onPress: () => {} // Continue with current interface
        }
      ]
    );
  };

  const openGoogleMeet = async () => {
    try {
      // For Google Meet, we can open the app or web version
      const meetUrl = 'https://meet.google.com/new';
      const supported = await Linking.canOpenURL(meetUrl);
      
      if (supported) {
        await Linking.openURL(meetUrl);
        onEndCall();
      } else {
        Alert.alert('Google Meet non disponible', 'Impossible d\'ouvrir Google Meet');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir Google Meet');
    }
  };

  const initiateVideoCall = () => {
    Alert.alert(
      'Video Call Options',
      `Choose how to video call ${judgeInfo.name}:`,
      [
        { text: 'Cancel', style: 'cancel', onPress: onEndCall },
        { 
          text: 'WhatsApp Video', 
          onPress: () => openWhatsAppVideo() 
        },
        { 
          text: 'FaceTime', 
          onPress: () => openFaceTime() 
        },
        { 
          text: 'Use In-App (Demo)', 
          onPress: () => {} // Continue with current interface
        }
      ]
    );
  };

  const openWhatsAppVideo = async () => {
    try {
      // Multiple WhatsApp approaches for video calls
      const whatsappUrls = [
        `whatsapp://send?phone=${phoneNumber}&text=Bonjour, pouvons-nous faire un appel vidéo ?`,
        `https://wa.me/${phoneNumber}?text=Appel vidéo demandé`,
        `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Appel vidéo`
      ];
      
      let opened = false;
      
      for (const url of whatsappUrls) {
        try {
          const supported = await Linking.canOpenURL(url);
          if (supported) {
            await Linking.openURL(url);
            opened = true;
            Alert.alert(
              'WhatsApp ouvert', 
              'Une fois dans WhatsApp, vous pouvez démarrer un appel vidéo en appuyant sur l\'icône caméra dans la conversation.'
            );
            break;
          }
        } catch (error) {
          continue;
        }
      }
      
      if (!opened) {
        Alert.alert(
          'WhatsApp non disponible', 
          'WhatsApp n\'est pas installé. Voulez-vous l\'installer ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { 
              text: 'Installer WhatsApp', 
              onPress: () => {
                const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.whatsapp';
                const appStoreUrl = 'https://apps.apple.com/app/whatsapp-messenger/id310633997';
                const storeUrl = Platform.OS === 'android' ? playStoreUrl : appStoreUrl;
                Linking.openURL(storeUrl);
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir WhatsApp: ' + error.message);
    }
  };

  const openFaceTime = async () => {
    try {
      const facetimeUrl = `facetime://${phoneNumber}`;
      const supported = await Linking.canOpenURL(facetimeUrl);
      
      if (supported) {
        await Linking.openURL(facetimeUrl);
      } else {
        Alert.alert('FaceTime not available', 'FaceTime is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open FaceTime');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (Platform.OS !== 'web') {
      // Implement native audio muting
      Alert.alert('Audio', isMuted ? 'Microphone enabled' : 'Microphone muted');
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (Platform.OS !== 'web') {
      // Implement native video toggle
      Alert.alert('Video', isVideoEnabled ? 'Camera disabled' : 'Camera enabled');
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    if (Platform.OS !== 'web') {
      // Implement native speaker toggle
      Alert.alert('Audio', isSpeakerOn ? 'Speaker off' : 'Speaker on');
    }
  };

  const switchCamera = () => {
    if (Platform.OS !== 'web') {
      // Implement camera switching
      Alert.alert('Camera', 'Switching camera...');
    }
  };

  const endCall = () => {
    Alert.alert(
      'End Video Call',
      'Choose an option:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch to Voice', onPress: () => switchToVoice() },
        { text: 'End Call', style: 'destructive', onPress: onEndCall }
      ]
    );
  };

  const switchToVoice = async () => {
    if (Platform.OS !== 'web' && phoneNumber) {
      try {
        const url = `tel:${phoneNumber}`;
        const supported = await Linking.canOpenURL(url);
        
        if (supported) {
          await Linking.openURL(url);
          onEndCall();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to switch to voice call');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Area */}
      <View style={styles.videoContainer}>
        {isConnecting ? (
          <View style={styles.connectingContainer}>
            <Text style={styles.connectingText}>Connecting to {judgeInfo.name}...</Text>
            {phoneNumber && (
              <Text style={styles.phoneNumber}>Calling {phoneNumber}</Text>
            )}
          </View>
        ) : (
          <View style={styles.videoArea}>
            <View style={styles.remoteVideo}>
              <View style={styles.videoPlaceholderContainer}>
                <VideoIcon size={48} color="#64748b" />
                <Text style={styles.videoPlaceholder}>
                  {judgeInfo.name}'s Video
                </Text>
                <Text style={styles.videoSubtext}>
                  Demo Mode - Use external apps for real video
                </Text>
              </View>
            </View>
            <View style={styles.localVideo}>
              <VideoIcon size={24} color="#ffffff" />
              <Text style={styles.localVideoText}>Your Video</Text>
            </View>
          </View>
        )}
      </View>

      {/* Call Info */}
      <View style={styles.callInfo}>
        <Text style={styles.judgeName}>{judgeInfo.name}</Text>
        <Text style={styles.callDuration}>
          {isConnecting ? 'Connecting...' : formatDuration(callDuration)}
        </Text>
        {Platform.OS !== 'web' && (
          <TouchableOpacity style={styles.externalAppButton} onPress={initiateVideoCall}>
            <ExternalLink size={16} color="#3b82f6" />
            <Text style={styles.externalAppText}>Use External App</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.mutedButton]}
          onPress={toggleMute}
        >
          {isMuted ? (
            <MicOff size={24} color="#ffffff" />
          ) : (
            <Mic size={24} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, !isVideoEnabled && styles.disabledButton]}
          onPress={toggleVideo}
        >
          {isVideoEnabled ? (
            <VideoIcon size={24} color="#ffffff" />
          ) : (
            <VideoOff size={24} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={switchCamera}
        >
          <RotateCcw size={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isSpeakerOn && styles.activeButton]}
          onPress={toggleSpeaker}
        >
          <Speaker size={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.endCallButton}
          onPress={endCall}
        >
          <PhoneOff size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    flex: 1,
  },
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  connectingText: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    textAlign: 'center',
  },
  videoArea: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 12,
    textAlign: 'center',
  },
  videoSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    marginTop: 8,
    textAlign: 'center',
  },
  localVideo: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: '#334155',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  localVideoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    marginTop: 4,
  },
  callInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  judgeName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  callDuration: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  externalAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  externalAppText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3b82f6',
    marginLeft: 6,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mutedButton: {
    backgroundColor: '#dc2626',
  },
  disabledButton: {
    backgroundColor: '#dc2626',
  },
  activeButton: {
    backgroundColor: '#059669',
  },
  endCallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
});