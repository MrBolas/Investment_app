import {Component, OnInit, OnDestroy} from '@angular/core';

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

  constructor(public investmentService: InvestmentService) {}

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
    const content = JSON.stringify(house);
    const dataURI = FileTransfer.generateURI(content,'json')
    FileTransfer.downloadFile(dataURI, house.name+'_export');
  }

}