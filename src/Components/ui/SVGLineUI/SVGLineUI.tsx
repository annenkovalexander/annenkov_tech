interface SvgLineProps {
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
  }
  
const SvgHorizontalLineUI: React.FC<SvgLineProps> = ({
    x1 = 0,
    y1 = 100,
    x2 = 1440,
    y2 = 100
}: SvgLineProps): JSX.Element => (
    <div style={{"position": "absolute", "top": -12, "left": 0}}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height={2}
            style={{ overflow: "visible", margin: 'auto' }}
        >
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={'#42567a'}
                strokeWidth={1}
                strokeOpacity={0.1}
            />
        </svg>
    </div>
);

const SvgVerticalLineUI: React.FC<SvgLineProps> = ({
    x1 = 0,
    y1 = 0,
    x2 = 1440,
    y2 = 100
}: SvgLineProps): JSX.Element => (
    <div style={{"position": "absolute"}}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={2}
            height="100%"
            style={{ overflow: "visible", margin: 'auto' }}
        >
            <line
                x1={x1}
                y1={y1}
                x2={x1}
                y2={y2}
                stroke={'#42567a'}
                strokeWidth={1}
                strokeOpacity={0.1}
            />
        </svg>
    </div>
);
  
export { SvgHorizontalLineUI, SvgVerticalLineUI };