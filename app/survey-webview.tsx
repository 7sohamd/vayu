import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function SurveyWebView() {
  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: 'https://vaayu-web-umber.vercel.app/onboarding' }} style={StyleSheet.absoluteFill} />
    </View>
  );
}