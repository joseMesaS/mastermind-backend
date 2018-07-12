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
const entity_2 = require("../users/entity");
const index_1 = require("../index");
const logic_1 = require("../turns/gamelogic/logic");
let GamesController = class GamesController {
    getGames() {
        return entity_1.Game.find();
    }
    async joinGame(user, gameId) {
        const game = await entity_1.Game.findOne(gameId);
        if (!game)
            throw new routing_controllers_1.BadRequestError(`Game does not exist`);
        if (game.status !== 'pending')
            throw new routing_controllers_1.BadRequestError(`Game is already started`);
        game.status = 'started';
        await game.save();
        await entity_1.Player.create({
            game,
            user,
            role: 'Player 2'
        }).save();
        index_1.io.emit('action', {
            type: 'UPDATE_GAME',
            payload: await entity_1.Game.findOne(game.id)
        });
        return await entity_1.Game.findOne(game.id);
    }
    async createGame(name, user) {
        const newGame = entity_1.Game.create();
        newGame.name = name;
        newGame.solution = logic_1.createSolution();
        const entity = await newGame.save();
        await entity_1.Player.create({
            game: entity,
            user,
            role: 'Player 1'
        }).save();
        const game = await entity_1.Game.findOne(entity.id);
        index_1.io.emit('action', {
            type: 'ADD_GAME',
            payload: game
        });
        return game;
    }
};
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/games'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "getGames", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Post('/games/:id([0-9]+)'),
    routing_controllers_1.HttpCode(201),
    __param(0, routing_controllers_1.CurrentUser()),
    __param(1, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_2.default, Number]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "joinGame", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.Post('/games'),
    __param(0, routing_controllers_1.BodyParam('name')),
    __param(1, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, entity_2.default]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "createGame", null);
GamesController = __decorate([
    routing_controllers_1.JsonController()
], GamesController);
exports.default = GamesController;
//# sourceMappingURL=controller.js.map