import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useAppColors } from "@/hooks/useAppColors";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet } from "react-native";

export default function HomeScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const chatPress = () => {
    router.push("../chatbot");
  };
  const learnPress = () => {
    router.push("../teachbot");
  };
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        你好
      </ThemedText>
      <Image
        source={require("@/assets/images/snoopy-and-woodstock.png")}
        style={styles.imageMainLogo}
      />
      <Pressable
        style={({ pressed }) => [
          styles.startButton,
          {
            backgroundColor: pressed
              ? colors.backgroundPressed
              : colors.buttonBackground,
            borderColor: colors.border,
          },
        ]}
        onPress={chatPress}
      >
        <ThemedText
          style={{ color: colors.buttonText, fontWeight: "bold", fontSize: 30 }}
        >
          Chat
        </ThemedText>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.startButton,
          {
            backgroundColor: pressed
              ? colors.backgroundPressed
              : colors.buttonBackground,
            borderColor: colors.border,
          },
        ]}
        onPress={learnPress}
      >
        <ThemedText
          style={{ color: colors.buttonText, fontWeight: "bold", fontSize: 30 }}
        >
          Learn
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "black",
  },
  title: {
    textAlign: "center",
    height: 70,
  },
  imageMainLogo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
  startButton: {
    width: 200,
    height: 70,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0056b3",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 100,
  },
});
