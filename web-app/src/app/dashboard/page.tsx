import styles from "./page.module.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const Dashboard = async () => {
    const session = await getServerSession(authOptions);
    console.log(session?.user);

    const generateDashboard = () => {
        if (session?.user === null || session?.user === undefined) {
            return "Welcome to the Dashboard, you are currently not logged in and are using this as a guest.";
        } else {
            return `Welcome to the Dashboard ${session?.user?.name}, you are currently logged in as a ${session?.user?.role}.`;
        }
    };

    return (
        <main>
            <div className={styles.main__intro}>{generateDashboard()}</div>
        </main>
    );
};

export default Dashboard;
