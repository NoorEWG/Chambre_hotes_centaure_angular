import {Component, Input} from '@angular/core';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';


const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'datepicker-range',
  templateUrl: './datepicker-range.component.html',
  styles: [`
    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range, .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }

    .isBooked {
      background-color: #902A28;
      color: white;
    }

  `]
})
export class DatePickerRangeComponent {

  @Input() isBookedRoca;
  @Input() isBookedCirq;
  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  bookedOrClosedDates;
  dates;
  roomRocaBooked: boolean;
  roomCirqBooked: boolean;

  constructor(calendar: NgbCalendar, private http: HttpClient) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 1);
  }

  ngOnInit() {
    this.roomRocaBooked = this.isBookedRoca;
    this.roomCirqBooked = this.isBookedCirq;
    this.dates = [];
    var year = moment().format("YYYY"); 
    // TO TEST
    // var requestBooking = "http://paardrijvakantie.com/api/getBookedOrClosedRooms.php?date=" + year + "-01-01&roca=" + this.roomRocaBooked+"&cirq=" +this.roomCirqBooked;   
    var requestBooking = "http://paardrijvakantie.com/api/getBookedOrClosedRooms.php?date=" + year + "-01-01&roca=true&cirq=false";
        this.http.get(requestBooking).subscribe(data => {
            this.bookedOrClosedDates = data;
            console.log("BOOKED OR CLOSED DATES: " + JSON.stringify(this.bookedOrClosedDates));
        });
  }        

  onDateChange(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isDisabled(date: NgbDateStruct, current: {month: number}) {
    
    if(date.month !== current.month) {
        return true;
    }
  }  

  isBooked(date: NgbDateStruct)  {
       
        if(this.bookedOrClosedDates) {
            this.getDates(this.bookedOrClosedDates);
            let d = date.year + "-" + date.month + "-" + date.day;
            let close = false;
            
            for(var i = 0; i < this.dates.length ; i++) {
                if(d === this.dates[i].replace("-0","-").replace("-0","-")) {
                    close = true;
                }   
            }
            return close;
        }    
        else {
            return false;
        }   
  }
  

  getDates(datesIn) {
    for(var i = 0; i < datesIn.length ; i++) {
      var d = moment(datesIn[i].begindatum).format('YYYY-MM-DD');
      this.dates.push(d);
      var temp = this.enumerateDaysBetweenDates(this.bookedOrClosedDates[i].begindatum, this.bookedOrClosedDates[i].einddatum);
      this.dates.push.apply(this.dates, temp);
    }

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

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);
}