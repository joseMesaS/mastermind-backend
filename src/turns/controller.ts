import { JsonController, Body, Post, NotFoundError, CurrentUser, Param} from 'routing-controllers'
import Turn from './entity'
import { Game, Player } from '../games/entity';
import {checkColors, checkPositions} from './gamelogic/logic'
import User from '../users/entity'


@JsonController()
export default class TurnController {

  @Post('/turns/:id([0-9]+)')
  async createTurn(
     @CurrentUser() user: User,
     @Param('id') gameId: number,
     @Body() turn: Turn
  ) {
    const current_game = await Game.findOne(gameId)
    if(!current_game) throw new NotFoundError('Game not found ')
    if (current_game.status !== 'started') throw new NotFoundError('Game has not started')
      const solution = current_game.solution

    const player = await Player.findOne({user, game: current_game})
    if (!player) throw new NotFoundError('Cannot find player')
    
    turn.colors_score = checkColors(turn.user_turn, solution)
    turn.postitons_score = checkPositions(turn.user_turn, solution)
    turn.game = current_game
    turn.player = player

    JSON.stringify(solution) === JSON.stringify(turn.user_turn) ? turn.winner = true : turn.winner = false
    const turns = await Turn.query(`SELECT COUNT * FROM turns WHERE game_id=${current_game.id}`)
    if (turns >= 19) throw new NotFoundError('The game is finished') 
    return turn.save()
  }
}


