import styles from "./page.module.scss";
import NumberplateEntry from "@/components/NumberplateEntry";

const Home = () => {
    return (
        <main className={styles.main}>
            <div className={styles.main__intro}>
                WELCOME TO THE PARKING MONITOR APP
            </div>
            <NumberplateEntry />
        </main>
    );
};

export default Home;
//use rafce to create a react arrow function component
