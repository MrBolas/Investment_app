const cron = require("node-cron");
const House = require("../models/house")

const periodicity = {
    none:       0,
    daily:      1,
    weekly:     2,
    monthly:    3,
    quarterly:  4,
    semester:   5,
    yearly:     6
}

/** @function launchCron 
 * launches a cron job that daily verifies all the 
 * periodic transactions for new instances to be created. 
 */
function launchCron(){
    console.log("Launched Cron Scheduler:")
    cron.schedule("0 0 * * *", function() {
    //cron.schedule("* * * * *", function() {
        //loads the periodic transactions
        House.find().then(houses => {
            houses.forEach(house => {
                house.periodicTransactionList.forEach( transaction => {
                    if (transaction.periodicity > 0) {
                        if(appliesPeriodicity(transaction)){
                            createTransaction(transaction, house.incomeList, house.expenseList);
                        }
                    }
                });
            });
        });
    });
};

/** @function appliesPeriodicity 
 * Verifies if a given transaction is due on its periodicity on the present day.
 * @returns a bollean
 */
function appliesPeriodicity(transaction){
    let present_date = new Date();     

    //calculate diference in time
    //for days or months

    switch (transaction.periodicity) {
        case periodicity.none:
            console.log("No periodicity");
            return true;
            break;
        case periodicity.daily:
            console.log("Daily periodicity");
            if(differenceOfDays(present_date, transaction.date) > 0){
                return true;
            }
            break;
        case periodicity.weekly:
            console.log("Weekly periodicity");
            if(differenceOfDays(present_date,transaction.date) > 6){
                return true;
            }
            break;
        case periodicity.monthly:
            console.log("Monthly periodicity");
            if(firstDayOfTheMonth()){
                return true;
            }
            break;
        case periodicity.quarterly:
            console.log("Quarterly periodicity");
            if (differenceOfMonths(present_date, transaction.date) % 3 == 0 && firstDayOfTheMonth()) {
                return true;
            }
            break;
        case periodicity.semester:
            console.log("Semester periodicity");
            if (differenceOfMonths(present_date, transaction.date) % 6 == 0 && firstDayOfTheMonth()) {
                return true;
            }
            break;
        case periodicity.yearly:
            console.log("Yearly periodicity");
            if (differenceOfMonths(present_date, transaction.date) % 12 == 0 && firstDayOfTheMonth()) {
                return true;
            }
            break;
        default:
            break;
    }

    return false;
}

function createTransaction(transaction, incomeList, expenseList){
    const new_id = Date.now().toString();
    transaction.child_id.push(new_id);
    const new_transaction = {
        id: new_id,
        value: transaction.value,
        short_description: transaction.short_description,
        long_description: transaction.long_description,
        date: new Date(),
        periodic: true
    };
    if (transaction.value > 0) {
        incomeList.push(new_transaction);
    }else{
        expenseList.push(new_transaction);
    }
    console.log(new_transaction);
    return new_id;
}

function differenceOfDays(present_date, transaction_date) {
    const start = transaction_date;
    const end = present_date;
    let dayCount = 0
  
    while (end > start) {
      dayCount++
      start.setDate(start.getDate() + 1)
    }
    return dayCount
}

function differenceOfMonths(present_date, transaction_date){
    let months;
    months = (present_date.getFullYear() - transaction_date.getFullYear()) * 12;
    months -= transaction_date.getMonth();
    months += present_date.getMonth();
    return months <= 0 ? 0 : months;
}

function firstDayOfTheMonth(present_date) {
    if(present_date.getDate()==1){
        return true;
    }
    else{
        return false;
    }
}

module.exports = launchCron;