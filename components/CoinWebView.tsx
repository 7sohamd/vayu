import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface CoinWebViewProps {
  onClose: () => void;
}

export const CoinWebView: React.FC<CoinWebViewProps> = ({ onClose }) => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Vayu Coins</ThemedText>
        <ThemedText style={styles.closeButton} onPress={onClose}>
          ✕
        </ThemedText>
      </View>
      
      <WebView
        source={{ uri: 'https://vaayu-voucher-hub.vercel.app/' }} // Replace with actual coin system URL
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    padding: 5,
  },
  webview: {
    flex: 1,
  },
}); 