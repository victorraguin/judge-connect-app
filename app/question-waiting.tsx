import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Users, MessageCircle } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';

export default function QuestionWaitingScreen() {
  const [waitingTime, setWaitingTime] = useState(0);
  const [availableJudges] = useState(3); // Simulated number of available judges

  useEffect(() => {
    const timer = setInterval(() => {
      setWaitingTime(prev => prev + 1);
    }, 1000);

    // Simulate judge accepting question after 10-30 seconds
    const acceptTimer = setTimeout(() => {
      Alert.alert(
        'Judge Found!',
        'Sarah Chen (Level 3 Judge) has accepted your question and started a conversation.',
        [
          {
            text: 'Start Chat',
            onPress: () => router.push('/chat')
          }
        ]
      );
    }, Math.random() * 20000 + 10000); // 10-30 seconds

    return () => {
      clearInterval(timer);
      clearTimeout(acceptTimer);
    };
  }, []);

  const handleBack = () => {
    Alert.alert(
      'Cancel Question',
      'Are you sure you want to cancel your question? You can ask again anytime.',
      [
        { text: 'Keep Waiting', style: 'cancel' },
        { 
          text: 'Cancel Question', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          <Text style={styles.title}>Waiting for Judge</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.waitingIndicator}>
          <View style={styles.pulseContainer}>
            <View style={styles.pulseOuter}>
              <View style={styles.pulseInner}>
                <MessageCircle size={48} color="#ffffff" />
              </View>
            </View>
          </View>
          
          <Text style={styles.waitingTitle}>Looking for an available judge...</Text>
          <Text style={styles.waitingSubtitle}>
            Your question has been sent to all online judges
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Clock size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>{formatTime(waitingTime)}</Text>
            <Text style={styles.statLabel}>Waiting Time</Text>
          </View>
          
          <View style={styles.statCard}>
            <Users size={24} color="#10b981" />
            <Text style={styles.statNumber}>{availableJudges}</Text>
            <Text style={styles.statLabel}>Judges Online</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <View style={styles.infoSteps}>
            <View style={styles.infoStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Available judges see your question notification
              </Text>
            </View>
            
            <View style={styles.infoStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                First judge to accept starts a private conversation
              </Text>
            </View>
            
            <View style={styles.infoStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Judge may offer text, voice, or video assistance
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>💡 Tip</Text>
          <Text style={styles.tipText}>
            Average response time is under 2 minutes during peak hours. 
            Judges prioritize clear, detailed questions.
          </Text>
        </View>
      </View>
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
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  waitingIndicator: {
    alignItems: 'center',
    marginBottom: 40,
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pulseOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    // Add animation here if needed
  },
  pulseInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  waitingSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  infoSteps: {
    gap: 16,
  },
  infoStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    lineHeight: 20,
  },
  tipContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#f59e0b',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#fbbf24',
    lineHeight: 20,
  },
});