import { palette } from '@/constants/palette';
import { db } from '@/firebaseConfig';
import type { DecisionRecord } from '@/types/decision';
import { parseDecisionRecord, serializeDecisionRecord } from '@/utils/decision-route';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const emptyDecision: DecisionRecord = {
  uuid: null,
  join_code: null,
  name: 'Decision Name',
  category: null,
  options: [],
  result: null,
  created_at: null,
};

export default function DecisionRoomScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ decision?: string; participantId?: string }>();
  const participantId = typeof params.participantId === 'string' ? params.participantId : '';
  const initialDecision = parseDecisionRecord(params.decision) ?? emptyDecision;
  const [decision, setDecision] = useState<DecisionRecord>(initialDecision);
  const decisionName = decision.name || 'Decision Name';
  const [options, setOptions] = useState<string[]>(initialDecision.options.map((option) => option.label));

  // Current input for adding a new option
  const [currentInput, setCurrentInput] = useState('');

  const buildDecisionOptions = (optionLabels: string[]) =>
    optionLabels.map((option, index) => ({
      id: `${index}-${option.toLowerCase().replace(/\s+/g, '-')}`,
      label: option,
      votes: [],
    }));

  useEffect(() => {
    if (!decision.uuid) {
      return undefined;
    }
    // for realtime updating for options and changing between the voting and results phases
    const unsubscribe = onSnapshot(doc(db, 'decisions', decision.uuid), (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }

      const roomData = snapshot.data();
      const nextOptions = Array.isArray(roomData.options) ? roomData.options : [];

      const nextDecision = {
        uuid: roomData.uuid ?? snapshot.id,
        join_code: roomData.join_code ?? null,
        name: roomData.name ?? '',
        category: roomData.category ?? null,
        options: nextOptions,
        result: roomData.result ?? null,
        created_at:
          typeof roomData.created_at?.toDate === 'function'
            ? roomData.created_at.toDate().toISOString()
            : roomData.created_at ?? null,
        phase: roomData.phase ?? 'options',
        participants: Array.isArray(roomData.participants) ? roomData.participants : [],
        completed_voters: Array.isArray(roomData.completed_voters)
          ? roomData.completed_voters
          : [],
        result_votes: roomData.result_votes ?? null,
      };

      setDecision(nextDecision);
      setOptions(nextOptions.map((option) => option.label));

      if (nextDecision.phase === 'voting') {
        router.replace({
          pathname: '/voting',
          params: {
            decision: serializeDecisionRecord(nextDecision),
            participantId,
          },
        });
      }

      if (nextDecision.phase === 'results') {
        router.replace({
          pathname: '/results',
          params: {
            decision: serializeDecisionRecord(nextDecision),
          },
        });
      }
    });

    return unsubscribe;
  }, [decision.uuid, participantId, router]);

  // Add a new option with shared room behavior, updates firestore and syncs to all the users in the room
  const handleAddOption = async () => {
    const trimmedInput = currentInput.trim();

    if (!trimmedInput || options.length >= 5) {
      return;
    }

    const nextOptions = [...options, trimmedInput];
    setOptions(nextOptions);
    setCurrentInput('');

    if (decision.uuid) {
      await updateDoc(doc(db, 'decisions', decision.uuid), {
        options: buildDecisionOptions(nextOptions),
      });
    }
  };

  // Delete an option with shared room behavior, updates firestore and syncs to all the users in the room 
  const handleDeleteOption = async (index: number) => {
    const nextOptions = [...options];
    nextOptions.splice(index, 1);
    setOptions(nextOptions);

    if (decision.uuid) {
      await updateDoc(doc(db, 'decisions', decision.uuid), {
        options: buildDecisionOptions(nextOptions),
      });
    }
  };

  // Placeholder "continue" button behavior
  const handleContinue = async () => {
    if (options.length === 0 || !decision.uuid) return;

    await updateDoc(doc(db, 'decisions', decision.uuid), {
      phase: 'voting',
      options: buildDecisionOptions(options),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Blue Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={32} color={palette.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Options</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* White "decision info" box */}
        <View style={styles.decisionroomBox}>
          <MaterialCommunityIcons name="map-marker" size={28} color={palette.blue} />
          <View>
            <Text style={styles.roomName}>{decisionName}</Text>
            <Text style={styles.roomCode}>Code: {decision.join_code ?? '------'}</Text>
            <Text style={styles.roomCode}>Room ID: {decision.uuid ?? 'Not saved yet'}</Text>
          </View>
        </View>

        {/* Options list */}
        {options.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No options have been added to this room yet.</Text>
          </View>
        ) : (
          options.map((option, index) => (
            <View key={index} style={styles.optionBox}>
              <Text style={styles.optionText}>{option}</Text>
              <Pressable onPress={() => handleDeleteOption(index)}>
                <MaterialCommunityIcons name="trash-can-outline" size={28} color={palette.darkBlue} />
              </Pressable>
            </View>
          ))
        )}

        {/* Add new option */}
        <View style={styles.addOptionBox}>
          <TextInput
            value={currentInput}
            onChangeText={setCurrentInput}
            placeholder="Add another option"
            placeholderTextColor={palette.blue}
            style={styles.input}
          />
          <Pressable onPress={handleAddOption}>
            <MaterialCommunityIcons name="plus-circle-outline" size={28} color={palette.blue} />
          </Pressable>
        </View>

        {/* Continue button */}
        <Pressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to voting</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.darkBlue,
    paddingHorizontal: 16,
    paddingVertical: 18,
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
    marginLeft: 8,
  },
  container: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  content: {
    paddingHorizontal: 22,
  },
  decisionroomBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    paddingVertical: 20,
    paddingHorizontal: 22,
    marginBottom: 20,
    marginHorizontal: -22,
  },
  roomName: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: '700',
    color: palette.darkBlue,
  },
  roomCode: {
    marginLeft: 12,
    marginTop: 4,
    color: palette.blue,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: palette.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    color: palette.darkBlue,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.blue, // light blue for filled option
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },
  optionText: {
    color: palette.darkBlue,
    fontSize: 18,
    fontWeight: '700',
  },
  addOptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.white,
    padding: 18,
    borderRadius: 14,
    marginBottom: 36,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: palette.darkBlue,
    marginRight: 12,
  },
  continueButton: {
    backgroundColor: palette.red,
    borderRadius: 999,
    paddingVertical: 26,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueButtonText: {
    color: palette.white,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
});
