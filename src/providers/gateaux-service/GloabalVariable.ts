import { Injectable } from '@angular/core';

@Injectable()
export class GloabalVariable {
  public header_data:any = {};
 // public requestmode :string ="TEST";
  public requestmode :string ="PROD";
  public destinataire = ["768823748","773218622","774153199","775067661"]
  public urlsave = "http://212.71.244.7:8080/kollere/save";
}
