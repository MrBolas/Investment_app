import {Component, OnInit, OnDestroy, NgModule} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { InvestmentService } from '../services/investment.service';
import { NgForm, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

import { House } from '../models/house.model';
import { Transaction } from "../models/transaction.model";
import { Income } from "../models/income.model";
import { Expense } from "../models/expense.model";
import { Subscription } from 'rxjs';

import { BookerUtils } from "../helper/booker_utils";
import { TimeSeriesUtils } from "../helper/time_series_utils";
import { ChartOptions } from "./chart_options";
import { PeriodicityUtils } from "../helper/periodicity_utils";
import { PeriodicTransaction } from '../models/periodicTransaction.model';

@Component({
  selector: 'app-investment-details',
  styleUrls: ['./investment-details.css'],
  templateUrl: './investment-details.html',
})
export class InvestmentDetailsComponent implements OnInit, OnDestroy{
    private investmentId: string;
    private investmentSub : Subscription;
   
    // charts options
    chart1_options = ChartOptions.getChart1Options();
    chart2_options = ChartOptions.getChart2Options();
    chart3_options = ChartOptions.getChart3Options();
    chart1_results :any = [];
    chart2_results :any = [];
    chart3_results :any = [];
    cumulative_checkbox = true;
   
    pipe = new DatePipe('en-US');
    value :string; short_description :string; long_description :string; 
    reservation_code :string; reservationOptionSelected = '';
    periodicityOptionSelected = '';
    date :string; end_date:string;
    reservationOptionsControl = new FormControl('');
    periodicityOptionsControl = new FormControl('');
    periodicityOptions: Object;
    reservationsOptions = [
      {name: 'No'},
      {name: 'Booking'},
      {name: 'Airbnb'},
    ];
    netValue: number = 0;
    loaded = true;
    displayedColumns: string[] = ['Action', 'Date', 'value', 'short_description','description'];
    house: House;
    transactions: Transaction[]=[];

    constructor(
        public investmentService: InvestmentService,
        public route: ActivatedRoute,
        public _snackBar:MatSnackBar,
    ){}

  ngOnInit(){
    //get data from ID
    this.loaded = false;
    this.periodicityOptions = PeriodicityUtils.getPeriodicityMap();
    this.route.paramMap.subscribe((paramMap:ParamMap) =>{
      if (paramMap.has("investmentId")) {
          this.investmentId = paramMap.get("investmentId")
          this.investmentService.getInvestment(this.investmentId);
          this.investmentSub = this.investmentService.getOneInvestmentUpdateListener().subscribe((house: House) => {
            this.loaded = true;
            this.house = house;
            this.transactions = [...this.house.incomeList, ...this.house.expenseList];
            this.calculateNet();
            this.ParseChartData();
          })
      }
    });
  }
  
  ngOnDestroy(){
    this.investmentSub.unsubscribe();
  }

  onButtonClick(transaction){
    window.open(transaction.reservation_link);
  }

  calculateNet(){
    if (this.transactions.length>0) { 
      this.transactions.forEach(transaction => {
        this.netValue += transaction.value;
      })
    }
  }

  ParseChartData(){
    let presentdate = new Date();

    /**Parse data for Chart 1 */
    this.chart1_results = TimeSeriesUtils.formatTransactionArrayForMonthlyChart(this.transactions, presentdate, this.cumulative_checkbox);
    this.chart1_results.forEach(chartSeriesData => {
      TimeSeriesUtils.normalizeDataSeries(chartSeriesData);
    });

    /**Parse data for chart 2 */
    this.chart2_results = TimeSeriesUtils.formatTransactionArrayForYearlyChart(this.transactions, presentdate, this.cumulative_checkbox);
    this.chart2_results.forEach(chartSeriesData => {
      TimeSeriesUtils.normalizeDataSeries(chartSeriesData);
    });
    
    /**Parse data for chart 3 */
    this.chart3_results = TimeSeriesUtils.formatTransactionArrayForTotalChart(this.transactions);

  }

  onSaveForm( form: NgForm){
    if (form.invalid) {
        return;
    }

    //Booker link validations
    var bookerSelected = '';
    var reservationLink = '';

    //Periodicity
    let periodic_transaction = false;

    if (BookerUtils.isBooker(this.reservationOptionSelected['name'])
    && BookerUtils.isValidReservationCode(this.reservationOptionSelected['name'], form.value.reservation_code)) 
    {
      bookerSelected = this.reservationOptionSelected['name'];
      reservationLink = BookerUtils.getReservationLink(this.reservationOptionSelected['name']) + form.value.reservation_code;  
    }

    if (this.periodicityOptionSelected['enum'] > 0) {
      periodic_transaction = true;  
    }
    
    if (Number(form.value.value) >= 0 ){
      // add income entry to this.house.incomeList
      const new_income_entry: Income = {
        id: Date.now().toString(),
        value: Number(form.value.value), 
        short_description:form.value.short_description,
        long_description:form.value.long_description,
        date: new Date(this.date),
        date_string: this.pipe.transform(this.date, 'fullDate'),
        booker: bookerSelected,
        reservation_link: reservationLink,
        periodicity: periodic_transaction
      };
      if (periodic_transaction) {
        let child_ids:string[]=[new_income_entry.id];
        const new_periodic_income: PeriodicTransaction = {
          id: new_income_entry.id,
          value: new_income_entry.value,
          short_description: new_income_entry.short_description,
          long_description: new_income_entry.long_description,
          date: new_income_entry.date,
          periodicity: this.periodicityOptionSelected['enum'],
          child_id: child_ids
        }
        this.investmentService.addIncome(this.house, new_income_entry, new_periodic_income);
      } else {
        this.investmentService.addIncome(this.house, new_income_entry);
      }
      this.displaySnackBar('Income '+new_income_entry.short_description+' added.')
    }else{
      // add expense entry to this.house.expenseList
      const new_expense_entry: Expense = {
        id: Date.now().toString(),
        value: Number(form.value.value), 
        short_description:form.value.short_description,
        long_description:form.value.long_description,
        date: new Date(this.date),
        date_string: this.pipe.transform(this.date, 'fullDate'),
        booker: bookerSelected,
        reservation_link: reservationLink,
        periodicity: periodic_transaction
      };
      if (periodic_transaction) {
        let child_ids:string[]=[new_expense_entry.id];
        const new_periodic_expense: PeriodicTransaction = {
          id: new_expense_entry.id,
          value: new_expense_entry.value,
          short_description: new_expense_entry.short_description,
          long_description: new_expense_entry.long_description,
          date: new_expense_entry.date,
          periodicity: this.periodicityOptionSelected['enum'],
          child_id: child_ids
        }
        this.investmentService.addExpense(this.house, new_expense_entry, new_periodic_expense);
      } else {
        this.investmentService.addExpense(this.house, new_expense_entry);
      }
      this.displaySnackBar('Expense '+new_expense_entry.short_description+' added.')
    }
    
    //update house
    form.resetForm();
}

  onDeleteTableEntry(transaction:Transaction){
    if (transaction.value >= 0) {
      this.investmentService.removeIncome(this.house, transaction.id);
      this.displaySnackBar('Income '+transaction.short_description+' deleted.');
      this.netValue = this.netValue - transaction.value;
    }else{
      this.investmentService.removeExpense(this.house, transaction.id);
      this.displaySnackBar('Expense '+transaction.short_description+' deleted.');
      this.netValue = this.netValue + transaction.value;
    }
  }

  displaySnackBar(message:string){
    //Display SnackBar
    const snackbar_message = message; 
    this._snackBar.open(snackbar_message, '',{
        duration: 2000,
        horizontalPosition:'right'
        });
  }
}