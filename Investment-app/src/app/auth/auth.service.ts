import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

@Injectable({providedIn: "root"})


export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private user_email: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken(){
        return this.token;
    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    getUserEmail(){
        return this.user_email;
    }

    createUser(email: string, password: string){
        const authData: AuthData = {email: email, password: password};
        this.http.post(environment.apiUrl+"/api/user/signup", authData)
        .subscribe(response => {
            this.token = response['user'].token;
        })
    }

    login(email: string, password: string){
        const authData: AuthData = {email: email, password: password};
        this.user_email = authData.email;
        this.http.post<{token: string}>(environment.apiUrl+"/api/user/login", authData)
        .subscribe(response => {
            this.token = response.token;
            console.log(this.token)
            if (this.token) {
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.router.navigate(['/list']);
            }
        })
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
    }
}