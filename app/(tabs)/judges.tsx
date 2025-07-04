import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Filter, Star, Award, MessageCircle, Phone, Video, Clock } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import VoiceCallScreen from '@/components/VoiceCallScreen';
import VideoCallScreen from '@/components/VideoCallScreen';

const judges = [
  {
    id: 1,
    name: "Sarah Chen",
    level: "L3",
    points: 2840,
    rating: 4.9,
    specialty: "Competitive REL",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    online: true,
    responseTime: "< 2 min",
    languages: ["English", "Chinese"],
    badges: ["Expert", "Fast Response", "Certified"]
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    level: "L2",
    points: 1920,
    rating: 4.8,
    specialty: "Rules Interactions",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    online: true,
    responseTime: "< 5 min",
    languages: ["English", "Spanish"],
    badges: ["Detailed", "Patient"]
  },
  {
    id: 3,
    name: "Emily Johnson",
    level: "L2",
    points: 1654,
    rating: 4.7,
    specialty: "Limited & Draft",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    online: false,
    responseTime: "< 10 min",
    languages: ["English"],
    badges: ["Limited Expert"]
  },
  {
    id: 4,
    name: "David Kim",
    level: "L3",
    points: 3120,
    rating: 4.9,
    specialty: "Modern & Legacy",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    online: true,
    responseTime: "< 1 min",
    languages: ["English", "Korean"],
    badges: ["Lightning Fast", "Format Expert", "Certified"]
  },
  {
    id: 5,
    name: "Anna Kowalski",
    level: "L2",
    points: 1435,
    rating: 4.6,
    specialty: "Commander & Casual",
    avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    online: true,
    responseTime: "< 3 min",
    languages: ["English", "Polish"],
    badges: ["Casual Expert", "Friendly"]
  }
];

export default function JudgesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredJudges = judges.filter(judge => {
    const matchesSearch = judge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      judge.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'online') {
      return matchesSearch && judge.online;
    } else if (selectedFilter === 'l3') {
      return matchesSearch && judge.level === 'L3';
    }
    
    return matchesSearch;
  });

  const handleFilterPress = () => {
    Alert.alert(
      'Filters',
      'Filter options:\n• By specialty\n• By rating\n• By response time\n• By language',
      [{ text: 'OK' }]
    );
  };

  const handleJudgePress = (judge: any) => {
    Alert.alert(
      judge.name,
      `Level ${judge.level} Judge\nSpecialty: ${judge.specialty}\nRating: ${judge.rating}/5\nResponse time: ${judge.responseTime}\n\nNote: You cannot contact judges directly. Please ask a question and available judges will respond.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e3a8a', '#3730a3', '#7c3aed']}
        style={styles.header}
      >
        <Text style={styles.title}>Available Judges</Text>
        <Text style={styles.subtitle}>View judge profiles and stats</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <Search size={20} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search judges or specialties..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
            <Filter size={20} color="#f59e0b" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterTabs}>
          <TouchableOpacity 
            style={[styles.filterTab, selectedFilter === 'all' && styles.activeTab]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
              All ({judges.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, selectedFilter === 'online' && styles.activeTab]}
            onPress={() => setSelectedFilter('online')}
          >
            <Text style={[styles.filterText, selectedFilter === 'online' && styles.activeFilterText]}>
              Online ({judges.filter(j => j.online).length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, selectedFilter === 'l3' && styles.activeTab]}
            onPress={() => setSelectedFilter('l3')}
          >
            <Text style={[styles.filterText, selectedFilter === 'l3' && styles.activeFilterText]}>
              Level 3
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.judgesList}>
          {filteredJudges.map((judge) => (
            <TouchableOpacity 
              key={judge.id} 
              style={styles.judgeCard}
              onPress={() => handleJudgePress(judge)}
            >
              <View style={styles.judgeHeader}>
                <View style={styles.judgeImageContainer}>
                  <Image 
                    source={{ uri: judge.avatar }} 
                    style={styles.judgeImage}
                  />
                  <View style={[styles.statusDot, { backgroundColor: judge.online ? '#10b981' : '#6b7280' }]} />
                </View>
                <View style={styles.judgeInfo}>
                  <View style={styles.judgeNameRow}>
                    <Text style={styles.judgeName}>{judge.name}</Text>
                    <View style={styles.judgeLevel}>
                      <Award size={16} color="#f59e0b" />
                      <Text style={styles.levelText}>{judge.level}</Text>
                    </View>
                  </View>
                  <Text style={styles.specialty}>{judge.specialty}</Text>
                  <View style={styles.ratingRow}>
                    <Star size={14} color="#f59e0b" />
                    <Text style={styles.rating}>{judge.rating}</Text>
                    <Text style={styles.points}>• {judge.points} pts</Text>
                  </View>
                </View>
              </View>

              <View style={styles.badgesContainer}>
                {judge.badges.map((badge, index) => (
                  <View key={index} style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.judgeDetails}>
                <View style={styles.detailRow}>
                  <Clock size={16} color="#64748b" />
                  <Text style={styles.detailText}>Response time: {judge.responseTime}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.languageLabel}>Languages:</Text>
                  <Text style={styles.languages}>{judge.languages.join(', ')}</Text>
                </View>
              </View>

              <View style={styles.contactNote}>
                <MessageCircle size={16} color="#64748b" />
                <Text style={styles.contactNoteText}>
                  Ask a question to connect with available judges
                </Text>
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
    paddingVertical: 20,
    paddingBottom: 24,
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
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  searchRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    marginLeft: 12,
  },
  filterButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTab: {
    backgroundColor: '#f59e0b',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#e2e8f0',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  judgesList: {
    padding: 20,
  },
  judgeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  judgeHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  judgeImageContainer: {
    position: 'relative',
    marginRight: 16,
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
  judgeInfo: {
    flex: 1,
  },
  judgeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  judgeName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  judgeLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#f59e0b',
    marginLeft: 4,
  },
  specialty: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#f59e0b',
    marginLeft: 4,
  },
  points: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginLeft: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#7c3aed',
  },
  judgeDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    marginLeft: 8,
  },
  languageLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94a3b8',
  },
  languages: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    marginLeft: 8,
  },
  contactNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 8,
  },
  contactNoteText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
  },
});