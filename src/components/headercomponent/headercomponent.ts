import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NavController} from "ionic-angular";

/**
 * Generated class for the HeadercomponentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'headercomponent',
  templateUrl: 'headercomponent.html'
})
export class HeadercomponentComponent {

  constructor(public navCtrl: NavController) {

  }

  @Input('header') header_data;

  set header(header_data: any) {
    this.header_data = header_data;
  }

  get header() {
    return this.header_data;
  }

  @Output() montogglesearch = new EventEmitter();
  @Output() useroptions = new EventEmitter();

  doIt() {
    this.montogglesearch.emit({value: this.montogglesearch})
  }

  useroption() {
    console.log("mon evenement ===>" + this.useroptions);
    this.useroptions.emit();

  }
}
