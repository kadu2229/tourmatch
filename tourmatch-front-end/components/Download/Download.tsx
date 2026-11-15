import Link from "next/link";
import styles from "./Download.module.css";

export default function Download() {
  return (
    <section id="inicio" className={styles.download}>
      <div className={styles.content}>
        <h1 className={styles.title}>
            O guia ideal a um <span className={styles.highlight}>match</span> de distância de você
        </h1>
        <p className={styles.subtitle}>
          Diga o que você procura e receba recomendações de guias compatíveis com seus interesses, idioma e orçamento.
        </p>
        <div className={styles.actions}>
          <a href="#" className={styles.primaryButton}>
            Baixar versão mobile
          </a>
          <Link href="/cadastro" className={styles.secondaryButton}>
            Criar conta
          </Link>
        </div>
      </div>
    </section>
  );
}
