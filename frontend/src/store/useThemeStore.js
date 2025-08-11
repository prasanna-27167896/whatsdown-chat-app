import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("color-theme") || "night",
  setTheme: (theme) => {
    localStorage.setItem("color-theme", theme);
    set({ theme });
  },
}));

export default useThemeStore;
