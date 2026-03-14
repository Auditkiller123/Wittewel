import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { saveUserProfile } from '../services/auth';
import { AppUser } from '../types';

interface Props {
  uid: string;
  onComplete: (user: AppUser) => void;
}

export default function LoginScreen({ uid, onComplete }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Vul je naam in');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Vul een geldig e-mailadres in');
      return;
    }
    setSaving(true);
    try {
      await saveUserProfile(uid, name, email);
      onComplete({ uid, name: name.trim(), email: email.trim().toLowerCase() });
    } catch (e: any) {
      Alert.alert('Fout', e.message);
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welkom bij de Parkeerapp</Text>
        <Text style={styles.subtitle}>
          Vul je naam en e-mail in. Dit is eenmalig.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Je naam"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="Je e-mailadres"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Doorgaan</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#1a73e8',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
