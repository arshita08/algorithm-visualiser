import React, { useState, useEffect, useReducer } from "react";
import styles from "../styles/screens/GraphScreen.module.scss";
import { matrixReducer } from "../reducers/matrixReducer";

const GraphScreen = () => {
  /*
    value meaning
      0       nonVisited  - white
      1       wall        - black
      2       startnode   - green
      3       endnode     - red
      4       visited     - traversal
  */

  const nrows = 10;
  const ncols = 20;
  const delayValue = 50;

  const [startCell, setStartCell] = useState({
    row: 4,
    col: 6,
    value: 0,
    visited: 0,
  });
  const [endCell, setEndCell] = useState({
    row: 0,
    col: 0,
    value: 0,
    visited: 0,
  });

  // Initial state setup for the reducer
  const createInitialMatrix = () => {
    return Array.from({ length: nrows }, (_, i) =>
      Array.from({ length: ncols }, (_, j) => ({
        row: i,
        col: j,
        value:
          i === 4 && j === 6 ? 2 : i === nrows - 3 && j === ncols - 3 ? 3 : 0,
        visited: 0,
      }))
    );
  };

  const [matrix, dispatch] = useReducer(matrixReducer, createInitialMatrix());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartValue, setDragStartValue] = useState({
    startRow: null,
    startCol: null,
    value: null,
  });
  const [endFound, setEndFound] = useState(false);

  const handleMouseDown = (row, col) => {
    let currentValue;
    if (matrix[row][col].value !== 2 && matrix[row][col].value !== 3) {
      currentValue = matrix[row][col].value === 1 ? 0 : 1;
    } else {
      currentValue = matrix[row][col].value;
    }
    console.log(`Mouse Down: ${currentValue}`);
    setIsDragging(true);
    setDragStartValue({ startRow: row, startCol: col, value: currentValue });
    // toggleCell(row, col, currentValue);
    dispatch({ type: "TOGGLE_CELL", row, col, value: currentValue });
  };

  const handleMouseEnter = (row, col) => {
    if (
      isDragging &&
      dragStartValue.value !== 2 &&
      dragStartValue.value !== 3 &&
      // BUG FIX Start/End cell value change ================>
      matrix[row][col].value !== 2 &&
      matrix[row][col].value !== 3
    ) {
      // toggleCell(row, col, dragStartValue.value);
      dispatch({ type: "TOGGLE_CELL", row, col, value: dragStartValue.value });
    }
  };

  const handleMouseUp = (row, col) => {
    if (isDragging) {
      // Prevent dragging start node to end node or vice versa
      if (dragStartValue.value === 2 && matrix[row][col].value === 3) {
        console.log("Cannot move start node to end node.");
      } else if (dragStartValue.value === 3 && matrix[row][col].value === 2) {
        console.log("Cannot move end node to start node.");
      } else {
        // Handle the toggle operation
        dispatch({
          type: "TOGGLE_CELL",
          row,
          col,
          value: dragStartValue.value,
        });

        // Clear the previous start/end cell value in the matrix if moving start or end
        if (dragStartValue.value === 2 || dragStartValue.value === 3) {
          dispatch({
            type: "TOGGLE_CELL",
            row: dragStartValue.startRow,
            col: dragStartValue.startCol,
            value: 0,
          });

          // Update the start/end cell state and matrix
          if (dragStartValue.value === 2) {
            setStartCell({ row, col, value: 2, visited: 0 });
            dispatch({ type: "TOGGLE_CELL", row, col, value: 2 });
          } else if (dragStartValue.value === 3) {
            setEndCell({ row, col, value: 3, visited: 0 });
            dispatch({ type: "TOGGLE_CELL", row, col, value: 3 });
          }
        }
      }
    }

    setIsDragging(false);
    setDragStartValue({ startRow: null, startCol: null, value: null });
    console.log(`mouse up: ${dragStartValue}`);
  };

  function delay(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  const resetMatrix = () => {
    dispatch({ type: "INIT_MATRIX", payload: createInitialMatrix() });
    setEndFound(false);
  };

  const bfs = async () => {
    // console.log("bfs called");
    let queue = [];
    let visited = new Set();
    visited.add(`${startCell.row},${startCell.col}`);
    queue.push({ row: startCell.row, col: startCell.col });

    const directions = [
      [1, 0], // Down
      [0, 1], // Right
      [-1, 0], // Up
      [0, -1], // Left
    ];

    while (queue.length > 0 && !endFound) {
      const { row, col } = queue.shift();
      console.log(`${row} ${col}`);

      dispatch({ type: "VISIT_CELL", row, col, value: matrix[row][col].value });
      await delay(delayValue);

      if (matrix[row][col].value === 3) {
        setEndFound(true);
        console.log("End cell found at", row, col);
        setShowGif(1);
        break; // Break the loop as we have found the end cell
      }

      // console.log("processing...");
      directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        const key = `${newRow},${newCol}`;
        if (
          newRow >= 0 &&
          newRow < nrows &&
          newCol >= 0 &&
          newCol < ncols &&
          matrix[newRow][newCol].value !== 1 &&
          !visited.has(key)
        ) {
          queue.push({ row: newRow, col: newCol });
          visited.add(key); // Mark this cell as visited
        }
      });
    }
  };

  const dfs = async () => {
    let stack = [];
    let visited = new Set();
    let startKey = `${startCell.row},${startCell.col}`;

    stack.push({ row: startCell.row, col: startCell.col });
    visited.add(startKey);

    const directions = [
      [1, 0], // Down
      [0, 1], // Right
      [-1, 0], // Up
      [0, -1], // Left
    ];

    while (stack.length > 0 && !endFound) {
      // Check if end is found before processing
      const { row, col } = stack.pop();
      console.log("Visiting:", row, col);

      dispatch({ type: "VISIT_CELL", row, col, value: matrix[row][col].value });
      await delay(delayValue);

      if (matrix[row][col].value === 3) {
        console.log("End cell found at", row, col);
        setEndFound(true); // Set end found to true, stops further exploration
        setShowGif(1);
        break; // Break out of the loop immediately
      }

      directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        const newKey = `${newRow},${newCol}`;

        if (
          newRow >= 0 &&
          newRow < nrows &&
          newCol >= 0 &&
          newCol < ncols &&
          matrix[newRow][newCol].value !== 1 &&
          !visited.has(newKey) &&
          !endFound // Check before pushing new nodes
        ) {
          stack.push({ row: newRow, col: newCol });
          visited.add(newKey);
          console.log("Pushing to stack:", newRow, newCol);
        }
      });
    }
  };

  return (
    <>
      <div className={styles.graphScreen}>
        <div className={`${styles.header}`}>
          <h1 className={styles.header__title}>Graph Visualizer</h1>
          <button className={styles.header__operationBtn} onClick={() => bfs()}>
            Breadth First Search
          </button>
          <button className={styles.header__operationBtn} onClick={() => dfs()}>
            Depth First Search
          </button>
          <button
            className={styles.header__operationBtn}
            onClick={() => resetMatrix()}
          >
            Reset
          </button>
        </div>

        <div className={styles.matrix}>
          {matrix.map((row, i) => (
            <div key={i} className={styles.matrix__row}>
              {row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`${styles[`matrix__cell--${cell.value}`]} ${
                    styles.matrix__cell
                  }`}
                  row={i}
                  col={j}
                  cell_value={cell.value}
                  visited={cell.visited}
                  onMouseEnter={() => handleMouseEnter(i, j)}
                  onMouseDown={() => handleMouseDown(i, j)}
                  onMouseUp={() => handleMouseUp(i, j)}
                >
                  {/* {cell.value} {cell.visited} */}{" "}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* DELETE LATER ================== */}
        {/* <div
          className={
            endFound
              ? `${styles.gifContainer__1} ${styles.show}`
              : `${styles.gifContainer__1} ${styles.hide}`
          }
        >
          <img src="/images/maza-aaya.gif" alt="giffy!!!" />
        </div>
        <div
          className={
            endFound
              ? `${styles.gifContainer__2} ${styles.show}`
              : `${styles.gifContainer__2} ${styles.hide}`
          }
        >
          <img src="/images/modi.gif" alt="giffy!!!" />
        </div> */}
        {/* DELETE LATER ================== */}
      </div>
    </>
  );
};

export default GraphScreen;
