import { JsonController, Get, Param, Body, Post, Put, NotFoundError} from 'routing-controllers'
import Turn from './entity'
import { Game } from '../games/entity';

 const checkColors = (turn, solution) => {
     return [...new Set([]
                 .concat(...solution
                 .map((s, index) => turn
                 .map(g => s === g ? index : null)))
                 .filter(i => i !== null))]
                 .length;
 }

 const checkPositions = (turn, solution) => {
    return turn.filter((a, i) => a === solution[i]).length
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