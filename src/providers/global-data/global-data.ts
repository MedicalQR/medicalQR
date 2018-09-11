import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalDataProvider {

  user_id : any;

  constructor() {
    this.user_id = "";
  }

  setUser_id(value) {
    this.user_id = value;
  }

  getUser_id() {
    return this.user_id;
  }

}
