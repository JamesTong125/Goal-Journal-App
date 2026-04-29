import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { JournalEntry } from '../types';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onPress: () => void;
}

export default function JournalEntryCard({ entry, onPress }: JournalEntryCardProps) {
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <MaterialIcons name="calendar-today" size={16} color="#666" />
          <Text style={styles.date}>
            {new Date(entry.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
        <View style={[styles.moodBadge, { backgroundColor: getMoodColor(entry.mood) }]}>
          <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
        </View>
      </View>

      <Text style={styles.content} numberOfLines={3}>
        {entry.content}
      </Text>

      {entry.goalIds.length > 0 && (
        <View style={styles.footer}>
          <MaterialIcons name="flag" size={14} color="#999" />
          <Text style={styles.goalCount}>
            {entry.goalIds.length} goal{entry.goalIds.length > 1 ? 's' : ''} tracked
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  moodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodEmoji: {
    fontSize: 16,
  },
  content: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  goalCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
});