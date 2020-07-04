import {Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { InvestmentService } from '../services/investment.service';
import { NgForm } from '@angular/forms';

import { House } from '../models/house.model';
import { Transaction } from "../models/transaction.model";
import { Income } from "../models/income.model";
import { Expense } from "../models/expense.model";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-investment-details',
  styleUrls: ['./investment-details.css'],
  templateUrl: './investment-details.html',
})
export class InvestmentDetailsComponent implements OnInit{
    private investmentId: string;
    private investmentSub : Subscription;
    loaded = true;
    displayedColumns: string[] = ['Action', 'Date', 'value', 'description'];
    house: House;
    transactions: Transaction[]=[];
    value = '';
    description = '';

    constructor(
        public investmentService: InvestmentService,
        public route: ActivatedRoute
    ){}

  ngOnInit(){
    //get data from ID
    this.loaded = false;
    this.route.paramMap.subscribe((paramMap:ParamMap) =>{
        if (paramMap.has("investmentId")) {
            this.investmentId = paramMap.get("investmentId");
            this.investmentService.getInvestment(this.investmentId)
            .subscribe(investmentData => {
              this.loaded = true;
              this.house = investmentData.house;
              this.transactions = [...this.house.incomeList, ...this.house.expenseList];
            })
          }
    })
  }

  onSaveForm( form: NgForm){
    if (form.invalid) {
        return;
    }

    if (form.value.value >= 0 ){
      // add income entry to this.house.incomeList
      const new_income_entry: Income = {
        id: Date.now().toString(),
        value: form.value.value, 
        description:form.value.description,
        date: new Date() };
      //this.house.incomeList.push(new_income_entry);
      this.investmentService.addIncome(this.house, new_income_entry);
    }else{
      // add expense entry to this.house.expenseList
      const new_expense_entry: Expense = {
        id: Date.now().toString(),
        value: form.value.value, 
        description:form.value.description,
        date: new Date() };
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