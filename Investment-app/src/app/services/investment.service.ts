import { House } from "../models/house.model";
import { Income } from "../models/income.model";
import { Expense } from "../models/expense.model";

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { map } from "rxjs/operators";


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

    addHouse(name: string, adress: string, location: string, incomeList: Income[], expenseList: Expense[]){
        const house: House = {
            id: null,
            name: name,
            adress: adress,
            location: location,
            incomeList: incomeList,
            expenseList: expenseList
        };
        this.http.post<{message: string, houseId: string}>('http://localhost:3000/api/house', house)
        .subscribe((responseData)=>{
            const id = responseData.houseId;
            house.id = id;
            this.houses.push(house);
            this.housesUpdated.next([...this.houses]);
            this.router.navigate(["/list"]);
        })
    }

    getInvestments(){
        this.http.get<{message: string, houses: any}>('http://localhost:3000/api/house')
        .pipe(map(investmentData => {
            console.log(investmentData);
            return investmentData.houses.map(house => {
                console.log(house);
                return {
                    id: house._id,
                    name: house.name,
                    adress: house.adress,
                    location: house.location,
                    incomeList: house.incomeList,
                    expenseList: house.expenseList
                };
            });
        }))
        .subscribe((transformedHouses) => {
            this.houses = transformedHouses;
            this.housesUpdated.next([...this.houses]);
        });
    }

    getInvestment(id: string){
        this.http.get<{message: string, house:any}>('http://localhost:3000/api/house/'+id)
        .subscribe((updatedReply) => {
            this.house = updatedReply.house;
            this.houseUpdated.next(this.house);
            this.router.navigate(["/house/"+id]);
        })
    }

    addIncome(house: House, income_entry: Income){
        // Adds new income entry
        house.incomeList.push(income_entry);

        this.http.put('http://localhost:3000/api/house/'+house["_id"], house)
        .subscribe((responseData)=>{
            this.house = house;
            this.houseUpdated.next(this.house);
            this.router.navigate(["/house/"+house['_id']]);
        })
    }

    removeIncome(house: House, income_entry_id: string){

        house.incomeList = house.incomeList.filter( entry => entry.id != income_entry_id);

        this.http.put('http://localhost:3000/api/house/'+house['_id'], house)
        .subscribe((responseData)=>{
            this.house = house;
            this.houseUpdated.next(this.house);
            this.router.navigate(["/house/"+house['_id']]);
        })
    }

    addExpense(house: House, expense_entry: Expense){
        console.log("service sends post request to add an expense entry")
        // Adds new expense entry
        house.expenseList.push(expense_entry);

        this.http.put('http://localhost:3000/api/house/'+house['_id'], house)
        .subscribe((responseData)=>{
            this.house = house;
            this.houseUpdated.next(this.house);
            this.router.navigate(["/house/"+house['_id']]);
        })
    }

    removeExpense(house: House, expense_entry_id: string){

        house.expenseList = house.expenseList.filter( entry => entry.id != expense_entry_id);
        console.log(house);
        this.http.put('http://localhost:3000/api/house/'+house['_id'], house)
        .subscribe((responseData)=>{
            this.house = house;
            this.houseUpdated.next(this.house);
            this.router.navigate(["/house/"+house['_id']]);
        })
    }
}