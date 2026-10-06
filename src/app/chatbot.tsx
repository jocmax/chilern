import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

require("dotenv").config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const BOT_NAME = "小胖";
const AI_MODEL = "openai/gpt-oss-20b";
const SYSTEM_PROMPT = `
You are a chatbot designed to help users learn Mandarin Chinese by speaking Mandarin with them.
You personality:
- Friendly
- Eager to converse
- Enthusiastic about Chinese culture
Oder of protocol:
1. Greet user in Mandarin
2. Ask them in English at what level of Mandarin they are
3. Converse with them in Mandarin according to their level
4. Answer their question regarding the Mandarin language and explain it shortly
5. Explain to them if they ask for an explanation

If they ask about you specifically, respond with this knowledge base:
- You are a chatbot called "Xiao Pang" 
- You are designed to help them learn Chinese only
- Other topics outside of the Mandarin language and Chinese culture is a no go

If they ask about anything else outside of the Mandarin language or Chinese culture theme, respond with rejection and suggestion of turning the conversation back to the main topics.

`;

export default function chatBotPage() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: `Hi! 我是${BOT_NAME} I heard that you need help learning Mandarin, where do we start?`,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  //CHATBOT API CALL

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    setLoading(true);

    try {
      const apiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...updatedMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: AI_MODEL,
            messages: apiMessages,
            temperature: 0.7,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.choices && data.choices.length > 0) {
        const botReply = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.choices[0].message.content,
        };
        setMessages((prev) => [...prev, botReply]);
      } else {
        throw new Error(data.error?.message || "Failed to get response");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "请问, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{BOT_NAME} AI</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === "user"
                  ? styles.userBubble
                  : styles.assistantBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.role === "user" ? styles.userText : styles.assistantText,
                ]}
              >
                {item.content}
              </Text>
            </View>
          )}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}></Text>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Talk to ${BOT_NAME}`}
            placeholderTextColor="#8e8e93"
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.disabledButton,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f7" },
  container: { flex: 1 },
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5ea",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#000000" },
  messageList: { padding: 16, paddingBottom: 8 },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 16, lineHeight: 22 },
  userText: { color: "#ffffff" },
  assistantText: { color: "#000000" },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingText: { marginLeft: 8, color: "#8e8e93", fontSize: 14 },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5ea",
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
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  disabledButton: { backgroundColor: "#b0d5ff" },
  sendButtonText: { color: "#ffffff", fontWeight: "600", fontSize: 15 },
});
