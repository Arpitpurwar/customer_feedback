import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { FormControl, FormArray } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Configuration } from '../../interface/configurationService';
import { DatePipe } from '@angular/common';
import { AppServiceProvider } from '../../providers/app.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY } from '@angular/material';
import { EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { AlertService } from '../../providers/alert.service';
import { COMMA, ENTER, SEMICOLON, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent, ErrorStateMatcher } from '@angular/material';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';
import * as globals from '../../../assets/global';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { Router } from '@angular/router';



export interface User {
  name: string;
}

export interface Emaildata {
  name: string;
}

export interface Template {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-initiate',
  templateUrl: './initiate.component.html',
  styleUrls: ['./initiate.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class InitiateComponent implements OnInit {
  category: Template[] = [
    { value: 'project', viewValue: 'Project' },
    { value: 'others', viewValue: 'Others' },

  ];

  editorvalue;
  milestoneName = "your Milestone";

  public otherValue: string = `<div style="font-family:Roboto;font-size: 16px; text-align: left;">
  <p >Hope you had a great experience with TAC Factories and Garages.</p>
  <p>We would like to hear about your experience with us. Please take out a few minutes to share your thoughts.</p>
  </div>`;

  public tools: object = {
    items: ['Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
  };
  public quickTools: object = {
    image: [
      'Replace', 'Align', 'Caption', 'Remove', 'InsertLink', '-', 'Display', 'AltText', 'Dimension']
  };

  recipientArray: FormArray;
  showrecipientError = true;
  recipientEmail: Emaildata[] = [];
  recipientEmailArray: string[][] = [];
  recipientNameValue: any[] = [];
  recipientEmailValue: any[] = [];
  nullValidator = /^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/;
  validationExpression = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
  multipleEmailValidation = /^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4})(,[\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4}){0,4}$/;
  // emailValidation = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  emValue: string;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE, SEMICOLON];
  // emaildatas: any[] = [];
  emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  showelement = true;
  hideElement = false;
  passingemail: any[] = [];
  milestoneMsg = 'Milestones are completed';
  initiateForm: FormGroup;
  // sendEmailData = {};
  initiateFeedbackData = {};
  showListData = false;
  results;
  pId: FormControl;
  projectId;
  projectName;
  projectData;
  status;
  project = ' ';
  taskArray;
  other;
  storedId = [];
  updatedmilestone = [];
  value;
  removable = true;
  loading = false;
  accountValidationMessages = {
    'emailId': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ]

  };

  @Output() touchStart: EventEmitter<string>;
  recpArray: any[];
  recpNameArray: any[];
  recpEmailArray: any[];

  constructor(private dialog: MatDialog, private datePipe: DatePipe, private appService: AppServiceProvider,
    public snackBar: MatSnackBar, private httpClient: HttpClient, private alertService: AlertService,
    private _fb: FormBuilder, private router: Router) {
    this.touchStart = new EventEmitter<string>();
  }
  ngOnInit() {
    this.initiateForm = this._fb.group({

      pId: [''],
      pMilestone: [''],
      pRecipients: [''],
      allRecipients: this._fb.array([
        this._fb.group({
          name: ['', [Validators.required, Validators.pattern(this.nullValidator)]],
          emailId: ['', [Validators.compose([
            Validators.required,
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
          ])]]
        })
      ]),
      mailContent: [''],
      otherCategory: [''],
      templateCategory: ['']
    });
    this.recipientEmailArray.push([]);

    this.projectData = JSON.parse(localStorage.getItem('projectData'));
    this.httpClient.get('./assets/task.json').subscribe(data => {
      this.taskArray = data[0]['projectM'];
      this.other = data[0]['Others'];
      this.project = '';
      this.initiateForm.controls.pId.valueChanges.subscribe(result => {
        this.project = result;
      });

    });
    this.milestoneName = this.initiateForm.controls.pMilestone.value;
  }


  addRecipient(): void {
    this.recipientArray = this.initiateForm.get('allRecipients') as FormArray;
    if (this.recipientArray.length < 10) {

      this.recipientArray.push(this._fb.group({
        name: ['', [Validators.required]],
        emailId: ['', [Validators.required, Validators.pattern(this.multipleEmailValidation)]]
      }));
      this.recipientEmailArray.push([]);
      console.log('this.recipientEmailArray', this.recipientEmailArray);
    } else {
      this.showrecipientError = false;
    }
  }

  removeRecipient(index: number) {
    this.recipientArray.removeAt(index);
    if (index !== -1) {
      this.recipientEmailArray.splice(index, 1);
    }
    this.showrecipientError = true;
  }
  completed() {
    if (this.updatedmilestone && this.updatedmilestone.length) {
      return false;
    } else {
      this.milestoneMsg;
      return true;
    }
  }

  call() {
    this.updatedmilestone = [];
    let projectID;
    if (this.project != null && this.project !== undefined && this.project !== '') {
      if (typeof (this.project) === 'object') {
        projectID = this.project[1];
      } else {
        const proj = this.project.split(', ');
        projectID = proj[1];
      }
      if (projectID != null && projectID !== undefined && projectID !== '') {
        this.appService.getId(projectID).subscribe(data => {
          if (data[0].milestone) {
            this.storedId = data[0].milestone.map(function (item) {
              return item['id'];
            });
          } else {
            this.storedId = [];
          }
          if (this.storedId && this.storedId.length) {
            for (let i = 0; i < this.taskArray.length; i++) {
              if (!this.storedId.includes(this.taskArray[i].id)) {
                this.updatedmilestone.push({ 'id': this.taskArray[i].id, 'name': this.taskArray[i].name });
              }
            }
          } else {
            for (let i = 0; i < this.taskArray.length; i++) {
              this.updatedmilestone.push({ 'id': this.taskArray[i].id, 'name': this.taskArray[i].name });
            }
          }
        });
      }
    }
  }
  /**
   * Displaying drop down when customer enters the three letters of destination.
   * @param event the letters that being entered by customer
   */
  // enterFunction(event) {
  //   this.showListData = true;
  // }

  /**
    *  Selecting of country can be done using touch.
    @param event This is city name selected by the customer
    @param value This is the identifier of the city selected by customer
    */
  onTouchStart(event, value): void {
    this.projectId = value;
    this.touchStart.emit(event);
    this.project = '';
    this.project += event + ', ' + value;
    this.status = !this.status;
    this.showListData = false;
  }
  recpName: string;
  recpEmail: string;

  initiateData() {
    // console.log(this.initiateForm.controls['allRecipients']['controls'][0]['controls']['name'].value)
    console.log(this.initiateForm.controls.mailContent.value);
    let allRecp = this.initiateForm.controls['allRecipients']['controls'];
    this.recpArray = [];
    this.recpNameArray = [];
    this.recpEmailArray = [];
    for (let i = 0; i < allRecp.length; i++) {
      this.recpName = allRecp[i]['controls'].name.value;
      this.recpEmail = allRecp[i]['controls'].emailId.value;
      console.log(this.recpName + this.recpEmail)
      this.recpArray[i] = this.recpName + this.recpEmail;
      this.recpNameArray[i] = this.recpName;
      this.recpEmailArray[i] = this.recpEmail;
    }

    let milestoneName = this.initiateForm.controls.pMilestone.value;
    const otherName = this.initiateForm.controls.otherCategory.value;
    if (this.project != null) {
      var proj = this.project.split(', ');
    }
    this.projectId = proj[1];
    this.projectName = proj[0];
    let milestoneId;
    let milestone_name;
    // let otherId;
    this.loading = true;
    this.httpClient.get('./assets/task.json').subscribe(data => {
      this.taskArray = data[0]['projectM'];
      this.other = data[0]['Others'];
      // this.taskArray.filter((milestone) => {
      [...this.taskArray, ...this.other].filter((milestone) => {
        if (milestone.name === milestoneName || milestone.name === otherName) {
          milestoneId = milestone.id;
          milestone_name = milestone.name;
        }
      });
      const rec = this.initiateForm.controls.pRecipients.value;
      const projId = this.projectId;
      let team;
      this.projectData.filter((proj) => {
        if (proj.projectId === projId) {
          team = proj.team;
        }
      });
      this.initiateFeedbackData = {
        'projectId': this.projectId,
        'projectName': this.projectName,
        'milestone': {
          'id': milestoneId,
          'name': milestone_name,
          'initDate': this.datePipe.transform(new Date(), 'dd-MM-yyyy')
        },
        'recipient': {
          'milestoneid': milestoneId,
          'user': this.recpEmailArray,
          'name': this.recpNameArray,
        },
        'email_content': this.initiateForm.controls.mailContent.value,
        'team': team
      };

      globals.initData.push({
        'projectId': this.projectId,
        'projectName': this.projectName,
        'milestone': {
          'id': milestoneId,
          'name': milestone_name
        },
        'user': this.recpEmailArray,
        'name': this.recpNameArray,
        'initDate': this.datePipe.transform(new Date(), 'dd-MM-yyyy')
      });
      // this.appService.postEmail(this.sendEmailData).subscribe(email => {
      this.appService.postInitiateData(this.initiateFeedbackData).subscribe(data => {
        this.loading = false;
        if (this.loading === false) {
          this.initiateForm.reset();
          this.value = '';
        }
      });
      // })

    });
    this.alertService.success('Feedback Form Successfully Initiated', true);
  }

  resetForm() {
    this.initiateForm.reset();
    this.alertService.success('Feedback Form Resetted', true);
  }

  show() {
    this.showelement = false;
    this.hideElement = true;
  }


  emailId = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    return this.emailId.hasError('required') ? 'You must enter a value' :
      this.emailId.hasError('email') ? 'Not a valid email' :
        '';
  }

  milestoneSelected(event) {
    this.milestoneName = event.value;
    console.log(this.milestoneName);
    if (this.initiateForm.value.templateCategory === 'project') {
      if (this.milestoneName !== '') {
        this.editorvalue = this.createNewEditor(this.milestoneName);
      } else {
        this.editorvalue = this.createNewEditor('');
      }
    } else {
      this.editorvalue = this.otherValue;
    }
  }

  onCategory() {
    if (this.initiateForm.value.templateCategory === 'project') {
      if (this.milestoneName !== '') {
        this.editorvalue = this.createNewEditor(this.milestoneName);
      } else {
        this.editorvalue = this.createNewEditor('');
      }
    } else {
      this.editorvalue = this.otherValue;
    }
  }

  createNewEditor(milestoneName) {
    const projectValue = `<div style="font-family:Roboto;font-size: 16px; text-align: left;">
  <p >The project has reached the ${milestoneName} milestone</p>
  <p>We would like to hear from you how we performed. Please take out a few minutes to share your thoughts.</p>
  </div>`;
    return projectValue;
  }
  goBack(){
    this.router.navigate(['/']);
  }
}
