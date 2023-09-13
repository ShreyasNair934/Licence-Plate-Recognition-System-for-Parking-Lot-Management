import React from "react";
import styles from "./Login.module.scss";
import Link from "next/link";

const Login = () => {
    return (
        <>
            <section className={styles.emailForm}>
                <div className={styles.emailForm__prompt}>
                    Please Enter your Vehicle's Plate Number
                </div>
                <div className={styles.emailForm__form}>
                    <input
                        className={styles.emailForm__form__input}
                        type="text"
                        placeholder="Enter your Vehicle's Plate Number"
                    />
                    <Link
                        href="/dashboard/userchoice"
                        className={styles.emailForm__form__button}
                    >
                        Confirm
                    </Link>
                </div>
            </section>
            <div className={styles.errorWarning}></div>
        </>
    );
};

export default Login;
