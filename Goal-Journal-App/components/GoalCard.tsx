import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
  progress: number;
  onPress: () => void;
}

export default function GoalCard({ goal, progress, onPress }: GoalCardProps) {
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

  const daysUntilTarget = Math.ceil(
    (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.colorBar, { backgroundColor: goal.color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name={getCategoryIcon(goal.category)} size={24} color={goal.color} />
          <Text style={styles.title}>{goal.title}</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {goal.description}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min(progress, 100)}%`, backgroundColor: goal.color }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.daysText}>
            {daysUntilTarget > 0 ? `${daysUntilTarget} days left` : 'Target date passed'}
          </Text>
          <Text style={styles.dateText}>
            Target: {new Date(goal.targetDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorBar: {
    width: 6,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 45,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  daysText: {
    fontSize: 12,
    color: '#999',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
});