import { House } from "../models/house.model";
import { Income } from "../models/income.model";
import { Expense } from "../models/expense.model";
import { PeriodicTransaction } from "../models/periodicTransaction.model";

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { map, audit } from "rxjs/operators";

import { environment } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';


@Injectable({providedIn: 'root'})
export class InvestmentService {
    private houses: House[] = [];                   //for the list component
    private house: House;                           //for the details component
    private housesUpdated = new Subject<House[]>(); //for the list component
    private houseUpdated = new Subject<House>();    //for the details component

    constructor(private http: HttpClient, private router: Router) { }

    getInvestmentUpdateListener(){
        return this.housesUpdated.asObservable();
    }

    getOneInvestmentUpdateListener(){
        return this.houseUpdated.asObservable();
    }

    addHouse(name: string, adress: string, location: string, incomeList: Income[], expenseList: Expense[], periodicTransactionList: PeriodicTransaction[], manager: string){
        const house: House = {
            id: null,
            name: name,
            adress: adress,
            location: location,
            incomeList: incomeList,
            expenseList: expenseList,
            periodicTransactionList: periodicTransactionList,
            managers: [manager]
        };
        this.http.post<{message: string, houseId: string}>(environment.apiUrl+'/api/house', house)
        .subscribe((responseData)=>{
            const id = responseData.houseId;
            house.id = id;
            this.houses.push(house);
            this.housesUpdated.next([...this.houses]);
            this.router.navigate(["/list"]);
        })
    }

    getInvestments(){
        this.http.get<{message: string, houses: any}>(environment.apiUrl+'/api/house')
        .pipe(map(investmentData => {
            return investmentData.houses.map(house => {
                return {
                    id: house._id,
                    name: house.name,
                    adress: house.adress,
                    location: house.location,
                    incomeList: house.incomeList,
                    expenseList: house.expenseList,
                    periodicTransactionList: house.periodicTransactionList
                };
            });
        }))
        .subscribe((transformedHouses) => {
            this.houses = transformedHouses;
            this.housesUpdated.next([...this.houses]);
        });
    }

    getInvestment(id: string){
        this.http.get<{message: string, house: House}>(environment.apiUrl+'/api/house/'+id)
        .subscribe(response => {
            this.houseUpdated.next(response.house);
            this.router.navigate(["/house/"+id]);
        })
    }

    deleteInvestment(target_house:House){
        this.http.delete<{message: string, house:any}>(environment.apiUrl+'/api/house/'+target_house.id)
        .subscribe(() => {
            const updatedInvestments = this.houses.filter(house => house.id !== target_house.id);
            this.houses = updatedInvestments;
            this.housesUpdated.next([...this.houses]);
        })
    }

    updateTransaction(house: House, transaction_entry: Transaction )
    {
        if (transaction_entry.value > 0) {
            this.updateIncome(house, transaction_entry);
        }else{
            this.updateExpense(house, transaction_entry);
        }
    }

    updateIncome(house :House, income_entry: Income){

        // remove previous income entry
        house.incomeList = house.incomeList.filter( entry => entry.id != income_entry.id);

        // add new income entry
        house.incomeList.push(income_entry);

        this.http.put(environment.apiUrl+'/api/house/'+house["_id"], house)
        .subscribe((responseData)=>{
            this.house = house;
            this.houseUpdated.next(this.house);
            this.router.navigate(["/house/"+house['_id']]);
        })
    }

    addIncome(house: House, income_entry: Income, periodic_income?: PeriodicTransaction){
        // Adds new income entry
        console.log(house)
        house.incomeList.push(income_entry);

        //If a template is available, add to house
        if (periodic_income != undefined) {
            house.periodicTransactionList.push(periodic_income);
        }
        this.http.put(environment.apiUrl+'/api/house/'+house["_id"], house)
        .subscribe((responseData)=>{
            this.house = house;
            this.houseUpdated.next(this.house);
            this.router.navigate(["/house/"+house['_id']]);
        })
    }

