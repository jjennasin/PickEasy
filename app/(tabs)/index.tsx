import { palette } from '@/constants/palette';
import { db } from '@/firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RecentPick {
  id: string;
  title: string;
  result: string;
  createdAt: string | null;
}

export default function HomeScreen() {
  const [recentPicks, setRecentPicks] = useState<RecentPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecent = async () => {
      setLoading(true);
      setError(null);
      try {
        // recent decisions from firestore ordered by date, only 8 at a time
        const decisionsQuery = query(
          collection(db, 'decisions'),
          orderBy('created_at', 'desc'),
          limit(8)
        );
        const snapshot = await getDocs(decisionsQuery);
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          const createdAt =
          // formats like March 23 at 3:45 PM etc
            data.created_at?.toDate instanceof Function
              ? data.created_at.toDate().toLocaleString([], {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : null;
          return {
            id: doc.id,
            title: data.name ?? 'Untitled decision',
            result: data.result ?? 'No result yet',
            createdAt,
          };
        });
        setRecentPicks(docs);
      } catch (loadError) {
        console.error('couldnt load recent decisions:', loadError);
        setError('Failed to load recent decisions.');
      } finally {
        setLoading(false);
      }
    };

    loadRecent();
  }, []);

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

          {loading ? (
            <Text style={styles.statusText}>Loading recent decisions...</Text>
          ) : error ? (
            <Text style={styles.statusText}>{error}</Text>
          ) : recentPicks.length === 0 ? (
            <Text style={styles.statusText}>No recent decisions yet.</Text>
          ) : (
            <ScrollView
              horizontal
              contentContainerStyle={styles.recentRow}>
              {recentPicks.map((pick) => (
                <View key={pick.id} style={styles.pickCard}>
                  <Text style={styles.pickText}>{pick.title}</Text>
                  <Text style={styles.pickDetail}>Result: {pick.result}</Text>
                  {pick.createdAt ? <Text style={styles.pickDetail}>{pick.createdAt}</Text> : null}
                </View>
              ))}
            </ScrollView>
          )}
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
    minHeight: 170,
    borderRadius: 34,
    padding: 18,
    justifyContent: 'center',
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: '#D9D3CB',
  },
  pickText: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    color: palette.darkBlue,
  },
  pickDetail: {
    marginTop: 6,
    fontSize: 16,
    color: palette.ink,
  },
  statusText: {
    paddingHorizontal: 24,
    marginTop: 12,
    color: palette.blue,
    fontSize: 18,
    textAlign: 'center',
  },
});
