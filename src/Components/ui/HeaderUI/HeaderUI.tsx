import type { HeaderData } from "../../../services/slices/headerSlice";
import styles from './HeaderUI.module.scss';

const HeaderUI = ({ fullName, role, description, tg_link, tg_link_aria_label }: HeaderData) => (
        <header className={styles.header}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    <a href={tg_link} aria-label={tg_link_aria_label}>
                        {fullName}
                    </a>
                </h1>
                <p className={styles.role}>{role}</p>
                <p className={styles.description}>{description}</p>
            </div>
        </header>
    )

export default HeaderUI;