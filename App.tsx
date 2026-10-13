import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import JournalScreen from './screens/JournalScreen';
import GoalsScreen from './screens/GoalsScreen';
import NewEntryScreen from './screens/NewEntryScreen';
import EntryDetailScreen from './screens/EntryDetailScreen';
import NewGoalScreen from './screens/NewGoalsScreen';
import GoalDetailScreen from './screens/GoalDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: '#fff',
          paddingTop: 8,
          paddingBottom: 8,
          height: 65,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="flag" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen 
            name="NewEntry" 
            component={NewEntryScreen}
            options={{
              presentation: 'modal',
            }}
          />
          <Stack.Screen name="EntryDetail" component={EntryDetailScreen} />
          <Stack.Screen 
            name="NewGoal" 
            component={NewGoalScreen}
            options={{
              presentation: 'modal',
            }}
          />
          <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}