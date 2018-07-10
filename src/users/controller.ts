import { JsonController, Body, Post, Get, Param } from 'routing-controllers'
import User from './entity'
import { io } from '..'

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
    @Body() data: User
    ) {
        const {password, ...rest} = data
        const entity = User.create(rest)
        await entity.setPassword(password)
        const user  = await entity.save()

        // io.emit('action', {
        //     type: 'ADD_USER',
        //     payload: entity
        // })

        return user

    }
}
