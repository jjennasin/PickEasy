import { palette } from '@/constants/palette';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DecisionRoomScreen() {
  // ----------------------------
  // PLACEHOLDER: hardcoded decision name
  // TODO: replace with value from backend once API is ready
  // ----------------------------
  const decisionName = 'Decision Name';

  // ----------------------------
  // Placeholder options array
  // TODO: replace with backend data later
  // ----------------------------
  const [options, setOptions] = useState<string[]>([
    'Chipotle',
    'Cava',
    'Tela',
    'Raising Cane\'s',
  ]);

  // Current input for adding a new option
  const [currentInput, setCurrentInput] = useState('');

  // Add a new option (placeholder behavior)
  const handleAddOption = () => {
    if (currentInput.trim() && options.length < 5) {
      setOptions([...options, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  // Delete an option (placeholder behavior)
  const handleDeleteOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  // Placeholder "continue" button behavior
  const handleContinue = () => {
    if (options.length === 0) return;

    // This is just a placeholder log for now
    console.log('Decision Room Name:', decisionName);
    console.log('Options:', options);

    // TODO: navigate to voting page when backend is ready
    // router.push(`/voting?decisionName=${encodeURIComponent(decisionName)}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Blue Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="arrow-left" size={32} color={palette.white} />
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
          <Text style={styles.roomName}>{decisionName}</Text>
        </View>

        {/* Options list */}
        {options.map((option, index) => (
          <View key={index} style={styles.optionBox}>
            <Text style={styles.optionText}>{option}</Text>
            <Pressable onPress={() => handleDeleteOption(index)}>
              <MaterialCommunityIcons name="trash-can-outline" size={28} color={palette.darkBlue} />
            </Pressable>
          </View>
        ))}

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
