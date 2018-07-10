import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'



@Entity()
export default class Turn extends BaseEntity {
 
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(type => Game, game => game.turns)
  game: Game;

  @ManyToOne(type => User, user => user.turns)
  user: User;

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