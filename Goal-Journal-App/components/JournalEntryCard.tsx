import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LinearGradient } from 'react-native';
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
          <View style={[styles.dateIcon, { backgroundColor: `${getMoodColor(entry.mood)}20` }]}>
            <MaterialIcons name="calendar-today" size={16} color={getMoodColor(entry.mood)} />
          </View>
          <Text style={styles.date}>
            {new Date(entry.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
        <LinearGradient
          colors={[getMoodColor(entry.mood), `${getMoodColor(entry.mood)}dd`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.moodBadge}
        >
          <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
        </LinearGradient>
      </View>

      <Text style={styles.content} numberOfLines={3}>
        {entry.content}
      </Text>

      {entry.goalIds.length > 0 && (
        <View style={styles.footer}>
          <View style={[styles.goalBadge, { backgroundColor: '#667eea20' }]}>
            <MaterialIcons name="flag" size={12} color="#667eea" />
            <Text style={styles.goalCount}>
              {entry.goalIds.length} goal{entry.goalIds.length > 1 ? 's' : ''} tracked
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
  dateIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  moodBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodEmoji: {
    fontSize: 18,
  },
  content: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goalCount: {
    fontSize: 12,
    color: '#667eea',
    marginLeft: 4,
    fontWeight: '600',
  },
});