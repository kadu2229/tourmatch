import Image from 'next/image';
import Logo from '../../public/img/Logo.png';
import styles from "./Header.module.css";

export default function Header() {
    return (
    <header className={styles.header}>
        <Image src={Logo} alt="Logo" />
    </header>
    )
}