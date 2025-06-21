import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the shape of the context data
interface TasksContextType {
  dailySteps: number;
  waterIntake: number;
  updateDailySteps: (steps: number) => void;
  addWater: () => void;
  reduceWater: () => void;
}

// Create the context
const TasksContext = createContext<TasksContextType | undefined>(undefined);

// Create the provider component
export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [dailySteps, setDailySteps] = useState(1350);
  const [waterIntake, setWaterIntake] = useState(2.0);
  const waterGoal = 3.0;

  const updateDailySteps = (steps: number) => {
    setDailySteps(steps);
  };

  const addWater = () => {
    if (waterIntake < waterGoal) {
      setWaterIntake(prev => Math.min(prev + 0.25, waterGoal));
    }
  };

  const reduceWater = () => {
    if (waterIntake > 0) {
      setWaterIntake(prev => Math.max(prev - 0.25, 0));
    }
  };
  
  return (
    <TasksContext.Provider value={{ dailySteps, waterIntake, updateDailySteps, addWater, reduceWater }}>
      {children}
    </TasksContext.Provider>
  );
};

// Create a custom hook for easy context consumption
export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}; 