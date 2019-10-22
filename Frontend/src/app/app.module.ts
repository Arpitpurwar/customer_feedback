import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { ConfigureComponent } from './components/configure/configure.component';
import { InitiateComponent } from './components/initiate/initiate.component';
import { ViewFeedbackComponent } from './components/view-feedback/view-feedback.component';
import { SendFeedbackComponent } from './components/send-feedback/send-feedback.component';
import { AppServiceProvider } from './providers/app.service';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AppMaterialModule } from './app-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
  MatCardModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { FilterPipe } from './providers/filterPipe';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
// import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AlertService } from './providers/alert.service';
import { AuthGuard } from './_guards/auth.guard';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AlertComponent } from './components/alert/alert.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule, MatOptionModule, MatGridListModule, MatProgressBarModule, MatSliderModule,
  MatSlideToggleModule, MatMenuModule, MatSelectModule, MatRadioModule, MatTabsModule } from '@angular/material';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConfigureComponent,
    InitiateComponent,
    ViewFeedbackComponent,
    SendFeedbackComponent,
    FilterPipe,
    // LoginComponent,
    RegisterComponent,
    ToolbarComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // AppMaterialModule,
    NoopAnimationsModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatDialogModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    routing,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatOptionModule,
    MatGridListModule,
    MatProgressBarModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    RichTextEditorAllModule
  ],

  exports: [
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatChipsModule, MatOptionModule, MatGridListModule,
    MatProgressBarModule, MatSliderModule, MatSlideToggleModule, MatMenuModule, MatDialogModule, MatSnackBarModule,
    MatSelectModule, MatInputModule, MatSidenavModule, MatCardModule, MatIconModule,
    MatRadioModule, MatProgressSpinnerModule, MatTabsModule, MatListModule
  ],

  providers: [AppServiceProvider, AlertService, DatePipe, AuthGuard, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
