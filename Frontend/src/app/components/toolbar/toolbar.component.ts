import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  hideElement = false;
  // showElement = true;
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if ((event.url !== '/') && (event.url !== '/home') && (event.url !== '/configure') && (event.url !== '/initiate')) {
          this.hideElement = true;
          // this.showElement = false;
        } else {
          this.hideElement = false;
          // this.showElement = true;
        }
      }
    });

  }

  ngOnInit() {
  }

}
