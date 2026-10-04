import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { Image, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        你好
      </ThemedText>

      <Image
        source={require("@/assets/images/snoopy-and-woodstock.png")}
        style={styles.imageMainLogo}
      />
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
});
