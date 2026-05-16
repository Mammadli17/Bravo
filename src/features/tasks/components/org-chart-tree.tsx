import type { HierarchyNode } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { BRAVO_COLORS } from '../constants/theme';
import { getUserById } from '../data/mock-data';

type NodeProps = {
  node: HierarchyNode;
  depth?: number;
  isLast?: boolean;
};

function OrgNode({ node, depth = 0, isLast = true }: NodeProps) {
  const user = getUserById(node.userId);
  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <View style={styles.nodeContainer}>
      <View style={[styles.row, { marginLeft: depth * 20 }]}>
        {depth > 0
          ? (
              <View style={styles.connector}>
                <View style={styles.verticalLine} />
                {!isLast ? <View style={styles.verticalExtend} /> : null}
                <View style={styles.horizontalLine} />
              </View>
            )
          : null}
        <View style={styles.card}>
          {user
            ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
              )
            : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={20} color={BRAVO_COLORS.textMuted} />
                </View>
              )}
          <View style={styles.info}>
            <Text style={styles.name}>{user?.nameAz ?? '—'}</Text>
            <Text style={styles.role}>{node.titleAz}</Text>
            {user
              ? (
                  <Text style={styles.id}>
                    ID:
                    {user.employeeId}
                  </Text>
                )
              : null}
          </View>
          {user?.canAssignTasks
            ? (
                <View style={styles.assignBadge}>
                  <Ionicons name="create-outline" size={14} color={BRAVO_COLORS.primary} />
                </View>
              )
            : null}
        </View>
      </View>
      {hasChildren
        ? (
            <View style={styles.children}>
              {node.children!.map((child, index) => (
                <OrgNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  isLast={index === node.children!.length - 1}
                />
              ))}
            </View>
          )
        : null}
    </View>
  );
}

type Props = { root: HierarchyNode };

export function OrgChartTree({ root }: Props) {
  return (
    <View style={styles.root}>
      <OrgNode node={root} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingVertical: 8 },
  nodeContainer: { marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  connector: {
    width: 20,
    alignItems: 'center',
    marginRight: 4,
    position: 'relative',
  },
  verticalLine: {
    width: 2,
    height: 24,
    backgroundColor: BRAVO_COLORS.border,
    marginTop: 20,
  },
  verticalExtend: {
    position: 'absolute',
    left: 9,
    top: 44,
    width: 2,
    bottom: -20,
    backgroundColor: BRAVO_COLORS.border,
  },
  horizontalLine: {
    position: 'absolute',
    left: 9,
    top: 32,
    width: 12,
    height: 2,
    backgroundColor: BRAVO_COLORS.border,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAVO_COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BRAVO_COLORS.border,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAVO_COLORS.background,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: BRAVO_COLORS.text,
  },
  role: {
    fontSize: 12,
    color: BRAVO_COLORS.primary,
    fontWeight: '500',
    marginTop: 2,
  },
  id: {
    fontSize: 11,
    color: BRAVO_COLORS.textMuted,
    marginTop: 2,
  },
  assignBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: BRAVO_COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  children: { marginLeft: 8 },
});
