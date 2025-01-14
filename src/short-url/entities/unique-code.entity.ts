import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UniqueCode {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    length: 10,
    comment: '唯一码',
  })
  code: string;

  @Column({
    comment: '状态 0:未使用 1:已使用',
  })
  status: number;
}
