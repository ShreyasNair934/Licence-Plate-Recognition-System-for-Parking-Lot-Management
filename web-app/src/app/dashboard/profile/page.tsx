import styles from "./page.module.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Profile = async () => {
    const session = await getServerSession(authOptions);
    console.log(session?.user);

    const generateProfile = () => {
        if (session?.user === null || session?.user === undefined) {
            return "Sorry you are not authorized to view this page as you are not logged in.";
        } else {
            return `Welcome to the Profile page ${session?.user?.name}, you are currently logged in as a ${session?.user?.role}.`;
        }
    };

    return (
        <main>
            <div className={styles.main__intro}>{generateProfile()}</div>
        </main>
    );
};

export default Profile;
