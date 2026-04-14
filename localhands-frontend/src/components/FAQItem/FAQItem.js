"use client";

import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "lucide-react";

//reusable faw item component with accordion expansion and i18n support
export default function FAQItem({ id, questionKey, answerKey, expandedItem, onToggle, styles }) {
  const { t } = useTranslation();

  return (
    <div className={`${styles.faqItem} ${expandedItem === id ? styles.expanded : ''}`}>
      <button className={styles.question} onClick={() => onToggle(id)}>
        <span>{t(`faq.question.${questionKey}`)}</span>
        {expandedItem === id ? (
          <ChevronUp size={20} className={styles.chevron} />
        ) : (
          <ChevronDown size={20} className={styles.chevron} />
        )}
      </button>
      
      {/*Show answer only when this item is expanded*/}
      {expandedItem === id && (
        <div className={styles.answer}>
          <p>{t(`faq.answer.${answerKey}`)}</p>
        </div>
      )}
    </div>
  );
}
