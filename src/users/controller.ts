import { JsonController, Body, Post, Get, Param } from 'routing-controllers'
import User from './entity'

@JsonController()
export default class UserController {

    @Get('/users/:id')
    getUser(
        @Param('id') id: number
    ) {
        return User.findOne(id)
    }

    @Post('/users')
    async createUser(
    @Body() user: User
    ) {
    const {password, ...rest} = user
    const entity = User.create(rest)
    await entity.setPassword(password)
    return entity.save()
    }
}
