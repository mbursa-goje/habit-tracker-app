"use client";

import HabitCard from "@/components/habits/HabitCard";
import type { Habit } from "@/types/habit";

type HabitListProps = {
  habits: Habit[];
  today: string;
  onToggleComplete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
};

export default function HabitList({
  habits,
  today,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitListProps) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          today={today}
          onToggleComplete={() => onToggleComplete(habit.id)}
          onEdit={() => onEdit(habit)}
          onDelete={() => onDelete(habit.id)}
        />
      ))}
    </div>
  );
}
