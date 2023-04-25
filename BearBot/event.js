const body = document.getElementsByTagName("body")[0];

body.addEventListener(
  "enroll-bearbot",
  (_) => {
    window[`submitAction_${winName}`](
      document[winName],
      "DERIVED_SSR_FL_SSR_ENROLL_FL$92$"
    );
  },
  false
);

body.addEventListener(
  "submit-bearbot",
  (_) => {
    oParentWin[`submitAction_${winName}`](
      oParentWin.document[winName],
      "#ICYes"
    );
    closeMsg(null, modId);
  },
  false
);
