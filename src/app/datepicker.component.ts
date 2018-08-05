import {Component, Input} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styles: [`
    .custom-day {      
      text-align: center;
      padding: 0.185rem 0.25rem;
      border-radius: 0.25rem;
      display: inline-block;
      width: 2rem;
    }
    
    .custom-day:hover, .custom-day.focused {
      background-color: #e6e6e6;
    }

    .isBooked {
      background-color: #902A28;
      color: white;
    }
    
    .isClosed {
      background-color: #435F84;
      color: white;
    }
   
    .hidden {
      display: none;
    }

    :root {
      --red: #902A28 !important;
      --blue:  #435F84 !important;
    }

    .btn-link {
        color: #435F84 !important; 
    }

    .bg-primary {
        color: #435F84 !important; 
    }

    .closed {
        background-color:  #435F84; 
        width: 25px;
        height: 25px;
        margin-right: 5px;
        margin-top: 5px;
        border-radius: 5px;
        display: inline-block;
    }

    .booked {
        background-color:#902A28; 
        width: 25px;
        height: 25px;
        margin-right: 5px;
        margin-top: 5px;
        border-radius: 5px;
        display: inline-block;
    }
  `]
})

export class DatePickerComponent {

  model: NgbDateStruct;
  date: {year: number, month: number};
  @Input() data;
  room: number;
  nameRoom: string;
  room1: number;
  room2: number;
  bookedDates;
  dates = [];
  closedDates;
  closed = [];

  constructor(private http: HttpClient) {  
  }

  ngOnInit() {
     this.room = this.data;
     if(this.room === 13) {
       this.nameRoom = 'Rocamadour';
       this.room1 = 1;
       this.room2 = 0;

     }
     else {
       this.nameRoom = 'Saint Cirq Lapopie';
       this.room2 = 1;
       this.room1 = 0;
     }
   
    var year = moment().format("YYYY"); 
    
    var requestBooking = "https://paardrijvakantie.com/api/getBookedDatesRooms.php?closed=0&room1=" + this.room1 + "&room2=" + this.room2 + "&date=" + year + "-01-01";
    this.http.get(requestBooking).subscribe(data => {
      this.bookedDates = data;
      if(this.bookedDates) {
        this.getDates(this.bookedDates, this.dates);
      }
    });    

    var requestClosed = "https://paardrijvakantie.com/api/getBookedDatesRooms.php?closed=1&room1=" + this.room1 + "&room2=" + this.room2 + "&date=" + year + "-01-01";
    this.http.get(requestClosed).subscribe(data => {
      this.closedDates = data;
      if(this.closedDates) {
        this.getDates(data, this.closed);
      }
    });    
  }

  getDates(datesIn, datesOut) {
    for(var i = 0; i < datesIn.length ; i++) {
      var d = moment(datesIn[i].arrival).format('YYYY-MM-DD');
      datesOut.push(d);
      var temp = this.enumerateDaysBetweenDates(datesIn[i].arrival, datesIn[i].departure);
      datesOut.push.apply(datesOut, temp);
    }
  }

  isBooked(date: NgbDateStruct) {
    let d = date.year + "-" + date.month + "-" + date.day;
    let booked = false;
    if(this.dates) {
      for(var i = 0; i < this.dates.length ; i++) {
        if(d === this.dates[i].replace("-0","-").replace("-0","-")) {
          booked = true;
        }   
      }
    }
    return booked;
  }

  isClosed(date: NgbDateStruct) {
    let d = date.year + "-" + date.month + "-" + date.day;
    let close = false;
    if(this.closed) {
      for(var i = 0; i < this.closed.length ; i++) {
        if(d === this.closed[i].replace("-0","-").replace("-0","-")) {
          close = true;
        }   
      }
    }
    return close;
  }
  
  isDisabled(date: NgbDateStruct, current: {month: number}) {
    return date.month !== current.month;
  }

  enumerateDaysBetweenDates(startDate, endDate) {
    var dates = [];

    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');

    while(currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(currDate.clone().format('YYYY-MM-DD'));
    }

    return dates;
  }
}