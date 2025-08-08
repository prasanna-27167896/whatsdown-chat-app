import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("color-theme") || "dim",
  setTheme: (theme) => {
    localStorage.setItem("color-theme", theme);
    set({ theme });
  },
}));

export default useThemeStore;
