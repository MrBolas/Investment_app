import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule} from "@angular/material/icon";
import { MatTreeModule, MatTree, MatTreeNode } from "@angular/material/tree";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from "@angular/material/card";
import { HttpClientModule } from "@angular/common/http";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from "@angular/material/checkbox";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InvestmentListComponent } from './investment-list/investment-list.component';
import { InvestmentCreateComponent } from './investment-create/investment-create.component';
import { SafePipe } from './safe.pipe';
import { InvestmentDetailsComponent } from './investment-details/investment-details';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InvestmentListComponent,
    InvestmentCreateComponent,
    InvestmentDetailsComponent,
    LoginComponent,
    SignupComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    //MatProgressBarModule,
    MatIconModule,
    MatTreeModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    HttpClientModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCheckboxModule,
    NgxChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
