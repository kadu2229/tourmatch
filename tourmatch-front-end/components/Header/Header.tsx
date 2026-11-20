"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/img/Logo.png";
import styles from "./Header.module.css";
import { useAuthModal } from "@/components/AuthModal/AuthModal";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const close = () => setOpen(false);
  const { openLogin, usuario, carregandoSessao, logout } = useAuthModal();

  const abrirLogin = () => {
    close();
    openLogin();
  };

  const sair = () => {
    close();
    logout();
  };

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
            <li><Link href="/#about" onClick={close}>Sobre</Link></li>
            <li><Link href="/#inicio" onClick={close}>Download</Link></li>
            {!carregandoSessao && usuario && (
              <>
                <li className={styles.mobileOnly}>
                  <span className={styles.mobileUser}>{usuario.email}</span>
                </li>
                <li className={styles.mobileOnly}>
                  <button type="button" className={styles.mobileLogin} onClick={sair}>
                    Sair
                  </button>
                </li>
              </>
            )}
            {!carregandoSessao && !usuario && (
              <li className={styles.mobileOnly}>
                <button type="button" className={styles.mobileLogin} onClick={abrirLogin}>
                  Entrar
                </button>
              </li>
            )}
          </ul>
        </nav>

        <div className={styles.actions}>
          {!carregandoSessao && usuario && (
            <>
              <span className={styles.userEmail} title={usuario.email}>
                {usuario.email}
              </span>
              <button type="button" className={styles.loginLink} onClick={sair}>
                Sair
              </button>
            </>
          )}
          {!carregandoSessao && !usuario && (
            <button type="button" className={styles.loginLink} onClick={abrirLogin}>
              Entrar
            </button>
          )}
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