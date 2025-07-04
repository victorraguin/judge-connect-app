import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function SignInScreen() {
  const { user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      router.replace('/(tabs)');
    }
  }, [user, loading]);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e3a8a', '#3730a3', '#7c3aed']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' }}
              style={styles.logo}
            />
            <Text style={styles.title}>MTG Judge Connect</Text>
            <Text style={styles.subtitle}>
              Connect with certified Magic: The Gathering judges for instant rule clarifications
            </Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>Instant responses from certified judges</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Expert rulings for all formats</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureText}>Text, voice, and video support</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⭐</Text>
              <Text style={styles.featureText}>Rate and review judge interactions</Text>
            </View>
          </View>

          <View style={styles.authSection}>
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    flex: 1,
  },
  authSection: {
    gap: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  googleIcon: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#4285f4',
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 16,
  },
});