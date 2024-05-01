import React from "react";
import styles from "../styles/screens/HomeScreen.module.scss";
import { Link } from "react-router-dom";

const HomeScreen = () => {
  return (
    <>
      <div className={styles.homeScreen}>
        <h1 className={`${styles.main__heading} ${styles.mgBottomBig}`}>
          Algorithm Visualizer
        </h1>

        <section className={`${styles.categories}`}>
          <div className={styles.algo}>
            <Link to={"/sorting"} className={styles.algo__link}>
              <img
                className={styles.algo__image}
                src="/images/sorting_ss.jpg"
                alt="Sorting Algoritms"
              />
            </Link>

            <Link to={"/sorting"} className={styles.algo__link}>
              Sorting
            </Link>
          </div>
          <div className={styles.algo}>
            <Link to={"/graphs"} className={styles.algo__link}>
              <img
                className={styles.algo__image}
                src="/images/graph_ss.jpg"
                alt="Graph Algoritms"
              />
            </Link>
            <Link to={"/graphs"} className={styles.algo__link}>
              Graphs
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomeScreen;
