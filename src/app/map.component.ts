import { Component, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { } from '@types/googlemaps';


@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  @Input() sites;
  @Input() lat;
  @Input() lon; 
  sitesTouristiques: string; 
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  latLon: google.maps.LatLng;
  interestingPlaces;

  constructor(private http: HttpClient) {  
  }

  ngOnInit() {
    // this.latLon = new google.maps.LatLng(44.643496514542555,1.588009373016348);
    this.latLon = new google.maps.LatLng(this.lat, this.lon);
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
      this.openMap();
    });  
  }

  ngAfterViewInit() {
    
    // setTimeout(() => {
      // this.openMap();
    // }, 2000);  
    
   
  } 

  openMap() {
    var mapProp = {
      center: this.latLon,
      zoom: 9,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    
    var infoCentaure = new google.maps.InfoWindow({
      content: "<div class='infowindow'><img width='50' title='Chambre d\'hôtes Centaure' height='auto' alt=''  src='https://paardrijvakantie.com/images/ladevezebanner1.jpg'></img></div><div style='float: right;'><br />Chambre <br />d'hôtes <br/>Centaure</div>",
      position: this.latLon
    }); 
    infoCentaure.open(map);
    if(this.sites == "true") {
       this.addSitesTouristiques(map);
    }
  }  

  addSitesTouristiques(map) {
    this.interestingPlaces.forEach( function (item) {

      var pos = new google.maps.LatLng(item.lat,item.lng);
	    
      var place = new google.maps.Marker({
	      position: pos,
	      title: item.titletext1,
        map: map
      });
	    
      // var contentstring = "<div class='infoWindowContent'><div><img width='150' title='" + item.title + "' height='auto' alt='' src='http://paardrijvakantie.com/images/" + item.image + "'></img></div><div style='margin: auto;'><b>" + item.titletext1 + "</b><p></p></div><input type='button' class='btn btn-infowindow' value='en savoir +' (click)='goTo(item.link)'></div>";
      var contentstring = "<div class='infoWindowContent'><div><img width='150' title='" + item.title + "' height='auto' alt='' src='https://paardrijvakantie.com/images/" + item.image + "'></div><div><b>" + item.titletext1 + "</b></div></div>";
	    var infowindow = new google.maps.InfoWindow({
        content: contentstring,
	      position: pos
	    });
     
	    google.maps.event.addListener(place, "click", function() {
	      infowindow.open(map, place);
      });

	    google.maps.event.addListener(infowindow, "closeclick", function() {
	      map.setCenter(this.latLon);
      });
    });
  }

}
