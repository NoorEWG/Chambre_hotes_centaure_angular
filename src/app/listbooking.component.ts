import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { chart } from 'highcharts';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import * as $ from 'jquery';
import 'datatables.net';
import { Subject } from 'rxjs';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'listbooking',
  templateUrl: './listbooking.component.html',
  styleUrls: ['./listbooking.component.css']
})
export class ListBookingComponent implements OnInit{
  
  @ViewChild('chartTarget') chartTarget: ElementRef;
  @ViewChild('chartPersons') chartPersons: ElementRef;
  @ViewChild('chartNights') chartNights: ElementRef;
  chart: Highcharts.ChartObject;
  chartPeople: Highcharts.ChartObject;
  chartNuits: Highcharts.ChartObject;
  year: number;
  yearBefore: number;
  month: number;
  bookings;
  statistics;
  totalBooking: number;
  commissionBooking: number;
  reserved: number;
  cash: number;
  cheque: number;
  other: number;
  shareBooking: number;
  shareCheque: number;
  shareCash: number;
  shareReserved: number;
  shareOther: number;
  pricesYear1: Array<number>;
  pricesYear2: Array<number>;
  persTotalYear1: Array<number>;
  persTotalYear2: Array<number>;
  persRoom1Year1: Array<number>;
  persRoom2Year1: Array<number>;
  persRoom1Year2: Array<number>;
  persRoom2Year2: Array<number>;
  cumul1: Array<number>;
  cumul2: Array<number>;
  totalPricesYear1: number;
  totalPricesYear2: number;
  totalPersYear1: number;
  totalPersYear2: number;
  room1PricesYear1: number;
  room1PricesYear2: number;
  room2PricesYear1: number;
  room2PricesYear2: number;
  nightsTotalYear1: Array<number>;
  nightsTotalYear2: Array<number>;
  nightsRoom1Year1: Array<number>;
  nightsRoom2Year1: Array<number>;
  nightsRoom1Year2: Array<number>;
  nightsRoom2Year2: Array<number>;
  totalNightsYear1: number;
  totalNightsYear2: number;

  dinnersYear1: number;
  dinnersYear2: number;
  remise1: number;
  remise2: number;
  moyenne1: number;
  moyenne2: number;
  today;
  dtOptions: DataTables.Settings = {};
  dtTrigger;

  constructor(private http: HttpClient, private route: ActivatedRoute) {    
    this.year = route.snapshot.params['year'] ? route.snapshot.params['year'] : moment().format('YYYY');
    this.yearBefore = this.year - 1; 
    this.month = route.snapshot.params['month'];
    this.dtTrigger = new Subject();
  }

  ngOnInit () {
    
    this.today            = Date();
    this.pricesYear1      = [];
    this.pricesYear2      = [];
    this.persTotalYear1   = [];
    this.persTotalYear2   = [];
    this.nightsTotalYear1 = [];
    this.nightsTotalYear2 = [];
    this.cumul1           = [];
    this.cumul2           = [];
    this.totalPricesYear1 = 0;
    this.totalPricesYear2 = 0;
    this.totalPersYear1   = 0;
    this.totalPersYear2   = 0;
    this.totalNightsYear1 = 0;
    this.totalNightsYear2 = 0;
    this.room1PricesYear1 = 0;
    this.room1PricesYear2 = 0;
    this.room2PricesYear1 = 0;
    this.room2PricesYear2 = 0;
    this.nightsRoom1Year1 = [];
    this.nightsRoom1Year2 = [];
    this.nightsRoom2Year1 = [];
    this.nightsRoom2Year2 = [];     
    this.dinnersYear1     = 0;
    this.dinnersYear2     = 0;
    this.persRoom1Year1   = [];
    this.persRoom2Year1   = []
    this.persRoom1Year2   = [];
    this.persRoom2Year2   = [];
    this.bookings         = {
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
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      order: [3, 'asc'],
      scrollX: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
      },
      columnDefs: [{'visible': false, 'targets': [3]}] 
    };
  
    var request = "https://paardrijvakantie.com/api/listBookings.php" + paramYear + paramMonth;
    this.http.get(request).subscribe(data => {
      this.bookings = data;
      this.dtTrigger.next();
      this.totalBooking = ( this.bookings.booking[0].price_room1 ? parseInt(this.bookings.booking[0].price_room1) : 0 ) + ( this.bookings.booking[0].price_room2 ? parseInt(this.bookings.booking[0].price_room2) : 0 );
      this.commissionBooking = this.totalBooking * 0.15;
      this.cash     = this.bookings.cash[0].cash_price ? this.bookings.cash[0].cash_price : 0;
      this.cheque   = this.bookings.cheque[0].cheque_price ? this.bookings.cheque[0].cheque_price : 0;
      this.other    = this.bookings.other[0].other_price ?  this.bookings.other[0].other_price : 0;
      this.reserved = (this.bookings.total[0].price - this.cash - this.cheque - this.other);
      this.shareBooking = this.totalBooking / this.bookings.total[0].price * 100;
      this.shareCheque = this.cheque / this.bookings.total[0].price * 100;
      this.shareCash = this.cash / this.bookings.total[0].price * 100;
      this.shareOther = this.other / this.bookings.total[0].price * 100;
      this.shareReserved = this.reserved / this.bookings.total[0].price * 100;
    });    

