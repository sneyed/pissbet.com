import styles from "./pirate.module.scss";

const Pirate = ({ data, error }) => {
  const { totalParticipants } = data || {};
  const hasParticipants = totalParticipants && totalParticipants > 0;
  return (
    <div className={styles.container}>
      <img src="/pirate.gif" alt="Pirate dancing" className={styles.pirate} />
      <div className={styles.speech}>
        Yarr... Merry Pissmas!
        <ul>
          <li>
            Thar be{" "}
            {hasParticipants ? (
              <span className={styles.count}>{totalParticipants}</span>
            ) : (
              "no"
            )}{" "}
            punters {hasParticipants ? "aboard in total" : "about"}
          </li>
          <li>Biggest win o' X pisscoins by ?</li>
          <li>Biggest loss o' X pisscoins by ?</li>
        </ul>
      </div>
    </div>
  );
};

export default Pirate;
