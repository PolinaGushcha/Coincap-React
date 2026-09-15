import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IPagination } from "../../types";
import styles from "./Pagination.module.scss";
import { RenderingPagination } from ".";

const Chevron: React.FC<{ direction: "left" | "right" }> = ({ direction }) => (
  <svg
    className={styles.img}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={direction === "right" ? { transform: "rotate(180deg)" } : undefined}
  >
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Pagination: React.FC<IPagination> = ({paginate,pageNumbers}) => {
  const location = useLocation();
  const navigation = useNavigate();

  const [pageNumberLimit, setPageNumberLimit] = useState(window.screen.width < 550 ? 3 : 5);
  const [maxPageLimit, setMaxPageLimit] = useState(window.screen.width < 550 ? 3 : 5);
  const [minPageLimit, setMinPageLimit] = useState(0);

  let pageIncrementBtn = null;
  if (pageNumbers.length > maxPageLimit) {
    pageIncrementBtn = (<button type="button" className={styles.pageIncrementBtn} onClick={() => goNext(currentLocation)}>···</button>);
  }
  let pageDecrementBtn = null;
  if (minPageLimit >= 1) {
    pageDecrementBtn = (<button type="button" className={styles.pageDecrementBtn} onClick={() => goPrevious(currentLocation)}>···</button>);
  }

  const currentLocation = Number(location.search.slice(6));

  const goPrevious = (currentLocation: number) => {
    if (currentLocation !== 1) {
      paginate(currentLocation - 1);
      navigation(`/?page=${currentLocation - 1}`);
      if (window.screen.width < 1050 && currentLocation - 1 < minPageLimit) {
        setMaxPageLimit(maxPageLimit - pageNumberLimit);
        setMinPageLimit(minPageLimit - pageNumberLimit);
      }
    }
  };

  const goNext = (currentLocation: number) => {
    if (currentLocation !== 10) {
      paginate(currentLocation + 1);
      navigation(`/?page=${currentLocation + 1}`);
      if (window.screen.width < 1050 && currentLocation + 1 > maxPageLimit) {
        setMaxPageLimit(maxPageLimit + pageNumberLimit);
        setMinPageLimit(minPageLimit + pageNumberLimit);
      }
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => goPrevious(currentLocation)}
        className={`${styles.button} ${currentLocation === 1 ? styles.buttonDisabled : ""}`}
        aria-label="Previous page"
      >
        <Chevron direction="left" />
      </button>
      {window.screen.width < 1050 ? pageDecrementBtn : null}
      <ul className={styles.list}>
        {pageNumbers.map((num) => {
          if (window.screen.width < 1050) {
            if (num < maxPageLimit + 1 && num > minPageLimit) {
              return (
                <RenderingPagination
                  key={crypto.randomUUID()}
                  num={num}
                  location={Number(location.search.slice(6))}
                  paginate={paginate}
                />
              );
            } else {
              return null;
            }
          } else {
            return (
              <RenderingPagination
                key={crypto.randomUUID()}
                num={num}
                location={Number(location.search.slice(6))}
                paginate={paginate}
              />
            );
          }
        })}
      </ul>
      {window.screen.width < 1050 ? pageIncrementBtn : null}
      <button
        onClick={() => goNext(currentLocation)}
        className={`${styles.button} ${currentLocation === 10 ? styles.buttonDisabled : ""}`}
        aria-label="Next page"
      >
        <Chevron direction="right" />
      </button>
    </div>
  );
};
