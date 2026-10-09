export const getCirclePath: (cx: number, cy: number, r: number) => string = (cx, cy, r) => {
    // Начать с 1 часа (30° от верха по часовой стрелке)
    const startAngle = -Math.PI / 3;  // -60° = 1 час
    
    const startX = cx + r * Math.cos(startAngle);
    const startY = cy + r * Math.sin(startAngle);
    
    // Середина круга: startAngle + π
    const midX = cx + r * Math.cos(startAngle + Math.PI);
    const midY = cy + r * Math.sin(startAngle + Math.PI);
    
    // Две дуги: от start до mid, от mid до start
    return `M ${startX} ${startY} A ${r} ${r} 0 1 1 ${midX} ${midY} A ${r} ${r} 0 1 1 ${startX} ${startY}`
}