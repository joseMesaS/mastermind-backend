import { JsonController, Get, Param, Body, Post, Put, NotFoundError} from 'routing-controllers'
import Turn from './entity'
import { Game } from '../games/entity';
import {checkColors, checkPositions} from './gamelogic/logic'

export const createSolution = () => {
  let solution = new Array(4)
  for (let i = 0; i < 4; i++) {
    const random = Math.random() * 6;
    const floor = Math.floor(random)
    solution.push(floor)
  }
  return solution
}
@JsonController()
export default class TurnController {

  @Post('/turns')
  async createTurn(
     @Body() turn: Turn
  ) {
    const current_game = await Game.findOne(turn.game)
    if(!current_game) throw new NotFoundError('game not found ')
    const solution = current_game.solution
    turn.colors_score = checkColors(turn.user_turn, solution)
    turn.postitons_score = checkPositions(turn.user_turn, solution)
    return turn.save()
  }
}