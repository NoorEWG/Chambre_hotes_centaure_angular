import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'modifybooking',
  templateUrl: './modifybooking.component.html',
  styleUrls: ['./modifybooking.component.css']
})
export class ModifyBookingComponent implements OnInit{
  
  client;
  changedClient: Object;
  year: number;
  month: number;
  bookings;
  booking;
  message;
  
  
  constructor(private http: HttpClient, private route: ActivatedRoute) {    
    this.year = route.snapshot.params['year'] ? route.snapshot.params['year'] : moment().format('YYYY');
    this.month = route.snapshot.params['month']; 
  }

  ngOnInit () {
    
    this.client = {};
    this.changedClient = {};
    this.message = {
      error: 1,
      message: ""
    };
    this.bookings  = {
        bookings: [],
        total: [{
            price: 0,
            pers_room1: 0,
            pers_room2: 0
        }],
        cash: [{cash_payment: 0}],
        cheque: [{cheque_payment: 0}],
        booking: [{
            price_room1: 0,
            price_room2: 0,
        }],
        totalBooking: 0,
        commissionBooking: 0
    }
  
    var paramYear  = "";
    var paramMonth = "";
    if(this.year) {
      paramYear = "?year=" + this.year;
    }
    if(this.month) {
      paramMonth = "&month=" + this.month;
    }
    var request = "https://paardrijvakantie.com/api/listBookings.php" + paramYear + paramMonth;
    this.http.get(request).subscribe(data => {
      this.bookings = data;
    });    
  }
  
  changeClient(value) {
    var boekingen = this.bookings.bookings;
    var count = 0;
    var nb = 0;
    boekingen.forEach( function(item) {
      if (item.id === value) {
        nb = count;   
      }
      count++;
    });
    this.client = boekingen[nb];
    this.changedClient = this.client;   
  }

  updateClient() {
    var request = "https://paardrijvakantie.com/api/modifyBooking.php?update=" +  JSON.stringify(this.changedClient);
    console.log(request);
    this.http.get(request).subscribe(data => {
      this.message = data;
    });     
  }
}
