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

function ruleValidator(rule, data) {
    // const ckk = rule.field;
    // console.log(data[ckk]);

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
    let splitedFileRule = field.split(".");

    if (typeof (splitedFileRule) == 'object' && splitedFileRule instanceof Array) {
        for (var i = 0; i < splitedFileRule.length; i++) {
            // console.log(splitedFileRule[i]);
            // console.log(i);
        }
    }

    // if (typeof(data)== 'object') {
    //     console.log(data);
    // }
    if (typeof (splitedFileRule) == 'object' && splitedFileRule instanceof Array) {
        console.log("Validation: "+ validationRules[condition]( data[splitedFileRule[0]][splitedFileRule[1]],condition_value));
        // console.log("Condition: "+ condition+ " " + JSON.stringify(data[splitedFileRule[0]][splitedFileRule[1]]));
        
    }
    // console.log(`${field}`);
    if (validationRules[condition](data[field], condition_value)) {
        console.log(validationRules[condition](data[field], condition_value));
    } else {
        return {
            "message": `field ${field} failed validation.`,
            "status": "error",
            "data": {
                "validation": {
                    "error": true,
                    "field": `${field}`,
                    "field_value": (typeof (splitedFileRule) == 'object' && splitedFileRule instanceof Array)?data[splitedFileRule[0]][splitedFileRule[1]]:data[splitedFileRule[0]],
                    "condition": condition,
                    "condition_value": condition_value
                }
            }
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

app.post("/validate-rule", (req, res) => {
    const payload = req.body;
    const { success, log: { code, report } } = payloadValidator(payload, payloadSchema);
    // console.log(payloadValidator(payload, payloadSchema));
    if (!success) {
        res.status(code).send(report);
    } else {
        console.log(ruleValidator(payload.rule, payload.data));
    }

});



app.listen(port, () => console.log(`Server running on http://localhost:${port} port `));