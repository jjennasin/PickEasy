import { palette } from '@/constants/palette';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const recentPicks = [
  {
    id: '1',
    title: 'Dinner with Roommates',
    result: 'Chipotle',
    time: 'Yesterday',
    backgroundColor: palette.peach,
    textColor: palette.white,
  },
  {
    id: '2',
    title: 'Dinner with Roommates',
    result: 'Chipotle',
    time: 'Yesterday',
    backgroundColor: palette.blue,
    textColor: palette.white,
  },
  {
    id: '3',
    title: 'Dinner with Roommates',
    result: 'Chipotle',
    time: 'Yesterday',
    backgroundColor: palette.red,
    textColor: palette.white,
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.brand}>PickEasy</Text>
          <Text style={styles.tagline}>Make group decisions faster</Text>
        </View>

        <View style={styles.actionCard}>
          <MaterialCommunityIcons name="account-group-outline" size={44} color="#27242C" />
          <Text style={styles.sectionTitle}>Get started</Text>

          <Pressable
            style={[styles.primaryAction, styles.startAction]}
            onPress={() => router.push('/create-decision')}>
            <Text style={styles.primaryActionText}>Start new decision</Text>
            <MaterialCommunityIcons name="plus-circle-outline" size={34} color={palette.white} />
          </Pressable>

          <Pressable 
            style={[styles.primaryAction, styles.joinAction]}
            onPress={() => router.push('/join-decision')}>
            <Text style={styles.primaryActionText}>Join with code</Text>
            <MaterialCommunityIcons name="chevron-double-right" size={34} color={palette.white} />
          </Pressable>
        </View>

        <View style={styles.recentCard}>
          <Text style={styles.recentTitle}>Recent picks</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentRow}>
            {recentPicks.map((pick) => (
              <View
                key={pick.id}
                style={[styles.pickCard, { backgroundColor: pick.backgroundColor }]}>
                <Text style={[styles.pickText, { color: pick.textColor }]}>
                  {'\u{1F354}'} {pick.title}
                </Text>
                <Text style={[styles.pickText, { color: pick.textColor }]}>{'\u{2192}'} {pick.result}</Text>
                <Text style={[styles.pickText, { color: pick.textColor }]}>{pick.time}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  container: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  content: {
    paddingBottom: 36,
  },
  hero: {
    backgroundColor: palette.darkBlue,
    borderBottomLeftRadius: 72,
    borderBottomRightRadius: 72,
    minHeight: 340,
    paddingHorizontal: 28,
    paddingTop: 72,
    paddingBottom: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: palette.white,
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -2,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 10,
    color: palette.white,
    fontSize: 26,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  actionCard: {
    marginTop: -56,
    marginHorizontal: 24,
    backgroundColor: palette.white,
    borderRadius: 46,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '800',
    color: palette.ink,
  },
  primaryAction: {
    width: '100%',
    marginTop: 26,
    borderRadius: 999,
    paddingVertical: 24,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  startAction: {
    backgroundColor: palette.blue,
  },
  joinAction: {
    backgroundColor: palette.red,
  },
  primaryActionText: {
    color: palette.white,
    fontSize: 23,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  recentCard: {
    marginTop: 22,
    marginHorizontal: 24,
    backgroundColor: palette.white,
    borderRadius: 46,
    paddingTop: 34,
    paddingBottom: 36,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  recentTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.ink,
    paddingHorizontal: 24,
  },
  recentRow: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 18,
  },
  pickCard: {
    width: 230,
    minHeight: 220,
    borderRadius: 34,
    padding: 18,
    justifyContent: 'center',
  },
  pickText: {
    fontSize: 20,
    lineHeight: 42,
    fontWeight: '500',
  },
});
