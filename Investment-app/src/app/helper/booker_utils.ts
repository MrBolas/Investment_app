import { isUndefined } from 'util';
import { element } from 'protractor';

export interface booker {
    name: string;
    reservation_link: string;
    reservation_code_type:string;
}

export class BookerUtils {

    booking_link = 'https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/booking.html?res_id=';

    constructor(){}

    static booker_information: booker[] = [
        {name: 'Booking',   reservation_link: 'https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/booking.html?res_id=', reservation_code_type: '1234567890'},
        {name: 'Airbnb',    reservation_link: 'https://airbnb.com/',                                                                 reservation_code_type: '1'}
    ];

    static isBooker(candidate_booker: string): boolean{
        if (isUndefined(this.getBooker(candidate_booker))) {
            return false;
        }else{
            return true;
        }
    }

    static getReservationLink(candidate_booker: string): string{
        let selected_booker = this.booker_information.find( element => element.name === candidate_booker.toString());
        return selected_booker.reservation_link
    }

    static getBooker(candidate_booker: string): booker{
        return this.booker_information.find(element => element.name === candidate_booker);
    }

    static getReservationCodeType(booker: string): string{
        let selected_booker = this.booker_information.find( element => element.name == booker);
        return selected_booker.reservation_code_type;
    }

    static isValidReservationCode(booker: string, reservation_code: string): boolean{
        let isValid = true;
        if (this.getReservationCodeType(booker).length != reservation_code.length) {
            isValid = false;
        }
        return isValid;
    }

}
