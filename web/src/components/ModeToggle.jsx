import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/ThemeProvider"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        if (theme === "dark") {
            setTheme("light")
        } else if (theme === "light") {
            setTheme("dark")
        } else {
            // If current theme is system, check system preference
            const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            setTheme(isSystemDark ? "light" : "dark")
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9 border border-zinc-200 dark:border-zinc-800 rounded-lg"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-zinc-900 dark:text-zinc-400" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-zinc-900 dark:text-zinc-400" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
