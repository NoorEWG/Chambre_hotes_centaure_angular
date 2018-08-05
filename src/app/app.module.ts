import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DatePickerComponent } from './datepicker.component';
import { DatePickerRangeComponent } from './datepicker-range.component';
import { MapComponent } from './map.component';
import { ImageComponent } from './image.component';
import { HomeComponent } from './home.component';
import { RocamadourComponent } from './rocamadour.component';
import { SaintCirqComponent } from './saintcirq.component';
import { TableHotesComponent } from './tablehotes.component';
import { SitesTouristiquesComponent } from './sitestouristiques.component';
import { ContactComponent } from './contact.component';
import { BookingComponent } from './booking.component';
import { InternalBookingComponent } from './internalbooking.component';
import { PageNotFoundComponent } from './pagenotfound.component';
import { HeaderComponent } from './nav.component';
import { FooterComponent } from './footer.component';
import { ListBookingComponent} from './listbooking.component';
import { ModifyBookingComponent} from './modifybooking.component';
import { BillingComponent} from './billing.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';

const appRoutes: Routes = [
  { path: 'chambre-hotes', component: HomeComponent },
  { path: 'chambre-rocamadour', component: RocamadourComponent },
  { path: 'chambre-saint-cirq-lapopie', component: SaintCirqComponent },
  { path: 'table-hotes', component: TableHotesComponent },
  { path: 'sites-touristiques', component: SitesTouristiquesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'reservation', component: BookingComponent },
  { path: 'internalbooking', component: InternalBookingComponent },
  { path: 'listbookings', component: ListBookingComponent },
  { path: 'listbookings/:year', component: ListBookingComponent },
  { path: 'listbookings/:year/:month', component: ListBookingComponent },
  { path: 'modifybooking', component: ModifyBookingComponent },
  { path: 'modifybooking/:year', component: ModifyBookingComponent },
  { path: 'modifybooking/:year/:month', component: ModifyBookingComponent },
  { path: 'billing/:code', component: BillingComponent },
  { path: '',
    redirectTo: '/chambre-hotes',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DatePickerComponent,
    DatePickerRangeComponent,
    MapComponent,
    ImageComponent,
    RocamadourComponent,
    SaintCirqComponent,
    TableHotesComponent,
    SitesTouristiquesComponent,
    ContactComponent,
    PageNotFoundComponent,
    BookingComponent,
    InternalBookingComponent,
    HeaderComponent,
    FooterComponent,
    ListBookingComponent,
    ModifyBookingComponent,
    BillingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // DlDateTimePickerModule,
    // MyDatePickerModule,
    DataTablesModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
    // other imports here
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