    var request = "https://paardrijvakantie.com/api/statisticsBookings.php" + paramYear;
    this.http.get(request).subscribe(data => {
     
      this.statistics = data;
      this.cumul1 = this.statistics.cumul1;     
      this.cumul2 = this.statistics.cumul2;
      this.room1PricesYear1 += this.statistics.room1cumul1 ? parseInt(this.statistics.room1cumul1) : 0;
      this.room1PricesYear2 += this.statistics.room1cumul2 ? parseInt(this.statistics.room1cumul2) : 0;
      this.room2PricesYear1 += this.statistics.room2cumul1 ? parseInt(this.statistics.room2cumul1) : 0;
      this.room2PricesYear2 += this.statistics.room2cumul2 ? parseInt(this.statistics.room2cumul2) : 0;
     
      this.dinnersYear1 += this.statistics.dinner1 ? parseInt(this.statistics.dinner1) : 0;
      this.dinnersYear2 += this.statistics.dinner2 ? parseInt(this.statistics.dinner2) : 0;
      this.dinnersYear1 += this.statistics.dinnerchild1 ? parseInt(this.statistics.dinnerchild1) : 0;
      this.dinnersYear2 += this.statistics.dinnerchild2 ? parseInt(this.statistics.dinnerchild2) : 0;
      this.remise1 = this.statistics.remise1;
      this.remise2 = this.statistics.remise2;

      this.statistics.statistics.forEach(element => {
        
        this.pricesYear1.push(element.values1[0].price ? parseInt(element.values1[0].price) : 0);
        this.pricesYear2.push(element.values2[0].price ? parseInt(element.values2[0].price) : 0);

        this.totalPricesYear1 += element.values1[0].price ? parseInt(element.values1[0].price) : 0;
        this.totalPricesYear2 += element.values2[0].price ? parseInt(element.values2[0].price) : 0;
      
        var room1 = element.values1[0].pers_room1 ? parseInt(element.values1[0].pers_room1) : 0;
        var room2 = element.values1[0].pers_room2 ? parseInt(element.values1[0].pers_room2) : 0;

        this.persRoom1Year1.push(room1);
        this.persRoom2Year1.push(room2);
        this.totalPersYear1 += (room1 + room2);
        this.persTotalYear1.push(this.totalPersYear1);
        
        room1 = element.values2[0].pers_room1 ? parseInt(element.values2[0].pers_room1) : 0;
        room2 = element.values2[0].pers_room2 ? parseInt(element.values2[0].pers_room2) : 0;
        
        this.persRoom1Year2.push(room1);
        this.persRoom2Year2.push(room2);
        this.totalPersYear2 += (room1 + room2);
        this.persTotalYear2.push(this.totalPersYear2);

        var nightsRoom1 = element.values1[0].nights_room1 ? parseInt(element.values1[0].nights_room1) : 0;
        var nightsRoom2 = element.values1[0].nights_room2 ? parseInt(element.values1[0].nights_room2) : 0;
          
        this.nightsRoom1Year1.push(nightsRoom1); 
        this.nightsRoom2Year1.push(nightsRoom2);
        this.totalNightsYear1 += (nightsRoom1 + nightsRoom2);
        this.nightsTotalYear1.push(this.totalNightsYear1);

        nightsRoom1 = element.values2[0].nights_room1 ? parseInt(element.values2[0].nights_room1) : 0;
        nightsRoom2 = element.values2[0].nights_room2 ? parseInt(element.values2[0].nights_room2) : 0;

        this.nightsRoom1Year2.push(nightsRoom1); 
        this.nightsRoom2Year2.push(nightsRoom2);  
        this.totalNightsYear2 += (nightsRoom1 + nightsRoom2);
        this.nightsTotalYear2.push(this.totalNightsYear2);

      });
      this.moyenne1 = this.totalPricesYear1 / this.totalPersYear1;
      this.moyenne2 = this.totalPricesYear2 / this.totalPersYear2;
  
      const options1: Highcharts.Options = {
        chart: {
          type: 'column',
        },
        colors: ['#902A28', '#435F84'],
        title: {
          text: '<b>Chiffre d\'affaires</b>'
        },
        plotOptions: {
          column: {
              dataLabels: {
                  enabled: true,
                  color: 'white'
              }
          }
        },
        xAxis: {
           categories: ['janvier', 'fevrier', 'mars','avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre']   
        },
        yAxis: [{
            title: {
              text: 'Chiffre d\'affaires mensuelle'
            }
          },
          {
            title: {
              text: 'Chiffre d\'affaires cumulative'
            },
            opposite: true
          }
        ],
        series: [{
          name: this.year.toString() + ' - mensuel',
          data: this.pricesYear1
        },
        {
          name: this.yearBefore.toString() + ' - mensuel',
          data: this.pricesYear2
        },
        {
          type: 'spline',
          name: this.year.toString() + ' - cumulatif',
          data: this.cumul1,
          yAxis: 1
        },
        {
          type: 'spline',
          name: this.yearBefore.toString() + ' - cumulatif',
          data: this.cumul2,
          yAxis: 1
        }],
        credits: {
          enabled: false
        },
      };

      this.chart = chart(this.chartTarget.nativeElement, options1);

      const options2: Highcharts.Options = {
        chart: {
          type: 'column',
        },
        colors: ['#902A28', '#A04847', '#435F84','#5E7696','#798DA7', '#B06765'],
        title: {
          text: '<b>Nombre de Personnes</b>'
        },
        plotOptions: {
          column: {
              stacking: 'normal',
          }
        },
        xAxis: {
          categories: ['janvier', 'fevrier', 'mars','avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre']
        },
        yAxis: [{
            title: {
              text: 'Nombre de personnes mensuelle'
            }
          },
          {
            title: {
            text: 'Nombre de personnes cumulative'
            }, 
            opposite: true
        }],
        series: [{
          name: 'Chambre Saint Cirq LaPopie - ' + this.year,
          data: this.persRoom2Year1,
          stack: this.year
        },
        {
          name: 'Chambre Rocamadour - ' + this.year,
          data: this.persRoom1Year1,
          stack: this.year
        },
        {
          name: 'Chambre Saint Cirq LaPopie - ' + this.yearBefore,
          data: this.persRoom2Year2,
          stack: this.yearBefore
        },
        {
          name: 'Chambre Rocamadour - ' + this.yearBefore,
          data: this.persRoom1Year2,
          stack: this.yearBefore,
        },
        {
          type: 'spline',
          name: this.year.toString() + ' - cumulatif',
          data: this.persTotalYear1,
          yAxis: 1
        },
        {
          type: 'spline',
          name: this.yearBefore.toString() + ' - cumulatif',
          data: this.persTotalYear2,
          yAxis: 1
        }],
        credits: {
          enabled: false
        },
      };
      this.chartPeople = chart(this.chartPersons.nativeElement, options2);
   
 const options3: Highcharts.Options = {
        chart: {
          type: 'column',
        },
        colors: ['#902A28', '#435F84'],
        title: {
          text: '<b>Nuitées</b>'
        },
        plotOptions: {
          column: {
              stacking: 'normal',
          }
        },
        xAxis: {
           categories: ['janvier', 'fevrier', 'mars','avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre']   
        },
        yAxis: [{
            title: {
              text: 'Nuitées mensuelles'
            }
          },
          {
            title: {
              text: 'Nuitées cumulatives'
            },
            opposite: true
          }
        ],
        series: [{
          name: 'Chambre Saint Cirq LaPopie' + this.year.toString() + ' - mensuel',
          data: this.nightsRoom1Year1,
          stack: this.year
        },
        {
          name: 'Chambre Saint Cirq LaPopie' + this.yearBefore.toString() + ' - mensuel',
          data: this.nightsRoom1Year2,
          stack: this.yearBefore
        },
        {
          name: 'Chambre Rocamadour' + this.year.toString() + ' - mensuel',
          data: this.nightsRoom2Year1,
          stack: this.year
        },
        {
          name: 'Chambre Rocamadour' + this.yearBefore.toString() + ' - mensuel',
          data: this.nightsRoom2Year2,
          stack: this.yearBefore
        },
        {
          type: 'spline',
          name: this.year.toString() + ' - cumulatif',
          data: this.nightsTotalYear1,
          yAxis: 1
        },
        {
          type: 'spline',
          name: this.yearBefore.toString() + ' - cumulatif',
          data: this.nightsTotalYear2,
          yAxis: 1
        }],
        credits: {
          enabled: false
        },
      };
    
    this.chartNuits = chart(this.chartNights.nativeElement, options3);
   });    
  }

  voirFacture(code) {
    window.open("https://chambre-hotes-lot.fr/#/billing/" + code);
  }

}

