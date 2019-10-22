import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interface/register';
// import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

@Injectable()
export class AppServiceProvider {
    public pageData = new BehaviorSubject<any[]>([]);
    baseApiUrl = 'https://customerfeedback.eu-gb.mybluemix.net';
    // baseApiUrl = 'http://localhost:4000';
    constructor(private httpClient: HttpClient) { }
    /**
     * If project is configured the data will be stored in database
     * @param data refers to the submitted form data which is used as the input payload for the configuration service
     */
    postConfigData(data): Observable<any> {
        const url = this.baseApiUrl + '/config';
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.httpClient.post(url, data, httpOptions);
    }
    /**
     * Fetch data from configuration service
     */
    // getConfigData(): Observable<any> {
    //     const url = this.baseApiUrl + '/second';
    //     return this.httpClient.get<any>(url);
    // }
    /**
     * Fetch data from Expiry service
     * @param date refers to the date when the link is openend
     */

    expireAlreadyData(user, projectId, milestone): Observable<any> {
        const url = this.baseApiUrl + '/expiresUrl?' + 'user=' + user + '&projectId=' + projectId + '&milestoneId=' + milestone;
        return this.httpClient.get<any>(url);
    }
    getId(projectId): Observable<any> {
        const url = this.baseApiUrl + '/view' + '?' + '&projectId=' + projectId;
        return this.httpClient.get<any>(url);
    }
    /**
     * Initiates feedback request for a particular milestone of a project
     * @param data refers to the submitted form data which is used as the input payload for the initiate service
     */
    postInitiateData(data): Observable<any> {
        const url = this.baseApiUrl + '/initiate';
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.httpClient.post(url, data, httpOptions);
    }
    /**
     * Fetch Project ID and Project Name from database
     */
    getProjectName(): Observable<any> {
        const url = this.baseApiUrl + '/getdata';
        return this.httpClient.get<any>(url);
    }
    postEmail(data): Observable<any> {
        const url = this.baseApiUrl + '/mail';
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.httpClient.post(url, data, httpOptions);
    }
    postSendFeedback(data): Observable<any> {
        const url = this.baseApiUrl + '/feedback';
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.httpClient.post(url, data, httpOptions);
    }
    register(user: User): Observable<any> {
        const url = this.baseApiUrl + '/register';
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.httpClient.post(url, user, httpOptions);
    }

    // login(username: string, password: string) {
    //     const url = this.baseApiUrl + '/login';
    //     const httpOptions = {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json'
    //         })
    //     };
    //     return this.httpClient.post<any>(url, { username: username, password: password }, httpOptions)
    //         .pipe(map(user => {
    //             // login successful if there's a jwt token in the response
    //             if (user) {
    //                 // store user details and jwt token in local storage to keep user logged in between page refreshes
    //                 localStorage.setItem('currentUser', JSON.stringify(user));
    //             }

    //             return user;
    //         }));
    // }

    // logout() {
    //     // remove user from local storage to log user out
    //     localStorage.removeItem('currentUser');
    // }

}
