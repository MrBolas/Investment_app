const cron = require("node-cron");
const House = require("../models/house");
const logger = require("../helper/logger")

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
    let cron_schedule = {
        name: 'Production schedule',
        schedule: "0 0 * * *"
    };
    if (process.env.NODE_ENV !== 'production') {
        cron_schedule = {
            name: 'Developer schedule',
            schedule: "* * * * *"
        };
    }
    cron.schedule(cron_schedule.schedule, function() {
        //loads the periodic transactions
        House.find().then(houses => {
            logger.info(`Started Cron task: Periodicity check on ${cron_schedule.name}.`);
            for (const house of houses)
            {
                for (let periodic_transaction of house.periodicTransactionList)
                {
                    if(appliesPeriodicity(house, periodic_transaction)){
                        logger.info(`Evaluating periodicity for: ${house.name}`);
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
    let date;
    var new_transactions = [];

    switch (periodic_transaction.periodicity) {
        case periodicity.none:
            break;
        case periodicity.daily:
            date = new Date(periodic_transaction.latest_date);
            const difference_of_days = differenceOfDays(present_date, new Date(periodic_transaction.latest_date));
            for (let transaction_to_create = 0; transaction_to_create < difference_of_days; transaction_to_create++) {
                date.setDate(date.getDate() + 1);
                const new_transaction = createTransaction(periodic_transaction, date);
                new_transactions.push(new_transaction);
            }
            return new_transactions;
            break;
        case periodicity.weekly:
            date = new Date(periodic_transaction.latest_date);
            let number_of_weeks = Math.floor(differenceOfDays(present_date, new Date(periodic_transaction.latest_date)) / 7);
            for (let transaction_to_create = 0; transaction_to_create < number_of_weeks; transaction_to_create++) {
                date.setDate(date.getDate() + 7);
                const new_transaction = createTransaction(periodic_transaction, date);
                new_transactions.push(new_transaction);
            }
            return new_transactions;
            break;
        case periodicity.monthly:
            date = new Date(periodic_transaction.latest_date);
            let number_of_months = differenceOfMonths(present_date, date);
            for (let transaction_to_create = 0; transaction_to_create < number_of_months; transaction_to_create++) {
                date.setMonth(date.getMonth() + 1);
                const new_transaction = createTransaction(periodic_transaction, date);
                new_transactions.push(new_transaction);
            }
            return new_transactions;
            break;
        case periodicity.quarterly:
            date = new Date(periodic_transaction.latest_date);
            let number_of_quarters = Math.floor(differenceOfMonths(present_date, date)/3);
            for (let transaction_to_create = 0; transaction_to_create < number_of_quarters; transaction_to_create++) {
                date.setMonth(date.getMonth() + 3);
                const new_transaction = createTransaction(periodic_transaction, date);
                new_transactions.push(new_transaction);
            }
            return new_transactions;
            break;
        case periodicity.semester:
            date = new Date(periodic_transaction.latest_date);
            let number_of_semesters = Math.floor(differenceOfMonths(present_date, date)/6);
            for (let transaction_to_create = 0; transaction_to_create < number_of_semesters; transaction_to_create++) {
                date.setMonth(date.getMonth() + 6);
                const new_transaction = createTransaction(periodic_transaction, date);
                new_transactions.push(new_transaction);
            }
            return new_transactions;
            break;
        case periodicity.yearly:
            date = new Date(periodic_transaction.latest_date);
            let number_of_years = Math.floor(differenceOfMonths(present_date, date)/12);
            for (let transaction_to_create = 0; transaction_to_create < number_of_years; transaction_to_create++) {
                date.setMonth(date.getMonth() + 12);
                const new_transaction = createTransaction(periodic_transaction, date);
                new_transactions.push(new_transaction);
            }
            return new_transactions;
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
    let transaction_date;

    switch (transaction.periodicity) {
        case periodicity.none:
            return true;
            break;
        case periodicity.daily:
            transaction_date = new Date(transaction.latest_date);
            if(differenceOfDays(present_date, transaction_date) > 0 ){
                return true;
            }
            break;
        case periodicity.weekly:
            transaction_date = new Date(transaction.latest_date);
            if(differenceOfDays(present_date,transaction_date) > 6 ){
                return true;
            }
            break;
        case periodicity.monthly:
            transaction_date = new Date(transaction.latest_date);
            if(differenceOfMonths(present_date, transaction_date) > 0 ){
                return true;
            }
            break;
        case periodicity.quarterly:
            transaction_date = new Date(transaction.latest_date);
            if (differenceOfMonths(present_date, transaction_date) > 2 ) {
                return true;
            }
            break;
        case periodicity.semester:
            transaction_date = new Date(transaction.latest_date);
            if (differenceOfMonths(present_date, transaction_date) > 5 ) {
                return true;
            }
            break;
        case periodicity.yearly:
            transaction_date = new Date(transaction.latest_date);
            if (differenceOfMonths(present_date, transaction_date) > 11 ) {
                return true;
            }
            break;
        default:
            break;
    }
    return false;
}

function createTransaction(periodic_transaction, new_date){
    const new_id = (Date.now()+Math.round(Math.random()*1000000)).toString();
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
            logger.info(`Added new income transaction ${new_transaction.short_description}:${new_transaction.id} to database.`)
        });
    }else{
        house.expenseList.push(new_transaction);
        House.updateOne({ _id: house.id} , house).then(updated => {
            logger.info(`Added new expense transaction ${new_transaction.short_description}:${new_transaction.id} to database.`)
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