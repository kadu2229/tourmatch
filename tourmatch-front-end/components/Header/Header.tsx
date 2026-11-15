"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/img/Logo.png";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current && y > 80) {
        setHidden(true);
        setOpen(false);
      } else if (y < lastY.current) {
        setHidden(false);
      }
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${hidden ? styles.headerHidden : ""}`}>
      <div className={styles.headerContainer}>
        <Link href="/" onClick={close}>
          <Image src={Logo} alt="TourMatch" className={styles.logo} priority />
        </Link>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`}>
          <ul className={styles.navList}>
            <li><Link href="/#inicio" onClick={close}>Início</Link></li>
            <li><Link href="/#sobre" onClick={close}>Sobre</Link></li>
            <li><Link href="/#contato" onClick={close}>Contato</Link></li>
            <li className={styles.mobileOnly}>
              <Link href="/login" onClick={close}>Entrar</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <Link className={styles.loginLink} href="/login" onClick={close}>
            Entrar
          </Link>
          <button
            type="button"
            className={`${styles.menuButton} ${open ? styles.menuButtonOpen : ""}`}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </div>
    </header>
  );
}