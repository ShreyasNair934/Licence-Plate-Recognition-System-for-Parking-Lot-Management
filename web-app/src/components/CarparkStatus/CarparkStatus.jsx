"use client";

import React, { useEffect, useState } from "react";
import { faUserCheck, faUserLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./CarparkStatus.module.scss";

const updateIntervalInSeconds = 30; // Set your desired interval in seconds

const CarparkStatus = () => {
    const [carparkOccupied1, setCarparkOccupied1] = useState("true");
    const [carparkOccupied2, setCarparkOccupied2] = useState("true");

    const getAvailability = async () => {
        const res = await fetch("/api/carpark/availability");
        const availabilityArr = (await res.json()).data;

        const carpark1 = availabilityArr.find(
            (item) => Number(item.carpark_no) === 1,
        );
        const carpark2 = availabilityArr.find(
            (item) => Number(item.carpark_no) === 2,
        );

        setCarparkOccupied1(carpark1.carpark_occupied);
        setCarparkOccupied2(carpark2.carpark_occupied);
    };

    useEffect(() => {
        // Initial fetch on component mount
        getAvailability();

        // Set up an interval to fetch data every 'updateIntervalInSeconds' seconds
        const intervalId = setInterval(() => {
            getAvailability();
        }, updateIntervalInSeconds * 1000); // Convert seconds to milliseconds

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <section className={styles.cardContainer}>
            <div
                className={`${styles.card} ${
                    carparkOccupied1 == "true" ? styles.occupied : styles.vacant
                }`}
            >
                <FontAwesomeIcon
                    icon={carparkOccupied1 == "true" ? faUserLock : faUserCheck}
                    style={{
                        fontSize: 50,
                        color: carparkOccupied1 == "true" ? "red" : "green",
                    }}
                />
                <p className={styles.card__title}>Carpark 1</p>
                <p className={styles.card__description}>
                    This carpark is currently{" "}
                    {carparkOccupied1 == "true" ? "occupied" : "vacant"}
                </p>
            </div>
            <div
                className={`${styles.card} ${
                    carparkOccupied2 == "true" ? styles.occupied : styles.vacant
                }`}
            >
                <FontAwesomeIcon
                    icon={carparkOccupied2 == "true" ? faUserLock : faUserCheck}
                    style={{
                        fontSize: 50,
                        color: carparkOccupied2 == "true" ? "red" : "green",
                    }}
                />
                <p className={styles.card__title}>Carpark 2</p>
                <p className={styles.card__description}>
                    This carpark is currently{" "}
                    {carparkOccupied2 == "true" ? "occupied" : "vacant"}
                </p>
            </div>
        </section>
    );
};

export default CarparkStatus;
