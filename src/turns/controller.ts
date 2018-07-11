import { JsonController, Body, Post, NotFoundError, CurrentUser, Param, BadRequestError} from 'routing-controllers'
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
 
     turn.game = current_game
     turn.player = player
     turn.user_turn = JSON.parse(turn.user_turn)
 
     turn.colors_score = checkColors(solution, turn.user_turn)
     turn.postitons_score = checkPositions(turn.user_turn, solution)
 
     const turns = await Turn.query(`SELECT COUNT (id) FROM turns WHERE game_id=${current_game.id}`)
     turn.count = turns[0].count
 
    if (turn.count > 0){ 
      const previousTurn = await Turn.findOne({count: turn.count - 1})
      if(!previousTurn) throw new BadRequestError('nost previus turn ')
        if (previousTurn.status !== 'pending') throw new NotFoundError('Game is finished')
    
    }

     JSON.stringify(solution) === JSON.stringify(turn.user_turn) ? turn.status = 'winner' : turn.status = 'pending'
     if (turn.count >= 19) turn.status = 'tie'
 
 
     return turn.save()
   }
 }


// import { JsonController, Body, Post, NotFoundError, CurrentUser, Param, BadRequestError, Authorized, Get, ForbiddenError} from 'routing-controllers'
// import Turn from './entity'
// import { Game, Player } from '../games/entity';
// // import {checkColors, checkPositions} from './gamelogic/logic'
// import User from '../users/entity'


// @JsonController()
// export default class TurnController {
//   @Authorized()
//   @Post('/turns/:id')
//   async createTurn(
//      @CurrentUser() user: User,
//      @Param('id') gameId: number,
//      @Body() turn: Partial<Turn>
//   ) {
      
//       const current_game = await Game.findOne(gameId)
//       if(!current_game) throw new NotFoundError('Game not found ')

//       const player = await Player.findOne({user, game: current_game})
//       if (!player) throw new ForbiddenError('You are not part of this game')
//       if (current_game.status !== 'started') throw new BadRequestError('Game has not started')

//       if(player.role !==  current_game.currentTurn) throw new BadRequestError(`It's not your turn`)
      
//       const solution = current_game.solution

      
      
//       // turn.colors_score = checkColors(turn.user_turn, solution)
//       // turn.postitons_score = checkPositions(turn.user_turn, solution)
//       turn.game = current_game
//       turn.player = player
//       console.log(turn)
//       JSON.stringify(solution) === JSON.stringify(turn.userInput) ? turn.winner = true : turn.winner = false
//       if(turn.winner) throw new BadRequestError('The game is over!')
//       return await Turn.create(turn).save()
//       // const turns = await Turn.query(`SELECT COUNT * FROM turns WHERE game_id=${current_game.id}`)
//       // if (turns >= 19) throw new NotFoundError('The game is finished') 
      
 
//     }

   
//     @Authorized()
//     @Get('/turns')
//     getTurns() {
//       return Turn.findAndCount()
//     }


// }






