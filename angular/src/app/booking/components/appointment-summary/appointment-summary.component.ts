import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Signal
} from '@angular/core';
import { UserService } from 'src/app/user/user.service';
import { Appointment } from '@shared/types/appointment';
import { UserProfile } from '@shared/types/user-profile';
@Component({
  selector: 'appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentSummaryComponent {
  @Input() appointment: Appointment;
  @Input() timeZone: string | undefined;
  @Output() goToAppointments: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly userService: UserService) {}

  get currUserProfile(): Signal<UserProfile | null> {
    return this.userService.getCurrUserProfile();
  }

  onGoToAppointments(): void {
    this.goToAppointments.emit();
  }
}
