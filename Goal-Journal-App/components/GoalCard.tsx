import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LinearGradient } from 'react-native';
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
      <LinearGradient
        colors={[goal.color, `${goal.color}dd`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={styles.cardInner}>
          <View style={styles.header}>
            <View style={[styles.categoryIcon, { backgroundColor: `${goal.color}20` }]}>
              <MaterialIcons name={getCategoryIcon(goal.category)} size={24} color={goal.color} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{goal.title}</Text>
              <Text style={styles.category}>{goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}</Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {goal.description}
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[goal.color, `${goal.color}aa`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]}
              />
            </View>
            <Text style={[styles.progressText, { color: goal.color }]}>{Math.round(progress)}%</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <MaterialIcons name="schedule" size={16} color="#999" />
              <Text style={styles.footerText}>
                {daysUntilTarget > 0 ? `${daysUntilTarget}d left` : 'Due!'}
              </Text>
            </View>
            <View style={styles.footerItem}>
              <MaterialIcons name="event" size={16} color="#999" />
              <Text style={styles.footerText}>
                {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  gradientBorder: {
    padding: 3,
  },
  cardInner: {
    backgroundColor: '#fff',
    borderRadius: 17,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    width: 50,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
});