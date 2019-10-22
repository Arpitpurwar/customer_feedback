import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceProvider } from '../../providers/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '..//initiate/initiate.component.css', '..//view-feedback/view-feedback.component.css']
})
export class HomeComponent implements OnInit {
  isDarkTheme = false;

  @Output() touchStart: EventEmitter<string>;
  projectID: string;
  projectName: string;
  AvgRating: any;
  revealClass = 'd-none';
  cardClass = 'd-block';
  pId: any;
  showListData = false;
  results: any = [];
  project;
  viewFeedbackForm: FormGroup;
  projectId;
  projectNAME;
  customer_number;
  status;
  idArray;
  rat = [];
  totalpeople;
  check = 1;
  milestone = [];
  rating = [];
  finalRating = [];
  feedbackArray = [];
  name: any;
  showNoFeedback = false;
  loading = false;
  storedRating = [];
  allAvgRatings = [];
  constructor(private httpClient: HttpClient, private appService: AppServiceProvider, private router: Router) {
    this.viewFeedbackForm = new FormGroup({
      pId: new FormControl(''),
      pMilestone: new FormControl(''),
      pRecipients: new FormControl('')
    });
  }
  ngOnInit() {
    this.loading = true;
    this.appService.getProjectName().subscribe(dataText => {
      localStorage.setItem('projectData', JSON.stringify(dataText));
      this.results = dataText;
      this.displayItems();
      this.project = '';
    });
  }

  onTouchStart(event, value): void {
    this.milestone = [];
    this.projectId = value;
    this.touchStart.emit(event);
    this.project = '';
    this.project += event + ', ' + value;
    this.projectNAME = event;
    this.status = !this.status;
    this.showListData = false;
  }


  displayItem(projectId) {
    this.router.navigate(['view-feedback'], { queryParams: { pId: projectId } });
  }
  details() {
    if (typeof (this.project) === 'object') {
      this.projectID = this.project[1];
    } else {
      const proj = this.project.split(',');
      this.projectID = proj[1];
    }
    this.check = 1;
    this.showNoFeedback = false;
    this.finalRating = [];
    this.feedbackArray = [];
    this.milestone = [];
    this.rating = [];
    this.cardClass = 'd-none';
    this.rat = [];
    this.displayItem(this.projectId);
  }

  displayItems() {
    this.finalRating = [];
    this.feedbackArray = [];
    this.milestone = [];
    this.rating = [];
    this.rat = [];
    let storedRating;
    this.loading = true;
    for (let id = 0; id < this.results.length; id++) {
      this.rating = [];
      this.idArray = this.results;
      this.projectName = this.idArray[id].projectName;
      this.projectId = this.idArray[id].projectId;
      if (this.idArray[id].milestone) {
        for (let i = 0; i < this.idArray[id].milestone.length; i++) { 
          if (this.idArray[id].milestone[i].feedback) {
            for (let k = 0; k < this.idArray[id].milestone[i].feedback.length; k++) {
              storedRating = this.idArray[id].milestone[i].feedback[k].rating;
              this.rating.push(storedRating);
            }
          }
        }
        let total = 0;
        for (let i = 0; i < this.rating.length; i++) {
          total = total + this.rating[i];
        }
        this.customer_number = this.rating.length;
        this.AvgRating = (total / this.rating.length).toFixed(1);
      } else {
        this.AvgRating = 0;
      }
      this.allAvgRatings.push(this.AvgRating);
      this.cardClass = 'd-block';
      this.loading = false;
    }
  }

  roundNumber(number) {
    number = ((number * 100) / this.totalpeople);
    return Math.round(number);

  }
  count(array_count) {
    // Counting numbers in Final rating array
    let letter_Count = 0;
    const obj = {};
    const individualRating = [];
    for (let m = 1; m < 6; m++) {
      for (let position = 0; position < array_count.length; position++) {

        if (array_count[position] === m) {
          letter_Count += 1;
        }
      }
      if (letter_Count !== 0) {
        obj[m] = letter_Count;
        individualRating.push(obj);
        letter_Count = 0;
      }
    }

    return individualRating;
  }

  enterFunction(event) {
    this.showListData = true;
  }




}
