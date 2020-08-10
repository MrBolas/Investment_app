/**  TimeSeriesUtils is a static helper class. Its porpuse is to support chart generation. */

import { Transaction } from '../models/transaction.model';

import { DatePipe } from '@angular/common';

export class TimeSeriesUtils {

    constructor(){}

    /**
     * Helping method that formats a transaction array to use with monthly charts in NGX-charts in a time series format
     * @param transactions Transaction array (income or expense)
     * @param date Date with the reference month for the transactions 
     */
    static formatTransactionArrayForMonthlyChart(transactions: Transaction[], date:Date) {
        let pipe = new DatePipe('en-US');
        let daysInMonth :number = new Date(date.getFullYear(), date.getMonth(),0).getDate();

        let incomeChartSeries = []; /** Income Array */
        let expenseChartSeries = []; /** Expense Array */

        for (let day = 1; day < daysInMonth; day++) {
            /**Verifies if there is any transaction on the date */
            transactions.forEach(transaction =>{
                if(transaction.value>0)
                {
                  if (pipe.transform(transaction.date, 'dd') == (day).toString() &&
                  pipe.transform(transaction.date, 'M') == (date.getMonth()+1).toString()) {
                    incomeChartSeries.push({name: pipe.transform(transaction.date, 'dd'), value: incomeChartSeries[incomeChartSeries.length-1]['value']+transaction.value})
                  }
                }
                else{
                  if (pipe.transform(transaction.date, 'dd') == (day).toString() &&
                  pipe.transform(transaction.date, 'M') == (date.getMonth()+1).toString()) {
                    expenseChartSeries.push({name: pipe.transform(transaction.date, 'dd'), value: expenseChartSeries[expenseChartSeries.length-1]['value']+transaction.value})
                  }
                }
              })
            
              /** If there are no transaction add an income or expense with the previous value */
              if (incomeChartSeries.length < daysInMonth) {
                  if (incomeChartSeries.length > 1) {
                    incomeChartSeries.push({name: (day).toString(), value: incomeChartSeries[incomeChartSeries.length-1]['value']});  
                }else{
                    incomeChartSeries.push({name: (day).toString(), value: 0});  
                  }
              }

              if (expenseChartSeries.length < daysInMonth) {
                if (expenseChartSeries.length > 1) {
                    expenseChartSeries.push({name: (day).toString(), value: expenseChartSeries[expenseChartSeries.length-1]['value']});  
              }else{
                    expenseChartSeries.push({name: (day).toString(), value: 0});  
                }
            }
        }

        return Object([
            {name:"income", series: incomeChartSeries},
            {name:"expense", series: expenseChartSeries}
        ]);
    }

    /**
     * Helping method that formats a transaction array to use with Yearly charts in NGX-charts in a time series format
     * @param transactions Transaction array (income or expense)
     * @param date Date with the reference year for the transactions 
     */
    static formatTransactionArrayForYearlyChart(transactions: Transaction[], date:Date)
    {
        let pipe = new DatePipe('en-US');
        let monthsInYear = 12;

        let incomeChartSeries = []; /** Income Array */
        let expenseChartSeries = []; /** Expense Array */

        for (let month = 1; month <= monthsInYear; month++) {
            /**Verifies if there is any transaction on the date */
            transactions.forEach(transaction =>{
                if(transaction.value>0)
                {
                  if (pipe.transform(transaction.date, 'M') == (month).toString() &&
                  pipe.transform(transaction.date, 'yyyy') == date.getFullYear().toString() &&
                  incomeChartSeries.length > 0) {
                    incomeChartSeries.push({name: pipe.transform(transaction.date, 'M'), value: incomeChartSeries[incomeChartSeries.length-1]['value']+transaction.value})
                  }
                }
                else{
                  if (pipe.transform(transaction.date, 'M') == (month).toString() &&
                  pipe.transform(transaction.date, 'yyyy') == date.getFullYear().toString() &&
                  expenseChartSeries.length > 0) {
                    expenseChartSeries.push({name: pipe.transform(transaction.date, 'M'), value: expenseChartSeries[expenseChartSeries.length-1]['value']+transaction.value})
                  }
                }
            })
            
              /** If there are no transaction add an income or expense with the previous value */
            if (incomeChartSeries.length < monthsInYear) {
                  if (incomeChartSeries.length > 1) {
                    incomeChartSeries.push({name: (month).toString(), value: incomeChartSeries[incomeChartSeries.length-1]['value']});  
                }else{
                    incomeChartSeries.push({name: (month).toString(), value: 0});  
                  }
            }

            if (expenseChartSeries.length < monthsInYear) {
                if (expenseChartSeries.length > 1) {
                    expenseChartSeries.push({name: (month).toString(), value: expenseChartSeries[expenseChartSeries.length-1]['value']});  
              }else{
                    expenseChartSeries.push({name: (month).toString(), value: 0});  
                }
            }
        }

        return Object([
            {name:"income", series: incomeChartSeries},
            {name:"expense", series: expenseChartSeries}
        ]);
    }

    static formatTransactionArrayForTotalChart(transactions: Transaction[])
    {
        let sumOfIncome:number = 0;
        let sumOfExpense:number = 0;
        let sumOfTransactions:number = 0;
        const series = [
            {
              "name": "Retired",
              "value": 20,
              "label": "20%"
            },
            {
              "name": "Employed",
              "value": 70,
              "label": "70%"
            },
            {
              "name": "Unemployed",
              "value": 10,
              "label": "10%"
            }
          ];

          transactions.forEach(transaction => {
            if (transaction.value > 0) {
                sumOfIncome += transaction.value;
            }else{
                sumOfExpense += Math.abs(transaction.value);
            }
          })

          return [
              { 
                "name": "Income",
                "value": sumOfIncome,
                "label":"Total sum of income = "+sumOfIncome.toString()+"€"
            },
            {
                "name":"Expense",
                "value": sumOfExpense,
                "label":"Total sum of expense = "+sumOfExpense.toString()+"€"
            }
          ];


    }

    static normalizeDataSeries(chartSeriesData:{name:string, series:Transaction[]}){
        chartSeriesData.series.forEach(transactionDataEntry => {
            if (transactionDataEntry.value < 0) {
                transactionDataEntry.value = Math.abs(transactionDataEntry.value);
            }
        });
    }

}