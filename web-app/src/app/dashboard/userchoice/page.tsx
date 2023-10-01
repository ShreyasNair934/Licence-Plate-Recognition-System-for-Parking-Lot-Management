import styles from "./page.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserPlus,
    faUserTie,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import UserChoiceCard from "@/components/UserChoiceCard";
import { use } from "react";

const Userchoice = () => {
    const userChoiceDataList = [
        // {
        //     title: "CONTINUE AS GUEST",
        //     icon: faUser,
        //     description:
        //         "View and pay for your parking information without an account. We won't be able to send you any emails.",
        //     url: "/dashboard",
        // },
        {
            title: "REGISTER AS NEW MEMBER",
            icon: faUserPlus,
            description:
                "Sign up for an account to view and pay for your parking, you can also enable email notifications",
            url: "/dashboard/register",
        },
        {
            title: "LOGIN AS EXISTING MEMBER",
            icon: faUserTie,
            description:
                "If you already have an account, login to view and pay for your parking, change your details and more",
            url: "/dashboard/login",
        },
    ];

    return (
        <main className={styles.main}>
            <div className={styles.main__intro}>
                PLEASE SELECT A LOGIN OPTION BELOW
            </div>
            <section className={styles.main__userchoice}>
                {userChoiceDataList.map((userChoiceData, index) => (
                    <UserChoiceCard
                        key={index}
                        title={userChoiceData.title}
                        description={userChoiceData.description}
                        icon={userChoiceData.icon}
                        url={userChoiceData.url}
                    ></UserChoiceCard>
                ))}
            </section>
        </main>
    );
};

export default Userchoice;
