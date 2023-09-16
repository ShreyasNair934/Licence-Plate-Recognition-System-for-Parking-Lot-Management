"use client";

import { usePathname } from "next/navigation";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

const Navbar = (props: any) => {
    const pathname = usePathname();
    const { isAuthenticated, isAdmin } = props;

    const links = [
        {
            title: "Home",
            url: "/",
            showOnPages: [
                "/dashboard/profile",
                "/dashboard/settings",
                "/dashboard/admin",
            ],
        },
    ];

    if (isAuthenticated) {
        links.push(
            {
                title: "Logout",
                url: "/dashboard/logout",
                showOnPages: [
                    "/dashboard",
                    "/dashboard/profile",
                    "/dashboard/settings",
                    "/dashboard/admin",
                ],
            },
            {
                title: "Profile",
                url: "/dashboard/profile",
                showOnPages: ["/dashboard"],
            },
        );
    } else {
        links.push(
            {
                title: "Admin Login",
                url: "/dashboard/login",
                showOnPages: ["/"],
            },
            {
                title: "Exit",
                url: "/",
                showOnPages: ["/dashboard"],
            },
        );
    }

    if (isAdmin) {
        links.push(
            {
                title: "Dashboard",
                url: "/dashboard",
                showOnPages: ["/dashboard/profile", "/dashboard/settings"],
            },
            {
                title: "Admin Settings",
                url: "/dashboard/settings",
                showOnPages: [
                    "/dashboard/admin",
                    "/dashboard/profile",
                    "/dashboard",
                    "/dashboard/settings",
                ],
            },
        );
    }

    return (
        <nav className={styles.nav}>
            <div className={styles.nav__title}>
                <FontAwesomeIcon
                    icon={faCar}
                    style={{ fontSize: 25, color: "white" }}
                />
                <span>&nbsp;</span>
                PARKING MONITOR
            </div>
            <ul className={styles.nav__list}>
                {links.map((link, index) => {
                    // Check if the link should be displayed on the current page
                    if (link.showOnPages.includes(pathname)) {
                        return (
                            <Link
                                key={index}
                                href={link.url}
                                className={styles.nav__list__link}
                            >
                                <li>{link.title}</li>
                            </Link>
                        );
                    }
                    return null; // Render nothing if link should not be displayed
                })}
            </ul>
        </nav>
    );
};

export default Navbar;
