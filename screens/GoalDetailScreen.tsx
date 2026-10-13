import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import JournalEntryCard from '../components/JournalEntryCard';
import { mockGoals, mockEntries } from '../data/mockData';

interface GoalDetailScreenProps {
  navigation: any;
  route: any;
}

export default function GoalDetailScreen({ navigation, route }: GoalDetailScreenProps) {
  const { goalId } = route.params;
  const goal = mockGoals.find(g => g.id === goalId);

  if (!goal) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Goal not found</Text>
      </SafeAreaView>
    );
  }

  const relatedEntries = mockEntries
    .filter(entry => entry.goalIds.includes(goalId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const progress = Math.min(relatedEntries.length * 10, 100);
  const daysUntilTarget = Math.ceil(
    (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return 'fitness-center';
      case 'career': return 'work';
      case 'personal': return 'person';
      case 'finance': return 'attach-money';
      case 'learning': return 'school';
      default: return 'flag';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="edit" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroSection, { backgroundColor: goal.color + '20' }]}>
          <MaterialIcons name={getCategoryIcon(goal.category)} size={48} color={goal.color} />
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <Text style={styles.goalDescription}>{goal.description}</Text>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{progress}%</Text>
            <Text style={styles.statLabel}>Progress</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress}%`, backgroundColor: goal.color }
                ]} 
              />
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{relatedEntries.length}</Text>
            <Text style={styles.statLabel}>Journal Entries</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{daysUntilTarget > 0 ? daysUntilTarget : 0}</Text>
            <Text style={styles.statLabel}>Days Remaining</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Target Date</Text>
              <Text style={styles.infoValue}>
                {new Date(goal.targetDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="category" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.entriesSection}>
          <Text style={styles.sectionTitle}>Related Journal Entries</Text>
          {relatedEntries.length > 0 ? (
            relatedEntries.map(entry => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                onPress={() => navigation.navigate('EntryDetail', { entryId: entry.id })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="book" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No journal entries yet</Text>
              <Text style={styles.emptySubtext}>
                Start journaling about this goal to track your progress
              </Text>
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 32,
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  goalDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  entriesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});