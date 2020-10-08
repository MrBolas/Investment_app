/**  SortingUtils is a helper class. Its porpuse is to support chart generation. */

import { Transaction } from '../models/transaction.model';
import { UserProfile, TableCollumns } from '../models/userProfile.model';

export class SortingUtils {

  constructor(){
  }

  /**
   * sortTransactions sorts an array of transactions according
   *  to the user preferences in the user profile
   * @param original_transactions original set of transactions
   * @param userProfile user profile with sorting preferences
   */
  static sortTransactions(original_transactions: Transaction[], userProfile: UserProfile){
    
    let transactions = original_transactions;
    let orderBy = userProfile.viewOptions.detailsView.table.orderBy;
    let ascending = userProfile.viewOptions.detailsView.table.ascending;

    if (ascending && orderBy == TableCollumns.Date) {
      //console.log('Ascending by Date')
      transactions = original_transactions.sort(SortingUtils.compareDatesAsc)          
    }else if (!ascending && orderBy == TableCollumns.Date) {
      //console.log('Descending by Date')
      transactions = original_transactions.sort(SortingUtils.compareDatesDsc)          
    }else if (ascending && orderBy == TableCollumns.Value) {
      //console.log('Ascending by Value')
      transactions = original_transactions.sort(SortingUtils.compareValuesAsc)          
    }else if(!ascending && orderBy == TableCollumns.Value){
      //console.log('Descending by Value')
      transactions = original_transactions.sort(SortingUtils.compareValuesDsc)          
    }
    return transactions;
  }

  static compareDatesAsc(a:Transaction, b:Transaction)
  {
    let a_milliseconds = new Date(a.date).getTime();
    let b_milliseconds = new Date(b.date).getTime();
    let comparison = 0;
    if (a_milliseconds > b_milliseconds) {
      comparison = 1;
    } else if (a_milliseconds < b_milliseconds) {
      comparison = -1;
    }
    return comparison;
  }

  static compareDatesDsc(a:Transaction, b:Transaction)
  {
    let a_milliseconds = new Date(a.date).getTime();
    let b_milliseconds = new Date(b.date).getTime();

    let comparison = 0;
    if (a_milliseconds < b_milliseconds) {
      comparison = 1;
    } else if (a_milliseconds > b_milliseconds) {
      comparison = -1;
    }
    return comparison;
  }

  static compareValuesAsc(a:Transaction, b:Transaction)
  {
    let comparison = 0;
    if (a.value > b.value) {
      comparison = 1;
    } else if (a.value < b.value) {
      comparison = -1;
    }
    return comparison;
  }

  static compareValuesDsc(a:Transaction, b:Transaction)
  {
    let comparison = 0;
    if (a.value < b.value) {
      comparison = 1;
    } else if (a.value > b.value) {
      comparison = -1;
    }
    return comparison;
  }

}