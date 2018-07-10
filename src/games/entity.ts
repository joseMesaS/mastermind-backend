import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import Turn  from '../turns/entity'
import User from '../users/entity'
 

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('text',{nullable:true})
  name: string

  @OneToMany(_ => Turn, turn => turn.game)
  turns: Turn;

  @OneToMany(_ => Player, player => player.game, {eager:true})
  players: Player[]

  @Column('json',{nullable:true})
  solution: number[]

  @Column('text', {default: 'pending'})
  status: string

  @CreateDateColumn({type: 'timestamp'})
  timeOfCreation: Date
}


@Entity()
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  @OneToMany(_ => Turn, turn => turn.player)
  turns: Turn[];

}