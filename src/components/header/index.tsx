import styles from './Header.module.scss';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
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

  return (
    <>
      <Portfolio modalWindow={modalWindow} setModalWindow={setModal} />
      <header className={styles.header}>
        <ul className={styles.list}>
          <li className={styles.item}>
            {data?.data[0].name} - ${Number(data?.data[0].priceUsd).toFixed(2)}
          </li>
          <li className={styles.item}>
            {data?.data[1].name} - ${Number(data?.data[1].priceUsd).toFixed(2)}
          </li>
          <li className={styles.item}>
            {data?.data[2].name} - ${Number(data?.data[2].priceUsd).toFixed(2)}
          </li>
        </ul>
        <div className={styles.portfolio_container}>
          <button
            onClick={() => setModalWindow(true)}
            className={styles.portfolio}
          >
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
