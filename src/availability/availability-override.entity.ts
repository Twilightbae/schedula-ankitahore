import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AvailabilityOverride {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  doctorId: number;

  @Column()
  date: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
}