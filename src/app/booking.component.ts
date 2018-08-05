import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { User } from './User';
import { Address } from './Address';

const httpOptions = {
    headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*', 
    "Access-Control-Allow-Methods":"GET,POST",
    'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type', 
    'Content-Type':  'application/json; charset=utf-8'
  })
};

@Component({
  selector: 'booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})

export class BookingComponent implements OnInit{
  
  cities;
  villes;
  cityList: String[];
  genderList;
  roomRocaList;
  roomCirqList;
  room1;
  room2;
  numberPersonsList;
  bookingForm: FormGroup;
  user: User;
  address: Address;
  formValidated;
  available;
  message;
  count;

  constructor(private http: HttpClient, private fb:FormBuilder) {  
  }

  ngOnInit() {

    this.genderList =  ['Sélectionnez ....', 'Monsieur', 'Madame'];
    this.roomRocaList = [
      {room: "roca", pers: 1, text: "un lit simple - 1 pers", price: 60},
      {room: "roca", pers: 2, text: "un lit double (1.60cm) - 2 pers", price: 65},
      {room: "roca", pers: 2, text: "deux lits, meme chambre - 2 pers", price: 65},
      {room: "roca", pers: 2, text: "deux lits, deux chambres - 2 pers", price: 75},
      {room: "roca", pers: 3, text: "un lit simple et un lit double - 3 pers", price: 85},
      {room: "roca", pers: 3, text: "trois lits simples - 3 pers", price: 85},
      {room: "roca", pers: 4, text: "un lit double, deux lits simples - 4 pers", price: 105},
      {room: "roca", pers: 5, text: "un lit double, deux lits simples, un lit d'appoint - 5 pers", price: 120},
    ];
     this.roomCirqList = [
      {room: "cirq", pers: 1, text: "un lit simple - 1 pers", price: 55},
      {room: "cirq", pers: 2, text: "un lit double (1.60cm) - 2 pers", price: 60},
      {room: "cirq", pers: 2, text: "deux lits, meme chambre - 2 pers", price: 60},
      {room: "cirq", pers: 2, text: "deux lits, deux chambres - 2 pers", price: 70},
      {room: "cirq", pers: 3, text: "un lit simple et un lit double - 3 pers", price: 80},
      {room: "cirq", pers: 3, text: "trois lits simples - 3 pers", price: 80},
      {room: "cirq", pers: 4, text: "un lit double, deux lits simples - 4 pers  ", price: 100},
    ];
    
    this.user = new User();
    
    this.user.address = new Address();
    
    this.user.roomRoca = {
      selected: false,
      selectedRoom: this.roomRocaList[1]
    };
    
    this.room1 =  {
      selected: false,
      selectedRoom: this.roomRocaList[1]
    };
    
    this.user.roomCirq = {
      selected: false,
      selectedRoom: this.roomCirqList[1]
    };

    this.room2 = {
      selected: false,
      selectedRoom: this.roomCirqList[1]
    }
    this.user.gender = this.genderList[0]; 

    this.formValidated = {
      message: '',
      error: 1
    }   

    this.user.arrival = moment().add(1,'day').format("YYYY-MM-DD");
    this.user.departure = moment().add(2,'day').format("YYYY-MM-DD");

    this.available = false;

    this.bookingForm = this.fb.group ({
        roomRoca: [''],
        roomCirq: [''],
        arrival: ['',[Validators.required, Validators.pattern('[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}')]],
        departure: [''],
        selectedRoca: [''],
        selectedCirq: [''],                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                gender: ['',[Validators.required, Validators.pattern(/^M/)]], 
        name: ['',[Validators.required, Validators.minLength(2)]],
        firstName: [''],
        email: ['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
        address: this.fb.group ({
          street: ['',Validators.required],
          zipcode: ['',Validators.required],
          city: ['',Validators.required]
        }),  
        tel: ['',[Validators.required, Validators.pattern(/[0-9+-.]/g), Validators.minLength(10)]],
        available: ['',Validators.required],
        terms: ['',Validators.requiredTrue]
    });
  }

  validateForm() {
        if(this.bookingForm.valid) {
          this.user.nights = moment(this.user.departure).diff(moment(this.user.arrival), 'days');
          var params = JSON.stringify(this.user); 
          var $request = "https://paardrijvakantie.com/api/saveBooking.php?booking=" + params ;
          this.http.post($request,httpOptions).subscribe(data => {
            this.formValidated = data;
          });
        }
    }

  getVilles(codePostal) {
    var request = "https://datanova.legroupe.laposte.fr/api/records/1.0/search/?dataset=laposte_hexasmal&facet=code_commune_insee&facet=nom_de_la_commune&facet=code_postal&facet=libell_d_acheminement&facet=ligne_5&refine.code_postal=" + codePostal;

    this.http.get(request).subscribe(data => {
      this.cities = data;
      if(this.cities) {
        this.villes = this.cities.records; 
      }
    });    
  }

  checkAvailability() {

    var arrival = this.user.arrival;
    var departure = this.user.departure;
    this.room1 = this.user.roomRoca;
    this.room2 = this.user.roomCirq;

    this.message = "";
    var re = new RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{2}$");
    
    if(re.test(arrival) && re.test(departure)) {
      
      // arrival date is before today
      if(moment(arrival).isBefore(moment())) {
         this.available = false;
         this.message = "La date d'arrivée est avant aujourd'hui";
      }
      
      // arrival date is after departure date
      else if(moment(arrival).isAfter(moment(departure))) {
         this.available = false;
         this.message = "La date d'arrivée est après la date de départ";
      }

      // arrival date and departure date are the same
      else if(moment(arrival).isSame(moment(departure))) {
         this.available = false;
         this.message = "La date d'arrivée et la date de départ sont pareil";
      }

      // reservations are not open after 1 year from now
      else if(moment(arrival).isAfter(moment().add(1,'year'))) {
         this.available = false;
         this.message = "La réservation en ligne pour ces dates n'est pas encore ouverte";
      }

      // dates are ok
      else {
        
        var dates = this.getDates(arrival,departure);
         
        var request = "https://paardrijvakantie.com/api/checkAvailability.php?room1=" + this.room1.selected + "&room2=" + this.room2.selected + "&dates=" +dates.join(";");
        console.log(request);
          
        this.http.get(request).subscribe(data => {
          this.count = data;
          if(this.count.count > 0) {
            this.available = false;
            this.message = "La/les dates demandée(s) ne sont pas disponibles";
          }
          else {
            this.available = true;
            this.message = "";
          }
        });   
      }
    }
    else {
      this.available = false;
      this.message = "Votre date d'arrivée ou date de départ n'est pas correcte";
    }
  }
 
 getDates(dateIn, dateOut) {
    
    var dates = [];
    var d = moment(dateIn).format('YYYY-MM-DD');
    dates.push(d);
    var temp = this.enumerateDaysBetweenDates(dateIn, dateOut);
    dates.push.apply(dates, temp);

    return dates;
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

  get name() { return this.bookingForm.get('name'); }
     
  get firstName() { return this.bookingForm.get('firstName'); }

  get tel() { return this.bookingForm.get('tel'); }

  get email() { return this.bookingForm.get('email'); }
 
  get gender() { return this.bookingForm.get('gender'); }
 
  get terms() { return this.bookingForm.get('terms'); }
}
