import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { mockGoals } from '../data/mockData';

interface NewEntryScreenProps {
  navigation: any;
}

export default function NewEntryScreen({ navigation }: NewEntryScreenProps) {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<'great' | 'good' | 'okay' | 'bad' | 'terrible'>('good');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

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

  const handleSave = () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write something in your journal entry');
      return;
    }

    // In a real app, this would save to a database
    Alert.alert('Success', 'Journal entry saved!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
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
          <Text style={styles.label}>What\'s on your mind?</Text>
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
            Select goals this entry relates to
          </Text>
          {mockGoals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalOption,
                selectedGoals.includes(goal.id) && styles.goalOptionSelected
              ]}
              onPress={() => toggleGoal(goal.id)}
            >
              <View style={styles.goalInfo}>
                <View style={[styles.goalColorDot, { backgroundColor: goal.color }]} />
                <Text style={styles.goalTitle}>{goal.title}</Text>
              </View>
              {selectedGoals.includes(goal.id) && (
                <MaterialIcons name="check-circle" size={24} color={goal.color} />
              )}
            </TouchableOpacity>
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
  goalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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