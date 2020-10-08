import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from 'rxjs';

import { InvestmentService } from '../services/investment.service';
import { House } from "../models/house.model";
import { Income } from "../models/income.model";
import { Expense } from "../models/expense.model";
import { PeriodicTransaction } from '../models/periodicTransaction.model';
import { AuthService } from "../auth/auth.service";

@Component({
    selector: 'app-investment-create',
    templateUrl: './investment-create.component.html',
    styleUrls: ['./investment-create.component.css']
  })

  export class InvestmentCreateComponent implements OnInit { 
    name = '';
    adress = '';
    location = '';
    userIsAuthenticated = false;
    private authStatusSub: Subscription;
 
    constructor(
        public investmentService: InvestmentService,
        private router: Router,
        private _snackBar: MatSnackBar,
        public authService: AuthService
    ){ }

    ngOnInit(){
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            console.log(isAuthenticated)
        });
        
        if (!this.userIsAuthenticated)
        {
          this.router.navigate(['/login']);
        }
    }

    onSaveForm( form: NgForm){
        if (!this.userIsAuthenticated) {
            this.displaySnackBar('User is not authenticated')
            throw new Error("User not Authenticated.");
        }

        if (form.invalid) {
            return;
        }

        let incomeList: Income[];
        let expenseList: Expense[];
        let periodicTransactionList: PeriodicTransaction[];
        const added_house = this.investmentService.addHouse(
            form.value.name,
            form.value.adress,
            form.value.location,
            incomeList,
            expenseList,
            periodicTransactionList,
            this.authService.getUserEmail()
        );
        this.displaySnackBar('House '+form.value.name+' created.')
        form.resetForm();
    }

    onFileInput(files: FileList){
        if (!this.userIsAuthenticated) {
            this.displaySnackBar('User is not authenticated')
            throw new Error("User not Authenticated.");
        }

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
                    new_house.expenseList,
                    new_house.periodicTransactionList,
                    this.authService.getUserEmail()
                )
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
