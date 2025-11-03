export const themes = {
  spotify: {
    primary: "#1DB954", // xanh lá Spotify
    primaryDark: "#1AA34A",
    muted: "#B3B3B3",
    tabBarBg: "#000000",
    tabBarBorder: "#282828",
    surface: "#121212", // đen Spotify
    cardBg: "#181818",
    cardHover: "#282828",
    text: "#FFFFFF",
    textMuted: "#A7A7A7",
    // Gradient
    gradientStart: "#1DB954",
    gradientEnd: "#121212",
    cardGradient: ["#282828", "#181818"],
    heroGradient: ["#1DB95420", "#121212"], // 20 = opacity 12%
    buttonGradient: ["#1ED760", "#1DB954"],
  },
  spotifyDark: {
    primary: "#1ED760", // xanh sáng hơn
    primaryDark: "#1DB954",
    muted: "#9E9E9E",
    tabBarBg: "#0A0A0A",
    tabBarBorder: "#1A1A1A",
    surface: "#000000",
    cardBg: "#121212",
    cardHover: "#1A1A1A",
    text: "#FFFFFF",
    textMuted: "#B3B3B3",
    // Gradient
    gradientStart: "#1ED760",
    gradientEnd: "#000000",
    cardGradient: ["#1A1A1A", "#0A0A0A"],
    heroGradient: ["#1ED76015", "#000000"],
    buttonGradient: ["#1ED760", "#1AA34A"],
  },
  midnightNeon: {
    // neon cyan cho action (Play, primary buttons)
    primary: "#22D3EE",
    primaryDark: "#06B6D4",
    muted: "#94A3B8",
    // nền xanh đen nhẹ (không quá đen)
    tabBarBg: "#0B1220",
    tabBarBorder: "#1E293B",
    surface: "#0A0F1F",
    cardBg: "#101826",
    cardHover: "#142033",
    text: "#E5E7EB",
    textMuted: "#94A3B8",
    // gradient nền rất dịu như ảnh
    gradientStart: "#0F172A",
    gradientEnd: "#0A0F1F",
    cardGradient: ["#142033", "#101826"],
    heroGradient: ["#22D3EE14", "#0F172A", "#0B1220", "#0A0F1F"], // có lớp cyan mờ trên cùng
    buttonGradient: ["#22D3EE", "#06B6D4"], // neon cho nút
  },
  tiffanyNoir: {
    // Accent neon (dùng cho nút, slider, switch)
    primary: "#93F2E0",
    primaryDark: "#72EAD7",
    muted: "#94A3B8",

    // Nền theo ảnh (đen xanh, không quá đen)
    surface: "#0E121B", // nền màn hình
    tabBarBg: "#101725", // nền tab bar
    tabBarBorder: "#1A2230",

    // Card/list
    cardBg: "#1C1F25",
    cardHover: "#101725",

    // Text
    text: "#F3F6FA",
    textMuted: "#A7B4C6",

    // Gradient
    gradientStart: "#101725",
    gradientEnd: "#0E121B",
    cardGradient: ["#1C1F25", "#101725"],
    heroGradient: ["#93F2E020", "#101725", "#0E121B"], // lớp cyan mờ + nền
    buttonGradient: ["#93F2E0", "#72EAD7"], // neon cho nút
  },
} as const;

export type ThemeKey = keyof typeof themes;
export const THEME: ThemeKey = "tiffanyNoir"; // đổi theme ở đây
export const t = themes[THEME];
