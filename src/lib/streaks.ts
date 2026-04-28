function getPreviousDate(date: string): string {
  const currentDate = new Date(`${date}T00:00:00.000Z`);
  currentDate.setUTCDate(currentDate.getUTCDate() - 1);
  return currentDate.toISOString().split("T")[0];
}

export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  const currentDay = today ?? new Date().toISOString().split("T")[0];
  const completedDates = new Set(completions);

  if (!completedDates.has(currentDay)) {
    return 0;
  }

  let streak = 0;
  let dateToCheck = currentDay;

  while (completedDates.has(dateToCheck)) {
    streak += 1;
    dateToCheck = getPreviousDate(dateToCheck);
  }

  return streak;
}
