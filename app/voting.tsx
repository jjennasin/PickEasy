import { palette } from "@/constants/palette";
import type { DecisionRecord } from "@/types/decision";
import { parseDecisionRecord } from "@/utils/decision-route";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const emptyDecisionRecord: DecisionRecord = {
  uuid: null,
  join_code: null,
  name: "",
  category: null,
  options: [],
  result: null,
  created_at: null,
};

const optionColors = [palette.peach, "#F6C28B", "#A7C7E7", "#F8AFA6"];

export default function VotingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ decision?: string }>();
  const decision = parseDecisionRecord(params.decision) ?? emptyDecisionRecord;

  const optionsData = useMemo(
    () =>
      decision.options.map((option, index) => ({
        id: option.id,
        name: option.label,
        color: optionColors[index % optionColors.length],
      })),
    [decision.options],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [approved, setApproved] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  const goNext = () => {
    if (currentIndex < optionsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    console.log("Voting finished");
    console.log("Approved:", approved);
    console.log("Rejected:", rejected);

    router.push("/results");
  };

  const handleApprove = () => {
    const current = optionsData[currentIndex];
    if (!current) {
      return;
    }

    setApproved((previous) => [...previous, current.name]);
    goNext();
  };

  const handleReject = () => {
    const current = optionsData[currentIndex];
    if (!current) {
      return;
    }

    setRejected((previous) => [...previous, current.name]);
    goNext();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={32}
            color={palette.white}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Vote</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.decisionNameBox}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={24}
            color={palette.darkBlue}
          />
          <Text style={styles.decisionNameText}>
            {decision.name || "Decision Room Name"}
          </Text>
        </View>

        {optionsData.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Add at least one option before voting.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.cardStack}>
              {currentIndex + 2 < optionsData.length && (
                <View
                  style={[
                    styles.card,
                    styles.cardBack2,
                    { backgroundColor: optionsData[currentIndex + 2].color },
                  ]}
                />
              )}

              {currentIndex + 1 < optionsData.length && (
                <View
                  style={[
                    styles.card,
                    styles.cardBack1,
                    { backgroundColor: optionsData[currentIndex + 1].color },
                  ]}
                />
              )}

              {currentIndex < optionsData.length && (
                <View
                  style={[
                    styles.card,
                    { backgroundColor: optionsData[currentIndex].color },
                  ]}
                >
                  <View style={styles.circle}>
                    <MaterialCommunityIcons
                      name="vote-outline"
                      size={44}
                      color={palette.white}
                    />
                  </View>
                  <Text style={styles.cardText}>
                    {optionsData[currentIndex].name}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.instructions}>
              <Text style={styles.instructionText}>
                Left to pass • Right to approve
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <Pressable style={styles.rejectButton} onPress={handleReject}>
                <MaterialCommunityIcons
                  name="close"
                  size={100}
                  color={palette.red}
                />
              </Pressable>

              <Pressable style={styles.approveButton} onPress={handleApprove}>
                <MaterialCommunityIcons
                  name="check"
                  size={100}
                  color={palette.darkBlue}
                />
              </Pressable>
            </View>
          </>
        )}
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  content: {
    paddingHorizontal: 22,
    paddingBottom: 36,
  },
  decisionNameBox: {
    backgroundColor: palette.white,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 24,
    marginHorizontal: -22,
  },
  decisionNameText: {
    fontSize: 20,
    fontWeight: "700",
    color: palette.darkBlue,
    marginLeft: 8,
  },
  emptyState: {
    marginTop: 40,
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  emptyStateText: {
    color: palette.darkBlue,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  cardStack: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    height: 260,
    position: "relative",
    overflow: "visible",
  },
  card: {
    width: 250,
    height: 250,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  cardBack1: {
    transform: [{ translateX: 15 }, { translateY: 10 }],
    opacity: 0.7,
  },
  cardBack2: {
    transform: [{ translateX: 30 }, { translateY: 20 }],
    opacity: 0.4,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: palette.red,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "700",
    color: palette.darkBlue,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  instructions: {
    alignItems: "center",
    marginTop: 30,
  },
  instructionText: {
    color: palette.darkBlue,
    fontSize: 24,
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  rejectButton: {
    backgroundColor: palette.peach,
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: {
    backgroundColor: "#D4DDEE",
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
