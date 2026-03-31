import { palette } from '@/constants/palette';
import type { DecisionRecord } from '@/types/decision';
import { parseDecisionRecord } from '@/utils/decision-route';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// if theres no decision data and its an error then theres null defaults
const emptyDecisionRecord: DecisionRecord = {
  uuid: null,
  join_code: null,
  name: '',
  category: null,
  options: [],
  result: null,
  created_at: null,
};

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ decision?: string }>();
  const decision = parseDecisionRecord(params.decision) ?? emptyDecisionRecord;

  const decisionName = decision.name || 'Decision Room Name';
  const winner = {
    name: decision.result ?? 'No winner selected',
    votes: decision.result_votes ?? 0,
    totalVoters: decision.completed_voters?.length ?? 0,
    categoryColor: palette.peach,
    circleColor: palette.red,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={32} color={palette.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Results</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Decision Name */}
        <View style={styles.decisionNameBox}>
          <MaterialCommunityIcons name="map-marker-outline" size={24} color={palette.darkBlue} />
          <Text style={styles.decisionNameText}>{decisionName}</Text>
        </View>

        {/* Confetti / Winner */}
        <View style={styles.winnerSection}>
          <Text style={styles.winnerTitle}>🎉 Winner! 🎉</Text>
        </View>

        {/* Yellow outer box */}
        <View style={styles.yellowBoxContainer}>
            <View style={styles.outerBox}>
            {/* Light red inner box */}
            <View style={[styles.optionBox, { backgroundColor: winner.categoryColor }]}>
                <View style={[styles.resultCircle, { backgroundColor: winner.circleColor }]}>
                <MaterialCommunityIcons name="trophy-outline" size={40} color={palette.white} />
                </View>
                <Text style={styles.resultName}>{winner.name}</Text>
            </View>
            </View>
        </View>

          <View style={styles.divider} />
        {/* Light blue votes box */}
          <View style={styles.votesBox}>
            <Text style={styles.votesText}>
              {winner.votes > 0
                ? `${winner.name} won with ${winner.votes} vote${winner.votes === 1 ? '' : 's'} after ${winner.totalVoters} participant${winner.totalVoters === 1 ? '' : 's'} finished voting.`
                : `No option was approved in this round yet.`}
            </Text>
          </View>
          <View style={styles.divider} />
        
        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.redButton} onPress={() => router.push('/')}>
            <Text style={styles.redButtonText}>Go home</Text>
          </Pressable>
          <Pressable style={styles.redButton} onPress={() => router.push('/create-decision')}>
            <Text style={styles.redButtonText}>New decision</Text>
          </Pressable>
        </View>
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
    paddingBottom: 36,
  },

  // Decision name box (flush with sides)
  decisionNameBox: {
    backgroundColor: palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
    marginHorizontal: -22, // flush with sides
  },
  decisionNameText: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.darkBlue,
    marginLeft: 8,
  },

  // Winner section
  winnerSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  winnerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: palette.darkBlue,
    marginVertical: 8,
  },
  yellowBoxContainer: {
    alignItems: 'center',        // center children horizontally
    marginBottom: 32,
  }, 
  // Yellow outer box
  outerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8EEAF',
    width: 250,
    height: 250,
    borderRadius: 24,
  },

  // Light red inner option box
  optionBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 220,
    height: 220,
    paddingVertical: 20,
    borderRadius: 24,
  },
  resultCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resultEmoji: {
    fontSize: 36,
  },
  resultName: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.darkBlue,
  },
  divider: {
    height: 4,
    backgroundColor: palette.darkBlue,
    marginTop: 36,
  },

  // Light blue votes box
  votesBox: {
    backgroundColor: '#D4DDEE',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 36,
  },
  votesText: {
    color: palette.darkBlue,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Buttons row
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  redButton: {
    flex: 1,
    backgroundColor: palette.red,
    borderRadius: 999,
    paddingVertical: 22,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  redButtonText: {
    color: palette.white,
    fontSize: 20,
    fontWeight: '700',
  },
});
