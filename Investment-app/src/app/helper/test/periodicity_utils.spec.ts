import { PeriodicityUtils, periodicity } from "../periodicity_utils";


const test_periodicity_map = [
  { name: "None", enum: periodicity.none},
  { name: "Daily", enum: periodicity.daily},
  { name: "Weekly", enum: periodicity.weekly},
  { name: "Monthly", enum: periodicity.monthly},
  { name: "Quarterly", enum: periodicity.quarterly},
  { name: "Semester", enum: periodicity.semester},
  { name: "Yearly", enum: periodicity.yearly}
];

describe('Periodicity Utilities helper class', () => {

  /** Map consistency test
   */
  it('should be a consistent map', () => {
      expect(PeriodicityUtils.getPeriodicityMap()).toEqual(test_periodicity_map);
  });

});