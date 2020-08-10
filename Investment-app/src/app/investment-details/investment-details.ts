import {Component, OnInit, OnDestroy, NgModule} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { InvestmentService } from '../services/investment.service';
import { NgForm, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { House } from '../models/house.model';
import { Transaction } from "../models/transaction.model";
import { Income } from "../models/income.model";
import { Expense } from "../models/expense.model";
import { Subscription } from 'rxjs';

import { BookerUtils } from "../helper/booker_utils";
import { TimeSeriesUtils } from "../helper/time_series_utils";
import { ChartOptions } from "./chart_options";

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
   
    pipe = new DatePipe('en-US');
    value = ''; short_description = ''; long_description = ''; reservation_code = ''; reservationOptionSelected = '';
    roomsFilter = '';
    date = '';
    reservationOptionsControl = new FormControl('');
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
        public route: ActivatedRoute
    ){}

  ngOnInit(){
    //get data from ID
    this.loaded = false;
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
    this.chart1_results = TimeSeriesUtils.formatTransactionArrayForMonthlyChart(this.transactions, presentdate);
    this.chart1_results.forEach(chartSeriesData => {
      TimeSeriesUtils.normalizeDataSeries(chartSeriesData);
    });

    /**Parse data for chart 2 */
    this.chart2_results = TimeSeriesUtils.formatTransactionArrayForYearlyChart(this.transactions, presentdate);
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

    //console.log(bookerSelected + ' ' + reservationLink);
    if (BookerUtils.isBooker(this.reservationOptionSelected['name'])
    && BookerUtils.isValidReservationCode(this.reservationOptionSelected['name'], form.value.reservation_code)) 
    {
      bookerSelected = this.reservationOptionSelected['name'];
      reservationLink = BookerUtils.getReservationLink(this.reservationOptionSelected['name']) + form.value.reservation_code;  
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
      };
      console.log(new_income_entry);
      //this.house.incomeList.push(new_income_entry);
      this.investmentService.addIncome(this.house, new_income_entry);
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
      };
      console.log(new_expense_entry);
      //this.house.expenseList.push(new_expense_entry);
      this.investmentService.addExpense(this.house, new_expense_entry);
    }
    
    //update house
    form.resetForm();
}

  onDeleteTableEntry(id:string, value:number){
    if (value >= 0) {
      this.investmentService.removeIncome(this.house, id);
      console.log("Income: "+id+" deleted.");
    }else{
      this.investmentService.removeExpense(this.house, id);
      console.log("Expense: "+id+" deleted.");
    }
  }

}