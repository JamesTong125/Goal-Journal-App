export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  createdAt: string;
  category: 'health' | 'career' | 'personal' | 'finance' | 'learning' | 'other';
  color: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  goalIds: string[]; // Goals this entry relates to
  createdAt: string;
}

export interface GoalProgress {
  goalId: string;
  entryCount: number;
  lastEntryDate: string | null;
  progressPercentage: number;
}