import { StatusBar } from 'expo-status-bar';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const topMatches = [
  { id: '1', name: 'Luan Costa', city: 'Rio de Janeiro', specialties: ['Histórico', 'Cultural'], score: 96 },
  { id: '2', name: 'Sofia Almeida', city: 'Salvador', specialties: ['Gastronômico', 'Natureza'], score: 92 },
  { id: '3', name: 'Mateus Ribeiro', city: 'Florianópolis', specialties: ['Natureza', 'Aventura'], score: 89 }
];

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.eyebrow}>TourMatch</Text>
      <Text style={styles.title}>Encontre o guia ideal para sua viagem</Text>
      <Text style={styles.subtitle}>Destinos, idioma, interesses e orçamento em um só lugar.</Text>

      <View style={styles.searchCard}>
        <Text style={styles.cardTitle}>Pesquisar guia</Text>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Buscar agora</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Matches</Text>
        <Text style={styles.sectionMeta}>Top 3</Text>
      </View>

      <FlatList
        data={topMatches}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.matchCard}>
            <View style={styles.matchHeader}>
              <Text style={styles.matchName}>{item.name}</Text>
              <Text style={styles.matchScore}>{item.score}%</Text>
            </View>
            <Text style={styles.matchCity}>{item.city}</Text>
            <View style={styles.badgeRow}>
              {item.specialties.map((specialty) => (
                <Text key={specialty} style={styles.badge}>{specialty}</Text>
              ))}
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    paddingTop: 72
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: '#2563eb',
    textTransform: 'uppercase',
    marginBottom: 10
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 40,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 24
  },
  searchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a'
  },
  sectionMeta: {
    color: '#475569',
    fontWeight: '700'
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  matchName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a'
  },
  matchScore: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontWeight: '800'
  },
  matchCity: {
    color: '#475569',
    fontSize: 15,
    marginBottom: 12
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  badge: {
    backgroundColor: '#e2e8f0',
    color: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
    marginRight: 8,
    marginBottom: 8
  }
});
