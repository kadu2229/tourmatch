"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";
import styles from "./AuthModal.module.css";

type Modo = "login" | "cadastro";

type AuthModalContextValue = {
  openLogin: () => void;
  openCadastro: () => void;
  closeModal: () => void;
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
  const [modo, setModo] = useState<Modo>("login");
  const [erro, setErro] = useState("");
  const titleId = useId();
  const emailId = useId();
  const senhaId = useId();
  const confirmarId = useId();

  const abrir = useCallback((novoModo: Modo) => {
    setErro("");
    setModo(novoModo);
    setOpen(true);
  }, []);

  const openLogin = useCallback(() => abrir("login"), [abrir]);
  const openCadastro = useCallback(() => abrir("cadastro"), [abrir]);
  const closeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openLogin, openCadastro, closeModal }),
    [openLogin, openCadastro, closeModal]
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeModal]);

  function trocarModo(novoModo: Modo) {
    setErro("");
    setModo(novoModo);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (modo === "cadastro") {
      const dados = new FormData(event.currentTarget);
      const senha = String(dados.get("senha") ?? "");
      const confirmar = String(dados.get("confirmarSenha") ?? "");

      if (senha !== confirmar) {
        setErro("As senhas não coincidem.");
        return;
      }
    }
  }

  const cadastro = modo === "cadastro";

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {open && (
        <div className={styles.overlay} onClick={closeModal}>
          <div
            key={modo}
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className={styles.closeButton} aria-label="Fechar" onClick={closeModal}>
              ×
            </button>

            <h2 id={titleId} className={styles.title}>
              {cadastro ? "Criar conta" : "Entrar no TourMatch"}
            </h2>
            <p className={styles.subtitle}>
              {cadastro
                ? "Cadastre-se para encontrar o guia ideal."
                : "Acesse a sua conta para encontrar o guia ideal."}
            </p>

            <form
              className={styles.form}
              onSubmit={handleSubmit}
              onChange={() => erro && setErro("")}
            >
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
                placeholder={cadastro ? "Crie uma senha" : "Digite sua senha"}
                autoComplete={cadastro ? "new-password" : "current-password"}
                minLength={cadastro ? 8 : undefined}
                required
              />

              {cadastro && (
                <>
                  <label className={styles.label} htmlFor={confirmarId}>Repetir senha</label>
                  <input
                    id={confirmarId}
                    name="confirmarSenha"
                    type="password"
                    className={styles.input}
                    placeholder="Digite a senha novamente"
                    autoComplete="new-password"
                    aria-invalid={erro ? true : undefined}
                    required
                  />
                </>
              )}

              {erro && (
                <p role="alert" className={styles.error}>
                  {erro}
                </p>
              )}

              <button type="submit" className={styles.submit}>
                {cadastro ? "Criar conta" : "Entrar"}
              </button>
            </form>

            <p className={styles.footerText}>
              {cadastro ? "Já tem conta? " : "Ainda não tem conta? "}
              <button
                type="button"
                className={styles.link}
                onClick={() => trocarModo(cadastro ? "login" : "cadastro")}
              >
                {cadastro ? "Entrar" : "Criar conta"}
              </button>
            </p>
          </div>
        </div>
      )}
    </AuthModalContext.Provider>
  );
}
