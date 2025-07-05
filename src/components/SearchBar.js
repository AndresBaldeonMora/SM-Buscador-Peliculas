import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ value, onChange }) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar película..."
        style={styles.input}
        value={value}
        onChangeText={onChange}
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange("")} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 44,
    borderColor: '#0a84ff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 40,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
});
