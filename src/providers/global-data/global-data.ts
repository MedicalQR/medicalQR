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
  gmail_id : any;
  homePage : any;
  apiUrl : any;

  constructor() {
    this.user_id = "";
    this.gmail_id = "";
    this.homePage = {};
    this.apiUrl = 'https://localhost:44355/api/';
  }

  setUser_id(value) {
    this.user_id = value;
  }

  getUser_id() {
    return this.user_id;
  }

  setGmailId(value) {
    this.gmail_id = value;
  }

  getGmailId() {
    return this.gmail_id;
  }

  setHomePage(value) {
    this.homePage = value;
  }

  getHomePage() {
    return this.homePage;
  }

  getApiURL() {
    return this.apiUrl;
  }

}
