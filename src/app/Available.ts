import { Address } from './Address';

export class Available {

    dates: string[];
    room1: boolean;
    room2: boolean;
   
    constructor(values: Object = {}) {
      //Constructor initialization
      Object.assign(this, values);
  }
 
}
