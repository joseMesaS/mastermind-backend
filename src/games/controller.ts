import { JsonController, Post, Get, Param, CurrentUser, Authorized, BodyParam} from 'routing-controllers'
import {Game, Player} from './entity'
import User from '../users/entity';
import {io} from '../index'
import {createSolution} from '../turns/gamelogic/logic'

@JsonController()
export default class GamesController {

    @Get('/games/:id')
    getGame(
        @Param('id') id: number
    ) {
        return Game.findOne(id)
    }

    
    @Authorized()
    @Post('/games')
    async createGame(
        @BodyParam('name') name : string,
        @CurrentUser() user: User
    ) {
        const newGame = Game.create()
        newGame.name = name
        newGame.solution = createSolution()
        const entity = await newGame.save()

        await Player.create({
        game: entity, 
        user
        }).save()

        const game = await Game.findOne(entity.id)

        io.emit('action', {
        type: 'ADD_GAME',
        payload: game
        })

        return game
    }

    
}
