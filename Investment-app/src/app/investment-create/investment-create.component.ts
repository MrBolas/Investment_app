import { Component, OnInit } from "@angular/core";
import { NgForm } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";

import { InvestmentService } from '../services/investment.service';
import { House } from "../models/house.model";
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
        private _snackBar: MatSnackBar
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
            const added_house = this.investmentService.addHouse(
                form.value.name,
                form.value.adress,
                form.value.location,
                incomeList,
                expenseList
            );
            this.displaySnackBar('House '+form.value.name+' created.')
        }
        form.resetForm();
    }

    onFileInput(files: FileList){
        if (files.length<1) {
            throw new Error("No file was selected.");
        }
        
        let new_house: House

        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            
            console.log(file.type);
            if (file.type != 'application/json') {
                throw new Error("File format not supported. Import suports json format.");
            }

            let reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
                let json_string = reader.result.toString();
                new_house = JSON.parse(json_string);
                this.investmentService.addHouse(
                    new_house.name,
                    new_house.adress,
                    new_house.location,
                    new_house.incomeList,
                    new_house.expenseList)
            }        
        }
        this.displaySnackBar('House '+new_house.name+' imported.')
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
