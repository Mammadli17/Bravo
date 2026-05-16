import type { TaskPriority } from '../types';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

const COLORS: Record<TaskPriority, string> = {
  low: '#22C55E',
  medium: '#EAB308',
  high: '#F97316',
  critical: '#EF4444',
};

type Props = { priority: TaskPriority };

export function PriorityDot({ priority }: Props) {
  return <View style={[styles.dot, { backgroundColor: COLORS[priority] }]} />;
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
