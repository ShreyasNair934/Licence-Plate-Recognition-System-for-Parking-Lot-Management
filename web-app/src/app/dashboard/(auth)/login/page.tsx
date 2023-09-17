import MemberLogin from "@/components/MemberLogin";
import styles from "./page.module.scss";

const Login = () => {
    return (
        <main>
            <div className={styles.main__intro}>MEMBER LOGIN</div>
            <MemberLogin></MemberLogin>
        </main>
    );
};

export default Login;
