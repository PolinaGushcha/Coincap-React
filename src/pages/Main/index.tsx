import React, { Suspense, useMemo } from "react";
import { useLoaderData, defer, Await, useLocation } from "react-router-dom";
import styles from "./Main.module.scss";
import { ListRender, Loading } from "../../components";
import { fetchCoincapApi } from "../../services/api";
import { IMain } from "../../types";

const Main: React.FC = () => {
  const { data } = useLoaderData() as IMain;
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={data}>
        <div className={styles.main}>
          <div className={styles.heading}>
            <h1 className={styles.title}>Markets</h1>
            <p className={styles.subtitle}>Live prices, ranked by market cap</p>
          </div>
          <ListRender pageNum={Number(searchParams.get('page'))} />
        </div>
      </Await>
    </Suspense>
  );
};
export const mainLoader = async () => {
  return defer({
    data: fetchCoincapApi(""),
  });
};

export default Main;
