"use client";

import React, { useState, useEffect } from "react";
import styles from "./AdminTable.module.scss";
import { format } from "date-fns";

const AdminTable = () => {
    const [vehicles, setVehicles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of items to display per page

    const getVehicles = async () => {
        const res = await fetch("/api/vehicles/all");
        const vehiclesArr = (await res.json()).vehicles;
        setVehicles(vehiclesArr);
    };

    useEffect(() => {
        getVehicles();
    }, []);

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
                            Timer
                        </td>
                        <td className={styles.mainTable__header__element}>
                            User
                        </td>
                        <td className={styles.mainTable__header__element}>
                            Exit
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
                                    new Date(vehicle.entry_time),
                                    "HH:mm -  EEEE, MMMM d, yyyy",
                                )}
                            </td>
                            <td className={styles.mainTable__body__element}>
                                counter
                            </td>
                            <td className={styles.mainTable__body__element}>
                                hii
                            </td>
                            <td className={styles.mainTable__body__element}>
                                test
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

export default AdminTable;
