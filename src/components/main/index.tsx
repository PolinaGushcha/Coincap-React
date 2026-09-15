import { IData, IMain, IListRender } from "../../types";
import { Link, useAsyncValue, useLocation } from "react-router-dom";
import styles from "../../pages/Main/Main.module.scss";
import React, { useState } from "react";
import { Pagination } from "../pagination/Pagination";
import { Modal } from "../../pages";
import { startData } from "../../constants";
import { getListOfItems } from "../../utils/main";

export const ListRender: React.FC<IListRender> = ({ pageNum }) => {
  const { data } = useAsyncValue() as IMain;
  const location = useLocation();

  const [startPage, setStartPage] = useState((pageNum = Number(location.search.slice(6))));
  const [countOfPages, setCountOfPages] = useState(10);
  const [modalWindow, setModalWindow] = useState<boolean>(false);
  const [modalData, setModalData] = useState<IData>(startData[0]);

  const setPaginate = (pageNumber: number) => setStartPage(pageNumber);
  const setModal = (val: boolean) => setModalWindow(val);

  return (
    <div>
      <Modal modalWindow={modalWindow} setModalWindow={setModal} data={modalData} />
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Price</th>
              <th>Market Cap</th>
              <th>VWAP(24Hr)</th>
              <th>Supply</th>
              <th>Volume</th>
              <th>{window.screen.width < 500 ? '24Hr' : 'Change(24Hr)'}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {getListOfItems(startPage, countOfPages, data).currentIndexes.map((obj) => {
              const isUp = Number(obj.changePercent24Hr) >= 0;
              return (
                <tr key={obj.id}>
                  <td><span className={styles.rank}>{obj.rank}</span></td>
                  <td>
                    <Link to={`/${obj.id}`} state={obj} className={styles.nameLink}>
                      <span className={styles.avatar}>{obj.symbol.slice(0, 1)}</span>
                      <span className={styles.nameCol}>
                        <span className={styles.name}>{obj.name}</span>
                        <span className={styles.symbol}>{obj.symbol}</span>
                      </span>
                    </Link>
                  </td>
                  <td className={styles.priceCell}>{"$" + Number(obj.priceUsd).toFixed(2)}</td>
                  <td>{"$" + new Intl.NumberFormat("de-DE").format(Number(obj.marketCapUsd)).slice(0, obj.marketCapUsd.length - 23) + "b"}</td>
                  <td>{"$" + Number(obj.vwap24Hr).toFixed(2)}</td>
                  <td>{new Intl.NumberFormat("de-DE").format(Number(obj.supply)).slice(0, obj.supply.length - 20) + "m"}</td>
                  <td>{"$" + new Intl.NumberFormat("de-DE").format(Number(obj.volumeUsd24Hr)).slice(0, obj.volumeUsd24Hr.length - 20) + "m"}</td>
                  <td>
                    <span className={isUp ? styles.pillUp : styles.pillDown}>
                      {isUp ? '▲' : '▼'} {Number(obj.changePercent24Hr).toFixed(2) + "%"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.button}
                      aria-label={`Add ${obj.name} to portfolio`}
                      onClick={() => { setModalWindow(true); setModalData(obj); }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination paginate={setPaginate} pageNumbers={getListOfItems(startPage, countOfPages, data).pageNumbers} />
    </div>
  );
};
