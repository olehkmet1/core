import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {ValidationService} from '../../../services/validation.service';
import {SpinnerService} from '../../../services/spinner.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  public signInFormGroup = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required, this.validationService.emailValidator])),
    password: new FormControl('', Validators.compose([Validators.required]))
  });

  returnUrl: string;

  public errorOccurred: boolean = false;
  public errorMessages: string[];

  constructor(private authService: AuthService,
              private validationService: ValidationService,
              private spinnerService: SpinnerService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loadData();
    this.removeUserSession();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
  }

  ngOnDestroy() {
  }

  private loadData() {
    this.spinnerService.hideSpinner();
  }

  removeUserSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
  }

  setUserSession(res) {
    localStorage.setItem('accessToken', res['token']);
    localStorage.setItem('refreshToken', res['refreshToken']);
    localStorage.setItem('expiresIn', res['expirationDate'] + new Date().getTime() / 1000);
  }

  public signInFormSubmit(event) {
    event.preventDefault();
    this.spinnerService.showSpinner();
    this.errorOccurred = false;

    const loginData = this.signInFormGroup.value;
    this.authService.createAccessToken(loginData)
      .subscribe(res => {
          this.setUserSession(res);
          // this.router.navigate(['/admin']);
          this.router.navigateByUrl(this.returnUrl);
        },
        error => {
          setTimeout(() => {
            this.spinnerService.hideSpinner();
            this.errorOccurred = true;
            this.errorMessages = error.error;
          }, 1000);
        });
  }

}
