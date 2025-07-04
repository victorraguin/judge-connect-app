import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Star, MessageCircle, Award, TrendingUp, Users, Clock, CreditCard as Edit } from 'lucide-react-native';
import { router } from 'expo-router';

const userStats = [
  { label: 'Questions Asked', value: 23, icon: MessageCircle, color: '#3b82f6' },
  { label: 'Answered', value: 18, icon: TrendingUp, color: '#10b981' },
  { label: 'Avg Rating Given', value: 4.9, icon: Star, color: '#f59e0b' },
  { label: 'Judges Helped By', value: 7, icon: Users, color: '#8b5cf6' },
];

const recentQuestions = [
  {
    id: 1,
    title: 'Lightning Bolt vs Counterspell',
    judge: 'Sarah Chen',
    rating: 5,
    time: '2 hours ago',
    status: 'completed'
  },
  {
    id: 2,
    title: 'Planeswalker loyalty timing',
    judge: 'Marcus Rodriguez',
    rating: 5,
    time: '1 day ago',
    status: 'completed'
  },
  {
    id: 3,
    title: 'Double-faced cards in draft',
    judge: 'Emily Johnson',
    rating: 4,
    time: '3 days ago',
    status: 'completed'
  },
];

export default function ProfileScreen() {
  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing options:\n• Change avatar\n• Update bio\n• Modify preferences\n• Update contact info',
      [{ text: 'OK' }]
    );
  };

  const handleSettings = () => {
    Alert.alert(
      'Settings',
      'App settings:\n• Notifications\n• Privacy\n• Account\n• Help & Support',
      [{ text: 'OK' }]
    );
  };

  const handleStatPress = (stat: any) => {
    if (stat.label === 'Questions Asked' || stat.label === 'Answered') {
      router.push('/my-questions');
    } else {
      Alert.alert(stat.label, `You have ${stat.value} ${stat.label.toLowerCase()}`);
    }
  };

  const handleQuestionPress = (question: any) => {
    Alert.alert(
      question.title,
      `Judge: ${question.judge}\nRating: ${question.rating}/5 stars\nTime: ${question.time}`,
      [{ text: 'OK' }]
    );
  };

  const handlePreferencePress = (preference: string) => {
    Alert.alert(
      preference,
      `Configure your ${preference.toLowerCase()} settings`,
      [{ text: 'OK' }]
    );
  };

  const handleAskQuestion = () => {
    router.push('/ask-question');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e3a8a', '#3730a3', '#7c3aed']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.profileInfo}>
            <TouchableOpacity onPress={handleEditProfile}>
              <Image 
                source={{ uri: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" }} 
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Alex Johnson</Text>
              <Text style={styles.userTitle}>Magic Player</Text>
              <View style={styles.memberSince}>
                <Text style={styles.memberText}>Member since March 2024</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Edit size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
              <Settings size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActionSection}>
          <TouchableOpacity style={styles.askQuestionButton} onPress={handleAskQuestion}>
            <MessageCircle size={24} color="#ffffff" />
            <Text style={styles.askQuestionText}>Ask a New Question</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            {userStats.map((stat, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.statCard}
                onPress={() => handleStatPress(stat)}
              >
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <stat.icon size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Questions</Text>
          <View style={styles.questionsList}>
            {recentQuestions.map((question) => (
              <TouchableOpacity 
                key={question.id} 
                style={styles.questionCard}
                onPress={() => handleQuestionPress(question)}
              >
                <View style={styles.questionContent}>
                  <Text style={styles.questionTitle}>{question.title}</Text>
                  <Text style={styles.questionJudge}>Answered by {question.judge}</Text>
                  <View style={styles.questionMeta}>
                    <View style={styles.ratingRow}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          color={i < question.rating ? '#f59e0b' : '#374151'}
                          fill={i < question.rating ? '#f59e0b' : 'none'}
                        />
                      ))}
                    </View>
                    <Text style={styles.questionTime}>{question.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.preferencesList}>
            <TouchableOpacity 
              style={styles.preferenceItem}
              onPress={() => handlePreferencePress('Notification Settings')}
            >
              <Text style={styles.preferenceLabel}>Notification Settings</Text>
              <Text style={styles.preferenceValue}>All enabled</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.preferenceItem}
              onPress={() => handlePreferencePress('Preferred Judge Level')}
            >
              <Text style={styles.preferenceLabel}>Preferred Judge Level</Text>
              <Text style={styles.preferenceValue}>Any level</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.preferenceItem}
              onPress={() => handlePreferencePress('Response Time')}
            >
              <Text style={styles.preferenceLabel}>Response Time</Text>
              <Text style={styles.preferenceValue}>Within 5 minutes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.preferenceItem}
              onPress={() => handlePreferencePress('Language')}
            >
              <Text style={styles.preferenceLabel}>Language</Text>
              <Text style={styles.preferenceValue}>English</Text>
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  userTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    marginTop: 4,
  },
  memberSince: {
    marginTop: 8,
  },
  memberText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  settingsButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickActionSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  askQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  askQuestionText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  questionsList: {
    gap: 12,
  },
  questionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  questionContent: {
    gap: 8,
  },
  questionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  questionJudge: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
  },
  questionTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  preferencesList: {
    gap: 12,
  },
  preferenceItem: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
  },
  preferenceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  preferenceValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
});