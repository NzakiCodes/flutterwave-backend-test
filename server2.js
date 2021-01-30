const express = require("express")
const app = express();
const port = process.env.PORT || 5000;
const { isEmpty, isUndefined } = require("lodash");
app.use(express.json());

const _und = undefined;
const arr = [];

/* payloadSchema: used to check againt the incomin payload */
const payloadSchema = {
    "rule": {
        "field": "field",
        "condition": "",
        "condition_value": ""
    },
    "data": {}
}

/* errorLogger: logs errors with code and message */
const errorLogger = (code, message) => {
    var error = {};
    error.message = message;
    error.code = code;

    return {
        code: error.code,
        report: {
            "message": error.message,
            "status": "error",
            "data": null
        }
    };
}

/* payloadValidator: used to validate the incomingPayload against the expectedPayload */
function payloadValidator(incomingPayload, expectedPayload) {
    var success, error;

    function checkChildPayload(incomingChildPayload, expectedChildPayload) {
        for (key in expectedChildPayload) {
            if (incomingChildPayload[key] == undefined) {
                return {
                    success: false,
                    error: true,
                    log: errorLogger(400, `${key} is required.`)
                }
            } else if (isEmpty(incomingChildPayload[key])) {
                return {
                    success: false,
                    error: true,
                    log: errorLogger(400, `${key} is required.`)
                }
            }
            else {
                // Check Logger
                return {
                    success: true,
                    error: false,
                    log: {
                        "code": 200,
                        report: {
                            "message": "Success",
                            "status": "success",
                            "data": ""
                        }
                    }
                }
            }


        }
    }



    if (incomingPayload == _und) {
        return {
            success: false,
            error: true,
            log: errorLogger(400, "Invalid JSON payload passed.")
        }
    } else if (typeof (incomingPayload) !== "object" || typeof (incomingPayload) === "object" && incomingPayload instanceof Array) {
        return {
            success: false,
            error: true,
            log: errorLogger(400, "Invalid JSON payload passed.")
        }
    } else {
        for (key in expectedPayload) {

            if (isUndefined(incomingPayload[key])) {
                return {
                    success: false,
                    error: true,
                    log: errorLogger(400, `${key} is required.`)
                }

                break
            } else {
                if (key == "rule") {
                    return checkChildPayload(incomingPayload[key], expectedPayload[key]);
                } else {
                    if (typeof (incomingPayload[key]) == 'number') {
                        return {
                            success: false,
                            error: true,
                            log: errorLogger(400, key + " Should not be a number.")
                        }
                    }
                }
                break
            }
        }
    }
    return success;
}


app.post("/validate-api", (req, res) => {
    const payload = req.body;
    const { success, log: { code, report } } = payloadValidator(payload, payloadSchema);
    // console.log(payloadValidator(payload, payloadSchema));
    if (!success) {
        res.status(code).send(report);
    } else {
       
    }

});



app.listen(port, () => console.log(`Server running on http://localhost:${port} port `));