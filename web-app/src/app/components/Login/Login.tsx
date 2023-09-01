import React from "react";
import styles from "./Login.module.scss";

const Login = () => {
    return (
        <>
            <section className={styles.emailForm}>
                <div className={styles.emailForm__prompt}>
                    Enter your Vehicle Plate Number to access your account
                </div>
                <div className={styles.emailForm__form}>
                    <input
                        className={styles.emailForm__form__input}
                        type="text"
                        placeholder="Enter your Vehicle Plate Number"
                    />
                    <button className={styles.emailForm__form__button}>
                        Verify
                    </button>
                </div>
            </section>
            <div className={styles.errorWarning}></div>
        </>
    );
};

export default Login;
