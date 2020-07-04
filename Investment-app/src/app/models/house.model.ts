import { Expense } from "./expense.model";
import { Income } from "./income.model";

export interface House {
    id: string;
    name: string;
    adress: string;
    location: string;
    incomeList: Income[]; 
    expenseList: Expense[];
  }
  