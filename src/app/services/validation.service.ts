import {Injectable, Output, EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AbstractControl, FormControl} from '@angular/forms';

@Injectable()
export class ValidationService {
  @Output() configLoaded = new EventEmitter<any>();

  private _config = {};

  public get config() {
    return this._config;
  }

  constructor(private translate: TranslateService) {
    this.initConfig();

    translate.onLangChange.subscribe(event => this.initConfig());
  }

  private initConfig() {
    this.translate.get('validationService').subscribe(result => {
      this._config = result;

      this.configLoaded.emit(this._config);
    });
  }

  public emailValidator(control: FormControl) {
    const emailRegex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');

    if (control.value === null) {
      return null;
    }
    if (!emailRegex.test(control.value)) {
      return {'emailIncorrect': true};
    }
    return null;
  }

  public passwordValidator(control: FormControl) {
    const passwordRegex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s)(?=.*[!@#$%^&*(),.?":{}|<>]).*$', 'gm');

    if (control.value === null) {
      return null;
    }

    if (control.value.length < 6) {
      return {'passwordShort': true};
    }

    if (!passwordRegex.test(control.value)) {
      return {'passwordWeak': true};
    }

    if (control.value.length > 300) {
      return {'passwordLong': true};
    }

    return null;
  }

  atLeastOneRequired(control: AbstractControl) {

    if (
      !control.get('email').value &&
      !control.get('phone').value
    ) {
      control.get('email').setErrors({'emailOrPhoneRequired': true});
      return null;
    }

    const phoneRegex = new RegExp('\(\\d{3}\\)\\d{3}\\-\\d{4})');

    if (!phoneRegex.test(control.get('phone').value) && control.get('phone').value.length > 0) {
      control.get('phone').setErrors({'phoneIncorrect': true});
    }

    if (
      !control.get('email').value &&
      control.get('phone').value
    ) {
      control.get('email').setErrors(null);
      return null;
    }

    const emailRegex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');

    if (!emailRegex.test(control.get('email').value)) {
      control.get('email').setErrors({'emailIncorrect': true});
    }

    return null;
  }

  public getValidatorErrorMessage(control: any) {
    if (control && control !== null) {
      for (const propertyName in control.errors) {
        if (control.errors.hasOwnProperty(propertyName)) {
          return this.config[propertyName];
        }
      }
    }

    return null;
  }
}
