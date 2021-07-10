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
  email: any;
  role : any;
  gmail_id : any;
  facebook_id : any;
  homePage : any;
  apiUrl : any;

  constructor() {
    this.user_id = "";
    this.email = "";
    this.gmail_id = "";
    this.facebook_id = "";
    this.role = "";
    this.homePage = {};
    this.apiUrl = 'https://localhost:44355/api/';
  }

  setUser_id(value) {
    this.user_id = value;
  }

  getUser_id() {
    return this.user_id;
  }

  setUserEmail(value) {
    this.email = value;
  }

  getUserEmail() {
    return this.email;
  }

  setRole(value) {
    this.role = value;
  }

  getRole() {
    return this.role;
  }

  setGmailId(value) {
    this.gmail_id = value;
  }

  getGmailId() {
    return this.gmail_id;
  }

  setFacebookId(value) {
    this.facebook_id = value;
  }

  getFacebookId() {
    return this.facebook_id;
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
