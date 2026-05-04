import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import GoalCard from '../components/GoalCard';
import JournalEntryCard from '../components/JournalEntryCard';
import { mockGoals, mockEntries } from '../data/mockData';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [goals] = useState(mockGoals);
  const [entries] = useState(mockEntries);

  const calculateProgress = (goalId: string) => {
    const relatedEntries = entries.filter(entry => entry.goalIds.includes(goalId));
    // Simple progress calculation: 10% per entry, max 100%
    return Math.min(relatedEntries.length * 10, 100);
  };

  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back! 👋</Text>
              <Text style={styles.date}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('NewEntry')}
            >
              <MaterialIcons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.quickStats}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <MaterialIcons name="flag" size={24} color="#fff" />
              </View>
              <Text style={styles.statNumber}>{goals.length}</Text>
              <Text style={styles.statLabel}>Active Goals</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <MaterialIcons name="book" size={24} color="#fff" />
              </View>
              <Text style={styles.statNumber}>{entries.length}</Text>
              <Text style={styles.statLabel}>Journal Entries</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <MaterialIcons name="trending-up" size={24} color="#fff" />
              </View>
              <Text style={styles.statNumber}>{Math.round(goals.reduce((acc, goal) => acc + calculateProgress(goal.id), 0) / Math.max(goals.length, 1))}%</Text>
              <Text style={styles.statLabel}>Avg Progress</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="flag" size={24} color="#667eea" />
              <Text style={styles.sectionTitle}>Your Goals</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>

          {goals.slice(0, 2).map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              progress={calculateProgress(goal.id)}
              onPress={() => navigation.navigate('GoalDetail', { goalId: goal.id })}
            />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="book" size={24} color="#667eea" />
              <Text style={styles.sectionTitle}>Recent Entries</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Journal')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>

          {recentEntries.map(entry => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              onPress={() => navigation.navigate('EntryDetail', { entryId: entry.id })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginLeft: 8,
  },
  seeAll: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
});