import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private translate: TranslateService,
              private router: Router) {
  }

  ngOnInit() {
    this.translate.setDefaultLang('uk');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('uk');

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
