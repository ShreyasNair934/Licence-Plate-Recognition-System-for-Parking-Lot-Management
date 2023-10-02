"use client";

import React, { useState, useEffect } from "react";
import styles from "./AdminCarparkStatus.module.scss";
import { format } from "date-fns";
import CountingTimer from "../CountingTimer";
import { set } from "mongoose";

const AdminCarparkStatus = () => {
    const [vehicles, setVehicles] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of items to display per page

    const getVehicles = async () => {
        const res = await fetch("/api/vehicles/all");
        const vehiclesArr = (await res.json()).vehicles;
        setVehicles(vehiclesArr);

        const res1 = await fetch("/api/users");
        const usersArrData = await res1.json();
        setUsers(usersArrData.data);
    };

    const convertToIsoString = (input: any) => {
        // Check if the input is in ISO format (by looking for the "T" separator)
        if (input.includes("T")) {
            return input; // It's already in ISO format, so return it as is
        } else {
            // Assume it's a Unix timestamp string and convert it
            var timestamp = Math.ceil(parseFloat(input) * 1000);

            var date = new Date(timestamp); // Multiply by 1000 to convert seconds to milliseconds
            return date.toISOString();
        }
    };

    useEffect(() => {
        getVehicles();
    }, []);

    const findMatchingUser = (vehicleNumber: any) => {
        const user: any = users.find((user: any) => {
            return user.vehicles.includes(vehicleNumber);
        });

        return user?.email ?? "N/A";
    };

    // Calculate the total number of pages
    const totalPages = Math.ceil(vehicles.length / itemsPerPage);

    // Calculate the starting and ending indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the vehicles array to display only the current page's items
    const currentVehicles = vehicles.slice(startIndex, endIndex);

    return (
        <section className={styles.container}>
            <table className={styles.mainTable}>
                <thead className={styles.mainTable__header}>
                    <tr className={styles.mainTable__header__row}>
                        <td className={styles.mainTable__header__element}>
                            Vehicle Number
                        </td>
                        <td className={styles.mainTable__header__element}>
                            Entry Time
                        </td>
                        <td className={styles.mainTable__header__element}>
                            Parking Duration
                        </td>
                        <td className={styles.mainTable__header__element}>
                            Amount Payable
                        </td>
                        <td className={styles.mainTable__header__element}>
                            Exit time
                        </td>
                        <td className={styles.mainTable__header__element}>
                            Linked User
                        </td>
                    </tr>
                </thead>
                <tbody className={styles.mainTable__body}>
                    {currentVehicles.map((vehicle: any, index) => (
                        <tr className={styles.mainTable__body__row} key={index}>
                            <td className={styles.mainTable__body__element}>
                                {vehicle.vehicle_no}
                            </td>
                            <td className={styles.mainTable__body__element}>
                                {format(
                                    new Date(
                                        convertToIsoString(vehicle.entry_time),
                                    ),
                                    "HH:mm -  EEEE, MMMM d, yyyy",
                                )}
                            </td>
                            <td className={styles.mainTable__body__element}>
                                <CountingTimer
                                    exitTime={vehicle.exit_time}
                                    entryTime={vehicle.entry_time}
                                />
                            </td>
                            <td className={styles.mainTable__body__element}>
                                <CountingTimer
                                    entryTime={vehicle.entry_time}
                                    exitTime={vehicle.exit_time}
                                    feeCalculator={true}
                                    dollarsPerMinute={0.4}
                                />
                            </td>
                            <td className={styles.mainTable__body__element}>
                                {vehicle.in_carpark === false
                                    ? vehicle.exit_time
                                        ? format(
                                              new Date(
                                                  convertToIsoString(
                                                      vehicle.exit_time,
                                                  ),
                                              ),
                                              "HH:mm -  EEEE, MMMM d, yyyy",
                                          )
                                        : "N/A"
                                    : "Vehicle still in carpark"}
                            </td>
                            <td className={styles.mainTable__body__element}>
                                {findMatchingUser(vehicle.vehicle_no)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={
                            currentPage === index + 1
                                ? styles.pagination__buttonActive
                                : styles.pagination__button
                        }
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default AdminCarparkStatus;
