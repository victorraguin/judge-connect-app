import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, Camera, Image as ImageIcon } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import CameraScreen from '@/components/CameraScreen';

const categories = [
  'Rules Interaction',
  'Stack & Priority',
  'Planeswalkers',
  'Limited Format',
  'Modern & Legacy',
  'Commander',
  'Tournament Rules',
  'Other'
];

export default function AskQuestionScreen() {
  const [question, setQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleCameraCapture = (uri: string) => {
    setShowCamera(false);
    setAttachedImage(uri);
  };

  const handleSubmitQuestion = () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter your question');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    // Simulate question submission
    Alert.alert(
      'Question Submitted!',
      'Your question has been sent to available judges. You will be notified when a judge accepts your question.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to a waiting screen or back to home
            router.push('/question-waiting');
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
          <Text style={styles.title}>Ask a Judge</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Question</Text>
          <TextInput
            style={styles.questionInput}
            placeholder="Describe your Magic rules question in detail..."
            placeholderTextColor="#64748b"
            value={question}
            onChangeText={setQuestion}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments (Optional)</Text>
          <View style={styles.attachmentButtons}>
            <TouchableOpacity 
              style={styles.attachmentButton}
              onPress={() => setShowCamera(true)}
            >
              <Camera size={24} color="#3b82f6" />
              <Text style={styles.attachmentText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.attachmentButton}
              onPress={() => Alert.alert('Gallery', 'Gallery picker would be implemented here')}
            >
              <ImageIcon size={24} color="#3b82f6" />
              <Text style={styles.attachmentText}>From Gallery</Text>
            </TouchableOpacity>
          </View>
          
          {attachedImage && (
            <View style={styles.attachedImageContainer}>
              <Text style={styles.attachedImageText}>✓ Image attached</Text>
              <TouchableOpacity onPress={() => setAttachedImage(null)}>
                <Text style={styles.removeImageText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            1. Submit your question with category and details{'\n'}
            2. Available judges will see your question{'\n'}
            3. First judge to accept will start a conversation{'\n'}
            4. Judge may offer text, voice, or video assistance{'\n'}
            5. Rate your experience when complete
          </Text>
        </View>
      </ScrollView>

      <View style={styles.submitContainer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!question.trim() || !selectedCategory) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmitQuestion}
          disabled={!question.trim() || !selectedCategory}
        >
          <Send size={20} color="#ffffff" />
          <Text style={styles.submitButtonText}>Submit Question</Text>
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedCategory: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#e2e8f0',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  questionInput: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 120,
  },
  attachmentButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  attachmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  attachmentText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#e2e8f0',
  },
  attachedImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  attachedImageText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  removeImageText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  infoSection: {
    marginTop: 32,
    marginBottom: 100,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    lineHeight: 20,
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});