import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvestmentListComponent } from './investment-list/investment-list.component';
import { InvestmentCreateComponent } from './investment-create/investment-create.component';
import { InvestmentDetailsComponent } from './investment-details/investment-details';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
  {path:'login',               component: LoginComponent},
  {path:'signup',              component: SignupComponent},
  {path:'create',              component: InvestmentCreateComponent},
  {path:'list',                component: InvestmentListComponent},
  {path:'house/:investmentId', component: InvestmentDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
