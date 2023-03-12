export interface RatingOption {
  avg: number;
  sum: number;
  numberOfOpinions: number;
  userKeys?: string[];
  key?: string;
}

export class RatingOption {
  constructor(
    public avg: number,
    public sum: number,
    public numberOfOpinions: number,
    public userKeys?: string[]
  ) {}
}
