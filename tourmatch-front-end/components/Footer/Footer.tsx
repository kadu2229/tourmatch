import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/img/Logo.png";
import styles from "./Footer.module.css";

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer id="contato" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/">
            <Image src={Logo} alt="TourMatch" className={styles.logo} />
          </Link>
          <p className={styles.description}>
            Conectamos turistas a guias que combinam com o seu estilo, o seu idioma e o seu orçamento.
          </p>
        </div>

        <nav className={styles.column} aria-label="Navegação do rodapé">
          <h3 className={styles.heading}>Navegação</h3>
          <ul className={styles.list}>
            <li><Link href="/#inicio">Início</Link></li>
            <li><Link href="/#sobre">Sobre</Link></li>
            <li><Link href="/#como-funciona">Como funciona</Link></li>
            <li><Link href="/#vantagens">Por que usar</Link></li>
          </ul>
        </nav>

        <div className={styles.column}>
          <h3 className={styles.heading}>Conta</h3>
          <ul className={styles.list}>
            <li><Link href="/login">Entrar</Link></li>
            <li><Link href="/cadastro">Criar conta</Link></li>
            <li><a href="#">Baixar versão mobile</a></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3 className={styles.heading}>Contato</h3>
          <ul className={styles.list}>
            <li><a href="mailto:kadu222963@gmail.com">kadu222963@gmail.com</a></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {ano} TourMatch. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
