import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import Game from '../games/entity';
import User from '../users/entity';



@Entity()
export default class Turn extends BaseEntity {
 
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => Game, game => game.turns)
  game: Game;

  @ManyToMany(type => Player, player => player.turns)
  player: Player;

  @Column('integer', {nullable:true})
  user_turn: number[]
  
  @Column('integer', {nullable:true})
  colors_score: number

  @Column('integer', {nullable:true})
  postitons_score: number

  @CreateDateColumn({type: "timestamp"})
  created_at: Date;

  @UpdateDateColumn({type: "timestamp"})
  updated_at: Date;
}