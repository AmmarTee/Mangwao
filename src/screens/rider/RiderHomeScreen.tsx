import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, RiderProfile } from '../../lib/supabase';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function RiderHomeScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<RiderProfile | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    loadRiderProfile();
  }, [user]);

  const loadRiderProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('rider_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setIsOnline(data?.is_online || false);
    } catch (error) {
      console.error('Error loading rider profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async (value: boolean) => {
    try {
      const { error } = await supabase
        .from('rider_profiles')
        .update({ is_online: value })
        .eq('user_id', user?.id);

      if (error) throw error;
      setIsOnline(value);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.secondary.main} />
      </View>
    );
  }

  if (!profile || profile.verification_status !== 'approved') {
    return (
      <View style={styles.container}>
        <Card style={styles.warningCard}>
          <Text style={styles.warningTitle}>Account Pending</Text>
          <Text style={styles.warningText}>
            Your rider account is pending verification. Please complete your KYC
            submission in the Profile tab.
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Online Status Toggle */}
      <Card style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View>
            <Text style={styles.statusTitle}>
              {isOnline ? 'You are Online' : 'You are Offline'}
            </Text>
            <Text style={styles.statusSubtext}>
              {isOnline
                ? 'Start accepting delivery jobs'
                : 'Toggle to start receiving jobs'}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={toggleOnlineStatus}
            trackColor={{ false: colors.border, true: colors.secondary.light }}
            thumbColor={isOnline ? colors.secondary.main : colors.text.disabled}
          />
        </View>
      </Card>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{profile.total_deliveries}</Text>
          <Text style={styles.statLabel}>Deliveries</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{profile.rating_avg.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{profile.strike_count}</Text>
          <Text style={styles.statLabel}>Strikes</Text>
        </Card>
      </View>

      {/* Tier Badge */}
      <Card style={styles.tierCard}>
        <Text style={styles.tierLabel}>Your Tier</Text>
        <Text style={styles.tierValue}>{profile.tier.toUpperCase()}</Text>
        <Text style={styles.tierDeposit}>
          Deposit: PKR {profile.deposit_amount}
        </Text>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <Text style={styles.summaryText}>Active Job: None</Text>
        <Text style={styles.summaryText}>Today's Earnings: PKR 0</Text>
        <Text style={styles.summaryText}>Completed Today: 0</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.default,
  },
  warningCard: {
    margin: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.warning + '10',
  },
  warningTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.warning,
    marginBottom: spacing.sm,
  },
  warningText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.md,
  },
  statusCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.secondary.light + '10',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statusSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  statValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.secondary.main,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  tierCard: {
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.accent.main + '10',
  },
  tierLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  tierValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent.main,
    marginBottom: spacing.sm,
  },
  tierDeposit: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  summaryText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    paddingVertical: spacing.xs,
  },
});
