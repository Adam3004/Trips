import { Component, Output, EventEmitter } from '@angular/core';
import { FilterTripsService } from '../../services/filter-trips.service';
import { ListOfTripsService } from '../../services/list-of-trips.service';
import { Trip } from '../../models/trip';

@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css'],
})
export class TripFormComponent {
  test?: String;
  model: Trip = new Trip(
    '',
    '',
    new Date(2020, 12, 30, 0, 0, 0, 0),
    new Date(2020, 12, 29, 0, 0, 0, 0),
    1,
    1,
    '',
    'https://photo-cdn2.icons8.com/lgdZNfh5nEYBicqJ5c5CCq8ga59fjVE41HXYh3DLdPs/rs:fit:1608:1072/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5l/eHRlcm5hbC9hMmE0/Mi9jZTQ5ZjYyOTJl/YTI0MjA4OWFiMzA2/MWE5N2ViMGExNy5q/cGc.jpg'
  );
  datesGood: number = 0;
  @Output() tripToEmit: EventEmitter<Trip> = new EventEmitter<Trip>();

  submitted = false;

  constructor(private listOfTrips: ListOfTripsService) {}

  onSubmit(): void {
    if (
      this.compareDates(
        this.model.startDate.toString(),
        new Date().toJSON().split('T')[0]
      )
    ) {
      this.datesGood = 3;
    } else if (this.model.endDate >= this.model.startDate) {
      this.submitted = true;
      this.datesGood = 1;
      console.log(this.listOfTrips.Trips)
      this.listOfTrips.getNewTrip(this.model);
      this.resetModel();
    } else {
      this.datesGood = 2;
    }
  }

  resetModel(): void {
    this.model = new Trip(
      '',
      '',
      new Date(2020, 12, 30, 0, 0, 0, 0),
      new Date(2020, 12, 29, 0, 0, 0, 0),
      1,
      1,
      '',
      'https://photo-cdn2.icons8.com/lgdZNfh5nEYBicqJ5c5CCq8ga59fjVE41HXYh3DLdPs/rs:fit:1608:1072/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5l/eHRlcm5hbC9hMmE0/Mi9jZTQ5ZjYyOTJl/YTI0MjA4OWFiMzA2/MWE5N2ViMGExNy5q/cGc.jpg'
    );
  }

  newTrip(): void {
    this.model = new Trip(
      '',
      '',
      new Date(2020, 12, 30, 0, 0, 0, 0),
      new Date(2020, 12, 29, 0, 0, 0, 0),
      1,
      1,
      '',
      ''
    );
  }

  compareDates(trying: string, curr: string): boolean {
    if (parseInt(trying.split('-')[0]) - parseInt(curr.split('-')[0]) < 0) {
      return true;
    } else if (
      parseInt(trying.split('-')[0]) - parseInt(curr.split('-')[0]) ==
      0
    ) {
      if (parseInt(trying.split('-')[1]) - parseInt(curr.split('-')[1]) < 0) {
        return true;
      } else if (
        parseInt(trying.split('-')[1]) - parseInt(curr.split('-')[1]) ==
        0
      ) {
        if (
          parseInt(trying.split('-')[2]) - parseInt(curr.split('-')[2]) <=
          0
        ) {
          return true;
        }
        return false;
      }
    }
    return false;
  }
}
