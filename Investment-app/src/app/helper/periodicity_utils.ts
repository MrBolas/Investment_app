
export class PeriodicityUtils {
    
    constructor() {}

    static getPeriodicityMap()
    {
        return periodicity_map;
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

const enum periodicity {
    none = 0,
    daily,
    weekly,
    monthly,
    quarterly,
    semester,
    yearly
}