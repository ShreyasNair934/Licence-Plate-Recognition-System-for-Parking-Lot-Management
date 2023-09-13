import styles from "./page.module.scss";
import Login from "@/components/Login";

const Home = () => {
    console.log("hi");
    return (
        <main className={styles.main}>
            <div className={styles.main__intro}>
                WELCOME TO THE PARKING MONITOR APP
            </div>
            <Login />
        </main>
    );
};

export default Home;
//use rafce to create a react arrow function component
