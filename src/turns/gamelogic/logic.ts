
export const createSolution = () => {
    let solution = new Array()
    for (let i = 0; i < 4; i++) {
      const random = Math.random() * 6;
      const floor = Math.floor(random)
      solution.push(floor)
    }
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

// export const checkIfWon = (guesses) => {
//     return guesses.filter(a => positions(a) === 4)
// }