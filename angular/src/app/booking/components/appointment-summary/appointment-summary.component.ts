import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserService } from 'src/app/user/user.service';
import { Appointment } from 'types/appointment';
import { UserProfile } from 'types/user-profile';
@Component({
  selector: 'appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentSummaryComponent {
  @Input() appointment: Appointment;
  @Input() timeZone: string | undefined;

  constructor(private readonly userService: UserService) {}

  get userProfileSnapshot(): UserProfile | null {
    return this.userService.getUserProfileSnapshot();
  }
}
