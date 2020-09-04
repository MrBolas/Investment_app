const cron = require("node-cron");
const House = require("../models/house");
const { transcode } = require("buffer");

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
    //cron.schedule("0 0 * * *", function() {
        cron.schedule("* * * * *", function() {
            //loads the periodic transactions
            House.find().then(houses => {
                console.log("Launched Cron Scheduler")
                for (const house of houses)
                {
                    console.log('-> for: '+house.name);
                    for (let periodic_transaction of house.periodicTransactionList)
                    {
                        if(appliesPeriodicity(house, periodic_transaction)){
                            let new_transactions = creationTransactionManager(periodic_transaction);
                            new_transactions.forEach(new_transaction => {
                                updateDB(house, new_transaction,periodic_transaction);
                            });
                        }
                    }
                }
            });
        });
};

/** @function creationTransactionManager 
 * function responsable for creating the transactions according with a Periodic Transanction
 * @returns an arraw of transaction
 */
function creationTransactionManager(periodic_transaction) {
    let present_date = new Date();     

    switch (periodic_transaction.periodicity) {
        case periodicity.none:
            break;
        case periodicity.daily:
            var new_transactions = [];
            let date = new Date(periodic_transaction.latest_date);
            const difference_of_days = differenceOfDays(present_date, new Date(periodic_transaction.latest_date));
            for (let transaction_to_create = 0; transaction_to_create < difference_of_days; transaction_to_create++) {
                date.setDate(date.getDate()+1);
                const new_transaction = createTransaction(periodic_transaction, date);
                new_transactions.push(new_transaction);
            }
            return new_transactions;
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

    
}

/** @function appliesPeriodicity 
 * Verifies if a given transaction is due on its periodicity on the present day.
 * @returns a bollean
 */
function appliesPeriodicity(house, transaction){
    let present_date = new Date();     

    switch (transaction.periodicity) {
        case periodicity.none:
            console.log("No periodicity");
            return true;
            break;
        case periodicity.daily:
            const transaction_date = new Date(transaction.latest_date);
            if(differenceOfDays(present_date, transaction_date) > 0){
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

function createTransaction(periodic_transaction, new_date){
    const new_id = (Date.now()+Math.round(Math.random()*1000)).toString();
    const new_transaction = {
        id: new_id,
        value: periodic_transaction.value,
        short_description: periodic_transaction.short_description,
        long_description: periodic_transaction.long_description,
        date: new Date(new_date),
        date_string: '',
        booker: periodic_transaction.booker,
        reservation_link: periodic_transaction.reservation_link,
        periodic: true
    };

    periodic_transaction.child_id.push(new_id);
    periodic_transaction.latest_date = new_transaction.date;

    return new_transaction;
}

function updateDB(house, new_transaction, updated_periodic_transaction) {

    for (let periodic_transaction of house.periodicTransactionList) {
        if (periodic_transaction.id == updated_periodic_transaction.id) {
            periodic_transaction = updated_periodic_transaction;
        }
    }
    
    if (new_transaction.value > 0) {
        house.incomeList.push(new_transaction);
        House.updateOne({ _id: house.id} , house).then( updated => {
            console.log('Added '+new_transaction.id+' to income List.')
        });
    }else{
        house.expenseList.push(new_transaction);
        House.updateOne({ _id: house.id} , house).then(updated => {
            console.log('Added '+new_transaction.id+' to expense List.')
        });
    }
}

function differenceOfDays(present_date, transaction_date) {
    const start = transaction_date;
    const end = present_date;
    let dayCount = 0
    while (end > start) {
      dayCount++
      start.setDate(start.getDate() + 1)
    }
    return dayCount-1
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