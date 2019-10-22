import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SendFeedbackComponent } from './components/send-feedback/send-feedback.component';
// import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InitiateComponent } from './components/initiate/initiate.component';
import { ConfigureComponent } from './components/configure/configure.component';
import { ViewFeedbackComponent } from './components/view-feedback/view-feedback.component';
import { AlertComponent } from './components/alert/alert.component';
import { AuthGuard } from './_guards/auth.guard';
const routes: Routes = [

    { path: 'send', component: SendFeedbackComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'initiate', component: InitiateComponent },
    { path: 'configure', component: ConfigureComponent },
    { path: 'view-feedback', component: ViewFeedbackComponent },
    // { path: 'login', component: LoginComponent },
    { path: 'alert', component: AlertComponent },
    // { path: 'home', component: HomeComponent},

    // { path: '', redirectTo: 'home', pathMatch: 'full' }
    { path: '', component: HomeComponent, pathMatch: 'full' }
];

export const routing = RouterModule.forRoot(routes, { useHash: true });
