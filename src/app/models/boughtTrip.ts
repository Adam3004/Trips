export interface BoughtTrip {
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  unitPrice: number;
  imgLink: string;
  buyDate: string;
  amount: number;
  key?: string;
}

export class BoughtTrip {
  constructor(
    public name: string,
    public destination: string,
    public startDate: Date,
    public endDate: Date,
    public unitPrice: number,
    public imgLink: string,
    public buyDate: string,
    public amount: number
  ) {}
}
