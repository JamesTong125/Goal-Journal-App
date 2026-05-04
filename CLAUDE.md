# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native/Expo mobile application for goal tracking and journaling. Users can create goals, write journal entries related to those goals, and track progress over time.

## Development Commands

```bash
# Start development server
npm start
# or
expo start

# Run on specific platforms
npm run android    # expo run:android
npm run ios        # expo run:ios
npm run web        # expo start --web
```

## Architecture

### Navigation Structure
The app uses a hybrid navigation approach with React Navigation:
- **Bottom Tab Navigator** (main navigation): Home, Journal, Goals tabs
- **Stack Navigator** (modal/detail screens): wraps the tab navigator and handles modals and detail views

Navigation flow:
- Main tabs: `HomeScreen`, `JournalScreen`, `GoalsScreen`
- Modal screens: `NewEntryScreen`, `NewGoalScreen` (presentation: 'modal')
- Detail screens: `EntryDetailScreen`, `GoalDetailScreen`

### Directory Structure
```
Goal-Journal-App/
├── screens/           # Screen components
├── components/        # Reusable UI components
├── data/             # Mock data and data management
├── types/            # TypeScript type definitions
├── assets/           # Images and static assets
└── App.tsx           # Main app component with navigation setup
```

### Key Components
- `GoalCard`: Displays goal information with progress bar, category icon, and target date
- `JournalEntryCard`: Shows journal entry with mood indicator and date

### Data Model
Core types defined in `types/index.ts`:
- `Goal`: id, title, description, targetDate, createdAt, category, color
- `JournalEntry`: id, date, content, mood, goalIds[], createdAt
- `GoalProgress`: goalId, entryCount, lastEntryDate, progressPercentage

### State Management
Currently uses local component state with mock data from `data/mockData.ts`. No global state management or backend integration yet.

### Progress Calculation
Progress is calculated based on journal entries related to a goal:
- Each related journal entry contributes 10% to progress
- Maximum progress is capped at 100%
- Calculation: `Math.min(relatedEntries.length * 10, 100)`

### UI Patterns
- **Color scheme**: Primary color `#4ECDC4` (teal), secondary `#FF6B6B` (coral)
- **Icons**: MaterialIcons from @expo/vector-icons
- **Safe areas**: Uses SafeAreaView with SafeAreaProvider
- **Styling**: Inline StyleSheet.create() in components
- **Category icons**: Mapped to MaterialIcons (health→fitness-center, career→work, etc.)

### Development Notes
- The app uses Expo SDK ~54.0.33 with React Native ^0.81.5
- TypeScript is enabled with strict typing
- New architecture is enabled in app.json
- Currently uses mock data - no backend integration
- All screens use functional components with React hooks