    removeIncome(house: House, income_entry: Income, periodic_income?: PeriodicTransaction){

        //Removes child_id when income is removed
        //Removes Periodic transaction if all childs are deleted
        house.periodicTransactionList.forEach(periodicTransaction => {
            periodicTransaction.child_id.map( id => {
                if (id == income_entry.id){
                    periodicTransaction.child_id = periodicTransaction.child_id.filter(id => id != income_entry.id);
                } 
                
                if( periodicTransaction.child_id.length < 1){
                    house.periodicTransactionList = house.periodicTransactionList.filter( entry => entry.id != periodicTransaction.id)
                }
            })
        });

        //Removes Periodic transaction if all childs are deleted
        house.periodicTransactionList.forEach(periodicTransaction => {
            periodicTransaction.child_id.map( id => {
                if (id == income_entry.id && periodicTransaction.child_id.length == 1){
                    house.periodicTransactionList.filter( entry => entry.id != periodicTransaction.id)
                }
            })
        });

        //remove income listing
        house.incomeList = house.incomeList.filter( entry => entry.id != income_entry.id);

        //If a template is available, remove from house
        if (periodic_income != undefined) {
            //remove all child transactions
            periodic_income.child_id.forEach(child_id => {
                house.incomeList = house.incomeList.filter( entry => entry.id != child_id);
            })
            // remove periodic transaction template
            house.periodicTransactionList = house.periodicTransactionList.filter( entry => entry.id != periodic_income.id);
        }

        this.http.put(environment.apiUrl+'/api/house/'+house['_id'], house)
        .subscribe((responseData)=>{
            this.house = house;
            this.houseUpdated.next(this.house);
            this.router.navigate(["/house/"+house['_id']]);
        })
    }

    updateExpense(house :House, expense_entry: Expense){

        // remove previous expense entry
        house.expenseList = house.expenseList.filter( entry => entry.id != expense_entry.id);

        // add new expense entry
        house.expenseList.push(expense_entry);

        this.http.put(environment.apiUrl+'/api/house/'+house["_id"], house)
        .subscribe((responseData)=>{
            this.house = house;
            this.houseUpdated.next(this.house);
            this.router.navigate(["/house/"+house['_id']]);
        })
    }

    addExpense(house: House, expense_entry: Expense, periodic_expense?: PeriodicTransaction){
        // Adds new expense entry
        house.expenseList.push(expense_entry);

        //If a template is available, add to house
        if (periodic_expense != undefined) {
            house.periodicTransactionList.push(periodic_expense);
        }

        this.http.put(environment.apiUrl+'/api/house/'+house['_id'], house)
        .subscribe((responseData)=>{
            this.house = house;
            this.houseUpdated.next(this.house);
            this.router.navigate(["/house/"+house['_id']]);
        })
    }

    removeExpense(house: House, expense_entry: Expense, periodic_expense?: PeriodicTransaction){

        //Removes child_id when expense is removed
        //Removes Periodic transaction if all childs are deleted
        house.periodicTransactionList.forEach(periodicTransaction => {
            periodicTransaction.child_id.map( id => {
                if (id == expense_entry.id){
                    periodicTransaction.child_id = periodicTransaction.child_id.filter(id => id != expense_entry.id);
                } 
                
                if( periodicTransaction.child_id.length < 1){
                    house.periodicTransactionList = house.periodicTransactionList.filter( entry => entry.id != periodicTransaction.id)
                }
            })
        });

        //remove expense listing
        house.expenseList = house.expenseList.filter( entry => entry.id != expense_entry.id);

        //If a template is available, add to house
        if (periodic_expense != undefined) {
            //remove all child transactions
            periodic_expense.child_id.forEach(child_id => {
                house.expenseList = house.expenseList.filter( entry => entry.id != child_id);
            })

            // remove periodic transaction template
            house.periodicTransactionList = house.periodicTransactionList.filter( entry => entry.id != periodic_expense.id);
        }

        this.http.put(environment.apiUrl+'/api/house/'+house['_id'], house)
        .subscribe((responseData)=>{
            this.house = house;
            this.houseUpdated.next(this.house);
            this.router.navigate(["/house/"+house['_id']]);
        })
    }

    addManager(house: House, new_manager_email: string){
        this.http.post<{message: string, house: House}>(environment.apiUrl+'/api/house/manager/'+house['_id'], {new_manager_email})
        .subscribe((response)=>{
            this.house.managers.push(new_manager_email);
            this.houseUpdated.next(response.house);
            this.router.navigate(["/house/"+house['_id']]);
        })
    }
    
    removeManager(house: House, manager_email: string){
        this.http.delete<{message: string, house: House}>(environment.apiUrl+'/api/house/manager/'+house['_id']+'/'+manager_email)
        .subscribe((response)=>{
            const updated_managers = this.house.managers.filter(manager => manager !== manager_email);
            this.house.managers = updated_managers;
            this.houseUpdated.next(this.house);
            this.router.navigate(["/house/"+house['_id']]);
        })
    }
}