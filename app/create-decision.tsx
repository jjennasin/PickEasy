import { palette } from "@/constants/palette";
import type { DecisionCategory, DecisionRecord } from "@/types/decision";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

type CategoryOption = {
  id: DecisionCategory;
  emoji: string;
  label: string;
  backgroundColor: string;
};

const categoryOptions: CategoryOption[] = [
  {
    id: "food-dining",
    emoji: "\u{1F354}",
    label: "Food & Dining",
    backgroundColor: palette.peach,
  },
  {
    id: "activity-entertainment",
    emoji: "\u{1F3AC}",
    label: "Activity & Entertainment",
    backgroundColor: palette.blue,
  },
  {
    id: "study-work",
    emoji: "\u{1F4D6}",
    label: "Study & Work",
    backgroundColor: palette.red,
  },
];

export default function CreateDecisionScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<DecisionCategory | null>(null);
  const [roomName, setRoomName] = useState("");

  const decisionDraft = useMemo<DecisionRecord>(
    () => ({
      uuid: null,
      join_code: null,
      name: roomName.trim(),
      category: selectedCategory,
      options: [],
      result: null,
      created_at: null,
    }),
    [roomName, selectedCategory],
  );

  const isReadyToCreate = Boolean(decisionDraft.category && decisionDraft.name);

  const handleCreateDecision = () => {
    if (!isReadyToCreate) {
      return;
    }

    console.log("decisionDraft", decisionDraft);
    console.log("decisionDraft:json", JSON.stringify(decisionDraft, null, 2));
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
        <Text style={styles.headerTitle}>Create decision</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
                ]}
              >
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
          <Text style={styles.roomCodeText}>
            {decisionDraft.join_code ?? " "}
          </Text>
        </View>

        <View style={styles.shareRow}>
          <Text style={styles.shareText}>Share code</Text>
          <MaterialCommunityIcons
            name="export-variant"
            size={28}
            color={palette.blue}
          />
        </View>

        <View style={styles.divider} />

        <Pressable
          style={[
            styles.createButton,
            !isReadyToCreate && styles.createButtonDisabled,
          ]}
          disabled={!isReadyToCreate}
          onPress={handleCreateDecision}
        >
          <Text style={styles.createButtonText}>Create decision room</Text>
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
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 36,
  },
  title: {
    color: palette.darkBlue,
    fontSize: 58,
    lineHeight: 72,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -2,
  },
  subtitle: {
    marginTop: 10,
    color: palette.blue,
    fontSize: 28,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: -0.8,
  },
  categoryRow: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minHeight: 216,
    borderRadius: 38,
    paddingHorizontal: 12,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "transparent",
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
    fontWeight: "700",
    textAlign: "center",
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
    fontWeight: "800",
    textAlign: "center",
  },
  input: {
    marginTop: 18,
    backgroundColor: palette.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D3CB",
    paddingHorizontal: 22,
    paddingVertical: 24,
    fontSize: 18,
    color: palette.darkBlue,
  },
  helperText: {
    marginTop: 8,
    color: palette.blue,
    fontSize: 18,
    textAlign: "center",
  },
  roomCodeBox: {
    alignSelf: "center",
    width: 240,
    marginTop: 22,
    backgroundColor: palette.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D3CB",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  roomCodeText: {
    minHeight: 44,
    color: palette.darkBlue,
    fontSize: 24,
    fontWeight: "700",
  },
  shareRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareText: {
    color: palette.blue,
    fontSize: 18,
    fontWeight: "500",
  },
  createButton: {
    marginTop: 44,
    backgroundColor: palette.red,
    borderRadius: 999,
    paddingVertical: 26,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  createButtonDisabled: {
    opacity: 0.55,
  },
  createButtonText: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
});
