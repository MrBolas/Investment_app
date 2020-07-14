export interface Income {
    id: string;
    value: number;
    short_description: string;
    long_description: string;
    date: Date;
    booker?: string;
    reservation_link?: string;
}
  