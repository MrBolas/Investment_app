import {Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { InvestmentService } from '../services/investment.service';
import { NgForm, FormControl } from '@angular/forms';

import { House } from '../models/house.model';
import { Transaction } from "../models/transaction.model";
import { Income } from "../models/income.model";
import { Expense } from "../models/expense.model";
import { Subscription } from 'rxjs';

import { BookerUtils } from "../helper/booker_utils";

@Component({
  selector: 'app-investment-details',
  styleUrls: ['./investment-details.css'],
  templateUrl: './investment-details.html',
})
export class InvestmentDetailsComponent implements OnInit, OnDestroy{
    private investmentId: string;
    private investmentSub : Subscription;
    value = ''; short_description = ''; long_description = ''; reservation_code = ''; reservationOptionSelected = '';
    reservationOptionsControl = new FormControl('');
    reservationsOptions = [
      {name: 'No'},
      {name: 'Booking'},
      {name: 'Airbnb'},
    ];
    netValue: number = 0;
    loaded = true;
    displayedColumns: string[] = ['Action', 'Date', 'value', 'description'];
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
        date: new Date(),
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
        date: new Date(),
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