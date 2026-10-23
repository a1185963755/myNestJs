import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  /** bcrypt 哈希，永不返回给客户端 */
  @Column()
  password: string;

  @Column({ nullable: true })
  email: string | null;

  /** 对应 Casbin 的 role:xxx 主体，默认最低权限 staff */
  @Column({ default: 'staff' })
  role: string;
}
