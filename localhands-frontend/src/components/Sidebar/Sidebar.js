"use client";

import styles from "./Sidebar.module.css";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardList, Home, LogOut, Menu, MessageCircle, Settings, User, Wallet, Wrench, X } from "lucide-react";
import { logoutUser } from "@/api/authApi";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // redirection even if logout fails
      router.push("/login");
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.mobileToggle}
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        {isCollapsed ? <Menu size={18} /> : <X size={18} />}
      </button>

      <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
        <div className={styles.nav}>
          <Link
            href="/dashboard"
            className={styles.navItem}
            title={isCollapsed ? t("sidebar.dashboard") : undefined}
          >
            <Home size={20} className={styles.icon} strokeWidth={2.1} />
            <span className={styles.label}>{t("sidebar.dashboard")}</span>
          </Link>

          <Link
            href="/dashboard/services"
            className={styles.navItem}
            title={isCollapsed ? t("sidebar.services") : undefined}
          >
            <Wrench size={20} className={styles.icon} strokeWidth={2.1} />
            <span className={styles.label}>{t("sidebar.services")}</span>
          </Link>

          <Link
            href="/requests"
            className={styles.navItem}
            title={isCollapsed ? t("sidebar.requests") : undefined}
          >
            <ClipboardList size={20} className={styles.icon} strokeWidth={2.1} />
            <span className={styles.label}>{t("sidebar.requests")}</span>
          </Link>

          <Link
            href="/messages"
            className={styles.navItem}
            title={isCollapsed ? t("sidebar.messages") : undefined}
          >
            <MessageCircle size={20} className={styles.icon} strokeWidth={2.1} />
            <span className={styles.label}>{t("sidebar.messages")}</span>
          </Link>

          <Link
            href="/wallet"
            className={styles.navItem}
            title={isCollapsed ? t("sidebar.wallet") : undefined}
          >
            <Wallet size={20} className={styles.icon} strokeWidth={2.1} />
            <span className={styles.label}>{t("sidebar.wallet")}</span>
          </Link>

          <Link
            href="/dashboard/profile"
            className={styles.navItem}
            title={isCollapsed ? t("sidebar.profile") : undefined}
          >
            <User size={20} className={styles.icon} strokeWidth={2.1} />
            <span className={styles.label}>{t("sidebar.profile")}</span>
          </Link>

          <Link
            href="/dashboard/settings"
            className={styles.navItem}
            title={isCollapsed ? t("sidebar.settings") : undefined}
          >
            <Settings size={20} className={styles.icon} strokeWidth={2.1} />
            <span className={styles.label}>{t("sidebar.settings")}</span>
          </Link>

          <button
            onClick={handleLogout}
            className={styles.navItem}
            title={isCollapsed ? t("sidebar.logout") : undefined}
          >
            <LogOut size={20} className={styles.icon} strokeWidth={2.1} />
            <span className={styles.label}>{t("sidebar.logout")}</span>
          </button>
        </div>
      </div>
    </>
  );
}
