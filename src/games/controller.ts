import { JsonController, Post, Get, Param, BodyParam } from 'routing-controllers'
import Game from './entity'

@JsonController()
export default class GamesController {

    @Get('/games/:id')
    getGame(
        @Param('id') id: number
    ) {
        return Game.findOne(id)
    }

    @Post('/games')
    async createGame(
    @BodyParam('name') name: string
    ) {
    const newGame = Game.create()
    newGame.name = name
    newGame.save()

    }
}
