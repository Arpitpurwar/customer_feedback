import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AppServiceProvider } from '../../providers/app.service';
import { AlertService } from '../../providers/alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  username: string;
  password: string;
  constructor(
    private router: Router,
    private loginservice: AppServiceProvider,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    // this.loginservice.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() { return this.loginForm.controls; }

  // onSubmit() {
  //   this.submitted = true;

  //   // stop here if form is invalid
  //   if (this.loginForm.invalid) {
  //     return;
  //   }

  //   this.loading = true;
  //   this.loginservice.login(this.f.username.value, this.f.password.value)
  //     .pipe(first())
  //     .subscribe(
  //       data => {

  //         if (data.Error === 'Wrong_Username' || data.Error === 'Wrong_Password') {
  //           this.alertService.error(data.Error);
  //           this.loading = false;
  //         } else {
  //           this.alertService.success('Login Successful', true);
  //           this.router.navigate([this.returnUrl]);
  //         }

  //       },
  //       error => {
  //         this.alertService.error(error);
  //         this.loading = false;
  //       });
  // }
}
