import { palette } from '@/constants/palette';
import { db } from '@/firebaseConfig';
import { serializeDecisionRecord } from '@/utils/decision-route';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { arrayUnion, collection, getDocs, limit, query, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JoinDecisionScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [participantId] = useState(() => `player-${Math.random().toString(36).slice(2, 10)}`);

  const normalizedCode = code.trim().toUpperCase();
  const isReady = normalizedCode.length > 0;

  const handleJoin = async () => {
    if (!isReady || isJoining) return;

    try {
      setIsJoining(true);
      setErrorMessage(null);

      const roomQuery = await getDocs(
        query(
          collection(db, 'decisions'),
          where('join_code', '==', normalizedCode),
          limit(1)
        )
      );

      if (roomQuery.empty) {
        throw new Error('Room not found. Check the code and try again.');
      }

      const roomDoc = roomQuery.docs[0];
      const roomData = roomDoc.data();

      await updateDoc(roomDoc.ref, {
        participants: arrayUnion(participantId),
      });

      const nextDecision = {
        uuid: roomData.uuid ?? roomDoc.id,
        join_code: roomData.join_code ?? normalizedCode,
        name: roomData.name ?? '',
        category: roomData.category ?? null,
        options: Array.isArray(roomData.options) ? roomData.options : [],
        result: roomData.result ?? null,
        created_at:
          typeof roomData.created_at?.toDate === 'function'
            ? roomData.created_at.toDate().toISOString()
            : null,
        phase: roomData.phase ?? 'options',
        participants: Array.from(new Set([...(roomData.participants ?? []), participantId])),
        completed_voters: Array.isArray(roomData.completed_voters)
          ? roomData.completed_voters
          : [],
        result_votes: roomData.result_votes ?? null,
      };

      router.push({
        pathname: nextDecision.phase === 'results' ? '/results' : nextDecision.phase === 'voting' ? '/voting' : '/decision-room',
        params: {
          decision: serializeDecisionRecord(nextDecision),
          participantId,
        },
      });
    } catch (error) {
      console.error('Error joining decision room:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to join the room right now.'
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <MaterialCommunityIcons name="arrow-left" size={32} color={palette.white} />
            </Pressable>
            <Text style={styles.headerTitle}>Join decision</Text>
          </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* TITLE */}
        <Text style={styles.title}>Enter room code to join decision</Text>

        {/* INPUT BOX */}
        <View style={styles.inputBox}>
          <TextInput
            value={code}
            onChangeText={(value) => setCode(value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
            placeholder="Enter your decision room's code to begin voting"
            placeholderTextColor={palette.blue}
            style={styles.input}
            autoCapitalize="characters"
            autoCorrect={false}
            onSubmitEditing={handleJoin}
            returnKeyType="go"
          />
        </View>

        {errorMessage ? <Text style={styles.helperText}>{errorMessage}</Text> : null}

        {/* BUTTON */}
        <Pressable
          style={[styles.joinButton, (!isReady || isJoining) && styles.joinButtonDisabled]}
          disabled={!isReady || isJoining}
          onPress={handleJoin}>
          <Text style={styles.joinButtonText}>{isJoining ? 'Joining...' : 'Join decision room'}</Text>
          <MaterialCommunityIcons
            name="chevron-double-right"
            size={32}
            color={palette.white}
          />
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.darkBlue,
  },
  header: {
    backgroundColor: palette.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 28,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 36,
  },
  title: {
    color: palette.darkBlue,
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -2,
  },
  subtitle: {
    marginTop: 6,
    color: palette.blue,
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputBox: {
    marginTop: 36,
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  helperText: {
    color: palette.blue,
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: palette.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D9D3CB',
    paddingHorizontal: 22,
    paddingVertical: 20,
    fontSize: 18,
    color: palette.darkBlue,
    textAlign: 'center',
  },
  joinButton: {
    marginTop: 44,
    backgroundColor: palette.red,
    borderRadius: 999,
    paddingVertical: 26,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  joinButtonDisabled: {
    opacity: 0.55,
  },
  joinButtonText: {
    color: palette.white,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
});
