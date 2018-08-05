import { Address } from './Address';

export class User {
 
    id: number;
    name: string;
    firstName: string;
    tel: string;
    email: string;
    address: Address;
    roomRoca: Object;
    roomCirq: Object;
    arrival: string;
    departure: string;
    nights: number;
    gender: string;
    terms: boolean;
    auth: boolean;
 
    constructor(values: Object = {}) {
      //Constructor initialization
      Object.assign(this, values);
  }
 
}
