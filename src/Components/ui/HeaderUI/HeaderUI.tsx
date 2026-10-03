import type { HeaderData } from "../../../services/slices/headerSlice";
import styles from './HeaderUI.module.scss';

const HeaderUI = ({ fullName, role, description }: HeaderData) => (
        <header className={styles.header}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    <a href="https://t.me/alexander_aap" aria-label="Открыть Telegram Александра Анненкова">
                        {fullName}
                    </a>
                </h1>
                <p className={styles.role}>{role}</p>
                <p className={styles.description}>{description}</p>
            </div>
        </header>
    )

export default HeaderUI;