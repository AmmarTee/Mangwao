import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, PricingConfig } from '../../lib/supabase';
import { colors, spacing, typography, borderRadius } from '../../theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

interface LocationInput {
  address: string;
  lat: number;
  lng: number;
  contactName: string;
  contactPhone: string;
}

export default function NewDeliveryScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(null);

  // Form state
  const [pickup, setPickup] = useState<LocationInput>({
    address: '',
    lat: 0,
    lng: 0,
    contactName: '',
    contactPhone: '',
  });
  
  const [drop, setDrop] = useState<LocationInput>({
    address: '',
    lat: 0,
    lng: 0,
    contactName: '',
    contactPhone: '',
  });

  const [itemDescription, setItemDescription] = useState('');
  const [isSealed, setIsSealed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer'>('cod');
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    loadPricingConfig();
  }, []);

  useEffect(() => {
    if (pricingConfig && distance > 0) {
      calculatePrice();
    }
  }, [distance, pricingConfig]);

  const loadPricingConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setPricingConfig(data);
    } catch (error) {
      console.error('Error loading pricing:', error);
    }
  };

  const calculateDistance = () => {
    // Simple distance calculation (placeholder - in production use proper geolocation)
    // For now, generate a random distance between 1-20 km for demo
    const dist = Math.random() * 19 + 1;
    setDistance(Number(dist.toFixed(2)));
  };

  const calculatePrice = () => {
    if (!pricingConfig) return;

    const baseFee = pricingConfig.base_fee;
    const distanceFee = distance * pricingConfig.per_km_fee;
    const total = baseFee + distanceFee;

    setEstimatedPrice(Number(total.toFixed(0)));
  };

  const validateForm = (): boolean => {
    if (!pickup.address || !pickup.contactName || !pickup.contactPhone) {
      Alert.alert('Error', 'Please fill in all pickup details');
      return false;
    }

    if (!drop.address || !drop.contactName || !drop.contactPhone) {
      Alert.alert('Error', 'Please fill in all drop-off details');
      return false;
    }

    if (!itemDescription.trim()) {
      Alert.alert('Error', 'Please describe the item to be delivered');
      return false;
    }

    if (!isSealed) {
      Alert.alert('Seal Required', 'Please confirm that your package is sealed properly');
      return false;
    }

    return true;
  };

  const handleCreateOrder = async () => {
    if (!validateForm()) return;

    // Calculate distance if not done
    if (distance === 0) {
      calculateDistance();
      return;
    }

    setLoading(true);
    try {
      // Generate OTPs
      const { data: pickupOtpData, error: otpError1 } = await supabase.rpc('generate_otp');
      const { data: dropOtpData, error: otpError2 } = await supabase.rpc('generate_otp');

      if (otpError1 || otpError2) throw otpError1 || otpError2;

      const orderData = {
        customer_id: user?.id,
        pickup_address: pickup.address,
        pickup_lat: pickup.lat || 30.1575, // Default Burewala coordinates
        pickup_lng: pickup.lng || 72.6547,
        pickup_contact_name: pickup.contactName,
        pickup_contact_phone: pickup.contactPhone,
        drop_address: drop.address,
        drop_lat: drop.lat || 30.1575,
        drop_lng: drop.lng || 72.6547,
        drop_contact_name: drop.contactName,
        drop_contact_phone: drop.contactPhone,
        item_description: itemDescription,
        is_sealed: isSealed,
        distance_km: distance,
        base_fee: pricingConfig?.base_fee,
        distance_fee: distance * (pricingConfig?.per_km_fee || 15),
        total_fee: estimatedPrice,
        payment_method: paymentMethod,
        pickup_otp: pickupOtpData,
        drop_otp: dropOtpData,
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      Alert.alert(
        'Order Created!',
        'Your delivery order has been created. A rider will accept it soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              resetForm();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating order:', error);
      Alert.alert('Error', error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPickup({ address: '', lat: 0, lng: 0, contactName: '', contactPhone: '' });
    setDrop({ address: '', lat: 0, lng: 0, contactName: '', contactPhone: '' });
    setItemDescription('');
    setIsSealed(false);
    setDistance(0);
    setEstimatedPrice(0);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Create Delivery Order</Text>

      {/* Pickup Details */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Pickup Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Pickup Address"
          value={pickup.address}
          onChangeText={(text) => setPickup({ ...pickup, address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Name"
          value={pickup.contactName}
          onChangeText={(text) => setPickup({ ...pickup, contactName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Phone"
          value={pickup.contactPhone}
          onChangeText={(text) => setPickup({ ...pickup, contactPhone: text })}
          keyboardType="phone-pad"
        />
      </Card>

      {/* Drop Details */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Drop-off Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Drop Address"
          value={drop.address}
          onChangeText={(text) => setDrop({ ...drop, address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Name"
          value={drop.contactName}
          onChangeText={(text) => setDrop({ ...drop, contactName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Phone"
          value={drop.contactPhone}
          onChangeText={(text) => setDrop({ ...drop, contactPhone: text })}
          keyboardType="phone-pad"
        />
      </Card>

      {/* Item Details */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Item Details</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the item (e.g., 2 boxes of biryani)"
          value={itemDescription}
          onChangeText={setItemDescription}
          multiline
          numberOfLines={3}
        />

        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <Text style={styles.switchText}>Package is sealed</Text>
            <Text style={styles.switchSubtext}>Required for delivery</Text>
          </View>
          <Switch
            value={isSealed}
            onValueChange={setIsSealed}
            trackColor={{ false: colors.border, true: colors.secondary.light }}
            thumbColor={isSealed ? colors.secondary.main : colors.text.disabled}
          />
        </View>
      </Card>

      {/* Payment Method */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentOptions}>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cod' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('cod')}
          >
            <Text
              style={[
                styles.paymentOptionText,
                paymentMethod === 'cod' && styles.paymentOptionTextActive,
              ]}
            >
              Cash on Delivery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'transfer' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('transfer')}
          >
            <Text
              style={[
                styles.paymentOptionText,
                paymentMethod === 'transfer' && styles.paymentOptionTextActive,
              ]}
            >
              Bank Transfer
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Price Estimate */}
      {distance > 0 && (
        <Card style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Distance:</Text>
            <Text style={styles.priceValue}>{distance} km</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base Fee:</Text>
            <Text style={styles.priceValue}>PKR {pricingConfig?.base_fee}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Distance Fee:</Text>
            <Text style={styles.priceValue}>
              PKR {(distance * (pricingConfig?.per_km_fee || 15)).toFixed(0)}
            </Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>PKR {estimatedPrice}</Text>
          </View>
        </Card>
      )}

      {/* Calculate Button */}
      {distance === 0 && (
        <Button
          title="Calculate Price"
          onPress={calculateDistance}
          variant="outline"
          style={styles.calculateButton}
        />
      )}

      {/* Create Order Button */}
      <Button
        title="Create Order"
        onPress={handleCreateOrder}
        loading={loading}
        disabled={loading || distance === 0}
        style={styles.createButton}
        size="large"
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your order will be visible to nearby riders once created.
        </Text>
      </View>
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
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
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
  input: {
    backgroundColor: colors.background.default,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  switchLabel: {
    flex: 1,
  },
  switchText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  switchSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  paymentOption: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  paymentOptionActive: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + '10',
  },
  paymentOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  paymentOptionTextActive: {
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semibold,
  },
  priceCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.primary.light + '05',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  priceValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
  },
  calculateButton: {
    marginBottom: spacing.md,
  },
  createButton: {
    marginBottom: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
