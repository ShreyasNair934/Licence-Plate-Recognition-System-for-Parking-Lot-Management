import React from "react";
import styles from "./UserChoiceCard.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserChoiceCard = (props: any) => {
    const { icon, title, description, url } = props;

    if (url) {
        return (
            <Link href={url} className={styles.link}>
                <div className={styles.card}>
                    <FontAwesomeIcon
                        icon={icon}
                        style={{ fontSize: 70, color: "white" }}
                    />
                    <p className={styles.card__description}>{title}</p>
                    <p className={styles.card__description}>{description}</p>
                </div>
            </Link>
        );
    } else {
        return (
            <div className={styles.card}>
                <FontAwesomeIcon
                    icon={icon}
                    style={{ fontSize: 70, color: "white" }}
                />
                <p className={styles.card__description}>{title}</p>
                <p className={styles.card__description}>{description}</p>
            </div>
        );
    }
};

export default UserChoiceCard;
