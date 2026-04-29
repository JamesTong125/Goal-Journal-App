import { Goal, JournalEntry } from '../types';

export const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Run a Marathon',
    description: 'Complete a full marathon by the end of the year',
    targetDate: '2024-12-31',
    createdAt: '2024-01-01',
    category: 'health',
    color: '#FF6B6B',
  },
  {
    id: '2',
    title: 'Learn Spanish',
    description: 'Achieve conversational fluency in Spanish',
    targetDate: '2024-06-30',
    createdAt: '2024-01-15',
    category: 'learning',
    color: '#4ECDC4',
  },
  {
    id: '3',
    title: 'Save $10,000',
    description: 'Build emergency fund of $10,000',
    targetDate: '2024-12-31',
    createdAt: '2024-01-01',
    category: 'finance',
    color: '#95E1D3',
  },
];

export const mockEntries: JournalEntry[] = [
  {
    id: '1',
    date: '2024-01-20',
    content: 'Ran 5 miles today! Feeling great about my progress. My pace is improving and I\'m starting to enjoy the early morning runs. Also practiced Spanish for 30 minutes.',
    mood: 'great',
    goalIds: ['1', '2'],
    createdAt: '2024-01-20T08:30:00',
  },
  {
    id: '2',
    date: '2024-01-19',
    content: 'Completed my Spanish lesson today. The verb conjugations are getting easier. Saved $200 from my paycheck.',
    mood: 'good',
    goalIds: ['2', '3'],
    createdAt: '2024-01-19T20:15:00',
  },
  {
    id: '3',
    date: '2024-01-18',
    content: 'Rest day from running. Focused on stretching and recovery. Watched a Spanish movie with subtitles.',
    mood: 'okay',
    goalIds: ['1', '2'],
    createdAt: '2024-01-18T19:00:00',
  },
];