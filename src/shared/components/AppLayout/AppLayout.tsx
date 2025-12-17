import styles from "./AppLayout.module.css";

interface Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function AppLayout({ header, footer, children }: Props) {
  return (
    <div className={styles.container}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.main}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
