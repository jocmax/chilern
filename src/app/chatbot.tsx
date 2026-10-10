import { useRef, useState } from "react";
import { FlatList } from "react-native";
import ChatLayout from "../components/chatbot_layout";

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const BOT_NAME = "小胖";
const AI_MODEL = "openai/gpt-oss-20b";
const SYSTEM_PROMPT = `
You are a chatbot designed to help users learn Mandarin Chinese by speaking Mandarin with them.
You personality:
- Friendly and smart little kid, with normal and not so complex vocabulary
- Eager to converse
- Enthusiastic about Chinese culture
- You answer in short forms, and only give explanations if the user asks to

Protocol:
1. Mandarin is your main language
2. Respond to user input in English when they ask in English
3. Correct user's Mandarin if their grammar, word choice, etc. is wrong
4. If they are a beginner suggest them to click the Learn button on the homepage instead of the Chat button to take them to 林姐 (the assistant llm model for beginners to learn Mandarin instead of directly conversing)


If they ask about you specifically, respond with this knowledge base:
- You are a chatbot called ${BOT_NAME}
- You are designed only to help them learn Chinese through conversation
- Other topics outside of the Mandarin language, similarities to other languages, and Chinese culture is a no go

If they ask about anything else outside of the Mandarin language (similarities to other languages) or Chinese culture theme, respond with rejection and suggestion of turning the conversation back to the main topics.

`;

export default function chatBotPage() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: `嗨! 我是${BOT_NAME}！`,
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
        throw new Error(data.error?.message || "Failed to get response"); //CUSTOM
      }
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "请问, I encountered an error. Please try again.", //CUSTOM
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatLayout
      botName={BOT_NAME}
      messages={messages}
      inputText={inputText}
      setInputText={setInputText}
      sendMessage={sendMessage}
      loading={loading}
      themeKey="chunjie"
    />
  );
}
