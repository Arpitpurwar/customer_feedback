import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppServiceProvider } from '../../providers/app.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as globals from '../../../assets/global';
import * as CryptoJS from 'crypto-js';
import { AlertService } from '../../providers/alert.service';

@Component({
  selector: 'app-send-feedback',
  templateUrl: './send-feedback.component.html',
  styleUrls: ['./send-feedback.component.css', '..//initiate/initiate.component.css']
})
export class SendFeedbackComponent implements OnInit {
  date;
  showElement = true;
  hideElement = false;
  feedbackHeader;
  expired = false;
  already = false;
  showdata;
  projectName;
  milestone;
  team;
  action: string;
  sendFeedbackForm: FormGroup;
  user;
  projectId;
  ratingObject;
  taskArray;
  param1;
  param2;
  param3;
  param4;
  param5;
  check = false;
  loading = false;
  name: any;
  email_content;
  other: any;
  
  constructor(private appService: AppServiceProvider, private datePipe: DatePipe, private httpClient: HttpClient,
    public snackBar: MatSnackBar, private route: ActivatedRoute, private alertService: AlertService) { }
  ratingCtrl = new FormControl(null, Validators.required);

  ngOnInit() {
    this.loading = true;
    this.sendFeedbackForm = new FormGroup({
      comments: new FormControl(''),
      stars: new FormControl(null, Validators.required)
    });
    let decode = decodeURIComponent(this.route.snapshot.queryParams['r']);
    let decrypted = JSON.parse(CryptoJS.AES.decrypt(decode.trim(), 'hello').toString(CryptoJS.enc.Utf8));
    this.param1 = decrypted['user'];
    this.param2 = decrypted['projectId'];
    this.param3 = decrypted['milestone']['id'];
    this.param4 = decrypted['name'];
    this.param5 = decrypted['email_content'];
    this.date = 'date=' + this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    const newDate = 'date=20-11-2018';
    // this.initData = JSON.parse(sessionStorage.getItem('initData'));
    this.appService.expireAlreadyData(this.param1, this.param2, this.param3).subscribe(data => {
      if (data.already === true) {
        this.already = true;
      } 
      else if(data.expire === true) {
        this.expired = true;
      }
      else{
        
        this.showdata = true;
        this.user = this.param1;
        this.projectId = this.param2;
        this.milestone = data.milestone;
        this.projectName = data.projectName;
        this.team = data.team;
        this.name = this.param4;
        this.email_content = data.email_content;
        }
      this.loading = false;
    });
  }

  openSave() {
    // this.appService.expireAlreadyData(this.param1, this.param2, this.param3).subscribe(data => {
    //   if (data.already === true) {
    //     this.check = true;
    //   }
    // });
    if (!this.check) {
      const mName = this.milestone;
      let mId;
      this.httpClient.get('./assets/task.json').subscribe(data => {
        this.taskArray = data[0]['projectM'];
        this.other = data[0]['Others'];
        [...this.taskArray, ...this.other].filter((milestone) => {
          if (mName === milestone.name) {
            mId = milestone.id;
          }
        });

        this.ratingObject = {
          'projectId': this.projectId,
          'milestone': {
            'id': mId,
            'name': mName
          },
          'rating': parseInt(this.sendFeedbackForm.controls.stars.value),
          'comment': this.sendFeedbackForm.controls.comments.value,
          'submit_date': new Date(),
          'user': this.user
        };
        this.appService.postSendFeedback(this.ratingObject).subscribe((res) => {
        });
        this.sendFeedbackForm.reset();
        this.showElement = false;
        this.hideElement = true;
      });
    }
  }

  openReset() {
    this.alertService.info('Feedback Form Resetted', true);
    this.sendFeedbackForm.reset();
    this.ratingCtrl.reset();
  }


}




