"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";
import styles from "./AuthModal.module.css";

type Modo = "login" | "cadastro";

type Tipo = "turista" | "guia";

type Usuario = {
  id: string;
  email: string;
  tipo: Tipo;
  created_at: string;
};

type AuthModalContextValue = {
  openLogin: () => void;
  openCadastro: () => void;
  closeModal: () => void;
  usuario: Usuario | null;
  carregandoSessao: boolean;
  logout: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const TOKEN_KEY = "tourmatch_token";

function lerToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function salvarToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    return;
  }
}

function removerToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    return;
  }
}

async function buscarSessao(): Promise<Usuario | null> {
  const token = lerToken();
  if (!token) return null;

  try {
    const resposta = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resposta.status === 401) {
      removerToken();
      return null;
    }
    if (!resposta.ok) return null;

    const dados = await resposta.json();
    return dados.usuario as Usuario;
  } catch {
    return null;
  }
}

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
  const [enviando, setEnviando] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);
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

  const logout = useCallback(() => {
    removerToken();
    setUsuario(null);
  }, []);

  const value = useMemo(
    () => ({ openLogin, openCadastro, closeModal, usuario, carregandoSessao, logout }),
    [openLogin, openCadastro, closeModal, usuario, carregandoSessao, logout]
  );

  useEffect(() => {
    let ativo = true;

    buscarSessao().then((sessao) => {
      if (!ativo) return;
      setUsuario(sessao);
      setCarregandoSessao(false);
    });

    return () => {
      ativo = false;
    };
  }, []);

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const dados = new FormData(event.currentTarget);
    const email = String(dados.get("email") ?? "");
    const senha = String(dados.get("senha") ?? "");

    const tipo = String(dados.get("tipo") ?? "");

    if (modo === "cadastro") {
      const confirmar = String(dados.get("confirmarSenha") ?? "");
      if (senha !== confirmar) {
        setErro("As senhas não coincidem.");
        return;
      }
      if (tipo !== "turista" && tipo !== "guia") {
        setErro("Escolha se você é turista ou guia.");
        return;
      }
    }

    setEnviando(true);
    setErro("");

    try {
      const rota = modo === "cadastro" ? "register" : "login";
      const resposta = await fetch(`${API_URL}/auth/${rota}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modo === "cadastro" ? { email, senha, tipo } : { email, senha }),
      });
      const corpo = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        setErro(
          corpo?.detalhes?.[0]?.mensagem ??
            corpo?.erro ??
            "Não foi possível concluir. Tente novamente."
        );
        return;
      }

      salvarToken(corpo.token);
      setUsuario(corpo.usuario);
      setOpen(false);
    } catch {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setEnviando(false);
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

                  <fieldset className={styles.tipoGroup}>
                    <legend className={styles.label}>Você é</legend>
                    <div className={styles.tipoOptions}>
                      <label className={styles.tipoOption}>
                        <input
                          type="radio"
                          name="tipo"
                          value="turista"
                          className={styles.tipoInput}
                          required
                        />
                        <span className={styles.tipoCard}>
                          <strong>Turista</strong>
                          <small>Quero encontrar guias</small>
                        </span>
                      </label>
                      <label className={styles.tipoOption}>
                        <input
                          type="radio"
                          name="tipo"
                          value="guia"
                          className={styles.tipoInput}
                        />
                        <span className={styles.tipoCard}>
                          <strong>Guia</strong>
                          <small>Quero oferecer passeios</small>
                        </span>
                      </label>
                    </div>
                  </fieldset>
                </>
              )}

              {erro && (
                <p role="alert" className={styles.error}>
                  {erro}
                </p>
              )}

              <button type="submit" className={styles.submit} disabled={enviando}>
                {enviando ? "Aguarde..." : cadastro ? "Criar conta" : "Entrar"}
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