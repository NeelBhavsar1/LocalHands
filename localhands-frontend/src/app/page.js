import ToggleButton from "@/components/ToggleButton/ToggleButton";
import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import styles from "./page.module.css";
import LanguageButton from "@/components/LanguageButton/LanguageButton";
import Footer from "@/components/Footer/Footer";


export default function Home() {

  

  return (
    <div className={styles.container}>
      <HomeNavBar />
      <Footer />
    </div>   
  );
}
