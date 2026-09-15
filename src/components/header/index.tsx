import styles from './Header.module.scss';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Suspense, startTransition, useEffect, useState } from 'react';
import { fetchCoincapApi } from '../../services/api';
import { IMain } from '../../types';
import { Portfolio } from '../../pages/Portfolio';
import { useDataContext } from '../../contexts/DataContextProvider';
import { useTotalCostContext } from '../../contexts/PriceContextProvider';
import { Loading } from '../loading';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userCryptocurrency } = useDataContext();
  const { getPortfolioPrice } = useTotalCostContext();
  const [getPrice, setGetPrice] = useState<string>('');

  const [data, setData] = useState<IMain>();
  const [modalWindow, setModalWindow] = useState<boolean>(false);

  useEffect(() => {
    fetchCoincapApi('').then(setData);
  }, []);
  useEffect(() => {
    if (location.pathname === '/' && !location.search) {
      startTransition(() => {
        navigate('/?page=1');
      });
    }
  }, []);
  useEffect(() => {
    setGetPrice(getPortfolioPrice(userCryptocurrency));
  }, [userCryptocurrency]);

  data?.data.sort((a, b) => Number(b.priceUsd) - Number(a.priceUsd));
  const setModal = (val: boolean) => setModalWindow(val);
  const topThree = data?.data.slice(0, 3) ?? [];

  return (
    <>
      <Portfolio modalWindow={modalWindow} setModalWindow={setModal} />
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L21 7.5V16.5L12 22L3 16.5V7.5L12 2Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M12 8L16 10.3V14.9L12 17.2L8 14.9V10.3L12 8Z" fill="white" />
            </svg>
          </span>
          <span className={styles.brandName}>CoinCap</span>
        </Link>

        <div className={styles.tickerWrap}>
          <span className={styles.liveDot} aria-hidden="true" />
          <span className={styles.tickerLabel}>Markets</span>
          <ul className={styles.list}>
            {topThree.map((coin) => {
              const isUp = Number(coin.changePercent24Hr) >= 0;
              return (
                <li className={styles.item} key={coin.id}>
                  <span className={styles.itemName}>{coin.name}</span>
                  <span className={styles.itemPrice}>${Number(coin.priceUsd).toFixed(2)}</span>
                  <span className={isUp ? styles.itemChangeUp : styles.itemChangeDown}>
                    {isUp ? '▲' : '▼'} {Math.abs(Number(coin.changePercent24Hr)).toFixed(1)}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.portfolio_container}>
          <button
            onClick={() => setModalWindow(true)}
            className={styles.portfolio}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path d="M3 7.5C3 6.11929 4.11929 5 5.5 5H17C18.6569 5 20 6.34315 20 8V8.5H18.5C16.567 8.5 15 10.067 15 12C15 13.933 16.567 15.5 18.5 15.5H20V16C20 17.6569 18.6569 19 17 19H6C4.34315 19 3 17.6569 3 16V7.5Z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M18.5 10H20.5C20.7761 10 21 10.2239 21 10.5V13.5C21 13.7761 20.7761 14 20.5 14H18.5C17.6716 14 17 13.3284 17 12.5V11.5C17 10.6716 17.6716 10 18.5 10Z" fill="currentColor" />
            </svg>
            Portfolio
          </button>
          <p id="portfolioInfo" className={styles.portfolio_info}>
            {userCryptocurrency.length >= 1 ? getPrice : 0}
          </p>
        </div>
      </header>
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </>
  );
};
