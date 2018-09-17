import { JsonController, Body, Post, Get, Param, Authorized } from 'routing-controllers'
import User from './entity'
import { io } from '../index'
import { Game } from '../games/entity';

@JsonController()
export default class UserController {

    @Post('/users')
    async createUser(
    @Body() data: User
    ) {
        const {password, ...rest} = data
        const entity = User.create(rest)
        await entity.setPassword(password)
        const user  = await entity.save()

        io.emit('action', {
            type: 'ADD_USER',
            payload: entity
        })

        return user

    }


    @Authorized()
    @Get('/users/:id([0-9]+)')
    getUser(
      @Param('id') id: number
    ) {
      return User.findOne(id)
    }
  
    @Authorized()
    @Get('/users')
    async allUsers() {
        const users = await User.find()
        const games = await Game.find()
        const finishedGames = games.filter(g => g.status === 'finished' && g.players.length > 1)
        const gameResults = finishedGames.map(f => f.players.map(p => {return {userId: p.user.id, winner: f.winner, playerRole: p.role, gameId: f.id}}))
        const gameScores = gameResults.map(g => g.map(a =>  {
          let tied = 0
          let won = 0
          let lost = 0
          if (a.winner === 'no winner') {tied = 1} 
          else if (a.winner === a.playerRole) {won = 1} 
          else if (a.winner !== a.playerRole) {lost = 1}
          return {
            userId: a.userId,
            won: won,
            lost: lost,
            tied: tied,
            gameId: a.gameId
          }
        }))
        .reduce((acc, val) => {return acc.concat(val)},[])
      const uniquePlayers = gameScores.map(a => a.userId).filter((item, pos) =>  gameScores.map(a => a.userId).indexOf(item)== pos);
      const playerScores = uniquePlayers.map(u => gameScores.filter(g => g.userId === u)
      .reduce((acc, val) => {
        return {userId: val.userId, won: acc.won + val.won, lost: acc.lost + val.lost, tied: acc.tied + val.tied, gameId: val.gameId}
      }), {})
      const addedScores = users.map(u => {
        // const userId = u.id
        // return userId
        const playerScore = playerScores.find(k => k.userId === u.id)
        if (playerScore) {
            u['won'] = playerScore.won
            u['lost'] = playerScore.lost
            u['tied'] = playerScore.tied
            u['score'] = (playerScore.won * 3) + (playerScore.tied * 2) + (playerScore.lost * 1)
            return u
        } else {
          u['won'] = 0
          u['lost'] = 0
          u['tied'] = 0
          u['score'] = 0
          return u
        }
      })
      // return playerScores
      return addedScores
      // return users
    }
}
