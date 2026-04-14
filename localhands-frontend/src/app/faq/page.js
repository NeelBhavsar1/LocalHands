"use client"

import { useState } from "react";
import HomeNavBar from "@/components/HomeNavBar/HomeNavBar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import { useTranslation } from "react-i18next";
import { User, Settings, Wrench, HelpCircle, AlertCircle } from "lucide-react";
import FAQItem from "@/components/FAQItem/FAQItem";

//faq page with expandable items and full i18n support
export default function FAQ() {
    const { t } = useTranslation()
    const [expandedItem, setExpandedItem] = useState(null)

    //toggle faq item expansion. closes if open, opens if closed
    const toggleItem = (itemId) => {
        setExpandedItem(prev => prev === itemId ? null : itemId)
    };

    return (
        <div className={styles.container}>
            <HomeNavBar showLinks={false}/>
            
            <div className={styles.faqContent}>
                <div className={styles.header}>
                    <h1>{t('faq.title')}</h1>
                    <p>{t('faq.subtitle')}</p>
                </div>

                <div className={styles.categories}>
                    <div className={styles.category}>
                        <h2 className={styles.categoryTitle}>
                            <User size={20} />
                            {t('faq.category.account')}
                        </h2>
                        
                        <div className={styles.questionsList}>
                            <FAQItem
                                id="changeName"
                                questionKey="changeName"
                                answerKey="changeName"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="changeAccountType"
                                questionKey="changeAccountType"
                                answerKey="changeAccountType"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="deleteAccount"
                                questionKey="deleteAccount"
                                answerKey="deleteAccount"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="changeEmail"
                                questionKey="changeEmail"
                                answerKey="changeEmail"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="changePassword"
                                questionKey="changePassword"
                                answerKey="changePassword"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />
                        </div>
                    </div>

                    <div className={styles.category}>
                        <h2 className={styles.categoryTitle}>
                            <Settings size={20} />
                            {t('faq.category.profile')}
                        </h2>
                        
                        <div className={styles.questionsList}>
                            <FAQItem
                                id="profilePhoto"
                                questionKey="profilePhoto"
                                answerKey="profilePhoto"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="privacySettings"
                                questionKey="privacySettings"
                                answerKey="privacySettings"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="serviceProviderToggle"
                                questionKey="serviceProviderToggle"
                                answerKey="serviceProviderToggle"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="bioUpdate"
                                questionKey="bioUpdate"
                                answerKey="bioUpdate"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />
                        </div>
                    </div>

                    <div className={styles.category}>
                        <h2 className={styles.categoryTitle}>
                            <Wrench size={20} />
                            {t('faq.category.listings')}
                        </h2>
                        
                        <div className={styles.questionsList}>
                            <FAQItem
                                id="createListing"
                                questionKey="createListing"
                                answerKey="createListing"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="editListing"
                                questionKey="editListing"
                                answerKey="editListing"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="deleteListing"
                                questionKey="deleteListing"
                                answerKey="deleteListing"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="listingVisibility"
                                questionKey="listingVisibility"
                                answerKey="listingVisibility"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />
                        </div>
                    </div>

                    
                    <div className={styles.category}>
                        <h2 className={styles.categoryTitle}>
                            <HelpCircle size={20} />
                            {t('faq.category.reviews')}
                        </h2>
                        
                        <div className={styles.questionsList}>
                            <FAQItem
                                id="leaveReview"
                                questionKey="leaveReview"
                                answerKey="leaveReview"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="editReview"
                                questionKey="editReview"
                                answerKey="editReview"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />
                        </div>
                    </div>

                    
                    <div className={styles.category}>
                        <h2 className={styles.categoryTitle}>
                            <AlertCircle size={20} />
                            {t('faq.category.technical')}
                        </h2>
                        
                        <div className={styles.questionsList}>
                            <FAQItem
                                id="loginProblems"
                                questionKey="loginProblems"
                                answerKey="loginProblems"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="profileNotUpdating"
                                questionKey="profileNotUpdating"
                                answerKey="profileNotUpdating"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />

                            <FAQItem
                                id="photosNotUploading"
                                questionKey="photosNotUploading"
                                answerKey="photosNotUploading"
                                expandedItem={expandedItem}
                                onToggle={toggleItem}
                                styles={styles}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
