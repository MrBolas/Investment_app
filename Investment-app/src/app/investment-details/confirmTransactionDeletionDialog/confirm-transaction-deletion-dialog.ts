import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from "@angular/material/button";
import { NgForm } from "@angular/forms";


@Component({
    selector: 'confirm-transaction-deletion-dialog',
    styleUrls: ['./confirm-transaction-deletion-dialog.css'],
    templateUrl: './confirm-transaction-deletion-dialog.html',
  })
  export class ConfirmTransactionDeletionDialog {
    constructor(
      public dialogRef: MatDialogRef<ConfirmTransactionDeletionDialog>) {}
  
        onYes(){
            this.dialogRef.close(true);
        }

        onNo(){
            this.dialogRef.close(false);
        }

  }