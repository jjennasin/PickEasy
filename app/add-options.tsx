import { palette } from "@/constants/palette";
import type {
  DecisionCategory,
  DecisionOption,
  DecisionRecord,
} from "@/types/decision";
import { parseDecisionRecord } from "@/utils/decision-route";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Suggestion = {
  id: string;
  emoji: string;
  label: string;
  backgroundColor: string;
};

// hard coded these for now
// let's use recent decision results based on category to suggest as options once we have a backend
const suggestionMap: Record<DecisionCategory, Suggestion[]> = {
  "food-dining": [
    {
      id: "relish",
      emoji: "\u{1F354}",
      label: "Relish",
      backgroundColor: palette.peach,
    },
    {
      id: "el-indio",
      emoji: "\u{1F32E}",
      label: "El Indio",
      backgroundColor: palette.blue,
    },
    {
      id: "piesanos",
      emoji: "\u{1F355}",
      label: "Piesanos",
      backgroundColor: palette.red,
    },
  ],
  "activity-entertainment": [
    {
      id: "movie-night",
      emoji: "\u{1F3AC}",
      label: "Movie Night",
      backgroundColor: palette.peach,
    },
    {
      id: "bowling",
      emoji: "\u{1F3B3}",
      label: "Bowling",
      backgroundColor: palette.blue,
    },
    {
      id: "arcade",
      emoji: "\u{1F579}",
      label: "Arcade",
      backgroundColor: palette.red,
    },
  ],
  "study-work": [
    {
      id: "library",
      emoji: "\u{1F4DA}",
      label: "Library",
      backgroundColor: palette.peach,
    },
    {
      id: "study-room",
      emoji: "\u{1F4DD}",
      label: "Study Room",
      backgroundColor: palette.blue,
    },
    {
      id: "coffee-shop",
      emoji: "\u{2615}",
      label: "Coffee Shop",
      backgroundColor: palette.red,
    },
  ],
};

const emptyDecisionRecord: DecisionRecord = {
  uuid: null,
  join_code: null,
  name: "",
  category: null,
  options: [],
  result: null,
  created_at: null,
};

export default function AddOptionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ decision?: string }>();
  const initialDecision =
    parseDecisionRecord(params.decision) ?? emptyDecisionRecord;

  const [decision, setDecision] = useState<DecisionRecord>(initialDecision);
  const [newOptionName, setNewOptionName] = useState("");

  const suggestions = useMemo(
    () => (decision.category ? suggestionMap[decision.category] : []),
    [decision.category],
  );

  const logDecisionUpdate = (updatedDecision: DecisionRecord) => {
    console.log("updatedDecision", updatedDecision);
    console.log(
      "updatedDecision:json",
      JSON.stringify(updatedDecision, null, 2),
    );
  };

  const updateDecisionOptions = (nextOptions: DecisionOption[]) => {
    const updatedDecision = {
      ...decision,
      options: nextOptions,
    };

    setDecision(updatedDecision);
    logDecisionUpdate(updatedDecision);
  };

  const addOption = (label: string) => {
    const trimmedLabel = label.trim();

    if (!trimmedLabel) {
      return;
    }

    const optionAlreadyExists = decision.options.some(
      (option) => option.label.toLowerCase() === trimmedLabel.toLowerCase(),
    );

    if (optionAlreadyExists) {
      setNewOptionName("");
      return;
    }

    updateDecisionOptions([
      ...decision.options,
      {
        id: `${Date.now()}-${trimmedLabel.toLowerCase().replace(/\s+/g, "-")}`,
        label: trimmedLabel,
        votes: [],
      },
    ]);
    setNewOptionName("");
  };

  const removeOption = (optionId: string) => {
    updateDecisionOptions(
      decision.options.filter((option) => option.id !== optionId),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={32}
            color={palette.white}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Add Options</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.roomBanner}>
          <MaterialCommunityIcons
            name="map-marker"
            size={36}
            color={palette.darkBlue}
          />
          <Text style={styles.roomBannerText}>
            {decision.name || "Untitled decision"}
          </Text>
        </View>

        <View style={styles.optionList}>
          {decision.options.map((option) => (
            <View key={option.id} style={styles.optionCard}>
              <Text style={styles.optionText}>{option.label}</Text>
              <Pressable
                onPress={() => removeOption(option.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${option.label}`}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={38}
                  color={palette.darkBlue}
                />
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.addOptionRow}>
          <TextInput
            value={newOptionName}
            onChangeText={setNewOptionName}
            placeholder="Add another option"
            placeholderTextColor={palette.darkBlue}
            style={styles.addOptionInput}
            onSubmitEditing={() => addOption(newOptionName)}
            returnKeyType="done"
          />
          <Pressable
            onPress={() => addOption(newOptionName)}
            style={styles.addButton}
            accessibilityRole="button"
            accessibilityLabel="Add option"
          >
            <MaterialCommunityIcons
              name="plus"
              size={38}
              color={palette.darkBlue}
            />
          </Pressable>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Suggestions</Text>

        <View style={styles.suggestionRow}>
          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion.id}
              onPress={() => addOption(suggestion.label)}
              style={[
                styles.suggestionCard,
                { backgroundColor: suggestion.backgroundColor },
              ]}
            >
              <Text style={styles.suggestionEmoji}>{suggestion.emoji}</Text>
              <Text style={styles.suggestionLabel}>{suggestion.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.divider} />

        <Pressable style={styles.continueButton}>
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
    paddingBottom: 36,
  },
  roomBanner: {
    backgroundColor: palette.white,
    paddingHorizontal: 28,
    paddingVertical: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  roomBannerText: {
    flex: 1,
    color: palette.darkBlue,
    fontSize: 28,
    fontWeight: "700",
  },
  optionList: {
    paddingHorizontal: 22,
    paddingTop: 26,
    gap: 18,
  },
  optionCard: {
    backgroundColor: "#CED8EE",
    borderRadius: 18,
    minHeight: 104,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    flex: 1,
    color: palette.darkBlue,
    fontSize: 28,
    fontWeight: "600",
  },
  addOptionRow: {
    marginTop: 22,
    marginHorizontal: 22,
    backgroundColor: palette.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9D3CB",
    minHeight: 104,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 10,
  },
  addOptionInput: {
    flex: 1,
    color: palette.darkBlue,
    fontSize: 28,
    fontWeight: "600",
    paddingVertical: 22,
  },
  addButton: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 4,
    backgroundColor: palette.darkBlue,
    marginHorizontal: 36,
    marginTop: 34,
  },
  sectionTitle: {
    marginTop: 24,
    color: palette.darkBlue,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  suggestionRow: {
    marginTop: 24,
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  suggestionCard: {
    flex: 1,
    minHeight: 216,
    borderRadius: 38,
    paddingHorizontal: 12,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionEmoji: {
    fontSize: 52,
    marginBottom: 16,
  },
  suggestionLabel: {
    color: palette.darkBlue,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  continueButton: {
    marginTop: 46,
    marginHorizontal: 20,
    backgroundColor: palette.red,
    borderRadius: 999,
    paddingVertical: 26,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  continueButtonText: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
});
