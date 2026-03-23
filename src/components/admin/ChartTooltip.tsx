"use client";
import { useTheme } from "./ThemeProvider";

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return {
    tooltipStyle: {
      background: isDark ? "#1A1A1A" : "#FFFFFF",
      border: isDark ? "1px solid #262626" : "1px solid #E5E5E5",
      borderRadius: "6px",
      fontSize: "11px",
      color: isDark ? "#EDEDED" : "#171717",
      boxShadow: "none",
    },
    axisColor: isDark ? "#6B6B6B" : "#A3A3A3",
    gridColor: isDark ? "#1A1A1A" : "#F0F0F0",
    labelColor: isDark ? "#6B6B6B" : "#A3A3A3",
    accentColor: "#5E6AD2",
    blueColor: "#5E6AD2",
  };
}
