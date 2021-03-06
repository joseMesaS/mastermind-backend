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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const entity_1 = require("./entity");
const index_1 = require("../index");
const entity_2 = require("../games/entity");
let UserController = class UserController {
    async createUser(data) {
        const { password } = data, rest = __rest(data, ["password"]);
        const entity = entity_1.default.create(rest);
        await entity.setPassword(password);
        const user = await entity.save();
        index_1.io.emit('action', {
            type: 'ADD_USER',
            payload: entity
        });
        return user;
    }
    getUser(id) {
        return entity_1.default.findOne(id);
    }
    async allUsers() {
        const users = await entity_1.default.find();
        const games = await entity_2.Game.find();
        const finishedGames = games.filter(g => g.status === 'finished' && g.players.length > 1);
        const gameResults = finishedGames.map(f => f.players.map(p => { return { userId: p.user.id, winner: f.winner, playerRole: p.role, gameId: f.id }; }));
        const gameScores = gameResults.map(g => g.map(a => {
            let tied = 0;
            let won = 0;
            let lost = 0;
            if (a.winner === 'no winner') {
                tied = 1;
            }
            else if (a.winner === a.playerRole) {
                won = 1;
            }
            else if (a.winner !== a.playerRole) {
                lost = 1;
            }
            return {
                userId: a.userId,
                won: won,
                lost: lost,
                tied: tied,
                gameId: a.gameId
            };
        }))
            .reduce((acc, val) => { return acc.concat(val); }, []);
        const uniquePlayers = gameScores.map(a => a.userId).filter((item, pos) => gameScores.map(a => a.userId).indexOf(item) == pos);
        const playerScores = uniquePlayers.map(u => gameScores.filter(g => g.userId === u)
            .reduce((acc, val) => {
            return { userId: val.userId, won: acc.won + val.won, lost: acc.lost + val.lost, tied: acc.tied + val.tied, gameId: val.gameId };
        }), {});
        const addedScores = users.map(u => {
            const playerScore = playerScores.find(k => k.userId === u.id);
            if (playerScore) {
                u['won'] = playerScore.won;
                u['lost'] = playerScore.lost;
                u['tied'] = playerScore.tied;
                u['score'] = (playerScore.won * 3) + (playerScore.tied * 2) + (playerScore.lost * 1);
                return u;
            }
            else {
                u['won'] = 0;
                u['lost'] = 0;
                u['tied'] = 0;
                u['score'] = 0;
                return u;
            }
        });
        return addedScores;
    }
};
__decorate([
    routing_controllers_1.Post('/users'),
    __param(0, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_1.default]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/users/:id([0-9]+)'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUser", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "allUsers", null);
UserController = __decorate([
    routing_controllers_1.JsonController()
], UserController);
exports.default = UserController;
//# sourceMappingURL=controller.js.map