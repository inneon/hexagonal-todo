import { ForGettingTime } from '@hexagonal-todo/drivenPorts';

export class GettingSystemTime implements ForGettingTime {
  getNow(): Date {
    return new Date();
  }
}
