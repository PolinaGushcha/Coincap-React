import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import styles from "./Error.module.scss";

export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : undefined;
  const title = isRouteErrorResponse(error) ? error.statusText : "Something went wrong";
  const message = isRouteErrorResponse(error) ? error.data?.message : undefined;

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.badge}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {status && <p className={styles.status}>{status}</p>}
        <h1 className={styles.title}>{title || "Oops!"}</h1>
        {message && <p className={styles.message}>{message}</p>}
        {!message && <p className={styles.message}>The page you're looking for doesn't exist or failed to load.</p>}
        <Link to="/?page=1" className={styles.link}>
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
};
