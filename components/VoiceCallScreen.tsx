import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhoneOff, Mic, MicOff, Speaker, Volume2, Key as Keypad } from 'lucide-react-native';

interface VoiceCallScreenProps {
  onEndCall: () => void;
  judgeInfo: {
    name: string;
    avatar: string;
  };
  phoneNumber: string;
}

export default function VoiceCallScreen({ onEndCall, judgeInfo, phoneNumber }: VoiceCallScreenProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [callStatus, setCallStatus] = useState('Calling...');

  useEffect(() => {
    // Check if we're on a real device
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // Immediately try to make a real call
      setTimeout(() => {
        makeRealCall();
      }, 500);
    }

    // Simulate connection process
    const connectTimer = setTimeout(() => {
      setIsConnecting(false);
      setCallStatus('Connected');
    }, 3000);

    // Call duration timer
    const durationTimer = setInterval(() => {
      if (!isConnecting) {
        setCallDuration(prev => prev + 1);
      }
    }, 1000);

    // For native platforms, initiate actual phone call
    if (Platform.OS !== 'web') {
      setTimeout(() => {
        initiatePhoneCall();
      }, 1000);
    }

    return () => {
      clearTimeout(connectTimer);
      clearInterval(durationTimer);
    };
  }, []);

  const makeRealCall = async () => {
    try {
      const url = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        Alert.alert(
          `Appeler ${judgeInfo.name}`,
          `Voulez-vous appeler le ${phoneNumber} ?`,
          [
            { text: 'Annuler', style: 'cancel', onPress: onEndCall },
            { 
              text: 'Appeler', 
              onPress: async () => {
                try {
                  await Linking.openURL(url);
                  // Keep the interface open to show call is in progress
                  setCallStatus('Appel en cours...');
                } catch (error) {
                  Alert.alert('Erreur', 'Impossible de passer l\'appel');
                }
              }
            },
            { 
              text: 'WhatsApp', 
              onPress: () => openWhatsAppCall()
            }
          ]
        );
      } else {
        Alert.alert('Erreur', 'Les appels téléphoniques ne sont pas supportés sur cet appareil');
      }
    } catch (error) {
      console.log('Call error:', error);
      Alert.alert('Erreur', 'Impossible d\'initier l\'appel');
    }
  };

  const initiatePhoneCall = async () => {
    try {
      const url = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        Alert.alert(
          'Voice Call Options',
          `Choose how to call ${judgeInfo.name}:`,
          [
            { text: 'Cancel', style: 'cancel', onPress: onEndCall },
            { 
              text: 'Phone App', 
              onPress: () => {
                Linking.openURL(url);
                onEndCall(); // Close interface after opening phone app
              }
            },
            { 
              text: 'WhatsApp Call', 
              onPress: () => openWhatsAppCall()
            },
            { 
              text: 'Use In-App (Demo)', 
              onPress: () => {} // Continue with current interface
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device/platform');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate call');
    }
  };

  const openWhatsAppCall = async () => {
    try {
      // Multiple WhatsApp URL schemes for better compatibility
      const whatsappUrls = [
        `whatsapp://send?phone=${phoneNumber}`,
        `https://wa.me/${phoneNumber}`,
        `https://api.whatsapp.com/send?phone=${phoneNumber}`
      ];
      
      let opened = false;
      
      for (const url of whatsappUrls) {
        try {
          const supported = await Linking.canOpenURL(url);
          if (supported) {
            await Linking.openURL(url);
            opened = true;
            onEndCall();
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    Alert.alert('Audio', isMuted ? 'Microphone enabled' : 'Microphone muted');
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    Alert.alert('Audio', isSpeakerOn ? 'Speaker off' : 'Speaker on');
  };

  const showKeypad = () => {
    Alert.alert('Keypad', 'Keypad functionality would be implemented here');
  };

  const endCall = () => {
    Alert.alert(
      'Call Options',
      'Choose an option:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Phone App', onPress: () => openPhoneApp() },
        { text: 'End Call', style: 'destructive', onPress: onEndCall }
      ]
    );
  };

  const openPhoneApp = async () => {
    if (Platform.OS !== 'web') {
      try {
        const url = `tel:${phoneNumber}`;
        await Linking.openURL(url);
        onEndCall();
      } catch (error) {
        Alert.alert('Error', 'Failed to open phone app');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Call Info */}
      <View style={styles.callInfo}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {judgeInfo.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
        </View>
        
        <Text style={styles.judgeName}>{judgeInfo.name}</Text>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        <Text style={styles.callStatus}>
          {isConnecting ? 'Demo Mode - Use external apps for real calls' : callStatus}
        </Text>
        
        {!isConnecting && (
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
        )}
      </View>

      {/* Audio Visualization */}
      <View style={styles.audioVisualization}>
        <View style={styles.waveContainer}>
          {[...Array(5)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.waveBar,
                { 
                  height: Math.random() * 40 + 10,
                  opacity: isConnecting ? 0.3 : 1 
                }
              ]} 
            />
          ))}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.controlRow}>
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
            style={styles.controlButton}
            onPress={showKeypad}
          >
            <Keypad size={24} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, isSpeakerOn && styles.activeButton]}
            onPress={toggleSpeaker}
          >
            {isSpeakerOn ? (
              <Volume2 size={24} color="#ffffff" />
            ) : (
              <Speaker size={24} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.endCallButton}
          onPress={endCall}
        >
          <PhoneOff size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  callInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#1e40af',
  },
  avatarText: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  judgeName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  phoneNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    marginBottom: 16,
  },
  callStatus: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#10b981',
    marginBottom: 8,
  },
  callDuration: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  audioVisualization: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  waveBar: {
    width: 4,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 40,
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
  activeButton: {
    backgroundColor: '#059669',
  },
  endCallButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
});