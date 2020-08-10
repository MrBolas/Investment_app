import { Transaction } from "./transaction.model";

export interface Income extends Transaction {
    id: string;
    value: number;
    short_description: string;
    long_description: string;
    date: Date;
    date_string: String;
    booker?: string;
    reservation_link?: string;
}
  