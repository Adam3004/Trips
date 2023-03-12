import { Injectable } from '@angular/core';
import { Opinion } from '../models/opinion';
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root',
})
export class OpinionsService {
  ListOfOpinions: Opinion[] = [];

  constructor() {}

  addOpinion(newOpinion: Opinion) {
    this.ListOfOpinions.push(newOpinion);
  }

  editOpionions(oldTrip: Trip, newTrip: Trip) {
    this.ListOfOpinions.map((trip) => {
      if (trip.tripName == oldTrip.name) {
        trip.tripName = newTrip.name;
      }
    });
  }

  getOpinionsOfTrip(name: string) {
    return this.ListOfOpinions.filter((opinion: Opinion) => {
      return opinion.tripName == name;
    });
  }

  didUserAddeedOpinion(tripName: string, userEmail: string) {
    const result = this.ListOfOpinions.filter((opinion: Opinion) => {
      return opinion.nick == userEmail && opinion.tripName == tripName;
    });
    return result.length > 0;
  }
}
