require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
var config = require("./dbconfig");
const sql = require("mssql");

async function getPRHeader(usr_req) {
  try {
    console.log("getPRHeader call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");
    console.log("Get user request list");
    const usrReqQry = await fetch(
      `http://${process.env.backendHost}:${process.env.himsPort}/api/himspsn/getusrreqlist/${usr_req}`
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("cancelled");
        } else {
          console.error("Error:", error);
        }
      });
    // let result = [{ name: usrReqQry.name }];
    let result = [];
    if (usrReqQry.status !== "error") {
      for (let i = 0; i < usrReqQry.usrReqList.length; i += 1) {
        let tmp = await pool
          .request()
          .query(
            `SELECT * FROM VIEW_PR_HEADER WHERE REFFLG = '2' AND AUTCOD = '${usrReqQry.usrReqList[i]}'`
          );
        // .query("SELECT * FROM VIEW_PR_HEADER");
        tmp = await tmp.recordsets[0];
        for (let j = 0; j < tmp.length; j += 1) {
          await result.push(tmp[j]);
        }
      }
      await result.sort((a, b) => {
        const RQONOA = a.RQONO;
        const RQONOB = b.RQONO;
        if (RQONOA < RQONOB) {
          return -1;
        }
        if (RQONOA > RQONOB) {
          return 1;
        }
        return 0;
      });
      console.log("getPRHeader complete");
      console.log("====================");
      return result;
    } else {
      console.log("getPRHeader complete");
      console.log("====================");
      return result;
    }
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getPOHeader(usr_req) {
  try {
    console.log("getPOHeader call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");

    console.log("Get user request list");
    const usrReqQry = await fetch(
      `http://${process.env.backendHost}:${process.env.himsPort}/api/himspsn/getusrreqlist/${usr_req}`
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("cancelled");
        } else {
          console.error("Error:", error);
        }
      });
    // let result = [{ name: usrReqQry.name }];
    let result = [];

    if (usrReqQry.status !== "error") {
      for (let i = 0; i < usrReqQry.usrReqList.length; i += 1) {
        let tmp = await pool
          .request()
          .query(
            `SELECT * FROM VIEW_PO_HEADER WHERE REFFLG = '' AND AUTCOD = '${usrReqQry.usrReqList[i]}'`
          );
        // .query("SELECT * FROM VIEW_PO_HEADER");
        tmp = await tmp.recordsets[0];
        for (let j = 0; j < tmp.length; j += 1) {
          await result.push(tmp[j]);
        }
      }
      await result.sort((a, b) => {
        const PONOA = a.PONO;
        const PONOB = b.PONO;
        if (PONOA < PONOB) {
          return -1;
        }
        if (PONOA > PONOB) {
          return 1;
        }
        return 0;
      });
      console.log("getPOHeader complete");
      console.log("====================");
      return result;
    } else {
      console.log("getPOHeader complete");
      console.log("====================");
      return result;
    }
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getPRDetail() {
  try {
    console.log("getPRDetail call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");

    const result = await pool
      .request()
      .query(`SELECT * FROM VIEW_PR_DETAIL ORDER BY ITMNO`);

    console.log("getPRDetail complete");
    console.log("====================");
    return result.recordsets[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}
// async function getPRDetail(RQONO) {
//   try {
//     console.log(
//       "getPRDetail call RQONO = " + RQONO + ", try connect to server"
//     );
//     let pool = await sql.connect(config);
//     console.log("connect complete");

//     const result = await pool
//       .request()
//       .query(`SELECT * FROM VIEW_PR_DETAIL WHERE RQONO = '${RQONO}'`);

//     console.log("getPRDetail complete");
//     console.log("====================");
//     return result.recordsets[0];
//   } catch (error) {
//     console.error(error);
//     return { status: "error", message: error.message };
//   }
// }

async function getPODetail() {
  try {
    console.log("getPODetail call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");

    const result = await pool
      .request()
      .query("SELECT * FROM VIEW_PO_DETAIL ORDER BY ITMNO");

    console.log("getPODetail complete");
    console.log("====================");
    return result.recordsets[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getAUTApprove() {
  try {
    console.log("getAUTApprove call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");

    const result = await pool.request().query("SELECT * FROM VIEW_AUTAPPROVE");

    console.log("getAUTApprove complete");
    console.log("====================");
    return result.recordsets[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function CheckApproveStatusPR(PGM, date, RQONO) {
  try {
    console.log(
      "CheckApproveStatusPR PGM: " +
        PGM +
        " date: " +
        date +
        " RQONO: " +
        RQONO +
        " call try connect to server"
    );
    let pool = await sql.connect(config);
    console.log("connect complete");

    const result = await pool
      .request()
      .query(
        `SELECT dbo.GET_CheckApproveStatus_PR ('${PGM}',${date},'${RQONO}') AS msg`
      );
    console.log(result.recordset[0]);
    console.log("CheckApproveStatusPR complete");
    console.log("====================");
    return result.recordset[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function CheckApproveStatusPO(PGM, date, RQONO) {
  try {
    console.log("CheckApproveStatusPO call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");

    const result = await pool
      .request()
      .query(
        `SELECT dbo.GET_CheckApproveStatus_PO ('${PGM}',${date},'${RQONO}') AS msg`
      );

    console.log("CheckApproveStatusPO complete");
    console.log("====================");
    return result.recordset[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function CheckAUTApproveAmountPR(usr_req, amt) {
  try {
    console.log("CheckAUTApproveAmountPR call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");

    const result = await pool
      .request()
      .query(
        `SELECT dbo.GET_CheckAutApproveAmount_PR ('${usr_req}',${amt}) as msg`
      );

    console.log("CheckAUTApproveAmountPR complete");
    console.log("====================");
    return result.recordset[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function CheckAUTApproveAmountPO(usr_req, amt) {
  try {
    console.log("CheckAUTApproveAmountPO call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");

    const result = await pool
      .request()
      .query(
        `SELECT dbo.GET_CheckAutApproveAmount_PO ('${usr_req}',${amt}) as msg`
      );

    console.log("CheckAUTApproveAmountPO complete");
    console.log("====================");
    return result.recordset[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function approvePR(data) {
  try {
    console.log("approvePR call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");

    const result = await pool
      .request()
      .query(
        `EXEC SP_Approve_PR '${data.PGM}',${data.date},'${data.RQONO}','${data.usr_req}'`
      );

    console.log("approvePR complete");
    console.log("====================");
    return result.recordsets[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function approvePO(data) {
  try {
    console.log("approvePO call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");
    console.log(data);
    const result = await pool
      .request()
      .query(
        `EXEC SP_Approve_PO '${data.PGM}',${data.date},'${data.PONO}','${data.usr_req}'`
      );

    console.log("approvePO complete");
    console.log("====================");
    return result.recordsets[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getVersion() {
  try {
    return process.env.version;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

module.exports = {
  getPRHeader: getPRHeader,
  getPOHeader: getPOHeader,
  getPRDetail: getPRDetail,
  getPODetail: getPODetail,
  getAUTApprove: getAUTApprove,
  CheckApproveStatusPR: CheckApproveStatusPR,
  CheckApproveStatusPO: CheckApproveStatusPO,
  CheckAUTApproveAmountPR: CheckAUTApproveAmountPR,
  CheckAUTApproveAmountPO: CheckAUTApproveAmountPO,
  approvePR: approvePR,
  approvePO: approvePO,
  getVersion: getVersion,
};
