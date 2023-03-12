export interface Opinion {
  nick: string;
  tripName: string;
  opinion: string;
  date?: Date;
}

export class Opinion {
  constructor(
    public nick: string,
    public tripName: string,
    public opinion: string,
    public date?: Date
  ) {}
}
