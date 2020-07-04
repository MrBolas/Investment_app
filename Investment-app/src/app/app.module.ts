import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule} from "@angular/material/icon";
import { MatTreeModule, MatTree, MatTreeNode } from "@angular/material/tree";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from "@angular/material/card";
import { HttpClientModule } from "@angular/common/http";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InvestmentListComponent } from './investment-list/investment-list.component';
import { InvestmentCreateComponent } from './investment-create/investment-create.component';
import { SafePipe } from './safe.pipe';
import { InvestmentDetailsComponent } from './investment-details/investment-details';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InvestmentListComponent,
    InvestmentCreateComponent,
    InvestmentDetailsComponent,
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
    MatFormFieldModule,
    MatCardModule,
    HttpClientModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
