"use client";

import React from "react";
import styles from "./MemberLogin.module.scss";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { signIn, useSession } from "next-auth/react";

const MemberLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorWarning, setErrorWarning] = useState("");
    const [pendingResponse, setPendingResponse] = useState(false);
    const successMessage = "Logged in successfully";

    const validateEmail = email.length > 3 && email.includes("@");
    const validatePassword = password.length > 3;

    const router = useRouter();
    const session = useSession();

    useEffect(() => {
        // This effect runs when the component mounts and when `session.status` changes
        if (session.status === "unauthenticated") {
            setPendingResponse(false);
        }
        if (session.status === "authenticated") {
            router?.push("/dashboard");
        }
    }, [session.status]); // Only re-run this effect when `session.status` changes

    const handleSubmit = async (e: any) => {
        setPendingResponse(true);

        if (validateEmail && validatePassword) {
            e.preventDefault();
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            const errorMessage = await res?.error;

            if (errorMessage) {
                setErrorWarning(errorMessage);
            } else {
                setErrorWarning(successMessage);
            }
        } else {
            setErrorWarning("Please enter a valid email and/or password");
        }
        setPendingResponse(false);
    };

    return (
        <div>
            <section className={styles.emailForm}>
                <div className={styles.emailForm__prompt}>
                    Please login below using your email address and password
                </div>
                <div className={styles.emailForm__form}>
                    <input
                        className={styles.emailForm__form__input}
                        type="text"
                        placeholder="Enter your email address"
                        onInput={(e) => {
                            setEmail((e.target as HTMLInputElement).value);
                            setErrorWarning("");
                        }}
                    />
                    <input
                        className={styles.emailForm__form__input}
                        type="text"
                        placeholder="Enter your password"
                        onInput={(e) => {
                            setPassword((e.target as HTMLInputElement).value);
                            setErrorWarning("");
                        }}
                    />

                    {pendingResponse ? (
                        <div className={styles.emailForm__form__spinner}>
                            <FontAwesomeIcon
                                icon={faRotate}
                                style={{ fontSize: 35, color: "white" }}
                            />
                        </div>
                    ) : (
                        <button
                            className={styles.emailForm__form__button}
                            onClick={handleSubmit}
                        >
                            Login
                        </button>
                    )}
                </div>
            </section>
            <div
                className={`${styles.errorWarning}  ${
                    errorWarning.includes(successMessage)
                        ? styles.success
                        : errorWarning.length != 0
                        ? styles.error
                        : styles.regular
                }`}
            >
                {errorWarning}
            </div>
        </div>
    );
};

export default MemberLogin;
