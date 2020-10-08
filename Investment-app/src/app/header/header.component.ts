import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent  {
    private authSub : Subscription;

    userIsAuthenticated = false;
    displayed_username:string = 'Guest';

    constructor( private authService :AuthService, public router: Router ) {}

    ngOnInit(){
        this.userIsAuthenticated = this.authService.getIsAuth();
        if (this.userIsAuthenticated) {
            this.displayed_username = this.authService.getUserEmail();
        }

        this.authSub = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          if (this.userIsAuthenticated) {
              this.displayed_username = this.authService.getUserEmail();
          }else{
              this.displayed_username = 'Guest';
          }
        })
    }

    ngOnDestroy(){
        this.authSub.unsubscribe();
    }

    logout(){
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}