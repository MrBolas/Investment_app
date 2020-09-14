export interface Transaction {
    id: string;
    value: number;
    description: string;
    additional_information: string;
    completed: boolean;
    date: Date;
    date_string: String;
    booker?: string;
    reservation_link?: string;
    periodicity: boolean;
}
  