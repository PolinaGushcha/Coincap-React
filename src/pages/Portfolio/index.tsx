import React, {useState, useEffect} from "react";
import { useDataContext } from "../../contexts/DataContextProvider";
import { IPortfolio, IProfileDataObject } from "../../types";
import { useTotalCostContext } from "../../contexts/PriceContextProvider";
import styles from "./Portfolio.module.scss";

export const Portfolio: React.FC<IPortfolio> = ({ setModalWindow, modalWindow }) => {
  const { userCryptocurrency, setUserCryptocurrency } = useDataContext();
  const { setIsDeleteOrPlus, setDeletedObj, getPortfolioPrice } = useTotalCostContext();
  const [getPrice, setGetPrice] = useState<string>('');

  const deleteItem = (delObj: IProfileDataObject) => {
    setUserCryptocurrency( userCryptocurrency.filter((obj) => obj.name !== delObj.name));
    setIsDeleteOrPlus(true);
    setDeletedObj(delObj);
  };

  useEffect(() => {
    setGetPrice(getPortfolioPrice(userCryptocurrency))
  }, [userCryptocurrency])

  const holdings = userCryptocurrency.slice(1, userCryptocurrency.length);

  return (
    <div className={modalWindow ? styles.visible : styles.hidden}>
      <div className={styles.modalBlock}>
        <button className={styles.closeBtn} onClick={() => setModalWindow(false)} aria-label="Close portfolio">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <p className={styles.eyebrow}>Your portfolio</p>
        <h2 className={styles.title}>{userCryptocurrency.length >= 1 ? getPrice : 0}</h2>

        {holdings.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7.5C3 6.11929 4.11929 5 5.5 5H17C18.6569 5 20 6.34315 20 8V8.5H18.5C16.567 8.5 15 10.067 15 12C15 13.933 16.567 15.5 18.5 15.5H20V16C20 17.6569 18.6569 19 17 19H6C4.34315 19 3 17.6569 3 16V7.5Z" stroke="currentColor" strokeWidth="1.6" />
                <path d="M18.5 10H20.5C20.7761 10 21 10.2239 21 10.5V13.5C21 13.7761 20.7761 14 20.5 14H18.5C17.6716 14 17 13.3284 17 12.5V11.5C17 10.6716 17.6716 10 18.5 10Z" fill="currentColor" />
              </svg>
            </div>
            <p className={styles.emptyTitle}>No holdings yet</p>
            <p className={styles.emptyText}>Add a coin from the markets table with the “+” button to start tracking it here.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((obj: IProfileDataObject) => {
                  return (
                    <tr key={obj.name}>
                      <td className={styles.nameCell}>
                        <span className={styles.avatar}>{obj.name.slice(0, 1)}</span>
                        {obj.name}
                      </td>
                      <td>{obj.amount}</td>
                      <td className={styles.priceCell}>${(Number(obj.price) * Number(obj.amount)).toFixed(2)}</td>
                      <td>
                        <button onClick={() => deleteItem(obj)} className={styles.trash} aria-label={`Remove ${obj.name}`}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 7H20M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7M18 7L17.3 18.5C17.2 19.9 16.1 21 14.7 21H9.3C7.9 21 6.8 19.9 6.7 18.5L6 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
