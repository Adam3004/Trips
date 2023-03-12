import { Roles } from '../enums/roles';
import { BasketElement } from './basketElement';
import { BoughtTrip } from './boughtTrip';
import { Trip } from './trip';

export interface User {
  id: string;
  emial: string;
  roles: Roles[];
  isBlocked: boolean;
  basket: BasketElement[];
  boughtTrips: BoughtTrip[];
  name?: string;
  key?: string;
}

export class User {
  constructor(
    public id: string,
    public email: string,
    public roles: Roles[] = [Roles.CUSTOMER],
    public isBlocked: boolean = false,
    public basket: BasketElement[] = [],
    public boughtTrips: BoughtTrip[] = []
  ) {}
}
