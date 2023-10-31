const dboperations = require("./dboperations");

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const { request, response } = require("express");
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api/prpo", router);

router.use((request, response, next) => {
  //write authen here

  response.setHeader("Access-Control-Allow-Origin", "*"); //หรือใส่แค่เฉพาะ domain ที่ต้องการได้
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Credentials", true);

  // console.log("middleware");
  next();
});

router.route("/health").get((request, response) => {
  // console.log("health check");
  response.json({ status: 200 });
});

router.route("/getprheader/:usr_req").get((request, response) => {
  dboperations
    .getPRHeader(request.params.usr_req)
    .then((result) => {
      response.json(result);
    })
    .catch((err) => {
      console.error(err);
      response.sendStatus(500);
    });
});

router.route("/getpoheader/:usr_req").get((request, response) => {
  dboperations
    .getPOHeader(request.params.usr_req)
    .then((result) => {
      response.json(result);
    })
    .catch((err) => {
      console.error(err);
      response.sendStatus(500);
    });
});

router.route("/getprdetail").get((request, response) => {
  dboperations
    // .getPRDetail(request.params.rqono)
    .getPRDetail(request.params.rqono)
    .then((result) => {
      response.json(result);
    })
    .catch((err) => {
      console.error(err);
      response.sendStatus(500);
    });
});

router.route("/getpodetail").get((request, response) => {
  dboperations
    .getPODetail()
    .then((result) => {
      response.json(result);
    })
    .catch((err) => {
      console.error(err);
      response.sendStatus(500);
    });
});

router.route("/getautapprove").get((request, response) => {
  dboperations
    .getAUTApprove()
    .then((result) => {
      response.json(result);
    })
    .catch((err) => {
      console.error(err);
      response.sendStatus(500);
    });
});

router
  .route("/checkapprovestatuspr/:PGM/:date/:RQONO")
  .get((request, response) => {
    dboperations
      .CheckApproveStatusPR(
        request.params.PGM,
        request.params.date,
        request.params.RQONO
      )
      .then((result) => {
        response.json(result);
      })
      .catch((err) => {
        console.error(err);
        response.sendStatus(500);
      });
  });

router
  .route("/checkapprovestatuspo/:PGM/:date/:RQONO")
  .get((request, response) => {
    dboperations
      .CheckApproveStatusPO(
        request.params.PGM,
        request.params.date,
        request.params.RQONO
      )
      .then((result) => {
        response.json(result);
      })
      .catch((err) => {
        console.error(err);
        response.sendStatus(500);
      });
  });

router
  .route("/checkautapproveamountpr/:usr_req/:amt")
  .get((request, response) => {
    dboperations
      .CheckAUTApproveAmountPR(request.params.usr_req, request.params.amt)
      .then((result) => {
        response.json(result);
      })
      .catch((err) => {
        console.error(err);
        response.sendStatus(500);
      });
  });

router
  .route("/checkautapproveamountpo/:usr_req/:amt")
  .get((request, response) => {
    dboperations
      .CheckAUTApproveAmountPO(request.params.usr_req, request.params.amt)
      .then((result) => {
        response.json(result);
      })
      .catch((err) => {
        console.error(err);
        response.sendStatus(500);
      });
  });

router.route("/approvepr").post((request, response) => {
  let data = { ...request.body };
  dboperations
    .approvePR(data)
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      response.setStatus(500);
    });
});

router.route("/approvepo").post((request, response) => {
  let data = { ...request.body };
  dboperations
    .approvePO(data)
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      response.setStatus(500);
    });
});

router.route("/getversion").get((request, response) => {
  dboperations
    .getVersion()
    .then((result) => {
      response.json(result);
    })
    .catch((err) => {
      console.error(err);
      response.setStatus(500);
    });
});

var port = process.env.PORT;
app.listen(port);
console.log("PRPO API is running at " + port);
