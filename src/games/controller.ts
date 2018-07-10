import { JsonController, Post, Get, Param, BodyParam, CurrentUser, Authorized } from 'routing-controllers'
import {Game, Player} from './entity'
import User from '../users/entity';

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
    @CurrentUser() user: User
    ) {
    
    const entity = await Game.create().save()
    console.log(entity)
    await Player.create({
        game: entity, 
        user
      }).save()

    const game = await Game.findOne(entity.id)
    
    // io.emit('action', {
    //   type: 'ADD_GAME',
    //   payload: game
    // })

    return game
    }

    
}
