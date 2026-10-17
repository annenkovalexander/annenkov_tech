export type UUID = `${string}-${string}-${string}-${string}-${string}` & { readonly __brand: 'UUID' };

export type Event = {
    id: UUID;
    year: number;
    description: string;
};

export type Period = {
    id: UUID;
    category: string;
    periodText: string;
    startYear: number;
    endYear: number;
    events: Event[];
};