import MemberRegistration from "@/components/MemberRegistration";
import styles from "./page.module.scss";

const Register = () => {
    return (
        <main>
            <div className={styles.main__intro}>NEW MEMBER REGISTRATION</div>
            <MemberRegistration></MemberRegistration>
        </main>
    );
};

export default Register;
