import {Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from "@angular/material/snack-bar";

import { House } from "../models/house.model";
import { InvestmentService } from '../services/investment.service';
import { Subscription } from 'rxjs';

import {FileTransfer } from "../helper/file_transfer_utils";
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-investment-list',
  templateUrl: './investment-list.component.html',
  styleUrls: ['./investment-list.component.css'],
})

export class InvestmentListComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  houses: House[] = [];
  userIsAuthenticated = false;
  private investmentSub: Subscription;
  private authSub: Subscription;

  constructor(
    public investmentService: InvestmentService,
    private authenticationService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar) {}

  ngOnInit(){
    this.userIsAuthenticated = this.authenticationService.getIsAuth();
    this.authSub = this.authenticationService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

    if (!this.userIsAuthenticated) {
      this.router.navigate(['/login']);
    }

    this.investmentService.getInvestments();
    this.investmentSub = this.investmentService.getInvestmentUpdateListener()
    .subscribe((houses: House[])=>{
      this.houses = houses;
    })
  }

  ngOnDestroy(){
    this.investmentSub.unsubscribe();
    this.authSub.unsubscribe();
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