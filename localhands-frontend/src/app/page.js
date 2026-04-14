"use client"

import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { motion, useScroll, useTransform} from "framer-motion";

export default function Home() {

  const { t } = useTranslation();
  const { scrollY } = useScroll(); //Tracks the position of the user's scroll
  const titleSizeChange = useTransform(scrollY, [0, 300], [1.5, 1]); //Smoother Transformations
  const subtitleTransparency = useTransform(scrollY, [0, 250], [0, 1]);
  const subtitleY = useTransform(scrollY, [0, 250], [40, 0]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>

      <HomeNavBar scrollToSection={scrollToSection} />

      <section id="home" className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            {t("hero.title")}<br/> 
            <span className={styles.titleSecond}>{t("hero.titleSecond")}</span>
          </h1>
          <p className={styles.subtitle}>{t("hero.subtitle")}</p>

          <div className={styles.buttonGroup}>
            <Link href="/signup" className={styles.tryButton}>
              {t("hero.buttonTry")}
            </Link>
            <button onClick={() => scrollToSection('services')} className={styles.howButton}>{t("hero.buttonHow")}</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.textSection}>
        <div className = {styles.headerArea}>
          <motion.h1 className = {styles.mainTitle} style={{scale: titleSizeChange}}>{t("about.title")}</motion.h1>
          <motion.p className = {styles.subtTitle} style={{opacity: subtitleTransparency, y: subtitleY}}>{t("about.subtitle")}</motion.p>
        </div>

        <div className = {styles.aboutGrid}>
          <motion.div
            className={styles.aboutSection}
            initial={{opacity:0}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6, delay:0.5, ease: "easeOut"}}>

            <h3>{t("about.gridSection.find.title")}</h3>
            <p>{t("about.gridSection.find.description")}</p>
          </motion.div>

          <motion.div
            className={styles.aboutSection}
            initial={{opacity:0, y:50}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6, delay:0.75}}>

            <h3>{t("about.gridSection.verified.title")}</h3>
            <p>{t("about.gridSection.verified.description")}</p>
          </motion.div>

          <motion.div
            className={styles.aboutSection}
            initial={{opacity:0, y:50}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6, delay:0.5}}>

            <h3>{t("about.gridSection.communication.title")}</h3>
            <p>{t("about.gridSection.communication.description")}</p>
          </motion.div>

          <motion.div
            className={styles.aboutSection}
            initial={{opacity:0, y:50}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6, delay:0.75}}>

            <h3>{t("about.gridSection.secure.title")}</h3>
            <p>{t("about.gridSection.secure.description")}</p>
          </motion.div>

          <motion.div
            className={styles.aboutSection}
            initial={{opacity:0, y:50}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6, delay:0.5}}>

            <h3>{t("about.gridSection.accessible.title")}</h3>
            <p>{t("about.gridSection.accessible.description")}</p>
          </motion.div>
        </div>

        <motion.div
          className={styles.missionArea}
          initial={{opacity:0, y:40}}
          whileInView={{opacity:1, y:0}}
          viewport={{once:true, margin: "-100px"}}
          transition={{duration: 0.8, delay:0.5}}>
          <h2>{t("about.mission.title")}</h2>
          <p>{t("about.mission.description")}</p>
        </motion.div>                   
      </section>

      {/* Services Section */}
      <section id="services" className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <motion.h2 
            initial={{opacity:0, y:30}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6}}>
            {t("services.title")}
          </motion.h2>
          <motion.p 
            className={styles.sectionSubtitle}
            initial={{opacity:0, y:20}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6, delay:0.2}}>
            {t("services.subtitle")}
          </motion.p>
        </div>

        <div className={styles.servicesGrid}>
          <motion.div 
            className={styles.serviceCard}
            initial={{opacity:0, y:50}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6, delay:0.1}}>
            <div className={styles.serviceIcon}>?</div>
            <h3>{t("services.card1.title")}</h3>
            <p>{t("services.card1.description")}</p>
          </motion.div>

          <motion.div 
            className={styles.serviceCard}
            initial={{opacity:0, y:50}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6, delay:0.2}}>
            <div className={styles.serviceIcon}>?</div>
            <h3>{t("services.card2.title")}</h3>
            <p>{t("services.card2.description")}</p>
          </motion.div>

          <motion.div 
            className={styles.serviceCard}
            initial={{opacity:0, y:50}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6, delay:0.3}}>
            <div className={styles.serviceIcon}>?</div>
            <h3>{t("services.card3.title")}</h3>
            <p>{t("services.card3.description")}</p>
          </motion.div>

          <motion.div 
            className={styles.serviceCard}
            initial={{opacity:0, y:50}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6, delay:0.4}}>
            <div className={styles.serviceIcon}>?</div>
            <h3>{t("services.card4.title")}</h3>
            <p>{t("services.card4.description")}</p>
          </motion.div>
        </div>

        <motion.div 
          className={styles.servicesCTA}
          initial={{opacity:0, y:30}}
          whileInView={{opacity:1, y:0}}
          viewport={{once:true, margin:"-100px"}}
          transition={{duration:0.6, delay:0.5}}>
          <Link href="/signup" className={styles.ctaButton}>
            {t("services.ctaButton")}
          </Link>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contactSection}>
        <div className={styles.sectionHeader}>
          <motion.h2 
            initial={{opacity:0, y:30}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6}}>
            {t("contact.title")}
          </motion.h2>
          <motion.p 
            className={styles.sectionSubtitle}
            initial={{opacity:0, y:20}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6, delay:0.2}}>
            {t("contact.subtitle")}
          </motion.p>
        </div>

        <div className={styles.contactContent}>
          <motion.div 
            className={styles.contactInfo}
            initial={{opacity:0, x:-50}}
            whileInView={{opacity:1, x:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6}}>
            <div className={styles.contactItem}>
              <h3>{t("contact.email.title")}</h3>
              <p>{t("contact.email.value")}</p>
            </div>
            <div className={styles.contactItem}>
              <h3>{t("contact.phone.title")}</h3>
              <p>{t("contact.phone.value")}</p>
            </div>
            <div className={styles.contactItem}>
              <h3>{t("contact.address.title")}</h3>
              <p>{t("contact.address.value")}</p>
            </div>
          </motion.div>

          <motion.form 
            className={styles.contactForm}
            initial={{opacity:0, x:50}}
            whileInView={{opacity:1, x:0}}
            viewport={{once:true, margin:"-100px"}}
            transition={{duration:0.6, delay:0.2}}>
            <div className={styles.formGroup}>
              <input type="text" placeholder={t("contact.form.name")} className={styles.formInput} />
            </div>
            <div className={styles.formGroup}>
              <input type="email" placeholder={t("contact.form.email")} className={styles.formInput} />
            </div>
            <div className={styles.formGroup}>
              <textarea placeholder={t("contact.form.message")} className={styles.formTextarea} rows={5}></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>
              {t("contact.form.submit")}
            </button>
          </motion.form>
        </div>
      </section>

      <Footer />

    </div>
  );
}
