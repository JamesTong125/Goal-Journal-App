import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useData } from '../data/DataContext';
import { DEFAULT_ENTRY_PROGRESS, calculateGoalProgress, clampProgress } from '../utils/progress';
import { notify } from '../utils/confirm';

interface NewEntryScreenProps {
  navigation: any;
}

export default function NewEntryScreen({ navigation }: NewEntryScreenProps) {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<'great' | 'good' | 'okay' | 'bad' | 'terrible'>('good');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [progressAmounts, setProgressAmounts] = useState<Record<string, number>>({});
  const { goals, entries, addEntry } = useData();

  const moods = [
    { value: 'great', emoji: '😄', label: 'Great' },
    { value: 'good', emoji: '🙂', label: 'Good' },
    { value: 'okay', emoji: '😐', label: 'Okay' },
    { value: 'bad', emoji: '😞', label: 'Bad' },
    { value: 'terrible', emoji: '😢', label: 'Terrible' },
  ];

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const amountFor = (goalId: string) => progressAmounts[goalId] ?? DEFAULT_ENTRY_PROGRESS;

  const setAmount = (goalId: string, value: number) => {
    setProgressAmounts(prev => ({ ...prev, [goalId]: clampProgress(value) }));
  };

  const handleSave = async () => {
    if (!content.trim()) {
      notify('Error', 'Please write something in your journal entry');
      return;
    }

    try {
      await addEntry({
        // Local calendar date (YYYY-MM-DD), not UTC
        date: new Date().toLocaleDateString('en-CA'),
        content: content.trim(),
        mood: selectedMood,
        goalIds: selectedGoals,
        goalProgress: Object.fromEntries(selectedGoals.map(id => [id, amountFor(id)])),
      });
      navigation.goBack();
    } catch (error) {
      notify('Error', 'Could not save your journal entry. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>New Entry</Text>
        <TouchableOpacity onPress={handleSave}>
          <MaterialIcons name="check" size={28} color="#4ECDC4" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>How are you feeling?</Text>
          <View style={styles.moodContainer}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodButton,
                  selectedMood === mood.value && styles.moodButtonSelected
                ]}
                onPress={() => setSelectedMood(mood.value as any)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>What's on your mind?</Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Write about your day, thoughts, progress..."
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Related Goals (Optional)</Text>
          <Text style={styles.sublabel}>
            Select goals this entry relates to, then set how much progress you made
          </Text>
          {goals.map((goal) => {
            const selected = selectedGoals.includes(goal.id);
            const amount = amountFor(goal.id);
            const current = calculateGoalProgress(goal.id, entries);
            const after = Math.min(current + amount, 100);
            return (
              <View
                key={goal.id}
                style={[styles.goalOption, selected && styles.goalOptionSelected]}
              >
                <TouchableOpacity
                  style={styles.goalRow}
                  onPress={() => toggleGoal(goal.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                >
                  <View style={styles.goalInfo}>
                    <View style={[styles.goalColorDot, { backgroundColor: goal.color }]} />
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                  </View>
                  {selected && (
                    <MaterialIcons name="check-circle" size={24} color={goal.color} />
                  )}
                </TouchableOpacity>

                {selected && (
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Progress made</Text>
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={styles.stepButton}
                        onPress={() => setAmount(goal.id, amount - 1)}
                        accessibilityRole="button"
                        accessibilityLabel={`Decrease progress for ${goal.title}`}
                      >
                        <MaterialIcons name="remove" size={20} color="#333" />
                      </TouchableOpacity>
                      <TextInput
                        style={styles.stepInput}
                        value={String(amount)}
                        onChangeText={(text) => {
                          const n = parseInt(text.replace(/\D/g, ''), 10);
                          setAmount(goal.id, isNaN(n) ? 0 : n);
                        }}
                        keyboardType="number-pad"
                        maxLength={3}
                        selectTextOnFocus
                        accessibilityLabel={`Progress percent for ${goal.title}`}
                      />
                      <Text style={styles.stepPercent}>%</Text>
                      <TouchableOpacity
                        style={styles.stepButton}
                        onPress={() => setAmount(goal.id, amount + 1)}
                        accessibilityRole="button"
                        accessibilityLabel={`Increase progress for ${goal.title}`}
                      >
                        <MaterialIcons name="add" size={20} color="#333" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.progressPreview}>
                      {current}% → <Text style={{ color: goal.color, fontWeight: '700' }}>{after}%</Text>
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sublabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 4,
  },
  moodButtonSelected: {
    backgroundColor: '#e8f5f4',
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: '#666',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 200,
    color: '#333',
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepInput: {
    width: 48,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 4,
  },
  stepPercent: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
    marginLeft: -6,
  },
  progressPreview: {
    fontSize: 14,
    color: '#666',
  },
  goalOption: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  goalOptionSelected: {
    backgroundColor: '#e8f5f4',
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  goalTitle: {
    fontSize: 16,
    color: '#333',
  },
});