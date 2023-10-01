"use client";

import React, { useState, useEffect } from "react";
import styles from "./CarparkBooking.module.scss";
import { format, addMinutes } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { useSession } from "next-auth/react";
import { set } from "mongoose";

const CarparkBooking = () => {
    const session = useSession();
    const email = session.data?.user?.email;
    const [numberplate, setNumberplate] = useState("");
    const [carparkNo, setCarparkNo] = useState("");
    const [timeslot, setTimeslot] = useState("");

    const handleSubmit = async () => {
        if (numberplate.length > 0) {
            try {
                const res = await fetch("/api/carpark/makebooking", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        timeslot: timeslot,
                        carpark_no: `${carparkNo}`,
                        vehicle_no: numberplate,
                        user_email: email,
                    }),
                });

                res.status === 200 && alert("Booking successful");
            } catch (err: any) {
                console.log(err);
                // console.log(error);
            }
        } else {
            alert("Please enter a valid numberplate");
        }
    };

    const [todaysBookings, setTodaysBookings] = useState<any>([]);

    const getTodaysBookings = async () => {
        const res = await fetch("/api/carpark/getTodaysBookings");
        const currentBookingsArr = (await res.json()).data;
        setTodaysBookings(currentBookingsArr);
        console.log(currentBookingsArr);
    };

    useEffect(() => {
        getTodaysBookings();
    }, []);

    const currentDateTime = new Date();
    const timeSlots = [];

    // Define the opening and closing hours of the carpark.
    const openingTime = 2; // 2:00 AM
    const closingTime = 23; // 11:00 PM
    const numberOfParkingLots = 2; // Number of parking lots

    // Specify the timezone for Perth.
    const timeZone = "Australia/Perth";

    // Convert the current time to the specified timezone.
    const perthTime = utcToZonedTime(currentDateTime, timeZone);

    // Function to calculate parking fee (customize as per your requirements).
    const calculateParkingFee = (startTime: any) => {
        // You can implement your logic to calculate the parking fee based on startTime.
        // Example: return a different fee based on peak hours, etc.
        return "$7.20";
    };

    // Generate time slots for the current day.
    for (let i = openingTime; i <= closingTime; i++) {
        const startTime = new Date(perthTime);
        startTime.setHours(i, 0, 0, 0);

        // Check if the time slot has already passed.
        if (startTime > perthTime) {
            const endTime = addMinutes(startTime, 60); // Add 60 minutes for 1-hour slots
            const formattedStartTime = format(startTime, "HH:mm");
            const formattedEndTime = format(endTime, "HH:mm");
            const parkingFee = calculateParkingFee(startTime);

            for (let j = 1; j <= numberOfParkingLots; j++) {
                timeSlots.push({
                    startTime: formattedStartTime,
                    endTime: formattedEndTime,
                    parkingFee,
                    carparkNo: j,
                });
            }
        }
    }

    // Define pagination parameters
    const itemsPerPage = 7; // Number of items to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index range for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Get the time slots for the current page
    const currentSlots = timeSlots
        .slice(startIndex, endIndex)
        .filter((item) => {
            // return item.carparkNo === 2 && item.startTime === "19:00";

            const itemTimeSlot = `${item.startTime} - ${item.endTime}`;
            const itemCarparkNo = item.carparkNo;

            const matchingBooking = todaysBookings.find(
                (booking: any) =>
                    booking.timeslot === itemTimeSlot &&
                    Number(booking.carpark_no) === itemCarparkNo,
            );

            return matchingBooking === undefined;
        });

    // Function to handle page change
    const handlePageChange = (pageNumber: any) => {
        setCurrentPage(pageNumber);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);

    const [selectedRow, setSelectedRow] = useState<any>(null);

    // Function to handle when a table row is clicked
    const handleTableRowClick = (slot: any) => {
        setSelectedSlot(slot);
        setCarparkNo(slot.carparkNo);
        setTimeslot(`${slot.startTime} - ${slot.endTime}`);
        setShowPopup(true);
    };

    // Function to handle the "Yes" button click in the popup
    const handleYesButtonClick = () => {
        // Perform any necessary actions with the selected slot and numberplate here
        console.log("Booking confirmed for slot:", selectedSlot);
        console.log("Numberplate entered:", numberplate);

        handleSubmit();
        // Close the popup
        setSelectedSlot(null);
        setSelectedRow(null);
        setNumberplate("");
        setShowPopup(false);
        getTodaysBookings();
    };

    // Function to handle the "No" button click in the popup
    const handleNoButtonClick = () => {
        // Clear the selected slot and numberplate
        setSelectedSlot(null);
        setSelectedRow(null);
        setNumberplate("");

        // Close the popup
        setShowPopup(false);
    };

    return (
        <section className={styles.container}>
            {/* Popup */}
            <section>
                {showPopup && selectedSlot && (
                    <div className={styles.popup}>
                        <p className={styles.title}>Book Carpark Slot</p>
                        <p className={styles.titleSmall}>
                            Do you want to book in carpark{" "}
                            {selectedSlot.carparkNo} for
                            {` ${selectedSlot.startTime} - ${selectedSlot.endTime} `}{" "}
                            today?
                        </p>
                        <input
                            className={styles.popup__input}
                            type="text"
                            placeholder="Re-enter Numberplate"
                            value={numberplate}
                            onChange={(e) => setNumberplate(e.target.value)}
                        />

                        <div className={styles.buttonContainer}>
                            <button
                                className={styles.popup__button}
                                onClick={handleYesButtonClick}
                            >
                                Yes
                            </button>
                            <button
                                className={styles.popup__button}
                                onClick={handleNoButtonClick}
                            >
                                No
                            </button>
                        </div>
                    </div>
                )}
            </section>
            {!showPopup && !selectedSlot && (
                <p className={styles.title}>
                    Available carpark slots for today
                </p>
            )}

            <table className={styles.mainTable}>
                <thead className={styles.mainTable__header}>
                    <tr className={styles.mainTable__header__row}>
                        <td className={styles.mainTable__header__element}>
                            Time Slot
                        </td>
                        <td className={styles.mainTable__header__element}>
                            Parking Fee
                        </td>
                        <td className={styles.mainTable__header__element}>
                            Carpark No.
                        </td>
                    </tr>
                </thead>
                <tbody className={styles.mainTable__body}>
                    {currentSlots.map((slot, index) => (
                        <tr
                            onClick={() => {
                                handleTableRowClick(slot);
                                setSelectedRow(index);
                            }}
                            className={
                                index === selectedRow
                                    ? styles.mainTable__body__rowSelected
                                    : styles.mainTable__body__row
                            }
                            key={index}
                        >
                            <td className={styles.mainTable__body__element}>
                                {`${slot.startTime} - ${slot.endTime}`}
                            </td>
                            <td className={styles.mainTable__body__element}>
                                {slot.parkingFee}
                            </td>
                            <td className={styles.mainTable__body__element}>
                                {`Carpark ${slot.carparkNo}`}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.pagination}>
                {/* Generate pagination buttons */}
                {Array(Math.ceil(timeSlots.length / itemsPerPage))
                    .fill(0)
                    .map((_, index) => (
                        <button
                            key={index}
                            className={
                                currentPage === index + 1
                                    ? styles.pagination__buttonActive
                                    : styles.pagination__button
                            }
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
            </div>
        </section>
    );
};

export default CarparkBooking;
