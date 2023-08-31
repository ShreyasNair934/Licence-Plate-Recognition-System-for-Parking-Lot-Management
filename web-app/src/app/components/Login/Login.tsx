import React from "react";
import styles from "./Login.module.scss";

const Login = () => {
    return (
        <>
            <section className={styles.emailForm}>
                <div className={styles.emailForm__prompt}>
                    Enter your device ID to access your plant data
                </div>
                <div className={styles.emailForm__form}>
                    <input
                        className={styles.emailForm__form__input}
                        type="text"
                        placeholder="Enter your device ID"
                    />
                    <button className={styles.emailForm__form__button}>
                        Login
                    </button>
                </div>
            </section>
            <div className={styles.errorWarning}></div>
        </>
    );
};

export default Login;
