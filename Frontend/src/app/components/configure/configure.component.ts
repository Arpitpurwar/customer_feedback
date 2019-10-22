import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Configuration } from '../../interface/configurationService';
import { DatePipe } from '@angular/common';
import { AppServiceProvider } from '../../providers/app.service';
import { MatSnackBar } from '@angular/material';
import { resetFakeAsyncZone } from '@angular/core/testing';
import * as globals from '../../../assets/global';
import { AlertService } from '../../providers/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css', '..//initiate/initiate.component.css']
})
export class ConfigureComponent implements OnInit {

  pTeam = new FormControl('', [Validators.required]);
  teamName = ['Digital TAC', 'UI Garage', 'SAP Garage'];
  configureForm: FormGroup;
  obj: Configuration;
  obj2 = {};
  options: FormGroup;
  projectData;
  oldID;
  action: string;
  display: boolean;
  loading = false;
  constructor(fb: FormBuilder, private datePipe: DatePipe, private appService: AppServiceProvider,
    public snackBar: MatSnackBar, private alertService: AlertService, private router: Router) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
    this.loading = true;
    this.configureForm = new FormGroup({
      pName: new FormControl(''),
      pId: new FormControl(''),
      pDesc: new FormControl(''),
      pTeam: new FormControl('')
    });
    this.appService.getProjectName().subscribe(dataText => {
      localStorage.setItem('projectData', JSON.stringify(dataText));
      this.projectData = dataText;
      this.loading = false;
    });
    if (globals.initData !== null || globals.initData !== undefined) {
    }
  }

  saveData() {
    const pId = this.configureForm.controls.pId.value;
    this.projectData.filter((project) => {
      if (project.projectId === pId) {
        this.oldID = true;
      }
    });
    this.obj2 = {
      'projectId': this.configureForm.controls.pId.value,
      'projectName': this.configureForm.controls.pName.value,
      'date': this.datePipe.transform(new Date(), 'dd-MM-yyyy'),
      'team': this.configureForm.controls.pTeam.value,
      'description': this.configureForm.controls.pDesc.value
    };
    this.obj = <Configuration>this.obj2;

    if (!this.oldID) {
      this.loading = true;
      this.appService.postConfigData(this.obj).subscribe(data => {
        
        if (data !== null && data !== undefined) {
          // window.location.reload();
          this.loading = false;
          if(this.loading===false) {
            this.resetForm();
          }
        }
        this.alertService.success('Project has been configured successfully', true);
      });         
      
    } else {
      this.alertService.info('The project ID you have entered is already configured. Please reset your form and try with another request.',
      true);
    }
  }
  resetForm() {
    this.configureForm.reset();
    this.alertService.success('Feedback Form Resetted', true);
  }
  goBack(){
    this.router.navigate(['/']);
  }
}

