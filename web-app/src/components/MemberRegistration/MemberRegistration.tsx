"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./MemberRegistration.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";

const MemberRegistration = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [numberplate, setNumberplate] = useState("");
    const [errorWarning, setErrorWarning] = useState("");
    const [error, setError] = useState(null);
    const [pendingResponse, setPendingResponse] = useState(false);

    const validateEmail = email.length > 3 && email.includes("@");
    const validatePassword = password.length > 3;
    const validateUserName = name.length > 0;
    const validateNumberplate = numberplate.length > 0;

    const router = useRouter();

    const handleSubmit = async () => {
        setPendingResponse(true);
        if (
            validateEmail &&
            validatePassword &&
            validateUserName &&
            validateNumberplate
        ) {
            try {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        numberplate,
                    }),
                });
                res.status === 200 && router.push("/dashboard/login");
                res.status === 401 &&
                    setErrorWarning("User with that email already exists");
                res.status === 404 &&
                    setErrorWarning(
                        "Another user has already registered that vehicle numberplate",
                    );
                res.status === 500 &&
                    setErrorWarning("Server error, please try again later");
            } catch (err: any) {
                setError(err);
                // console.log(error);
            }
        } else {
            setErrorWarning(
                "Please make sure all fields are filled in correctly and/or your password is at least 4 characters long",
            );
        }
        setPendingResponse(false);
    };

    return (
        <div>
            <section className={styles.emailForm}>
                <div className={styles.emailForm__prompt}>
                    Please register below by entering a username, valid email
                    address and password
                </div>
                <div className={styles.emailForm__form}>
                    <input
                        className={styles.emailForm__form__input}
                        type="text"
                        placeholder="Enter a username"
                        onInput={(e) => {
                            setName((e.target as HTMLInputElement).value);
                            setErrorWarning("");
                        }}
                    />
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
                    <input
                        className={styles.emailForm__form__input}
                        type="text"
                        placeholder="Enter the numberplate of your vehicle"
                        onInput={(e) => {
                            setNumberplate(
                                (e.target as HTMLInputElement).value,
                            );
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
                            Register
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

export default MemberRegistration;
