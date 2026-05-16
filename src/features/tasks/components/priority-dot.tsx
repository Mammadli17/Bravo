import type { TaskPriority } from '../types';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

const COLORS: Record<TaskPriority, string> = {
  low: '#94A3B8',
  medium: '#F59E0B',
  high: '#F97316',
  urgent: '#EF4444',
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
