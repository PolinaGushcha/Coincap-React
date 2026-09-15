import React from "react";
import styles from "./Loading.module.scss";

export const Loading: React.FC = () => {
  return (
    <div className={styles.loadingBlock} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>Loading market data…</span>
    </div>
  );
};
