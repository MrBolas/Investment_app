export interface PeriodicTransaction {
    id: string;
    value: number;
    short_description: string;
    long_description: string;
    date: Date;
    periodicity: number;
    child_id: string[];
    latest_date: Date;
}