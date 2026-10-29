import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TourMatch</Text>
      <Text style={styles.subtitle}>Conectando turistas e guias</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a'
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#334155'
  }
});
