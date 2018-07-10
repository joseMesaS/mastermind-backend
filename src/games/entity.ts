import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'


@Entity()
export default class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('text')
  name: string

  @Column()
  idPlayer1: number


  @Column()
  idPlayer2: number

  @CreateDateColumn({type: 'timestamp'})
  timeOfCreation: Date
}