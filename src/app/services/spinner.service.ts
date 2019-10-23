import {Injectable, Output, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  @Output() spinnerVisibilityChanged = new EventEmitter<any>();

  public showSpinner() {
    this.spinnerVisibilityChanged.emit(true);
  }

  public hideSpinner() {
    this.spinnerVisibilityChanged.emit(false);
  }
}
