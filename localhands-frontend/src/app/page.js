import ToggleButton from "@/components/ToggleButton/ToggleButton";
import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import LanguageButton from "@/components/LanguageButton/LanguageButton";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {

  return (
    <div className={styles.container}>

      <HomeNavBar />
      <Footer />

    </div>
  );
}