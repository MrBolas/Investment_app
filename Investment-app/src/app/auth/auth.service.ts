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

    constructor(private http: HttpClient, private router: Router) {

        const user_local_saved_data = localStorage.getItem('user_data');
        if (user_local_saved_data) {
            const user_data = JSON.parse(user_local_saved_data);
            this.user_email = user_data.email;
            this.token = user_data.token;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
        }
    }

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
            this.router.navigate(['/list']);
        })
    }

    login(email: string, password: string){
        const authData: AuthData = {email: email, password: password};
        this.user_email = authData.email;
        this.http.post<{token: string}>(environment.apiUrl+"/api/user/login", authData)
        .subscribe(response => {
            this.token = response.token;
            if (this.token) {
                const user_data = 
                {
                    email: this.user_email, 
                    token: this.token
                }
                localStorage.setItem('user_data', JSON.stringify(user_data));
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
        localStorage.removeItem('user_data');
        this.router.navigate(['/']);
    }
}