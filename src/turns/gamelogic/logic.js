export const getUserInput = () => {
    return readline.question("Enter 4 numbers: ").split('').map(a => +a)
}
export const createSolution = () => {
    let solution = []
    for (let i = 0; i < 4; i++) {solution.push(Math.floor(Math.random() * 6))}
    return solution
}
export const checkPositions = (guess, solution) => {
   return guess.filter((a, i) => a === solution[i]).length
}
export const checkColors = (guess, solution) => {
    return [...new Set([]
                .concat(...solution
                .map((s, index) => guess
                .map(g => s === g ? index : null)))
                .filter(i => i !== null))]
                .length;
}