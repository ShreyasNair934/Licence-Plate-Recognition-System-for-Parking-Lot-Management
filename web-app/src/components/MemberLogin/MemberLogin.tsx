"use client";

import React from "react";
import styles from "./MemberLogin.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";

const MemberLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorWarning, setErrorWarning] = useState("");
    const [error, setError] = useState(null);
    const [pendingResponse, setPendingResponse] = useState(false);

    const validateEmail = email.length > 3 && email.includes("@");
    const validatePassword = password.length > 3;

    const router = useRouter();

    const handleSubmit = async () => {
        setPendingResponse(true);
        if (validateEmail && validatePassword) {
            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });
                res.status === 200 && router.push("/dashboard");
                res.status === 401 && setErrorWarning("Invalid password");
                res.status === 404 &&
                    setErrorWarning("No user found with that email");
                res.status === 500 &&
                    setErrorWarning("Server error, please try again later");
            } catch (err: any) {
                setError(err);
                console.log(error);
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
                    errorWarning.length != 0 ? styles.error : styles.regular
                }`}
            >
                {errorWarning}
            </div>
        </div>
    );
};

export default MemberLogin;
