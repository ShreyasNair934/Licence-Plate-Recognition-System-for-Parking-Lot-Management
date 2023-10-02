import CarparkStatus from "@/components/CarparkStatus";
import Userchoice from "./dashboard/userchoice/page";
import styles from "./page.module.scss";
import NumberplateEntry from "@/components/NumberplateEntry";

const Home = () => {
    return (
        <main className={styles.main}>
            <div className={styles.main__prompt}>
                WELCOME TO THE PARKING MONITOR APP
            </div>
            <div className={styles.main__intro}>CARPARK AVAILABILITY</div>
            <CarparkStatus />
        </main>
    );
};

export default Home;
//use rafce to create a react arrow function component
