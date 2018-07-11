import { JsonController, Body, Post, NotFoundError, CurrentUser, Param, BadRequestError} from 'routing-controllers'
import Turn from './entity'
import { Game, Player } from '../games/entity';
import {checkColors, checkPositions} from './gamelogic/logic'
import User from '../users/entity'
import { io } from '../index';


@JsonController()
export default class TurnController {

  @Post('/turns/:id([0-9]+)')
  async createTurn(
     @CurrentUser() user: User,
     @Param('id') gameId: number,
     @Body() turn: Partial<Turn>
  ) {
    const current_game = await Game.findOne(gameId)
    if(!current_game) throw new NotFoundError('Game not found ')

    const player = await Player.findOne({user, game: current_game})
    if (!player) throw new NotFoundError('you are not part of this game')

    if (current_game.status !== 'started') throw new NotFoundError('Game has not started')

    if(player.role !==  current_game.currentTurn) throw new BadRequestError(`It's not your turn`)

    const solution = current_game.solution


    const newTurn = Turn.create()
    newTurn.game = current_game
    newTurn.player = player
    if(!turn.userInput) throw new BadRequestError('no input!')
    newTurn.userInput = turn.userInput
    newTurn.colors_score = checkColors(solution, turn.userInput)
    newTurn.postitons_score = checkPositions(turn.userInput, solution)

   

    const turns = await Turn.query(`SELECT COUNT (id) FROM turns WHERE game_id=${current_game.id}`)
    newTurn.count = turns[0].count

    if (newTurn.count > 0){ 
      const previousTurn = await Turn.findOne({count: newTurn.count - 1})
      if(!previousTurn) throw new BadRequestError('no previus turn')
        if (previousTurn.status !== 'pending') throw new NotFoundError('Game is finished')
    
    }

    JSON.stringify(solution) === JSON.stringify(turn.userInput) ? turn.status = 'winner' : turn.status = 'pending'
    if (newTurn.count >= 19) turn.status = 'tie'

    current_game.currentTurn ==   'Player 1' ? 'Player 2' : 'Player 1'
    
    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: current_game
    })
    return newTurn.save()
  }
}


