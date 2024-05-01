import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/screens/SortingScreen.module.scss";

function SortingScreen() {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const timeouts = useRef([]);

  // Initialize array with random values
  useEffect(() => {
    resetArray();
  }, []);

  // Function to generate a new array
  const resetArray = () => {
    if (isSorting) {
      stopSorting();
    }
    const newArray = Array.from(
      { length: 30 },
      () => Math.floor(Math.random() * 250) + 10
    );
    setArray(newArray);
  };

  // Function to visualize the Bubble Sort (as an example)
  const bubbleSort = () => {
    setIsSorting(true);
    const animations = [];
    const auxArray = array.slice();
    for (let i = 0; i < auxArray.length; i++) {
      for (let j = 0; j < auxArray.length - i - 1; j++) {
        if (auxArray[j] > auxArray[j + 1]) {
          // Swap elements
          [auxArray[j], auxArray[j + 1]] = [auxArray[j + 1], auxArray[j]];
          animations.push([j, j + 1, true]); // Indicates a swap
        } else {
          animations.push([j, j + 1, false]); // No swap
        }
      }
    }
    animate(animations);
  };

  const selectionSort = () => {
    setIsSorting(true);
    const animations = [];
    const auxArray = array.slice();
    let n = auxArray.length;
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < n; j++) {
        if (auxArray[j] < auxArray[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [auxArray[i], auxArray[minIndex]] = [auxArray[minIndex], auxArray[i]];
        animations.push([i, minIndex, true]); // Indicates a swap
      }
    }
    animate(animations);
  };

  const insertionSort = () => {
    setIsSorting(true);
    const animations = [];
    const auxArray = array.slice();
    let n = auxArray.length;
    for (let i = 1; i < n; i++) {
      let key = auxArray[i];
      let j = i - 1;
      while (j >= 0 && auxArray[j] > key) {
        auxArray[j + 1] = auxArray[j];
        animations.push([j, j + 1, true]); // Move element
        j = j - 1;
      }
      auxArray[j + 1] = key;
    }
    animate(animations);
  };

  const quickSort = () => {
    setIsSorting(true);
    const animations = [];
    const auxArray = array.slice();
    quickSortHelper(auxArray, 0, auxArray.length - 1, animations);
    animate(animations);
  };

  const quickSortHelper = (array, start, end, animations) => {
    if (start >= end) return;
    let index = partition(array, start, end, animations);
    quickSortHelper(array, start, index - 1, animations);
    quickSortHelper(array, index + 1, end, animations);
  };

  const partition = (array, start, end, animations) => {
    const pivotValue = array[end];
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
      if (array[i] < pivotValue) {
        if (pivotIndex !== i) {
          [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
          animations.push([pivotIndex, i, true]); // Swap
        }
        pivotIndex++;
      }
    }
    [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
    animations.push([pivotIndex, end, true]); // Swap pivot to correct place
    return pivotIndex;
  };

  // Function to animate the sorting process
  const animate = (animations) => {
    animations.forEach((animation, index) => {
      const timeout = setTimeout(() => {
        if (!isSorting) return; // Check if the sorting has been stopped
        const [barOneIdx, barTwoIdx, isSwap] = animation;
        const arrayBars = document.getElementsByClassName(styles.array__bar);
        if (isSwap) {
          arrayBars[barOneIdx].style.backgroundColor = "#ffff";
          arrayBars[barTwoIdx].style.backgroundColor = "#ffff";

          const tempHeight = arrayBars[barOneIdx].style.height;
          arrayBars[barOneIdx].style.height = arrayBars[barTwoIdx].style.height;
          arrayBars[barTwoIdx].style.height = tempHeight;

          setTimeout(() => {
            arrayBars[barOneIdx].style.backgroundColor = "#ef8354";
            arrayBars[barTwoIdx].style.backgroundColor = "#ef8354";
          }, 100);
        }
      }, index * 100);
      timeouts.current.push(timeout);
    });
  };

  const stopSorting = () => {
    // Clear all timeouts to stop animations
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setIsSorting(false); // Update sorting state
  };

  return (
    <div className={styles.sortingScreen}>
      <div className={`${styles.header} ${styles.mgBottomBig}`}>
        <h1 className={styles.header__title}>Sorting</h1>
        <button
          className={styles.header__operationBtn}
          onClick={() => resetArray()}
        >
          Reset
        </button>
        <button
          className={styles.header__operationBtn}
          onClick={() => bubbleSort()}
        >
          Bubble Sort
        </button>
        <button
          className={styles.header__operationBtn}
          onClick={() => selectionSort()}
        >
          Selection Sort
        </button>
        <button
          className={styles.header__operationBtn}
          onClick={() => insertionSort()}
        >
          Insertion Sort
        </button>
        <button
          className={styles.header__operationBtn}
          onClick={() => quickSort()}
        >
          Quick Sort
        </button>
      </div>
      <div className={styles.array}>
        {array.map((value, idx) => (
          <div
            className={styles.array__bar}
            key={idx}
            style={{
              height: `${value}px`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default SortingScreen;
