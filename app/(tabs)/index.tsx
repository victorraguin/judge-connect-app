import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, MessageCircle, Phone, Video, Camera, Star, Award, TrendingUp, Users } from 'lucide-react-native';
import { router, useRouter } from 'expo-router';
import { useState } from 'react';
import CameraScreen from '@/components/CameraScreen';

const recentQuestions = [
  {
    id: 1,
    title: "Lightning Bolt vs Counterspell interaction",
    category: "Stack Interaction",
    timeAgo: "5 min ago",
    status: "answered",
    judgeAssigned: "Sarah Chen"
  },
  {
    id: 2,
    title: "Planeswalker loyalty timing rules",
    category: "Planeswalkers",
    timeAgo: "12 min ago",
    status: "waiting_for_judge"
  },
  {
    id: 3,
    title: "Double-faced cards in draft",
    category: "Limited Format",
    timeAgo: "1 hour ago",
    status: "answered",
    judgeAssigned: "Emily Johnson"
  }
];

const topJudges = [
  {
    id: 1,
    name: "Sarah Chen",
    level: "L3",
    points: 2840,
    specialty: "Competitive REL",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    online: true
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    level: "L2",
    points: 1920,
    specialty: "Rules Interactions",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    online: true
  },
  {
    id: 3,
    name: "Emily Johnson",
    level: "L2",
    points: 1654,
    specialty: "Limited & Draft",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    online: false
  }
];

export default function HomeScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const routerInstance = useRouter();

  const handleAskQuestion = () => {
    router.push('/ask-question');
  };

  const handleCardPhoto = () => {
    setShowCamera(true);
  };

  const handleCameraCapture = (uri: string) => {
    setShowCamera(false);
    // Navigate to chat with the captured image
    router.push('/ask-question');
  };

  const handleQuestionPress = (questionId: number) => {
    router.push(`/question/${questionId}`);
  };

  const handleViewAllJudges = () => {
    router.push('/judges');
  };

  const handleViewAllQuestions = () => {
    router.push('/my-questions');
  };

  const handleSearch = () => {
    router.push('/judges');
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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e3a8a', '#3730a3', '#7c3aed']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>MTG Judge Connect</Text>
          <Text style={styles.subtitle}>Get expert rulings instantly</Text>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Search size={24} color="#ffffff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handleAskQuestion}>
              <MessageCircle size={28} color="#f59e0b" />
              <Text style={styles.actionText}>Ask Judge</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={handleViewAllJudges}>
              <Users size={28} color="#10b981" />
              <Text style={styles.actionText}>View Judges</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={handleViewAllQuestions}>
              <TrendingUp size={28} color="#3b82f6" />
              <Text style={styles.actionText}>My Questions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={handleCardPhoto}>
              <Camera size={28} color="#8b5cf6" />
              <Text style={styles.actionText}>Card Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Judges</Text>
            <TouchableOpacity onPress={handleViewAllJudges}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.judgesList}>
              {topJudges.map((judge) => (
                <View key={judge.id} style={styles.judgeCard}>
                  <View style={styles.judgeImageContainer}>
                    <Image 
                      source={{ uri: judge.avatar }} 
                      style={styles.judgeImage}
                    />
                    <View style={[styles.statusDot, { backgroundColor: judge.online ? '#10b981' : '#6b7280' }]} />
                  </View>
                  <Text style={styles.judgeName}>{judge.name}</Text>
                  <View style={styles.judgeLevel}>
                    <Award size={16} color="#f59e0b" />
                    <Text style={styles.levelText}>{judge.level}</Text>
                  </View>
                  <Text style={styles.specialty}>{judge.specialty}</Text>
                  <View style={styles.pointsRow}>
                    <Star size={14} color="#f59e0b" />
                    <Text style={styles.points}>{judge.points} pts</Text>
                  </View>
                  <Text style={styles.judgeNote}>Available for questions</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Recent Questions</Text>
            <TouchableOpacity onPress={handleViewAllQuestions}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentQuestions.map((question) => (
            <TouchableOpacity 
              key={question.id} 
              style={styles.questionCard}
              onPress={() => handleQuestionPress(question.id)}
            >
              <View style={styles.questionHeader}>
                <View style={styles.questionMeta}>
                  <Text style={styles.questionCategory}>{question.category}</Text>
                  <Text style={styles.questionTime}>{question.timeAgo}</Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: 
                    question.status === 'answered' ? '#10b981' : 
                    question.status === 'waiting_for_judge' ? '#f59e0b' : '#6b7280' 
                  }
                ]}>
                  <Text style={styles.statusText}>
                    {question.status === 'answered' ? 'Answered' : 
                     question.status === 'waiting_for_judge' ? 'Waiting' : 'Pending'}
                  </Text>
                </View>
              </View>
              <Text style={styles.questionTitle}>{question.title}</Text>
              {question.judgeAssigned && (
                <Text style={styles.judgeAssigned}>Assigned to: {question.judgeAssigned}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity style={styles.statCard} onPress={handleViewAllQuestions}>
              <MessageCircle size={24} color="#3b82f6" />
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Questions Asked</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard} onPress={handleViewAllQuestions}>
              <TrendingUp size={24} color="#10b981" />
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Answered</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/profile')}>
              <Star size={24} color="#f59e0b" />
              <Text style={styles.statNumber}>4.9</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    marginTop: 4,
  },
  searchButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickActions: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#e2e8f0',
    marginTop: 8,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#f59e0b',
  },
  judgesList: {
    flexDirection: 'row',
    gap: 16,
  },
  judgeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    width: 180,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  judgeImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  judgeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  judgeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  judgeLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#f59e0b',
    marginLeft: 4,
  },
  specialty: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 8,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#f59e0b',
    marginLeft: 4,
  },
  judgeNote: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#10b981',
    textAlign: 'center',
    marginTop: 4,
  },
  questionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionCategory: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#7c3aed',
    marginRight: 12,
  },
  questionTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  questionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  judgeAssigned: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#10b981',
  },
  statsSection: {
    marginTop: 32,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
});