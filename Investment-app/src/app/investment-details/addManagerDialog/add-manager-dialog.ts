import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from "@angular/forms";


@Component({
    selector: 'add-manager-dialog',
    styleUrls: ['./add-manager-dialog.css'],
    templateUrl: './add-manager-dialog.html',
  })
  export class AddManagerDialog {
    email: string = '';
    constructor(
      public dialogRef: MatDialogRef<AddManagerDialog>) {}
  
      onSaveForm( form: NgForm){
        
        if (form.invalid) {
            throw new Error('Invalid form.')
        }
        this.dialogRef.close(form.value.email);
      }
  }