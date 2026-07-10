import React, { lazy } from 'react';
import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { mainLoader } from '../pages';
import styles from './Router.module.scss';
import { Layout, ErrorPage } from '../components';
import DataContextProvider from '../contexts/DataContextProvider';
import TotalCostContext from '../contexts/PriceContextProvider';

const LazyMain: React.FC = lazy(() => import(`../pages/Main/index`));
const LazyElementInfo: React.FC = lazy(() => import(`../pages/ElementInfo`));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route
        path="/"
        element={<LazyMain />}
        loader={mainLoader}
        errorElement={<ErrorPage />}
      />
      <Route path="/:id" element={<LazyElementInfo />} />
    </Route>,
  ),
  { basename: process.env.PUBLIC_URL },
);

const Navigation: React.FC = () => {
  return (
    <div className={styles.routerContainer}>
      <DataContextProvider>
        <TotalCostContext>
          <RouterProvider router={router} />
        </TotalCostContext>
      </DataContextProvider>
    </div>
  );
};

export default Navigation;
