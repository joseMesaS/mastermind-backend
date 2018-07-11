import { JsonController, Post, Get, Param, CurrentUser, Authorized, BodyParam, HttpCode, BadRequestError} from 'routing-controllers'
import {Game, Player} from './entity'
import User from '../users/entity';
import {io} from '../index'
import {createSolution} from '../turns/gamelogic/logic'

@JsonController()
export default class GamesController {


    @Authorized()
    @Get('/games')
    getGames() {
      return Game.find()
    }

    @Authorized()
    @Post('/games/:id([0-9]+)')
    @HttpCode(201)
    async joinGame(
        @CurrentUser() user: User,
        @Param('id') gameId: number
    ) {
        const game = await Game.findOne(gameId)
        if (!game) throw new BadRequestError(`Game does not exist`)
        if (game.status !== 'pending') throw new BadRequestError(`Game is already started`)

        game.status = 'started'
        await game.save()

        const player = await Player.create({
        game, 
        user,
        role: 'Player 2'
        }).save()

        io.emit('action', {
        type: 'UPDATE_GAME',
        payload: await Game.findOne(game.id)
        })

        return player
    }

    
    @Authorized()
    @HttpCode(201)
    @Post('/games')
    async createGame(
        @BodyParam('name') name : string,
        @CurrentUser() user: User
    ) {
        const newGame = Game.create()
        newGame.name = name
        newGame.solution = createSolution()
        console.log(newGame.solution)
        const entity = await newGame.save()

        await Player.create({
        game: entity, 
        user,
        role: 'Player 1'
        }).save()

        const game = await Game.findOne(entity.id)

        io.emit('action', {
        type: 'ADD_GAME',
        payload: game
        })

        return game
    }

    
}
