import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from "@angular/material/button";
import { NgForm } from "@angular/forms";


@Component({
    selector: 'remove-manager-dialog',
    styleUrls: ['./remove-manager-dialog.css'],
    templateUrl: './remove-manager-dialog.html',
  })
  export class RemoveManagerDialog {
    email: string = '';
    constructor(
      public dialogRef: MatDialogRef<RemoveManagerDialog>) {}
  
        onYes(){
            this.dialogRef.close(true);
        }

        onNo(){
            this.dialogRef.close(false);
        }

  }