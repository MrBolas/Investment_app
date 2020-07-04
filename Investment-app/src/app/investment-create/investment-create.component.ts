import { Component, OnInit } from "@angular/core";
import { NgForm } from '@angular/forms';

import { InvestmentService } from '../services/investment.service';
import { Income } from "../models/income.model";
import { Expense } from "../models/expense.model";

@Component({
    selector: 'app-investment-create',
    templateUrl: './investment-create.component.html',
    styleUrls: ['./investment-create.component.css']
  })

  export class InvestmentCreateComponent implements OnInit { 
    private mode = 'create';
    name = '';
    adress = '';
    location = '';

    constructor(
        public investmentService: InvestmentService,
    ){ }

    ngOnInit(){
        this.mode = 'create';
    }

    onSaveForm( form: NgForm){
        if (form.invalid) {
            return;
        }
        if (this.mode === "create") {
            let incomeList: Income[];
            let expenseList: Expense[];
            console.log("onSave");
            this.investmentService.addHouse(
                form.value.name,
                form.value.adress,
                form.value.location,
                incomeList,
                expenseList
            );
        }
        form.resetForm();
    }
}
