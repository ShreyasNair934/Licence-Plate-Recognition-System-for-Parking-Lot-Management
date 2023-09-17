import styles from "./page.module.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Settings = async () => {
    const session = await getServerSession(authOptions);
    // console.log(session?.user);

    const generateSettings = () => {
        if (session?.user?.role !== "admin") {
            return "Sorry you are not authorized to view this page as you are not an admin";
        } else {
            return `Welcome to the Settings page ${session?.user?.name}, you are currently logged in as a ${session?.user?.role}.`;
        }
    };

    return (
        <main>
            <div className={styles.main__intro}>{generateSettings()}</div>
        </main>
    );
};

export default Settings;
