export interface Trip {
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  unitPrice: number;
  maxPlaces: number;
  description: string;
  imgLink: string;
  key?: string;
}

export class Trip {
  constructor(
    public name: string,
    public destination: string,
    public startDate: Date,
    public endDate: Date,
    public unitPrice: number,
    public maxPlaces: number,
    public description: string,
    public imgLink: string,
  ) {}
}
