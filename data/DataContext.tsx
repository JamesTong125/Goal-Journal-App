import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Goal, JournalEntry } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

type NewGoal = Omit<Goal, 'id' | 'createdAt'>;
type NewEntry = Omit<JournalEntry, 'id' | 'createdAt'>;

interface DataContextValue {
  goals: Goal[];
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addGoal: (goal: NewGoal) => Promise<void>;
  addEntry: (entry: NewEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

// --- Row <-> app type mapping (DB uses snake_case) ---

function toGoal(row: any): Goal {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    targetDate: row.target_date ?? '',
    createdAt: row.created_at,
    category: row.category,
    color: row.color,
  };
}

function toEntry(row: any): JournalEntry {
  return {
    id: row.id,
    date: row.date,
    content: row.content,
    mood: row.mood,
    goalIds: row.goal_ids ?? [],
    goalProgress: row.goal_progress ?? {},
    createdAt: row.created_at,
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    // RLS limits these queries to the signed-in user's rows.
    const [goalsRes, entriesRes] = await Promise.all([
      supabase.from('goals').select('*').order('created_at', { ascending: true }),
      supabase.from('entries').select('*').order('date', { ascending: false }),
    ]);
    if (goalsRes.error || entriesRes.error) {
      const msg = (goalsRes.error ?? entriesRes.error)!.message;
      console.warn('Failed to load data', msg);
      setError(msg);
    } else {
      setGoals(goalsRes.data.map(toGoal));
      setEntries(entriesRes.data.map(toEntry));
    }
    setLoading(false);
  }, []);

  // Reload whenever the signed-in user changes; clear data on sign out.
  const userId = session?.user.id;
  useEffect(() => {
    if (userId) {
      refresh();
    } else {
      setGoals([]);
      setEntries([]);
    }
  }, [userId, refresh]);

  const addGoal = useCallback(async (goal: NewGoal) => {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        title: goal.title,
        description: goal.description,
        target_date: goal.targetDate || null,
        category: goal.category,
        color: goal.color,
      })
      .select()
      .single();
    if (error) throw error;
    setGoals((prev) => [...prev, toGoal(data)]);
  }, []);

  const addEntry = useCallback(async (entry: NewEntry) => {
    const { data, error } = await supabase
      .from('entries')
      .insert({
        date: entry.date,
        content: entry.content,
        mood: entry.mood,
        goal_ids: entry.goalIds,
        goal_progress: entry.goalProgress,
      })
      .select()
      .single();
    if (error) throw error;
    setEntries((prev) => [toEntry(data), ...prev]);
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    const { error } = await supabase.from('entries').delete().eq('id', id);
    if (error) throw error;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <DataContext.Provider
      value={{ goals, entries, loading, error, refresh, addGoal, addEntry, deleteEntry }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
