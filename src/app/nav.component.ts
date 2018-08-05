import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class HeaderComponent implements OnInit{

  isCollapsed: boolean;

  constructor() {
    this.isCollapsed = true;
  }

  ngOnInit() {


  }

  changeCollapse() {
    if(this.isCollapsed) {
      this.isCollapsed = false;
      setTimeout(() => {  
        this.isCollapsed = true }, 
      4000);  
    }
    else {
      this.isCollapsed = true; 
    }
  }
}
