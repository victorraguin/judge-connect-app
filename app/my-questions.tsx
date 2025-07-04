import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MessageCircle, Clock, Star, CircleCheck as CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';

const questions = [
  {
    id: 1,
    title: 'Lightning Bolt vs Counterspell interaction',
    category: 'Stack Interaction',
    status: 'completed',
    judge: 'Sarah Chen',
    rating: 5,
    timeAgo: '2 hours ago',
    responseTime: '1 min'
  },
  {
    id: 2,
    title: 'Planeswalker loyalty timing rules',
    category: 'Planeswalkers',
    status: 'waiting_for_judge',
    timeAgo: '12 min ago'
  },
  {
    id: 3,
    title: 'Double-faced cards in draft format',
    category: 'Limited Format',
    status: 'completed',
    judge: 'Emily Johnson',
    rating: 4,
    timeAgo: '1 day ago',
    responseTime: '3 min'
  },
  {
    id: 4,
    title: 'Mana abilities and the stack',
    category: 'Rules Interaction',
    status: 'completed',
    judge: 'Marcus Rodriguez',
    rating: 5,
    timeAgo: '2 days ago',
    responseTime: '45 sec'
  },
  {
    id: 5,
    title: 'Commander damage rules',
    category: 'Commander',
    status: 'completed',
    judge: 'David Kim',
    rating: 5,
    timeAgo: '1 week ago',
    responseTime: '2 min'
  }
];

export default function MyQuestionsScreen() {
  const handleBack = () => {
    router.back();
  };

  const handleQuestionPress = (question: any) => {
    if (question.status === 'waiting_for_judge') {
      router.push('/question-waiting');
    } else {
      router.push('/chat');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'waiting_for_judge':
        return '#f59e0b';
      case 'in_progress':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'waiting_for_judge':
        return 'Waiting for Judge';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Unknown';
    }
  };

  const completedQuestions = questions.filter(q => q.status === 'completed');
  const pendingQuestions = questions.filter(q => q.status !== 'completed');

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
          <Text style={styles.title}>My Questions</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MessageCircle size={24} color="#3b82f6" />
            <Text style={styles.statNumber}>{questions.length}</Text>
            <Text style={styles.statLabel}>Total Questions</Text>
          </View>
          
          <View style={styles.statCard}>
            <CheckCircle size={24} color="#10b981" />
            <Text style={styles.statNumber}>{completedQuestions.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <Clock size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>{pendingQuestions.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {pendingQuestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Questions</Text>
            {pendingQuestions.map((question) => (
              <TouchableOpacity 
                key={question.id} 
                style={styles.questionCard}
                onPress={() => handleQuestionPress(question)}
              >
                <View style={styles.questionHeader}>
                  <View style={styles.questionMeta}>
                    <Text style={styles.questionCategory}>{question.category}</Text>
                    <Text style={styles.questionTime}>{question.timeAgo}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(question.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(question.status)}</Text>
                  </View>
                </View>
                <Text style={styles.questionTitle}>{question.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed Questions</Text>
          {completedQuestions.map((question) => (
            <TouchableOpacity 
              key={question.id} 
              style={styles.questionCard}
              onPress={() => handleQuestionPress(question)}
            >
              <View style={styles.questionHeader}>
                <View style={styles.questionMeta}>
                  <Text style={styles.questionCategory}>{question.category}</Text>
                  <Text style={styles.questionTime}>{question.timeAgo}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(question.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(question.status)}</Text>
                </View>
              </View>
              <Text style={styles.questionTitle}>{question.title}</Text>
              
              <View style={styles.completedInfo}>
                <Text style={styles.judgeInfo}>Answered by {question.judge}</Text>
                <View style={styles.responseInfo}>
                  <Clock size={14} color="#64748b" />
                  <Text style={styles.responseTime}>Response: {question.responseTime}</Text>
                </View>
              </View>
              
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Your rating:</Text>
                <View style={styles.ratingRow}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      color={i < question.rating ? '#f59e0b' : '#374151'}
                      fill={i < question.rating ? '#f59e0b' : 'none'}
                    />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 16,
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
  completedInfo: {
    marginBottom: 12,
  },
  judgeInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#10b981',
    marginBottom: 4,
  },
  responseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  responseTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  ratingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#e2e8f0',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
  },
});