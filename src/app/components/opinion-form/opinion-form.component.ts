import { Component, Input, OnInit } from '@angular/core';
import { ListOfTripsService } from '../../services/list-of-trips.service';
import { Opinion } from '../../models/opinion';
import { OpinionsService } from '../../services/opinions.service';
import { Trip } from '../../models/trip';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Roles } from 'src/app/enums/roles';
import { BoughtTripsComponent } from '../bought-trips/bought-trips.component';
import { BoughtTrip } from 'src/app/models/boughtTrip';
import { BoughtTripsService } from 'src/app/services/bought-trips.service';

@Component({
  selector: 'app-opinion-form',
  templateUrl: './opinion-form.component.html',
  styleUrls: ['./opinion-form.component.css'],
})
export class OpinionFormComponent implements OnInit {
  @Input() tripName?: string;
  opinion: Opinion = new Opinion('', this.tripName ? this.tripName : '', '');
  Errors: boolean[] = [false, false, false, false, false, false, false];

  constructor(
    private listOfTrips: ListOfTripsService,
    private opinionsService: OpinionsService,
    private authService: AuthService,
    private userService: UserService, // private boughtTrips: BoughtTripsComponent
    private boughtTripsService: BoughtTripsService
  ) {}

  onSubmit(): void {
    let everythingOk: boolean = true;
    // if (this.opinion.nick == '') {
    //   this.Errors[0] = true;
    //   everythingOk = false;
    // }
    if (this.opinion.opinion.length < 50 || this.opinion.opinion.length > 500) {
      this.Errors[1] = true;
      everythingOk = false;
    }
    if (!this.isNameInList(this.opinion.tripName)) {
      this.Errors[2] = true;
      everythingOk = false;
    }
    if (
      this.userService.getSessionUser() !== null &&
      this.userService.getSessionUser()!.isBlocked
    ) {
      this.Errors[3] = true;
      everythingOk = false;
    }
    if (!this.authService.isLogged()) {
      this.Errors[4] = true;
      everythingOk = false;
    }
    if (!this.boughtTripsService.checkWasGuestOnTrip(this.tripName!)) {
      this.Errors[5] = true;
      everythingOk = false;
    }
    if (
      this.opinionsService.didUserAddeedOpinion(
        this.tripName!,
        this.userService.getSessionUser()!.email
      )
    ) {
      this.Errors[6] = true;
      everythingOk = false;
    }
    if (everythingOk) {
      console.log('its ok');
      this.opinion.nick = this.userService.getSessionUser()!.email;
      this.opinionsService.addOpinion(this.opinion);
      this.resetOpinion();
    }
  }

  isNameInList(tripName: string): boolean {
    let tmpList: Trip[] = this.listOfTrips.Trips.filter((trip: Trip) => {
      return trip.name == tripName;
    });
    return tmpList.length > 0;
  }

  resetOpinion(): void {
    this.opinion = new Opinion('', this.tripName ? this.tripName : '', '');
    this.Errors = this.Errors.map((data) => (data = false));
  }

  ngOnInit(): void {
    this.resetOpinion();
    this.listOfTrips.ngOnInit();
  }

  // checkWasGuestOnTrip() {
  //   const boughtTrip: BoughtTrip | null = this.boughtTripsService.findBought(
  //     this.tripName!
  //   );
  //   if (boughtTrip == null) {
  //     return false;
  //   }
  //   if (this.checkStatus(boughtTrip) == 'ended') {
  //     return true;
  //   }
  //   return false;
  // }

  // checkStatus(trip: BoughtTrip): string {
  //   const now: string = this.boughtTripsService.formatDate(new Date());
  //   if (this.boughtTripsService.compareDates(now, trip.startDate.toString())) {
  //     return 'waiting';
  //   } else {
  //     if (this.boughtTripsService.compareDates(now, trip.endDate.toString())) {
  //       return 'active';
  //     } else {
  //       return 'ended';
  //     }
  //   }
  // }
}
