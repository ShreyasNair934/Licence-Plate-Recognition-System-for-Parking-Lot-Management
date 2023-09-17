"use client";

import { usePathname } from "next/navigation";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = (props: any) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [plateNumber, setPlateNumber] = useState("");

    let plateEntry = searchParams.get("numberplate");
    const session = useSession();

    // console.log(session.data);
    const isAuthenticated = session.status === "authenticated";
    const isAdmin = session.data?.user?.role === "admin";

    useEffect(() => {
        //Change plateNumber state if the numberplate query parameter is present
        if (plateEntry) {
            setPlateNumber(plateEntry);
        }
    }, [plateEntry]);

    // Links that should be displayed in the navbar for all users
    const links = [
        {
            title: "Exit",
            url: "/",
            showOnPages: [
                "/dashboard/login",
                "/dashboard/register",
                "/dashboard/userchoice",
            ],
        },
        {
            title: "Admin Login",
            url: "/dashboard/login",
            showOnPages: ["/"],
        },
    ];

    // Links that should be displayed in the navbar fron non-authenticated users
    if (!isAuthenticated) {
        links.push({
            title: "Exit",
            url: "/",
            showOnPages: [
                "/dashboard",
                "/dashboard/settings",
                "/dashboard/profile",
            ],
        });
    }

    // Links that should be displayed in the navbar for authenticated users who are not admins
    if (isAuthenticated && !isAdmin) {
        links.push(
            {
                title: "Profile",
                url: "/dashboard/profile",
                showOnPages: ["/dashboard"],
            },
            {
                title: "Dashboard",
                url: "/dashboard",
                showOnPages: ["/dashboard/profile"],
            },
            {
                title: "Exit",
                url: "/dashboard",
                showOnPages: ["/dashboard/settings"],
            },
        );
    }

    // Links that should be displayed in the navbar for authenticated users who are admins
    if (isAdmin) {
        links.push(
            {
                title: "Profile",
                url: "/dashboard/profile",
                showOnPages: ["/dashboard", "/dashboard/settings"],
            },
            {
                title: "Dashboard",
                url: "/dashboard",
                showOnPages: ["/dashboard/profile", "/dashboard/settings"],
            },
            {
                title: "Settings",
                url: "/dashboard/settings",
                showOnPages: ["/dashboard/profile", "/dashboard"],
            },
        );
    }

    return (
        <>
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
                                    onClick={() => {
                                        if (link.title === "Exit") {
                                            setPlateNumber("");
                                        }
                                    }}
                                >
                                    <li>{link.title}</li>
                                </Link>
                            );
                        }
                        return null; // Render nothing if link should not be displayed
                    })}

                    {isAuthenticated && (
                        <div
                            className={styles.nav__list__link}
                            onClick={() => {
                                signOut({ redirect: false }).then(() => {
                                    router.push("/");
                                });
                                setPlateNumber("");
                            }}
                        >
                            <li>Logout</li>
                        </div>
                    )}
                </ul>
            </nav>

            {plateNumber.length != 0 && (
                <p className={styles.numberplate}>
                    Entered Number Plate: {plateNumber}
                </p>
            )}
        </>
    );
};

export default Navbar;
