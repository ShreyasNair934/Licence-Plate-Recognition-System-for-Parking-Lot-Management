"use client";

import React from "react";
import styles from "./UserCarparkStatus.module.scss";
import Link from "next/link";
import { useState, useEffect } from "react";
import vehicle from "@/models/vehicle";
import { format } from "date-fns";
import CountingTimer from "@/components/CountingTimer";

const UserCarparkStatus = (props: any) => {
    const { email } = props;

    const [parkedVehicles, setParkedVehicles] = useState(new Array());
    const [userVehicles, setUserVehicles] = useState(new Array());

    const getCurrentUsers = async () => {
        const res1 = await fetch("/api/users");
        const usersArrData = await res1.json();
        const currentUserVehicles = await usersArrData.data.find(
            (user: any) => user.email == email,
        );
        const usersVehicleArr = currentUserVehicles.vehicles;
        console.log(usersVehicleArr);
        setUserVehicles(usersVehicleArr);

        const res = await fetch("/api/vehicles/currentlyParked");
        const vehiclesArr = (await res.json()).vehicles;
        const usersParkedVehicles = vehiclesArr.filter((vehicle: any) => {
            return usersVehicleArr.includes(vehicle.vehicle_no);
        });
        setParkedVehicles(usersParkedVehicles);
        console.log(usersParkedVehicles);
    };

    useEffect(() => {
        getCurrentUsers();
    }, []);

    return (
        <>
            {parkedVehicles.length === 0 ? (
                <div className={styles.prompt}>
                    We've not detected any parked vehicles linked to your
                    account
                </div>
            ) : (
                <section className={styles.container}>
                    <div className={styles.prompt}>
                        We've detected the following parked vehicle linked to
                        your account
                    </div>
                    <table className={styles.mainTable}>
                        <thead className={styles.mainTable__header}>
                            <tr className={styles.mainTable__header__row}>
                                <td
                                    className={
                                        styles.mainTable__header__element
                                    }
                                ></td>
                                <td
                                    className={
                                        styles.mainTable__header__element
                                    }
                                >
                                    Entry Time
                                </td>
                                <td
                                    className={
                                        styles.mainTable__header__element
                                    }
                                >
                                    Parking Duration
                                </td>
                            </tr>
                        </thead>
                        <tbody className={styles.mainTable__body}>
                            {parkedVehicles.map((vehicle: any, index) => (
                                <tr
                                    className={styles.mainTable__body__row}
                                    key={index}
                                >
                                    <td
                                        className={
                                            styles.mainTable__body__element
                                        }
                                    >
                                        {vehicle.vehicle_no}
                                    </td>
                                    <td
                                        className={
                                            styles.mainTable__body__element
                                        }
                                    >
                                        {format(
                                            new Date(vehicle.entry_time),
                                            "HH:mm -  EEEE, MMMM d, yyyy",
                                        )}
                                    </td>
                                    <td
                                        className={
                                            styles.mainTable__body__element
                                        }
                                    >
                                        <CountingTimer
                                            entryTime={vehicle.entry_time}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={styles.prompt}>
                        {parkedVehicles.map((vehicle: any, index) => (
                            <>
                                Upon exit of {vehicle.vehicle_no}, you will be
                                invoiced
                                <CountingTimer
                                    entryTime={vehicle.entry_time}
                                    feeCalculator={true}
                                    dollarsPerMinute={0.4}
                                />
                            </>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
};

export default UserCarparkStatus;
