"use client"
import styles from "./ToggleButton.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes"; //next-themes package

/*
this is the toggle button component, it will be used to toggle between light and dark mode
it will be used in the navbar components for both homeNavBar and loggedinNavBar, it will be 
used to toggle between light and dark mode for the entire website.
*/

export default function ToggleButton() {
    /*
    this is a hook that allows us to access the current theme and set the theme, 
    it also gives us access to the system theme (light or dark) which we can use 
    to set the initial theme of the website. useTheme().
    */
    const {theme, setTheme, systemTheme} = useTheme(); 
    const [mounted, setMounted] = useState(false);

    
    /*
    runs after component is mounted on the client, preventing hydration mistmatch
    by ensuring the button only renders after the theme is available on the client side.
    */
    useEffect(() => {
        setMounted(true);
    }, [])

    /*
    this is to prevent the toggle button from rendering on the server side, 
    which would cause a mismatch between the server and client rendering, 
    we only want to render the toggle button on the client side after the 
    component has mounted.
    */ 
    if (!mounted) return null; 
    
    /*
    this is to get the current theme, if the theme is set to system, 
    we use the system theme, otherwise we use the theme that is set by the user.
    */
    const currentTheme = theme === "system" ? systemTheme : theme; 

    /*
    this is to check if the current theme is dark or not, we will use this 
    to determine which icon to show on the toggle button.
    */
    const isDark = currentTheme === "dark"; 

    /*
    this is to toggle the theme, if the current theme is dark, 
    we set it to light, otherwise we set it to dark.
    */
    const toggleButton = () => {
        setTheme(isDark ? "light" : "dark"); 
    }

    return (
        <div className={styles.toggleButtonContainer}>
            <button type="button" className={styles.toggleButton} onClick={toggleButton}>
                <Image src={isDark ? "/moon.png" : "/sun.png"} alt="toggle theme" width={24} height={24} />
            </button>
        </div>
    );
}