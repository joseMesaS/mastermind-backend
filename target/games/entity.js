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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("typeorm/repository/BaseEntity");
const entity_1 = require("../turns/entity");
const entity_2 = require("../users/entity");
let Game = class Game extends BaseEntity_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Game.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(_ => entity_1.default, turn => turn.game),
    __metadata("design:type", entity_1.default)
], Game.prototype, "turns", void 0);
__decorate([
    typeorm_1.OneToMany(_ => Player, player => player.game, { eager: true }),
    __metadata("design:type", Array)
], Game.prototype, "players", void 0);
__decorate([
    typeorm_1.Column('json', { nullable: true }),
    __metadata("design:type", Array)
], Game.prototype, "solution", void 0);
__decorate([
    typeorm_1.Column('text', { default: 'Player 1' }),
    __metadata("design:type", String)
], Game.prototype, "currentTurn", void 0);
__decorate([
    typeorm_1.Column('text', { default: 'pending' }),
    __metadata("design:type", String)
], Game.prototype, "status", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Game.prototype, "timeOfCreation", void 0);
__decorate([
    typeorm_1.Column('text', { default: 'none' }),
    __metadata("design:type", String)
], Game.prototype, "winner", void 0);
Game = __decorate([
    typeorm_1.Entity()
], Game);
exports.Game = Game;
let Player = class Player extends BaseEntity_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Player.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => entity_2.default, user => user.players, { eager: true }),
    __metadata("design:type", entity_2.default)
], Player.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => Game, game => game.players),
    __metadata("design:type", Game)
], Player.prototype, "game", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], Player.prototype, "role", void 0);
__decorate([
    typeorm_1.OneToMany(_ => entity_1.default, turn => turn.player),
    __metadata("design:type", Array)
], Player.prototype, "turns", void 0);
Player = __decorate([
    typeorm_1.Entity()
], Player);
exports.Player = Player;
//# sourceMappingURL=entity.js.map