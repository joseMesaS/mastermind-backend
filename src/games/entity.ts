import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import Turn  from '../turns/entity';
import User from '../users/entity';
 

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text',{nullable:true})
  name: string;

  @OneToMany(_ => Turn, turn => turn.game)
  turns: Turn;

  @OneToMany(_ => Player, player => player.game, {eager:true})
  players: Player[];

  @Column('json',{nullable:true})
  solution: number[];

  @Column('text',{default: 'Player 1'})
  currentTurn: string;

  @Column('text', {default: 'pending'})
  status: string;

  @CreateDateColumn({type: 'timestamp'})
  timeOfCreation: Date;

  @Column('text', {default: 'none'})
  winner: string;
}


@Entity()
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(_ => User, user => user.players, {eager:true})
  user: User;

  @ManyToOne(_ => Game, game => game.players)
  game: Game;

  @Column('text',{nullable:true})
  role: string;

  @OneToMany(_ => Turn, turn => turn.player)
  turns: Turn[];

}