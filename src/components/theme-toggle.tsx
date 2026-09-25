import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

const THEME_KEY = "agrilink-theme";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    const nextTheme: Theme = savedTheme === "light" ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} mode`;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className="size-11 shrink-0 rounded-full border border-header-border bg-header-control text-header-foreground hover:bg-header-control-hover hover:text-header-foreground"
      onClick={() => {
        applyTheme(nextTheme);
        window.localStorage.setItem(THEME_KEY, nextTheme);
        setTheme(nextTheme);
      }}
    >
      {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}