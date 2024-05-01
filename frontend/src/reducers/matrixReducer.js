export const matrixReducer = (state, action) => {
  switch (action.type) {
    case "INIT_MATRIX":
      return action.payload;
    case "TOGGLE_CELL":
      return state.map((row, i) =>
        row.map((cell, j) => {
          if (i === action.row && j === action.col) {
            return { ...cell, value: action.value };
          }
          return cell;
        })
      );
    case "VISIT_CELL":
      return state.map((row, i) =>
        row.map((cell, j) => {
          if (i === action.row && j === action.col) {
            if (action.value === 3 || action.value === 2) {
              return { ...cell, visited: 1 };
            } else {
              return { ...cell, visited: 1, value: 4 };
            }
          }
          return cell;
        })
      );
    default:
      return state;
  }
};
