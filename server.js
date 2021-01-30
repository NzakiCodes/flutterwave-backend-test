const express = require("express")
const app = express();
// Truncate Lodash if Not Used after Development
const assert = require('assert');
// const payloadChecker = require('payload-validator');
const { isEmpty, isObject } = require("lodash");
const { type } = require("os");

app.use(express.json());
const payloadSchema = {
  "rule": {
    "field": "",
    "condition": "",
    "condition_value": ""
  },
  "data": {}
}

// console.log(typeof(payloadSchema["data"]));

function payloadChecker(expectedPayload, incomingPayload) {

  // const validateSubValue = (key) => {
  //   for (var i = 0; i < incomingPayload[key]; i++) {
  //     if(expectedPayload[key][0] !== undefined && typeof(expectedPayload[key][0]) !== typeof(incomingPayload[key][i])){
  //       return errorLogger(400,`${expectedPayload[key][0]} should be a|an ${typeof(expectedPayload[key][0])}`);
  //     }
  //   }
  // };

  for (var key in expectedPayload) {
    if (incomingPayload[key] === undefined) {
      return errorLogger(400, `${key} is required`);

    } else if (typeof (expectedPayload[key]) !== typeof (incomingPayload[key])) {
      console.log(incomingPayload[key].indexOf());
    } else {
      // return 
    }
  }
}

app.post("/validate-api", (req, res) => {
  const { rule, data } = req.body;
  , success = {}, response = {};
  const errorLogger = (code, message) => {
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


  if (data === undefined) {
    return errorLogger(400, `${key} is required`);
  } else if (typeof (data) !== ("object" | "string" | "number")) {
    return errorLogger(400, `${data} should be an object, a string or a number `);
  } else if (data.length > 1) {
    console.log("opor");
  } else {
    console.log("Nothing");
  }

  const incomingPayload = req.body;
  console.log(payloadChecker(payloadSchema, incomingPayload));

});
// || typeof (expectedPayload[key] === "object" && expectedPayload[key] instanceof Array !== incomingPayload["rule"] instanceof Array)



const myPersonalDetails = {
  "name": "Ekikere-abasi Michael Ekere",
  "github": "@NzakiCodes",
  "email": "ekisnzaki@gmail.com",
  "mobile": "08109736282",
  "twitter": "@NzakiCodes"
};

// const validationRules = {
//   "eq": (firstValue, secondValue) => (firstValue === secondValue),
//   "gte": (firstValue, secondValue) => (firstValue !== secondValue),
//   "lte": (firstValue, secondValue) => (firstValue <= secondValue),
//   "neq": (firstValue, secondValue) => (assert.notStrictEqual(firstValue, secondValue)),
//   "contains": (dataArray, searchValue) => dataArray.includes(searchValue)
// }

// const dataSchema = {
//   "name": new String(),
//   "crew": "Rocinante",
//   "age": 34,
//   "position": "Captain",
//   "missions": 45
// };

// function runFunc(func, callback) {
//   if (func) {
//     errors.push();
//   }
//   else {
//     errors.push();
//   }
// }
// function validatePayload() { };

// const validator = (req, res) => {
//   const { rule, data } = req.body;
//   var result = [];
//   var errors = []


//   if (rule == "" | rule == undefined | rule == null) {
//     errors.push("rule is required");
//     return res.json({
//       "message": errors[0],
//       "status": "error",
//       "data": null
//     });
//   }

//   if (typeof rule != 'object') {
//     errors.push("rule is not a Valid JSON Object.");
//     return res.json({
//       "message": errors[0],
//       "status": "error",
//       "data": null
//     });
//   }

//   if (data == "" || data == undefined || data == null) {
//     errors.push("data is required");
//     return res.json({
//       "message": errors[0],
//       "status": "error",
//       "data": null
//     });
//   }


//   if (typeof data != 'object') {
//     errors.push("data is not a Valid JSON Object.");
//     return
//   }

//   for (let d = 0; d < data.length; d++) {

//     let dataValue = data[d];

//     if (isEmpty(dataValue)) {
//       errors.push(`${dataValue} is required`);
//       console.log(`${dataValue} is required`);
//     }

//   }

//   let field = rule.field;
//   let condition = (rule.condition);
//   let condition_value = rule.condition_value;


//   // console.log(`${field}, ${condition}, ${condition_value}`);

//   console.log(validationRules[condition](data[field], condition_value));
//   if (validationRules[condition](data[field], condition_value)) {

//   }




//   if (errors.length >= 1) {
//     return res.json({
//       "message": errors[0],
//       "status": "error",
//       "data": null
//     });

//   } else {
//     return res.json({
//       "message": `field ${field} successfully validated.`,
//       "status": "success",
//       "data": {
//         "validation": {
//           "error": false,
//           "field": field,
//           "field_value": data[field],
//           "condition": condition,
//           "condition_value": condition_value
//         }
//       }
//     });
//   }

// }

// console.log(validationRules.eq(3, 3));

app.get("/", (req, res) => {
  res.status(200).json(
    {
      "message": "My Rule-Validation API",
      "status": "success",
      "data": myPersonalDetails
    }
  );
});

app.post("/validate-rule", (req, res) => validator(req, res));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on http://localhost:${port} port `));