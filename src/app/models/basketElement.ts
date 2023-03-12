export interface BasketElement {
  key: string;
  tripName: string;
  price: number;
  amount: number;
  imgLink: string;
}

export class BasketElement {
  constructor(
    public key: string,
    public tripName: string,
    public price: number,
    public amount: number,
    public imgLink: string
  ) {}
}
