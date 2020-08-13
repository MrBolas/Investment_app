import {Component, OnInit, OnDestroy} from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

import { House } from "../models/house.model";
import { InvestmentService } from '../services/investment.service';
import { Subscription } from 'rxjs';

import {FileTransfer } from "../helper/file_transfer_utils";

@Component({
  selector: 'app-investment-list',
  templateUrl: './investment-list.component.html',
  styleUrls: ['./investment-list.component.css'],
})

export class InvestmentListComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  houses: House[] = [];
  private investmentSub: Subscription;

  constructor(
    public investmentService: InvestmentService,
    private _snackBar: MatSnackBar) {}

  ngOnInit(){
    this.investmentService.getInvestments();
    this.investmentSub = this.investmentService.getInvestmentUpdateListener()
    .subscribe((houses: House[])=>{
      this.houses = houses;
    })
  }

  ngOnDestroy(){
    this.investmentSub.unsubscribe();
  }

  onExportButton(house: House){
    const content_json = JSON.stringify(house);
    const dataURI_json = FileTransfer.generateURI(content_json,'json');
    FileTransfer.downloadFile(dataURI_json, house.name+'_export');
    this.displaySnackBar('House '+house.name+' exported.')  
  }

  onDeleteButton(house:House){
    // Add confirmation button
    this.investmentService.deleteInvestment(house);
    this.displaySnackBar('House '+house.name+' deleted.')  
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