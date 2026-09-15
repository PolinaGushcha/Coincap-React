import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./ElementInfo.module.scss";
import { Charts, Loading } from "../../components";
import { fetchCoincapApi } from "../../services/api";
import { Modal } from "../Modal";

const ElementInfo: React.FC = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>();
  const [modalWindow, setModalWindow] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchCoincapApi(id).then(setData);
    }
  }, [id]);

  const setModal = (val: boolean) => setModalWindow(val);

  if (!data) {
    return <Loading />;
  }

  const isUp = Number(data.data.changePercent24Hr) >= 0;

  return (
    <div className={styles.container}>
      <Modal modalWindow={modalWindow} setModalWindow={setModal} data={location.state} />
      <div className={styles.elementInfoBlock}>
        <button className={styles.button} onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div className={styles.title}>
          <span className={styles.avatar}>{data.data.symbol?.slice(0, 1)}</span>
          <div>
            <h3>{data.data.name}</h3>
            <span className={styles.symbol}>{data.data.symbol}</span>
          </div>
          <button className={styles.addToProfile} onClick={() => setModalWindow(true)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add to portfolio
          </button>
        </div>

        <div className={styles.priceRow}>
          <p className={styles.price}>${Number(data.data.priceUsd).toFixed(2)}</p>
          <span className={isUp ? styles.pillUp : styles.pillDown}>
            {isUp ? "▲" : "▼"} {Number(data.data.changePercent24Hr).toFixed(2)}%
            <span className={styles.pillLabel}>24h</span>
          </span>
        </div>

        <Charts />
      </div>
    </div>
  );
};

export default ElementInfo;
