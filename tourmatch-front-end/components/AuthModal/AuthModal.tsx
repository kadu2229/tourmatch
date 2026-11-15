"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./AuthModal.module.css";

type AuthModalContextValue = {
  openLogin: () => void;
  closeLogin: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal precisa ser usado dentro de AuthModalProvider");
  }
  return context;
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const emailId = useId();
  const senhaId = useId();

  const openLogin = useCallback(() => setOpen(true), []);
  const closeLogin = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ openLogin, closeLogin }), [openLogin, closeLogin]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLogin();
    };

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeLogin]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {open && (
        <div className={styles.overlay} onClick={closeLogin}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className={styles.closeButton} aria-label="Fechar" onClick={closeLogin}>
              ×
            </button>

            <h2 id={titleId} className={styles.title}>Entrar no TourMatch</h2>
            <p className={styles.subtitle}>Acesse a sua conta para encontrar o guia ideal.</p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.label} htmlFor={emailId}>E-mail</label>
              <input
                id={emailId}
                name="email"
                type="email"
                className={styles.input}
                placeholder="voce@exemplo.com"
                autoComplete="email"
                required
                autoFocus
              />

              <label className={styles.label} htmlFor={senhaId}>Senha</label>
              <input
                id={senhaId}
                name="senha"
                type="password"
                className={styles.input}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />

              <button type="submit" className={styles.submit}>Entrar</button>
            </form>

            <p className={styles.footerText}>
              Ainda não tem conta?{" "}
              <Link href="/cadastro" className={styles.link} onClick={closeLogin}>
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      )}
    </AuthModalContext.Provider>
  );
}
