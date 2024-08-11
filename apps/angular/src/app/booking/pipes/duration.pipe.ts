import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  transform(durationInMinutes: number) {
    if (durationInMinutes < 60) {
      return `${durationInMinutes} min`;
    } else {
      const hours = `${Math.floor(durationInMinutes / 60)} hr`;
      const minutes =
        durationInMinutes % 60 === 0 ? '' : ` ${durationInMinutes % 60} min`;
      return `${hours}${minutes}`;
    }
  }
}
