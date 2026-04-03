import { createDecision } from '@/app/services/decisionService';
import { palette } from '@/constants/palette';
import type { DecisionCategory, DecisionRecord } from '@/types/decision';
import { serializeDecisionRecord } from '@/utils/decision-route';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

type CategoryOption = {
  id: DecisionCategory;
  emoji: string;
  label: string;
  backgroundColor: string;
};

const categoryOptions: CategoryOption[] = [
  {
    id: 'food-dining',
    emoji: '\u{1F354}',
    label: 'Food & Dining',
    backgroundColor: palette.peach,
  },
  {
    id: 'activity-entertainment',
    emoji: '\u{1F3AC}',
    label: 'Activity & Entertainment',
    backgroundColor: palette.blue,
  },
  {
    id: 'study-work',
    emoji: '\u{1F4D6}',
    label: 'Study & Work',
    backgroundColor: palette.red,
  },
];

export default function CreateDecisionScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<DecisionCategory | null>(null);
  const [roomName, setRoomName] = useState('');
  const [joinCode] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const [participantId] = useState(() => `user-${Math.random().toString(36).slice(2, 10)}`);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const decisionDraft = useMemo<DecisionRecord>(
    () => ({
      uuid: null,
      join_code: joinCode,
      name: roomName.trim(),
      category: selectedCategory,
      options: [],
      result: null,
      created_at: null,
    }),
    [joinCode, roomName, selectedCategory]
  );

  const isReadyToCreate = Boolean(decisionDraft.category && decisionDraft.name);

  const handleCreateDecision = async () => {
    if (!isReadyToCreate || isCreating) {
      return;
    }

    try {
      setIsCreating(true);
      setErrorMessage(null);

      const savedDecision = await createDecision(decisionDraft, participantId);

      router.push({
        pathname: '/add-options',
        params: {
          decision: serializeDecisionRecord(savedDecision),
          participantId,
        },
      });
    } catch (error) {
      console.error('Error creating decision room:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to create room'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(decisionDraft.join_code ?? '');
      Alert.alert('Copied to clipboard', 'The room code has been copied to your clipboard.');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'Failed to copy the room code. Please try again.');
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
        <Text style={styles.headerTitle}>Create decision</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What are we deciding?</Text>
        <Text style={styles.subtitle}>Choose a category to get started</Text>

        <View style={styles.categoryRow}>
          {categoryOptions.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.categoryCard,
                  { backgroundColor: category.backgroundColor },
                  isSelected && styles.selectedCategoryCard,
                ]}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Name your decision room</Text>
        <TextInput
          value={roomName}
          onChangeText={setRoomName}
          placeholder="Write your decision room's name"
          placeholderTextColor={palette.blue}
          style={styles.input}
        />

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Room code</Text>
        <Text style={styles.helperText}>
          Share this code with your friends to start deciding!
        </Text>

        <View style={styles.roomCodeBox}>
          <Text selectable={true}style={styles.roomCodeText}>{decisionDraft.join_code ?? ' '}</Text>
        </View>

        <View style={styles.shareRow}>
          {/* <Text style={styles.shareText}>Share code</Text> */}
          <Button title="Share Code" onPress={copyToClipboard} />
          <MaterialCommunityIcons name="export-variant" size={28} color={palette.blue} />
        </View>

        <View style={styles.divider} />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Pressable
          style={[
            styles.createButton,
            (!isReadyToCreate || isCreating) && styles.createButtonDisabled,
          ]}
          disabled={!isReadyToCreate || isCreating}
          onPress={handleCreateDecision}>
          <Text style={styles.createButtonText}>
            {isCreating ? 'Creating room...' : 'Create decision room'}
          </Text>
          <MaterialCommunityIcons name="chevron-double-right" size={32} color={palette.white} />
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
    fontSize: 58,
    lineHeight: 72,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -2,
  },
  subtitle: {
    marginTop: 10,
    color: palette.blue,
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  categoryRow: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minHeight: 216,
    borderRadius: 38,
    paddingHorizontal: 12,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedCategoryCard: {
    borderColor: palette.darkBlue,
    transform: [{ translateY: -4 }],
  },
  categoryEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  categoryLabel: {
    color: palette.darkBlue,
    fontSize: 16,
    lineHeight: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  divider: {
    height: 4,
    backgroundColor: palette.darkBlue,
    marginTop: 36,
  },
  sectionTitle: {
    marginTop: 28,
    color: palette.darkBlue,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  input: {
    marginTop: 18,
    backgroundColor: palette.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D9D3CB',
    paddingHorizontal: 22,
    paddingVertical: 24,
    fontSize: 18,
    color: palette.darkBlue,
  },
  helperText: {
    marginTop: 8,
    color: palette.blue,
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 20,
    color: palette.red,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  roomCodeBox: {
    alignSelf: 'center',
    width: 240,
    marginTop: 22,
    backgroundColor: palette.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D9D3CB',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomCodeText: {
    minHeight: 44,
    color: palette.darkBlue,
    fontSize: 24,
    fontWeight: '700',
  },
  shareRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareText: {
    color: palette.blue,
    fontSize: 18,
    fontWeight: '500',
  },
  createButton: {
    marginTop: 44,
    backgroundColor: palette.red,
    borderRadius: 999,
    paddingVertical: 26,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createButtonDisabled: {
    opacity: 0.55,
  },
  createButtonText: {
    color: palette.white,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
});
