
export class PeriodicityUtils {
    
    constructor() {}

    static getPeriodicityMap()
    {
        return periodicity_map;
    }

    static getEnumFromString(periodicity_string:String) : Number
    {
        for (const periodicity_element of periodicity_map) {
            if (periodicity_element.name == periodicity_string) {
                return periodicity_element.enum;
            }
        }
        return 0;
    }

    static getStringFromEnum(periodicity_number:Number) :String{
        for (const periodicity_element of periodicity_map) {
            if (periodicity_element.enum == periodicity_number) {
                return periodicity_element.name;
            }
        }
        return "None";
    }

}

const periodicity_map = [
    { name: "None", enum: periodicity.none},
    { name: "Daily", enum: periodicity.daily},
    { name: "Weekly", enum: periodicity.weekly},
    { name: "Monthly", enum: periodicity.monthly},
    { name: "Quarterly", enum: periodicity.quarterly},
    { name: "Semester", enum: periodicity.semester},
    { name: "Yearly", enum: periodicity.yearly}
];

export const enum periodicity {
    none = 0,
    daily,
    weekly,
    monthly,
    quarterly,
    semester,
    yearly
}