import styles from "./page.module.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminTable from "@/components/AdminTable";
import CarparkStatus from "@/components/CarparkStatus";
import CarparkBooking from "@/components/CarparkBooking";
import UserCarparkStatus from "@/components/UserCarparkStatus";
import AdminCarparkStatus from "@/components/AdminCarparkStatus/AdminCarparkStatus";

const Dashboard = async () => {
    const session = await getServerSession(authOptions);
    // console.log(session?.user);

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
            {session?.user?.role === "user" && (
                <UserCarparkStatus email={session?.user?.email} />
            )}
            {session?.user?.role === "admin" && (
                <>
                    <CarparkStatus />
                    <AdminCarparkStatus />
                </>
            )}
        </main>
    );
};

export default Dashboard;
