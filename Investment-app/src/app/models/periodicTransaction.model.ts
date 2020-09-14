export interface PeriodicTransaction {
    id: string;
    value: number;
    description: string;
    additional_information: string;
    date: Date;
    periodicity: number;
    child_id: string[];
    latest_date: Date;
}