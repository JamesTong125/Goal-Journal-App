import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useData } from '../data/DataContext';
import { entryProgressFor } from '../utils/progress';
import { confirmAction, notify } from '../utils/confirm';

interface EntryDetailScreenProps {
  navigation: any;
  route: any;
}

export default function EntryDetailScreen({ navigation, route }: EntryDetailScreenProps) {
  const { entryId } = route.params;
  const { goals, entries, deleteEntry } = useData();
  const entry = entries.find(e => e.id === entryId);

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Entry not found</Text>
      </SafeAreaView>
    );
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'great': return '😄';
      case 'good': return '🙂';
      case 'okay': return '😐';
      case 'bad': return '😞';
      case 'terrible': return '😢';
      default: return '😐';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'great': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'okay': return '#FFC107';
      case 'bad': return '#FF9800';
      case 'terrible': return '#F44336';
      default: return '#999';
    }
  };

  const relatedGoals = goals.filter(goal => entry.goalIds.includes(goal.id));

  const handleDelete = () => {
    confirmAction(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      'Delete',
      async () => {
        try {
          await deleteEntry(entry.id);
          navigation.goBack();
        } catch (error) {
          notify('Error', 'Could not delete this entry. Please try again.');
        }
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="edit" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
            <MaterialIcons name="delete" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.dateSection}>
          <MaterialIcons name="calendar-today" size={20} color="#666" />
          <Text style={styles.date}>
            {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>

        <View style={styles.moodSection}>
          <View style={[styles.moodBadge, { backgroundColor: getMoodColor(entry.mood) }]}>
            <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
            <Text style={styles.moodText}>{entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.content}>{entry.content}</Text>
        </View>

        {relatedGoals.length > 0 && (
          <View style={styles.goalsSection}>
            <Text style={styles.sectionTitle}>Related Goals</Text>
            {relatedGoals.map(goal => (
              <TouchableOpacity
                key={goal.id}
                style={styles.goalCard}
                onPress={() => navigation.navigate('GoalDetail', { goalId: goal.id })}
              >
                <View style={[styles.goalColorBar, { backgroundColor: goal.color }]} />
                <View style={styles.goalContent}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalCategory}>{goal.category}</Text>
                </View>
                <View style={[styles.progressBadge, { backgroundColor: goal.color + '30' }]}>
                  <Text style={styles.progressBadgeText}>+{entryProgressFor(entry, goal.id)}%</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  progressBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  progressBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
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
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 2,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  moodSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 2,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  moodText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  contentSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 2,
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  goalsSection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  goalColorBar: {
    width: 4,
    height: '100%',
  },
  goalContent: {
    flex: 1,
    padding: 16,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  goalCategory: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
});