import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function AQISafeAreasWebView() {
  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: 'https://aqi-index-tracker.vercel.app/' }} style={StyleSheet.absoluteFill} />
    </View>
  );
} 