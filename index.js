const express = require("express")
const app = express();
const port = process.env.PORT || 5000;
const { isUndefined, isNull } = require("lodash");
app.use(express.json());

const _und = undefined;

/* payloadSchema: used to check againt the incomin payload */
const payloadSchema = {
    "rule": {
        "field": "field",
        "condition": "",
        "condition_value": ""
    },
    "data": {}
}


const myPersonalDetails = {
    "name": "Ekikere-abasi Michael Ekere",
    "github": "@NzakiCodes",
    "email": "ekisnzaki@gmail.com",
    "mobile": "08109736282",
    "twitter": "@NzakiCodes"
};

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
            } else if (isNull(incomingChildPayload[key])) {
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

function ruleValidator(rule, data) {

    const validationRules = {
        "eq": (firstValue, secondValue) => (firstValue === secondValue),
        "gte": (firstValue, secondValue) => (firstValue >= secondValue),
        "lte": (firstValue, secondValue) => (firstValue <= secondValue),
        "neq": (firstValue, secondValue) => (assert.notStrictEqual(firstValue, secondValue)),
        "contains": (dataArray, searchValue) => dataArray.includes(searchValue)
    }

    let field = rule.field;
    let condition = (rule.condition);
    let condition_value = rule.condition_value;
    var splitedFileRule = field;

    if (typeof (field) != 'number') {
        splitedFileRule = field.split(".");

        if ((typeof (splitedFileRule) == 'object' && splitedFileRule instanceof Array)) {
            if (typeof (data[splitedFileRule[0]]) == 'undefined') {
                return {
                    "message": `field ${field} is missing from data.`,
                    "status": "error",
                    "data": null
                }
            } else {
                if ((data[splitedFileRule[0]][splitedFileRule[1]]) == null || typeof (data[splitedFileRule[0]][splitedFileRule[1]]) == 'undefined') {
                    return {
                        "message": `field ${field} failed validation.`,
                        "status": "error",
                        "data": {
                            "validation": {
                                "error": true,
                                "field": `${field}`,
                                "field_value": (typeof (splitedFileRule) == 'object' && splitedFileRule instanceof Array) ? data[splitedFileRule[0]][splitedFileRule[1]] : data[splitedFileRule[0]],
                                "condition": condition,
                                "condition_value": condition_value
                            }
                        }
                    }
                } else {
                    if (validationRules[condition](data[splitedFileRule[0]][splitedFileRule[1]], condition_value)) {
                        return {
                            "message": `field ${field} successfully validated.`,
                            "status": "success",
                            "data": {
                                "validation": {
                                    "error": false,
                                    "field": `${field}`,
                                    "field_value": (typeof (splitedFileRule) == 'object' && splitedFileRule instanceof Array) ? data[splitedFileRule[0]][splitedFileRule[1]] : data[splitedFileRule[0]],
                                    "condition": condition,
                                    "condition_value": condition_value
                                }
                            }
                        }
                    } else {
                        return {
                            "message": `field ${field} failed validation.`,
                            "status": "error",
                            "data": {
                                "validation": {
                                    "error": true,
                                    "field": `${field}`,
                                    "field_value": (typeof (splitedFileRule) == 'object' && splitedFileRule instanceof Array) ? data[splitedFileRule[0]][splitedFileRule[1]] : data[splitedFileRule[0]],
                                    "condition": condition,
                                    "condition_value": condition_value
                                }
                            }
                        }
                    }
                }
            }
        }
    } else if (typeof (data["field"]) == 'number') {

        return {
            "message": `field ${field.join('')} failed validation.`,
            "status": "error",
            "data": {
                "validation": {
                    "error": true,
                    "field": `${field}`,
                    "field_value": (typeof (splitedFileRule) == 'object' && splitedFileRule instanceof Array) ? data[splitedFileRule[0]][splitedFileRule[1]] : data[splitedFileRule[0]],
                    "condition": condition,
                    "condition_value": condition_value
                }
            }
        }

    } else {
        return {
            "message": `field ${field} is missing from data.`,
            "status": "error",
            "data": null
        }
    }

}

// data[splitedFileRule[0]]
app.get("/", (req, res) => {
    res.status(200).json(
        {
            "message": "My Rule-Validation API",
            "status": "success",
            "data": myPersonalDetails
        }
    );
});

app.get("/validate-rule", (req, res) => {
    res.send("Not a <b>GET</b> request try <b>POST</b>.");
});

app.post("/validate-rule", (req, res) => {
    const payload = req.body;
    const { success, log: { code, report } } = payloadValidator(payload, payloadSchema);
    // console.log(payloadValidator(payload, payloadSchema));
    if (!success) {
        res.status(code).send(report);
    } else {
        const { status } = ruleValidator(payload.rule, payload.data);
        if (status == "success") {
            res.status(200).send(ruleValidator(payload.rule, payload.data));
        } else {
            res.status(400).send(ruleValidator(payload.rule, payload.data))
        }
    }

});



app.listen(port, () => console.log(`Server running on http://localhost:${port} port `));