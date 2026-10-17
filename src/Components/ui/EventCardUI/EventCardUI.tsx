import styles from './EventCardUI.module.scss';

interface EventCardProps {
    year: number;
    description: string;
}

const EventCardUI = ({year, description}: EventCardProps) => (
        <article className={styles.container}>
            <h3 className={styles.year}>{year}</h3>
            <p className={styles.description}>{description}</p>
        </article>
    )
export default EventCardUI;