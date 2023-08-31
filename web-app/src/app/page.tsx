import styles from "./page.module.scss";
import Login from "./components/Login";

const Home = () => {
    return (
        <main className={styles.main}>
            <div className={styles.main__intro}>
                WELCOME TO THE PLANT MONITOR VIEWER
            </div>
            <Login />
        </main>
    );
};

export default Home;
