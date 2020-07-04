import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvestmentListComponent } from './investment-list/investment-list.component';
import { InvestmentCreateComponent } from './investment-create/investment-create.component';
import { InvestmentDetailsComponent } from './investment-details/investment-details';

const routes: Routes = [
  {path:'create', component: InvestmentCreateComponent},
  {path:'list', component: InvestmentListComponent},
  {path:'house/:investmentId', component: InvestmentDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
