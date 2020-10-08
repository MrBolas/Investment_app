import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { Transaction } from '../../models/transaction.model';

@Component({
    selector: 'edit-transaction-dialog',
    styleUrls: ['./edit-transaction-dialog.css'],
    templateUrl: './edit-transaction-dialog.html',
  })
  export class EditTransactionDialog {
    transaction:Transaction;

    date:Date;
    value:number;
    description:string;
    additional_information:string;
    pipe = new DatePipe('en-US');
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditTransactionDialog>) 
      {    }
  
      ngOnInit(){
        //console.log(this.data); //imported data
        this.transaction = this.data.transaction;

        this.date = this.transaction.date;
        this.value = this.transaction.value;
        this.description = this.transaction.description;
        this.additional_information = this.transaction.additional_information;
      }


      onSaveForm( form: NgForm){
        
        if (form.invalid) {
            throw new Error('Invalid form.')
        }

        this.transaction.date = new Date(this.date);
        this.transaction.date_string = this.pipe.transform(this.date, 'fullDate'),
        this.transaction.value = Number(this.value);
        this.transaction.description = this.description;
        this.transaction.additional_information = this.additional_information;

        this.dialogRef.close(this.transaction);
      }
  }