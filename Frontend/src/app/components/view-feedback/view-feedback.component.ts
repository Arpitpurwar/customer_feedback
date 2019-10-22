import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceProvider } from '../../providers/app.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-view-feedback',
    templateUrl: './view-feedback.component.html',
    styleUrls: ['./view-feedback.component.css']
})
export class ViewFeedbackComponent implements OnInit {
    @Output() touchStart: EventEmitter<string>;
    projectID: string;
    projectName: string;
    AvgRating: any;
    sysDate: any;
    comments: string[];
    entertext;
    revealClass = 'd-none';
    cardClass = 'd-block';
    pId: any;
    showListData = false;
    totalResult;
    results: any = [];
    project;
    viewFeedbackForm: FormGroup;
    projectId;
    projectNAME;
    customer_number;
    status;
    taskArray;
    idArray;
    rat = [];
    totalpeople;
    check = 1;
    milestone = [];
    rating = [];
    finalRating = [];
    feedbackArray = [];
    submit_date;
    name: any;
    subpleas: any;
    width: any;
    showNoFeedback = false;
    allRatings = [];
    storedRating = [];
    allAvgRatings = [];
    loading = false;
    constructor(private httpClient: HttpClient, private appService: AppServiceProvider, private route: ActivatedRoute, private router: Router) {
        this.touchStart = new EventEmitter<string>();
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.projectId = params.pId;
        });
        this.displayItem(this.projectId);
        this.viewFeedbackForm = new FormGroup({
            pId: new FormControl(''),
            pMilestone: new FormControl(''),
            pRecipients: new FormControl('')
        });
        this.width = 45;
        this.appService.getProjectName().subscribe(dataText => {
            this.results = dataText;
            this.project = '';
            this.viewFeedbackForm.controls.pId.valueChanges.subscribe(result => {
                this.project = result;
                if (this.project === '') {
                    this.revealClass = 'd-none';
                }
            });
            this.httpClient.get('./assets/task.json').subscribe(data => {
                this.taskArray = data;
            });
            // for (var prop in this.results) {
            //     this.resultsfunction(this.results[prop].projectId);
            // }
        });

    }

    // resultsfunction(id) {
    //     var storedRating;

    //     this.appService.getId(id).subscribe(data => {
    //         this.idArray = data;
    //         if (this.idArray[0].milestone) {
    //             for (let i = 0; i < this.idArray[0].milestone.length; i++) {
    //                 this.milestone.push(this.idArray[0].milestone[i]);

    //                 if (this.milestone[i].feedback) {
    //                     this.check = 0;
    //                     storedRating = this.milestone[i].feedback.map(function (item) {
    //                         return item['rating'];
    //                     });
    //                     this.rating.push(storedRating);

    //                 }
    //             }

    //         }
    //         for (let j = 0; j < this.rating.length; j++) {
    //             Array.prototype.push.apply(this.finalRating, this.rating[j]);
    //         }
    //         let total = 0;
    //         for (let i = 0; i < this.finalRating.length; i++) {
    //             total = total + this.finalRating[i];
    //         }

    //         this.customer_number = this.finalRating.length;
    //         this.AvgRating = (total / this.finalRating.length).toFixed(1);
    //     });
    // }


    details() {
        if (typeof (this.project) === 'object') {
            this.projectID = this.project[1];
        } else {
            let proj = this.project.split(', ');
            this.projectID = proj[1];
        }
        this.check = 1;
        this.showNoFeedback = false;
        this.finalRating = [];
        this.feedbackArray = [];
        this.milestone = [];
        this.rating = [];
        this.revealClass = 'd-block';
        this.cardClass = 'd-none';
        this.rat = [];
        this.displayItem(this.projectID);

    }

    displayItem(projectId) {
        this.check = 1;
        this.showNoFeedback = false;
        this.finalRating = [];
        this.feedbackArray = [];
        this.milestone = [];
        this.rating = [];
        this.revealClass = 'd-block';
        this.cardClass = 'd-none';
        this.rat = [];
        let storedRating;
        this.loading = true;
        this.appService.getId(projectId).subscribe(data => {
            this.idArray = data;
            this.projectName = this.idArray[0].projectName;
            this.projectId = this.idArray[0].projectId;
            if (this.idArray[0].milestone) {
                for (let i = 0; i < this.idArray[0].milestone.length; i++) {
                    this.milestone.push(this.idArray[0].milestone[i]);

                    if (this.milestone[i].feedback) {
                        this.check = 0;
                        storedRating = this.milestone[i].feedback.map(function (item) {
                            return item['rating'];
                        });
                        for (let j = 0; j < this.milestone[i].feedback.length; j++) {
                            this.milestone[i].feedback[j]['milestoneName'] = this.milestone[i].name;
                        }
                        this.feedbackArray = this.feedbackArray.concat(this.milestone[i].feedback);


                        this.rating.push(storedRating);
                    }
                }
                if (this.check === 1) {
                    this.showNoFeedback = true;
                    this.revealClass = 'd-none';
                } else {
                    this.feedbackArray.sort((a, b) => {
                        return new Date(b['submit_date']).getTime() - new Date(a['submit_date']).getTime();
                    });
                    for (let j = 0; j < this.rating.length; j++) {

                        Array.prototype.push.apply(this.finalRating, this.rating[j]);
                    }
                    var abc = this.rating[0].concat(this.rating[1]);

                    var value1 = typeof (this.count(this.finalRating)[0][1]) === 'undefined' ? 0 : this.count(this.finalRating)[0][1];
                    var value2 = typeof (this.count(this.finalRating)[0][2]) === 'undefined' ? 0 : this.count(this.finalRating)[0][2];
                    var value3 = typeof (this.count(this.finalRating)[0][3]) === 'undefined' ? 0 : this.count(this.finalRating)[0][3];
                    var value4 = typeof (this.count(this.finalRating)[0][4]) === 'undefined' ? 0 : this.count(this.finalRating)[0][4];
                    var value5 = typeof (this.count(this.finalRating)[0][5]) === 'undefined' ? 0 : this.count(this.finalRating)[0][5];

                    var middle = [value1, value2, value3, value4, value5];

                    this.totalpeople = middle.reduce((total, num) => {
                        return total + num;
                    });
                    this.rat = [this.roundNumber(middle[0]), this.roundNumber(middle[1]),
                    this.roundNumber(middle[2]), this.roundNumber(middle[3]), this.roundNumber(middle[4])];

                    let total = 0;
                    for (let i = 0; i < this.finalRating.length; i++) {

                        total = total + this.finalRating[i];

                    }
                    this.customer_number = this.finalRating.length;
                    this.AvgRating = (total / this.finalRating.length).toFixed(1);
                }
            } else {
                this.showNoFeedback = true;
                this.revealClass = 'd-none';
            }
            this.loading = false;
        }
        );
    }
    roundNumber(number) {
        number = ((number * 100) / this.totalpeople);
        return Math.round(number);

    }
    count(array_count) {
        // Counting numbers in Final rating array
        var letter_Count = 0;
        var obj = {};
        var individualRating = [];
        for (var m = 1; m < 6; m++) {
            for (var position = 0; position < array_count.length; position++) {

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
    goBack(){
        this.router.navigate(['/']);
      }
}

