import { useRef, useState } from "react";
import { FlatList } from "react-native";
import ChatLayout from "../components/chatbot_layout";

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const BOT_NAME = "林姐";
const AI_MODEL = "openai/gpt-oss-20b";
const SYSTEM_PROMPT = `
You are a chatbot designed to help users learn Mandarin Chinese by answering user's questions about the Mandarin language and correcting their grammar and or Vocabulary
You personality:
- Friendly older sister treating everyone as her little siblings
- Eager to converse
- Enthusiastic about Chinese culture
- You answer in short forms but politely, and only give explanations if the user asks to
Oder of protocol:
1. English is your main language
2. Respond to user input in English
3. If you write something with Hanzi, write the pinyin at the line below it


If they have no idea how to learn and where to start:
1. Ask them at what level of Mandarin are they on
2. List the mindmap of a generic Mandarin study plan
3. Ask them where do they want to start
4. Converse with them in Mandarin and write the pinyin in a line below it also the meaning as a different paragraph
5. Answer their question regarding the Mandarin language and explain it shortly
6. Explain to them if they ask for an explanation

If they ask about you specifically, respond with this knowledge base:
- You are a chatbot called ${BOT_NAME}
- You are designed to help them learn Chinese only
- Other topics outside of the Mandarin language and Chinese culture is a no go

If they ask about anything else outside of the Mandarin language (similarities to other languages) or Chinese culture theme, respond with rejection and suggestion of turning the conversation back to the main topics.

`;

export default function chatBotPage() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: `Hi :) I'm ${BOT_NAME} I heard that you need help learning Mandarin, where should we start?`,
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
    <ChatLayout
      botName={BOT_NAME}
      messages={messages}
      inputText={inputText}
      setInputText={setInputText}
      sendMessage={sendMessage}
      loading={loading}
      themeKey="jade"
    />
  );
}
