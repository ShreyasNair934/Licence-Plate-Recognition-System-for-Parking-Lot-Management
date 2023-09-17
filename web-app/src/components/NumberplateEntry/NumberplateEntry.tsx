"use client";

import React from "react";
import styles from "./NumberplateEntry.module.scss";
import Link from "next/link";
import { useState } from "react";

const NumberplateEntry = () => {
    const [numberplate, setNumberplate] = useState("");

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
                        onInput={(e) => {
                            setNumberplate(
                                (e.target as HTMLInputElement).value,
                            );
                        }}
                    />

                    {numberplate.length != 0 ? (
                        <Link
                            href={
                                "/dashboard/userchoice?numberplate=" +
                                { numberplate }
                            }
                            className={styles.emailForm__form__button}
                        >
                            Confirm
                        </Link>
                    ) : (
                        <></>
                    )}
                </div>
            </section>
            <div className={styles.errorWarning}></div>
        </>
    );
};

export default NumberplateEntry;
