import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { } from '@types/googlemaps';


@Component({
  selector: 'sites-touristiques',
  templateUrl: './sitestouristiques.component.html',
  styleUrls: ['./sitestouristiques.component.css']
})
export class SitesTouristiquesComponent {
  
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  interestingPlaces;

  constructor(private http: HttpClient) {  
  }

  ngOnInit() {

    var requestBooking = "https://paardrijvakantie.com/api/getInterestingPlaces.php";
    this.http.get(requestBooking).subscribe(data => {
      this.interestingPlaces = data;
      if(this.interestingPlaces) {
        this.interestingPlaces.forEach(function (item) {
          if(item.image ) {
            item.image2 = "https://paardrijvakantie.com/images/" +  item.image;
          }
        });
      }
    });  
  }

  goTo(item) {
    window.open(item.link,"_blank");
  }
}