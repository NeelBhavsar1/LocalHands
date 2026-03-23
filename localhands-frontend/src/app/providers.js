"use client"

/**
 * this component is used to wrap the entire application with the themeprovider from next-themes.
 * it allows us to easily switch between light and dark themes based on the user's system preferences.
 */

import { ThemeProvider } from "next-themes";
import "@/i18n";

export function Providers({ children }) {
    return (
        // importing "@/i18n" above initializes i18next once for the app.
        // keep this provider in the root app tree so all client components
        // can use useTranslation() and react to language changes.
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
    )
}
