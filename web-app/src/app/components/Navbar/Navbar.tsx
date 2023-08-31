import styles from "./Navbar.module.scss";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className={styles.nav}>
            <div className={styles.nav__title}>PLANT MONITOR</div>
            <ul className={styles.nav__list}>
                <Link href="/dashboard">
                    <li>Dashboard</li>
                </Link>

                <li>Analytics</li>
                <Link href="/settings">
                    <li>Settings</li>
                </Link>
            </ul>
        </nav>
    );
};

export default Navbar;
