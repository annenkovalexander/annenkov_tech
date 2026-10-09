import styles from './EventCardUI.module.scss';

interface TEventCardProps {
    year: number;
    description: string;
}

const EventCardUI: React.FC<TEventCardProps> = ({year, description}) => (
        <div className={styles.container}>
            <div className={styles.year}>{year}</div>
            <p className={styles.description}>{description}</p>
        </div>
    )
export default EventCardUI;