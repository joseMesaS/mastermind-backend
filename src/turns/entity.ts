import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import {Game, Player } from '../games/entity';




@Entity()
export default class Turn extends BaseEntity {
 
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => Game, game => game.turns)
  game: Game;

  @ManyToOne(_ => Player, player => player.turns)
  player: Player;

  @Column('integer', {nullable:true})
  user_turn: number[]
  
  @Column('integer', {nullable:true})
  colors_score: number

  @Column('integer', {nullable:true})
  postitons_score: number

  @Column('boolean', {nullable:true})
  winner: boolean

  @CreateDateColumn({type: "timestamp"})
  created_at: Date;
}