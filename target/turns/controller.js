"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const entity_1 = require("./entity");
const entity_2 = require("../games/entity");
const logic_1 = require("./gamelogic/logic");
const entity_3 = require("../users/entity");
const index_1 = require("../index");
let TurnController = class TurnController {
    async createTurn(user, gameId, turn) {
        const current_game = await entity_2.Game.findOne(gameId);
        if (!current_game)
            throw new routing_controllers_1.NotFoundError('Game not found ');
        const player = await entity_2.Player.findOne({ user, game: current_game });
        if (!player)
            throw new routing_controllers_1.NotFoundError('you are not part of this game');
        if (current_game.status === 'finished')
            throw new routing_controllers_1.NotFoundError(`Game is over and winner is ${current_game.winner}`);
        if (current_game.status !== 'started')
            throw new routing_controllers_1.NotFoundError('Game has not started');
        if (player.role !== current_game.currentTurn)
            throw new routing_controllers_1.BadRequestError(`It's not your turn`);
        if (!turn.userInput)
            throw new routing_controllers_1.BadRequestError('no input!');
        const newTurn = entity_1.default.create();
        newTurn.game = current_game;
        newTurn.player = player;
        newTurn.userInput = turn.userInput;
        newTurn.postitons_score = logic_1.checkPositions(turn.userInput, current_game.solution);
        newTurn.colors_score = logic_1.checkColors(current_game.solution, turn.userInput) - newTurn.postitons_score;
        const turnsCount = Number((await entity_1.default.query(`SELECT COUNT (id) FROM turns WHERE game_id=${current_game.id}`))[0].count);
        if (newTurn.postitons_score === 4) {
            current_game.status = 'finished';
            current_game.winner = player.role;
        }
        if (turnsCount >= 10 && current_game.winner === 'none') {
            current_game.status = 'finished';
            current_game.winner = 'no winner';
        }
        const newTurnSaved = await newTurn.save();
        current_game.currentTurn = current_game.currentTurn === 'Player 1' ? 'Player 2' : 'Player 1';
        const savedGame = await current_game.save();
        index_1.io.emit('action', {
            type: 'UPDATE_GAME',
            payload: savedGame
        });
        index_1.io.emit('action', {
            type: 'MAKE_TURN',
            payload: newTurnSaved
        });
        const TurnList = await entity_1.default.query(`SELECT * FROM turns WHERE game_id=${current_game.id} ORDER BY created_at ASC`);
        index_1.io.emit('action', {
            type: 'GET_TURNS',
            payload: TurnList
        });
        return newTurnSaved;
    }
    async getTurns(gameId) {
        const current_game = await entity_2.Game.findOne(gameId);
        if (!current_game)
            throw new routing_controllers_1.NotFoundError('Game not found ');
        const TurnList = await entity_1.default.query(`SELECT * FROM turns WHERE game_id=${current_game.id} ORDER BY created_at ASC`);
        index_1.io.emit('action', {
            type: 'GET_TURNS',
            payload: TurnList
        });
        return TurnList;
    }
};
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Post('/turns/:id([0-9]+)'),
    __param(0, routing_controllers_1.CurrentUser()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_3.default, Number, Object]),
    __metadata("design:returntype", Promise)
], TurnController.prototype, "createTurn", null);
__decorate([
    routing_controllers_1.Get('/turns/:id([0-9]+)'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TurnController.prototype, "getTurns", null);
TurnController = __decorate([
    routing_controllers_1.JsonController()
], TurnController);
exports.default = TurnController;
//# sourceMappingURL=controller.js.map