import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function LoginWebViewScreen() {
  return (
    <ThemedView style={styles.container}>
      <WebView
        source={{ uri: 'https://vaayu-alpha.vercel.app/' }} // Replace with your login URL
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        geolocationEnabled={true}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  title: { fontSize: 20, fontWeight: '600' },
  closeButton: { fontSize: 24, color: '#666', padding: 5 },
  webview: { flex: 1 },
}); 