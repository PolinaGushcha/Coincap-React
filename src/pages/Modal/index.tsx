import React, { useState } from "react";
import { IModal, IProfileDataObject } from "../../types";
import { useDataContext } from "../../contexts/DataContextProvider";
import { useTotalCostContext } from "../../contexts/PriceContextProvider";
import styles from "./ModalWindow.module.scss";

export const Modal: React.FC<IModal> = ({ setModalWindow, modalWindow, data }) => {
  const [cryptocurrencyItem, setCryptocurrencyItem] = useState("");
  const { setUserCryptocurrency, userCryptocurrency } = useDataContext();
  const { setNumberOfRendering, setIsDeleteOrPlus } = useTotalCostContext();

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (!cryptocurrencyItem) {
      return;
    }
    const arr = [...userCryptocurrency];
    const res: IProfileDataObject[] = arr.filter((obj) => obj.name === data.name);
    if(res.length === 1) {
      const indexOfItem = arr.findIndex((obj) => obj.name === data.name);
      arr[indexOfItem].price = String(Number(arr[indexOfItem].price) + Number(data.priceUsd))
      arr[indexOfItem].amount = String(Number(arr[indexOfItem].amount) + Number(cryptocurrencyItem));
      setUserCryptocurrency(arr);
    } else {
      setUserCryptocurrency([ ...userCryptocurrency, {
        name: data.name,
        amount: String(cryptocurrencyItem),
        price: data.priceUsd,
      },
    ]);
    }
    setCryptocurrencyItem("");
    setNumberOfRendering(prev => prev = prev + 1);
    setIsDeleteOrPlus(false);
    setModalWindow(false);
  };

  const estimate = Number(cryptocurrencyItem) * Number(data.priceUsd);

  return (
    <div className={modalWindow ? styles.visible : styles.hidden}>
      <div className={styles.modalBlock}>
        <button className={styles.closeBtn} onClick={() => setModalWindow(false)} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <p className={styles.eyebrow}>Add to portfolio</p>
        <h2 className={styles.title}>{data.name}</h2>
        <p className={styles.price}>${Number(data.priceUsd).toFixed(2)} <span>per coin</span></p>

        <form onSubmit={handleOnSubmit} className={styles.form}>
          <label className={styles.label} htmlFor="cryptoAmount">Amount</label>
          <div className={styles.inputRow}>
            <input
              id="cryptoAmount"
              className={styles.input}
              value={cryptocurrencyItem}
              onChange={(e) => setCryptocurrencyItem(e.target.value)}
              type="number"
              max={100}
              placeholder="0.00"
              min={0.01}
              step={0.01}
            />
            <button className={styles.submit} type="submit">Add</button>
          </div>
          <p className={styles.hint}>Min 0.01 · Max 100</p>
          {cryptocurrencyItem !== "" && !Number.isNaN(estimate) && (
            <p className={styles.estimate}>≈ <span>${estimate.toFixed(2)}</span> total</p>
          )}
        </form>
      </div>
    </div>
  );
};
