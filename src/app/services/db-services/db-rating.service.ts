import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { RatingOption } from '../../models/ratingOptions';

@Injectable({
  providedIn: 'root',
})
export class DbRatingService {
  private dbPath = '/rating';
  ratingRef: AngularFireList<RatingOption>;
  constructor(private db: AngularFireDatabase) {
    this.ratingRef = db.list(this.dbPath);
  }

  createRatingInDB(trip: RatingOption): void {
    this.ratingRef.push(trip);
  }

  getRatingFromDB() {
    return this.ratingRef;
  }

  updateRatingInDB(key: string, value: any) {
    console.log(key);
    return this.ratingRef.update(key, value);
  }
}
