import { NgModule } from '@angular/core';
import { HeadercomponentComponent } from './headercomponent/headercomponent';
import {IonicModule} from "ionic-angular";
@NgModule({
	declarations: [HeadercomponentComponent],
	imports: [IonicModule ],
	exports: [HeadercomponentComponent]
})
export class ComponentsModule {}
