"use client"

/**
 * this component is used to wrap the entire application with the themeprovider from next-themes.
 * it allows us to easily switch between light and dark themes based on the user's system preferences.
 */

import { ThemeProvider } from "next-themes";
import "@/i18n";

export function Providers({ children }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
    )
}
