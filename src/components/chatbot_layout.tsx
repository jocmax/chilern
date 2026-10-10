//Improving Coding Efficiency

import { useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { themes } from "../constants/theme";

export interface Message {
  id: string;
  role: string;
  content: string;
}

export interface ChatTheme {
  bg: string;
  headerBg: string;
  statusBarBg: string;
  userBubbleBg: string;
  assistantBubbleBg: string;
  assistantTextColor: string;
  sendButtonBg: string;
  sendButtonDisabledBg: string;
  loaderColor: string;
  placeholderColor: string;
}

interface ChatLayoutProps {
  botName: string;
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  sendMessage: () => void;
  loading?: boolean;
  themeKey?: keyof typeof themes;
}

export default function ChatLayout({
  botName,
  messages,
  inputText,
  setInputText,
  sendMessage,
  loading = false,
  themeKey = "chunjie",
}: ChatLayoutProps) {
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const theme = themes[themeKey] || themes.chunjie;

  return (
    <SafeAreaView
      style={[baseStyles.safeArea, { backgroundColor: theme.statusBarBg }]}
    >
      <KeyboardAvoidingView
        style={[baseStyles.container, { backgroundColor: theme.bg }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View
          style={[
            baseStyles.header,
            {
              backgroundColor: theme.headerBg,
              borderBottomColor: theme.headerBg,
            },
          ]}
        >
          <Text style={baseStyles.headerTitle}>{botName}</Text>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages.filter((m) => m.role !== "system")}
          keyExtractor={(item) => item.id}
          contentContainerStyle={baseStyles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          style={baseStyles.flexOne}
          renderItem={({ item }) => (
            <View
              style={[
                baseStyles.bubble,
                item.role === "user"
                  ? [
                      baseStyles.userBubble,
                      { backgroundColor: theme.userBubbleBg },
                    ]
                  : [
                      baseStyles.assistantBubble,
                      { backgroundColor: theme.assistantBubbleBg },
                    ],
              ]}
            >
              <Text
                style={[
                  baseStyles.messageText,
                  item.role === "user"
                    ? baseStyles.userText
                    : { color: theme.assistantTextColor },
                ]}
              >
                {item.content}
              </Text>
            </View>
          )}
        />

        {/* Loading State */}
        {loading && (
          <View style={baseStyles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.loaderColor} />
          </View>
        )}

        {/* Input Bar */}
        <View
          style={[
            baseStyles.inputContainer,
            { backgroundColor: theme.headerBg, borderTopColor: theme.bg },
          ]}
        >
          <TextInput
            style={baseStyles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Talk to ${botName}`}
            placeholderTextColor={theme.placeholderColor}
            multiline
            returnKeyType={Platform.OS === "web" ? "send" : "default"}
            onSubmitEditing={Platform.OS === "web" ? sendMessage : undefined}
            onKeyPress={(e) => {
              if (Platform.OS === "web") {
                const nativeEvt = e.nativeEvent as unknown as KeyboardEvent;
                if (nativeEvt.key === "Enter" && !nativeEvt.shiftKey) {
                  e.preventDefault?.();
                  sendMessage();
                }
              }
            }}
          />
          <TouchableOpacity
            style={[
              baseStyles.sendButton,
              {
                backgroundColor:
                  !inputText.trim() || loading
                    ? theme.sendButtonDisabledBg
                    : theme.sendButtonBg,
              },
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
          >
            <Text style={baseStyles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const baseStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  flexOne: { flex: 1 },
  header: {
    padding: 5,
    borderBottomWidth: 5,
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#ffffff" },
  messageList: { padding: 16, paddingBottom: 8 },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 16, lineHeight: 22 },
  userText: { color: "#ffffff" },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f7",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    color: "#000000",
  },
  sendButton: {
    marginLeft: 10,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonText: { color: "#ffffff", fontWeight: "600", fontSize: 15 },
});
