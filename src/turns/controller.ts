import { JsonController, Body, Post, NotFoundError, CurrentUser, Param, BadRequestError, Authorized, Get} from 'routing-controllers'
import Turn from './entity'
import { Game, Player } from '../games/entity';
import {checkColors, checkPositions} from './gamelogic/logic'
import User from '../users/entity'
import { io } from '../index';


@JsonController()
export default class TurnController {

  @Authorized()
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

    if (current_game.status === 'finished') throw new NotFoundError(`Game is over and winner is ${current_game.winner}`)
    if (current_game.status !== 'started') throw new NotFoundError('Game has not started')
    
    if(player.role !==  current_game.currentTurn) throw new BadRequestError(`It's not your turn`)

    if(!turn.userInput) throw new BadRequestError('no input!')


    const newTurn = Turn.create()
    newTurn.game = current_game
    newTurn.player = player
    newTurn.userInput = turn.userInput
    newTurn.colors_score = checkColors(current_game.solution, turn.userInput)
    newTurn.postitons_score = checkPositions(turn.userInput, current_game.solution)

    
    const turnsCount = Number((await Turn.query(`SELECT COUNT (id) FROM turns WHERE game_id=${current_game.id}`))[0].count)


    if(newTurn.postitons_score === 4) {
      current_game.status = 'finished'
      current_game.winner = player.role
    }

    if(turnsCount >= 10 && current_game.winner === 'none'){
      current_game.status = 'finished'
      current_game.winner = 'no winner'
    }

    const newTurnSaved = await newTurn.save()
    current_game.currentTurn =   current_game.currentTurn === 'Player 1' ? 'Player 2' : 'Player 1'
    const savedGame = await current_game.save()


    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: savedGame
    })

    io.emit('action', {
      type: 'MAKE_TURN',
      payload: newTurnSaved
    })

    const TurnList = await Turn.query(`SELECT * FROM turns WHERE game_id=${current_game.id} ORDER BY created_at ASC`)

    io.emit('action', {
      type: 'GET_TURNS',
      payload: TurnList
    })
    
    return newTurnSaved
  }


 
    @Get('/turns/:id([0-9]+)')
    async getTurns(
      @Param('id') gameId: number
    ) {

      const current_game = await Game.findOne(gameId)
      if(!current_game) throw new NotFoundError('Game not found ')
      
      const TurnList = await Turn.query(`SELECT * FROM turns WHERE game_id=${current_game.id} ORDER BY created_at ASC`)

      io.emit('action', {
        type: 'GET_TURNS',
        payload: TurnList
      })
  
      return TurnList
    }
}


