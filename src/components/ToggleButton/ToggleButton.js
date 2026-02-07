"use client"
import styles from "./ToggleButton.module.css";
import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";

/*
this is the toggle button component, it will be used to toggle between light and dark mode
it will be used in the navbar components for both homeNavBar and loggedinNavBar, it will be 
used to toggle between light and dark mode for the entire website.
*/

export default function ToggleButton() {
    const [isToggled, setIsToggled] = useState(false);

    const toggleButton = () => {
        setIsToggled(!isToggled);
        console.log("Toggled", !isToggled);
    };

    return (
        <div className={styles.toggleButtonContainer}>
            <button type="button" className={styles.toggleButton} onClick={toggleButton}>
                <Image src={isToggled ? "/moon.png" : "/sun.png"} alt="blooper!!" width={24} height={24} />
            </button>
        </div>
    );
}