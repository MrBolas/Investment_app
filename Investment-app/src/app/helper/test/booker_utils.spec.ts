import { booker } from "../booker_utils";
import { BookerUtils } from "../booker_utils";

const test_booker_information: booker[] = [
    {name: 'Booking',   reservation_link: 'https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/booking.html?res_id=', reservation_code_type: '1234567890'},
    {name: 'Airbnb',    reservation_link: 'https://airbnb.com/',                                                                 reservation_code_type: '1'}
];

describe('Booker utilities helper class', () => {

    /**
     * Test data consistency agains tests
     */
    it('should have consistent Booker data versus the Booker test data', () => {
        const booker_information = BookerUtils.booker_information;
        let consistent:boolean = true;

        booker_information.forEach(booker => {
            let booker_exists:boolean = false;
            test_booker_information.forEach(test_booker => {
                if (test_booker.name == booker.name 
                    && test_booker.reservation_link == booker.reservation_link
                    && test_booker.reservation_code_type == booker.reservation_code_type) {
                    booker_exists = true;
                }
            });
            if(!booker_exists)
            {
                consistent = false;
            }
        });
        expect(consistent).toBe(true);
      });
    
    /**
     * Test method for validating a booker
     */
    it('should validate a booker', () => {
        const is_booker:boolean = BookerUtils.isBooker(test_booker_information[0].name)
        expect(is_booker).toBe(true);
    });
    
    /**
     * Test getter method for reservation link
     */
    it('should get a reservation link', () => {
        const reservation_link:string = BookerUtils.getReservationLink(test_booker_information[0].name)
        expect(reservation_link).toBe(test_booker_information[0].reservation_link);
    });
    
    /**
     * Test getter method for booker
     */
    it('should get booker object', () => {
        const booker_object:booker = BookerUtils.getBooker(test_booker_information[0].name)
        expect(booker_object).toEqual(test_booker_information[0]);
    });
    
    /**
     * Test getter method for reservation code type
     */
    it('should get reservation code type', () => {
        const reservation_code_type:string = BookerUtils.getReservationCodeType(test_booker_information[0].name)
        expect(reservation_code_type).toBe(test_booker_information[0].reservation_code_type);
    });
    
    /**
     * Test method for validation of the reservation code type
     */
    it('should validate the reservation code type', () => {
        let valid = true;
        valid = BookerUtils.isValidReservationCode(test_booker_information[0].name, test_booker_information[0].reservation_code_type);
        expect(valid).toBe(true);
        valid = BookerUtils.isValidReservationCode(test_booker_information[0].name, '');
        expect(valid).toBe(false);
    });
})
