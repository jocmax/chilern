import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#000000",
    background: "#2ce1ee",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",
    textSecondary: "#60646C",
    buttonBackground: "#ffffff",
    backgroundPressed: "#ffffff98",
    buttonText: "#000000",
    border: "#ffffff",
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",
    textSecondary: "#B0B4BA",
    buttonBackground: "#5353d4",
    backgroundPressed: "#202d70",
    buttonText: "#f3f2f2",
    border: "#0c143b",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const ButtonStyles = {
  borderRadius: 30,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderWidth: 1,
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

//CHATBOT COLOR THEMES
export interface ChatTheme {
  bg: string;
  statusBarBg: string;
  headerBg: string;
  userBubbleBg: string;
  assistantBubbleBg: string;
  assistantTextColor: string;
  sendButtonBg: string;
  sendButtonDisabledBg: string;
  loaderColor: string;
  placeholderColor: string;
}

export const themes: Record<string, ChatTheme> = {
  chunjie: {
    bg: "#f3c3b5",
    statusBarBg: "#e99292",
    headerBg: "#e99292",
    userBubbleBg: "#ff5e00",
    assistantBubbleBg: "#fcfa93",
    assistantTextColor: "#000000",
    sendButtonBg: "#ff2701",
    sendButtonDisabledBg: "#ff270141",
    loaderColor: "#e75555",
    placeholderColor: "#532a2a",
  },
  jade: {
    bg: "#d1fae5",
    statusBarBg: "#33c292",
    headerBg: "#33c292",
    userBubbleBg: "#08968f",
    assistantBubbleBg: "#ffffff",
    assistantTextColor: "#0f172a",
    sendButtonBg: "#047857",
    sendButtonDisabledBg: "#04785741",
    loaderColor: "#047857",
    placeholderColor: "#064e3b",
  },
};
