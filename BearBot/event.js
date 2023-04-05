const body = document.getElementsByTagName("body")[0];

body.addEventListener(
  "enroll-bearbot",
  (e) => {
    let idx = e.detail;

    window[`submitAction_${winName}`](
      document[winName],
      `ZSAW_CLSRCH_WRK_ENROLL$${idx}`
    );

    i;
  },
  false
);

body.addEventListener(
  "submit-bearbot",
  (_) => {
    window[`submitAction_${winName}`](
      document[winName],
      "SSR_ENRL_FL_WRK_SUBMIT_PB"
    );
  },
  false
);
