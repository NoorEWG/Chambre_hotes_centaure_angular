import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {
  @Input() clazz;
  @Input() no;
  @Input() w;
  @Input() h;
  sources;
  src;

  constructor() {
    console.log(this.no);  
    this.sources = ["../assets/la-deveze-1.jpg", "../assets/la-deveze-2.jpg", "../assets/ladevezebanner1.jpg"];
    this.src = this.sources[1];      
  }

 
}
