import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import Turn  from '../turns/entity'

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


  @OneToMany(type => Turn, turn => turn.game)
  turns: Turn;


  @CreateDateColumn({type: 'timestamp'})
  timeOfCreation: Date
}