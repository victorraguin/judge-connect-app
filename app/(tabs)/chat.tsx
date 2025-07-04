import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Camera, Mic, Phone, Video, MoveHorizontal as MoreHorizontal, ArrowLeft, Star } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { router, useRouter } from 'expo-router';
import CameraScreen from '@/components/CameraScreen';
import VoiceCallScreen from '@/components/VoiceCallScreen';
import VideoCallScreen from '@/components/VideoCallScreen';

const chatMessages = [
  {
    id: 1,
    text: "Hi! I have a question about Lightning Bolt and counterspells interaction.",
    sender: "user",
    time: "2:30 PM",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 2,
    text: "Hello! I've accepted your question. What's your specific question about Lightning Bolt and counterspells? I can help via text, or if you prefer, we can do a voice or video call.",
    sender: "judge",
    time: "2:31 PM",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 3,
    text: "If my opponent casts a counterspell targeting my Lightning Bolt, can I cast another Lightning Bolt in response?",
    sender: "user",
    time: "2:32 PM",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 4,
    text: "Yes, absolutely! When your opponent casts a counterspell, it goes on the stack above your Lightning Bolt. You can respond by casting another Lightning Bolt, which will resolve first before the counterspell.",
    sender: "judge",
    time: "2:33 PM",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 5,
    text: "That makes perfect sense! So the stack would be: Lightning Bolt 2 (top), Counterspell, Lightning Bolt 1 (bottom)?",
    sender: "user",
    time: "2:34 PM",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 6,
    text: "Exactly right! Lightning Bolt 2 resolves first, then the counterspell resolves countering Lightning Bolt 1. Is there anything else you'd like to know about the stack?",
    sender: "judge",
    time: "2:35 PM",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 7,
    text: "That's perfect, thank you so much for the clear explanation!",
    sender: "user",
    time: "2:36 PM",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    id: 8,
    text: "You're welcome! Feel free to ask if you have any other questions. Would you like to rate this conversation?",
    sender: "judge",
    time: "2:37 PM",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  }
];

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(chatMessages);
  const [showCamera, setShowCamera] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const judgeInfo = {
    name: 'Sarah Chen',
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  };

  const testPhoneNumber = '0662398343';

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message.trim(),
        sender: "user",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate judge typing
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const judgeResponse = {
          id: messages.length + 2,
          text: "Thanks for your question! I'll help you with that rule clarification.",
          sender: "judge",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
        };
        setMessages(prev => [...prev, judgeResponse]);
      }, 2000);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleCamera = () => {
    setShowCamera(true);
  };

  const handleCameraCapture = (uri: string) => {
    setShowCamera(false);
    
    // Add the photo as a message
    const newMessage = {
      id: messages.length + 1,
      text: '',
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      image: uri
    };
    
    setMessages([...messages, newMessage]);
    
    // Simulate judge response to photo
    setTimeout(() => {
      const judgeResponse = {
        id: messages.length + 2,
        text: "I can see the cards clearly! Let me help you with that interaction.",
        sender: "judge",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
      };
      setMessages(prev => [...prev, judgeResponse]);
    }, 2000);
  };

  const handleMic = () => {
    Alert.alert(
      'Voice Message',
      'Record a voice message',
      [{ text: 'OK' }]
    );
  };

  const handlePhone = () => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // On mobile, offer real call options
      Alert.alert(
        'Appel vocal',
        'Choisissez votre méthode d\'appel :',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Téléphone', onPress: () => openPhoneApp() },
          { text: 'WhatsApp', onPress: () => openWhatsAppCall() },
          { text: 'Interface Démo', onPress: () => setShowVoiceCall(true) }
        ]
      );
    } else {
      setShowVoiceCall(true);
    }
  };

  const openWhatsAppCall = async () => {
    try {
      // Try multiple WhatsApp URL schemes
      const whatsappUrls = [
        `whatsapp://send?phone=${testPhoneNumber}`, // More reliable for opening WhatsApp
        `https://wa.me/${testPhoneNumber}`, // Web fallback
        `https://api.whatsapp.com/send?phone=${testPhoneNumber}` // Alternative web
      ];
      
      let opened = false;
      
      for (const url of whatsappUrls) {
        try {
          const supported = await Linking.canOpenURL(url);
          if (supported) {
            await Linking.openURL(url);
            opened = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }
      const supported = await Linking.canOpenURL(whatsappUrl);
      
      if (!opened) {
        Alert.alert(
          'WhatsApp non disponible', 
          'WhatsApp n\'est pas installé ou disponible. Voulez-vous l\'installer ?',
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

  const openPhoneApp = async () => {
    try {
      const url = `tel:${testPhoneNumber}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Phone calls not supported');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to make call');
    }
  };

  const handleVideo = () => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // On mobile, offer real video call options
      Alert.alert(
        'Appel vidéo',
        'Choisissez votre méthode d\'appel vidéo :',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'WhatsApp Vidéo', onPress: () => openWhatsAppVideo() },
          { text: 'FaceTime', onPress: () => openFaceTime() },
          { text: 'Google Meet', onPress: () => openGoogleMeet() },
          { text: 'Interface Démo', onPress: () => setShowVideoCall(true) }
        ]
      );
    } else {
      setShowVideoCall(true);
    }
  };

  const openGoogleMeet = async () => {
    try {
      const meetUrl = 'https://meet.google.com/new';
      const supported = await Linking.canOpenURL(meetUrl);
      
      if (supported) {
        await Linking.openURL(meetUrl);
      } else {
        Alert.alert('Google Meet non disponible', 'Impossible d\'ouvrir Google Meet');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir Google Meet');
    }
  };

  const openWhatsAppVideo = async () => {
    try {
      // Try multiple approaches for WhatsApp video
      const whatsappUrls = [
        `whatsapp://send?phone=${testPhoneNumber}&text=Bonjour, pouvons-nous faire un appel vidéo ?`,
        `https://wa.me/${testPhoneNumber}?text=Bonjour, pouvons-nous faire un appel vidéo ?`,
        `https://api.whatsapp.com/send?phone=${testPhoneNumber}&text=Appel vidéo`
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
              'Une fois dans WhatsApp, vous pouvez démarrer un appel vidéo en appuyant sur l\'icône caméra.'
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
      const facetimeUrl = `facetime://${testPhoneNumber}`;
      const supported = await Linking.canOpenURL(facetimeUrl);
      
      if (supported) {
        await Linking.openURL(facetimeUrl);
      } else {
        Alert.alert('FaceTime not available', 'FaceTime not supported on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open FaceTime');
    }
  };

  const handleMore = () => {
    Alert.alert(
      'Conversation Options',
      'Choose an option:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Conversation', onPress: () => handleEndConversation() },
        { text: 'Rate Judge', onPress: () => setShowRating(true) },
        { text: 'Report Issue', onPress: () => handleReportIssue() }
      ]
    );
  };

  const handleEndConversation = () => {
    Alert.alert(
      'End Conversation',
      'Are you sure you want to end this conversation with the judge?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Conversation', 
          style: 'destructive',
          onPress: () => {
            setConversationEnded(true);
            setShowRating(true);
          }
        }
      ]
    );
  };

  const handleReportIssue = () => {
    Alert.alert(
      'Report Issue',
      'What type of issue would you like to report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Inappropriate Behavior' },
        { text: 'Incorrect Ruling' },
        { text: 'Technical Issue' },
        { text: 'Other' }
      ]
    );
  };

  const handleRating = (rating: number) => {
    Alert.alert(
      'Thank You!',
      `You rated this conversation ${rating}/5 stars. Your feedback helps improve our service.`,
      [
        {
          text: 'Done',
          onPress: () => {
            setShowRating(false);
            router.push('/');
          }
        }
      ]
    );
  };

  // Show camera screen
  if (showCamera) {
    return (
      <CameraScreen
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />
    );
  }

  // Show voice call screen
  if (showVoiceCall) {
    return (
      <VoiceCallScreen
        onEndCall={() => setShowVoiceCall(false)}
        judgeInfo={judgeInfo}
        phoneNumber={testPhoneNumber}
      />
    );
  }

  // Show video call screen
  if (showVideoCall) {
    return (
      <VideoCallScreen
        onEndCall={() => setShowVideoCall(false)}
        judgeInfo={judgeInfo}
        phoneNumber={testPhoneNumber}
      />
    );
  }

  // Show rating modal
  if (showRating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>Rate Your Experience</Text>
          <Text style={styles.ratingSubtitle}>
            How was your conversation with {judgeInfo.name}?
          </Text>
          
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                style={styles.starButton}
                onPress={() => handleRating(star)}
              >
                <Star size={40} color="#f59e0b" fill="#f59e0b" />
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => {
              setShowRating(false);
              router.push('/');
            }}
          >
            <Text style={styles.skipButtonText}>Skip Rating</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e3a8a', '#3730a3']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.judgeInfo}>
            <Image 
              source={{ uri: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" }} 
              style={styles.judgeAvatar}
            />
            <View style={styles.judgeDetails}>
              <Text style={styles.judgeName}>Sarah Chen</Text>
              <Text style={styles.judgeStatus}>
                Level 3 Judge • {conversationEnded ? 'Conversation Ended' : 'Active'}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.actionButton, conversationEnded && styles.disabledButton]} 
              onPress={handlePhone}
              disabled={conversationEnded}
            >
              <Phone size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, conversationEnded && styles.disabledButton]} 
              onPress={handleVideo}
              disabled={conversationEnded}
            >
              <Video size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleMore}>
              <MoreHorizontal size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[
              styles.messageContainer,
              msg.sender === 'user' ? styles.userMessage : styles.judgeMessage
            ]}>
              {msg.sender === 'judge' && (
                <Image source={{ uri: msg.avatar }} style={styles.messageAvatar} />
              )}
              <View style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.judgeBubble
              ]}>
                <Text style={[
                  styles.messageText,
                  msg.sender === 'user' ? styles.userText : styles.judgeText
                ]}>
                  {msg.text}
                </Text>
                {msg.image && (
                  <Image 
                    source={{ uri: msg.image }} 
                    style={styles.messageImage}
                    resizeMode="cover"
                  />
                )}
                <Text style={[
                  styles.messageTime,
                  msg.sender === 'user' ? styles.userTime : styles.judgeTime
                ]}>
                  {msg.time}
                </Text>
              </View>
              {msg.sender === 'user' && (
                <Image source={{ uri: msg.avatar }} style={styles.messageAvatar} />
              )}
            </View>
          ))}
          
          {isTyping && (
            <View style={styles.typingIndicator}>
              <Image 
                source={{ uri: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" }} 
                style={styles.messageAvatar} 
              />
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>Judge is typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {conversationEnded && (
          <View style={styles.conversationEndedBanner}>
            <Text style={styles.conversationEndedText}>
              Conversation ended. Rate your experience above.
            </Text>
          </View>
        )}

        <View style={[styles.inputContainer, conversationEnded && styles.inputContainerDisabled]}>
          <View style={styles.inputRow}>
            <TouchableOpacity 
              style={[styles.inputAction, conversationEnded && styles.disabledButton]} 
              onPress={handleCamera}
              disabled={conversationEnded}
            >
              <Camera size={24} color="#64748b" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder={conversationEnded ? "Conversation ended" : "Type your message..."}
              placeholderTextColor="#64748b"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              editable={!conversationEnded}
            />
            <TouchableOpacity 
              style={[styles.inputAction, conversationEnded && styles.disabledButton]} 
              onPress={handleMic}
              disabled={conversationEnded}
            >
              <Mic size={24} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                { opacity: (message.trim() && !conversationEnded) ? 1 : 0.5 }
              ]}
              onPress={handleSend}
              disabled={!message.trim() || conversationEnded}
            >
              <Send size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  judgeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  judgeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  judgeDetails: {
    marginLeft: 12,
  },
  judgeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  judgeStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 100,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  judgeMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
  },
  judgeBubble: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  judgeText: {
    color: '#e2e8f0',
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  judgeTime: {
    color: '#64748b',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginTop: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  typingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  conversationEndedBanner: {
    backgroundColor: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#4b5563',
  },
  conversationEndedText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#d1d5db',
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  inputContainerDisabled: {
    opacity: 0.6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  inputAction: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    padding: 12,
  },
  ratingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#0f172a',
  },
  ratingTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  ratingSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 40,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  starButton: {
    padding: 8,
  },
  skipButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
    textDecorationLine: 'underline',
  },
});