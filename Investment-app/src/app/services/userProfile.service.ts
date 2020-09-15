import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";

import { UserProfile } from "../models/userProfile.model";

@Injectable({providedIn: 'root'})
export class UserProfileService{
    private userProfile: UserProfile;
    private userProfileUpdated = new Subject<UserProfile>();

    constructor(private http: HttpClient, private router: Router){ }

    getUserProfileUpdateListener(){
        return this.userProfileUpdated.asObservable();
    }

    getUserProfile()
    {
        return this.userProfile;
    }

    getLatestUserProfile()
    {
        this.http.get<{message: string, userProfile: UserProfile}>(environment.apiUrl+'/api/user/me')
        .subscribe( response => {
            console.log('latest response ')
            console.log(response)
            this.userProfile = response.userProfile;
            this.userProfileUpdated.next(response.userProfile);
        })
    }
    
    updateUserProfile(updatedUserProfile: UserProfile)
    {
        this.http.put(environment.apiUrl+'/api/user/me', updatedUserProfile)
        .subscribe(response => {
            console.log('update response '+response)
            this.userProfile = response['userProfile'];
        })
    }
}