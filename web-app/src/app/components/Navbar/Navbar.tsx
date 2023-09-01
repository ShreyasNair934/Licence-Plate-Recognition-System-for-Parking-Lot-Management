import styles from "./Navbar.module.scss";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className={styles.nav}>
            <div className={styles.nav__title}>PARKING MONITOR</div>
            <ul className={styles.nav__list}>
                <Link href="/dashboard" className={styles.nav__list__link}>
                    <li>Register</li>
                </Link>
                <Link href="/settings" className={styles.nav__list__link}>
                    <li>Admin</li>
                </Link>
            </ul>
        </nav>
    );
};

export default Navbar;
