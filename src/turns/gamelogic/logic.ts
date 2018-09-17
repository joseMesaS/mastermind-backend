export const createSolution = () => {
  let solution = new Array();
  while (solution.length<4) {

    const random = Math.floor( Math.random() * 6);
    if(solution.indexOf(random) === -1) solution.push(random);
    
  }
  return solution;
};

export const checkPositions = (guess, solution) => {
  return guess.filter((a, i) => a === solution[i]).length;
};

export const checkColors = (guess, solution) => {
  return guess.filter(element => solution.indexOf(element)!==-1).length;
};

