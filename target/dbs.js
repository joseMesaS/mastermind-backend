"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const DefaultNamingStrategy_1 = require("typeorm/naming-strategy/DefaultNamingStrategy");
const StringUtils_1 = require("typeorm/util/StringUtils");
const entity_1 = require("./users/entity");
const entity_2 = require("./games/entity");
const entity_3 = require("./turns/entity");
class CustomNamingStrategy extends DefaultNamingStrategy_1.DefaultNamingStrategy {
    tableName(targetName, userSpecifiedName) {
        return userSpecifiedName ? userSpecifiedName : StringUtils_1.snakeCase(targetName) + 's';
    }
    columnName(propertyName, customName, embeddedPrefixes) {
        return StringUtils_1.snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join("_"));
    }
    columnNameCustomized(customName) {
        return customName;
    }
    relationName(propertyName) {
        return StringUtils_1.snakeCase(propertyName);
    }
}
exports.default = () => typeorm_1.createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL || 'postgres://isbmljylcoowoe:863c95402f27bacb924d5ca4eff8d44a8692e0cf100026f5215306ec5ef1a715@ec2-54-217-235-137.eu-west-1.compute.amazonaws.com:5432/d22eacv32dkmcu',
    entities: [
        entity_1.default,
        entity_2.Game,
        entity_2.Player,
        entity_3.default
    ],
    synchronize: true,
    logging: true,
    namingStrategy: new CustomNamingStrategy()
})
    .then(_ => console.log('Connected to Postgres with TypeORM'));
//# sourceMappingURL=dbs.js.map