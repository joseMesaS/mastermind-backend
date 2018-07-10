import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, Index } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import Turn  from '../turns/entity'
import User from '../users/entity'

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('text')
  name: string

  @Column()
  idPlayer1: number


  @Column()
  idPlayer2: number


//   @OneToMany(_ => Turn, turn => turn.game)
//   turns: Turn;

  @OneToMany(_ => Player, player => player.game, {eager:true})
  players: Player[]

  @Column('json')
  solution: number[]

  @CreateDateColumn({type: 'timestamp'})
  timeOfCreation: Date
}


@Entity()
// @Index(['game', 'user'], {unique:true})
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

//   @Column()
//   userId: number

//   @ManyToOne(_ => Turn, turn => turn.player)
//   turns: Turn[];

}