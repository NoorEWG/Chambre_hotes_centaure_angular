export class Address {
 
    street: string;
    zipcode: string;
    city: string;
     
    constructor(values: Object = {}) {
      //Constructor initialization
      Object.assign(this, values);
  }
 
}
