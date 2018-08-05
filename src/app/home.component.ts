import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'Home';
  @ViewChild('homeImage') elementView: ElementRef;
  homeImageSource: string;
  height: number;
  width: number;

  constructor() {  
  }

  ngOnInit() {
    this.height=this.elementView.nativeElement.height;
    this.width=this.elementView.nativeElement.width;
    if(this.width > 979) {
      this.homeImageSource = "https://paardrijvakantie.com/images/ladevezebanner1.jpg";
    } 
    else {
      this.homeImageSource = "https://paardrijvakantie.com/images/la-deveze-2.jpg";      
    }
  }

}
