import styles from './SVGLineUI.module.scss';

interface SvgLineProps {
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
}

type SvgHorizontalLineUIProps = SvgLineProps;
type SvgVerticalLineUIProps = Omit<SvgLineProps, 'x2'>;
  
const SvgHorizontalLineUI = ({
    x1 = 0,
    y1 = 100,
    x2 = 1440,
    y2 = 100,
}: SvgHorizontalLineUIProps) => (
    <div className={styles.container}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.svg}
        >
            <line
                className={styles.line}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
            />
        </svg>
    </div>
);

const SvgVerticalLineUI = ({
    x1 = 0,
    y1 = 0,
    y2 = 100,
}: SvgVerticalLineUIProps) => (
    <div className={styles.container}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.svg}
        >
            <line
                className={styles.line}
                x1={x1}
                y1={y1}
                x2={x1}
                y2={y2}
            />
        </svg>
    </div>
);
  
export { SvgHorizontalLineUI, SvgVerticalLineUI };