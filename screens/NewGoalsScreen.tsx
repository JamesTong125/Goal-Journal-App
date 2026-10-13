import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useData } from '../data/DataContext';
import { notify } from '../utils/confirm';

interface NewGoalScreenProps {
  navigation: any;
}

// Checks format and that the date actually exists (e.g. rejects 2026-02-30)
function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00');
  return !isNaN(d.getTime()) && d.toLocaleDateString('en-CA') === value;
}

export default function NewGoalScreen({ navigation }: NewGoalScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'health' | 'career' | 'personal' | 'finance' | 'learning' | 'other'>('personal');
  const { addGoal } = useData();

  const categories = [
    { value: 'health', icon: 'fitness-center', label: 'Health', color: '#FF6B6B' },
    { value: 'career', icon: 'work', label: 'Career', color: '#4ECDC4' },
    { value: 'personal', icon: 'person', label: 'Personal', color: '#95E1D3' },
    { value: 'finance', icon: 'attach-money', label: 'Finance', color: '#FFE66D' },
    { value: 'learning', icon: 'school', label: 'Learning', color: '#A8E6CF' },
    { value: 'other', icon: 'flag', label: 'Other', color: '#C7CEEA' },
  ];

  const handleSave = async () => {
    if (!title.trim()) {
      notify('Error', 'Please enter a goal title');
      return;
    }

    if (!description.trim()) {
      notify('Error', 'Please enter a goal description');
      return;
    }

    const date = targetDate.trim();
    if (date && !isValidDate(date)) {
      notify('Error', 'Target date must be a real date in YYYY-MM-DD format');
      return;
    }

    const category = categories.find(c => c.value === selectedCategory)!;
    try {
      await addGoal({
        title: title.trim(),
        description: description.trim(),
        targetDate: date,
        category: selectedCategory,
        color: category.color,
      });
      navigation.goBack();
    } catch (error) {
      notify('Error', 'Could not save your goal. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>New Goal</Text>
        <TouchableOpacity onPress={handleSave}>
          <MaterialIcons name="check" size={28} color="#4ECDC4" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Goal Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Run a Marathon"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your goal..."
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.value && {
                    backgroundColor: category.color + '20',
                    borderColor: category.color,
                  }
                ]}
                onPress={() => setSelectedCategory(category.value as any)}
              >
                <MaterialIcons 
                  name={category.icon as any} 
                  size={24} 
                  color={selectedCategory === category.value ? category.color : '#999'} 
                />
                <Text style={[
                  styles.categoryLabel,
                  selectedCategory === category.value && { color: category.color }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Target Date (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={targetDate}
            onChangeText={setTargetDate}
          />
          <Text style={styles.hint}>
            When do you want to achieve this goal?
          </Text>
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    minHeight: 120,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
});