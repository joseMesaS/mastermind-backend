"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSolution = () => {
    let solution = new Array();
    while (solution.length < 4) {
        const random = Math.floor(Math.random() * 6);
        if (solution.indexOf(random) === -1)
            solution.push(random);
    }
    return solution;
};
exports.checkPositions = (guess, solution) => {
    return guess.filter((a, i) => a === solution[i]).length;
};
exports.checkColors = (guess, solution) => {
    return guess.filter(element => solution.indexOf(element) !== -1).length;
};
//# sourceMappingURL=logic.js.map