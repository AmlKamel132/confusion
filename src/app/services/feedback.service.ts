import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Feedback } from '../shared/feedback';
import { ProcessHTTPMsgService } from './process-http-msg.service';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) {}

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    console.log('here in service ... ')
    return this.http
      .post<Feedback>(`${baseURL}feedback`, feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
