const express = require("express")
const app = express();
// Truncate Lodash if Not Used after Development
const _ = require('lodash');
const assert = require('assert');
const { isEmpty, isObject } = require("lodash");
app.use(express.json());

const myPersonalDetails = {
  "name": "Ekikere-abasi Michael Ekere",
  "github": "@NzakiCodes",
  "email": "ekisnzaki@gmail.com",
  "mobile": "08109736282",
  "twitter": "@NzakiCodes"
};

const validationRules = {
  "eq": (firstValue, secondValue) => (firstValue === secondValue),
  "gte": (firstValue, secondValue) => (firstValue !== secondValue),
  "lte": (firstValue, secondValue) => (firstValue <= secondValue),
  "neq": (firstValue, secondValue) => (assert.notStrictEqual(firstValue, secondValue)),
  "contains": (dataArray, searchValue) => dataArray.includes(searchValue)
}

const dataSchema = {
  "name": new String(),
  "crew": "Rocinante",
  "age": 34,
  "position": "Captain",
  "missions": 45
};
// const error = {
//   code: this.code,
//   message: ""
// };

function error(code, message) {
  var error = { code: this.code, message: this.message };
  return error;
}



const validator = (req, res) => {
  const { rule, data } = req.body;
  var result = [];
  var errors = {};


  if (rule == "" | rule == undefined | rule == null) {
    error.message = "rule is required";
    return res.json({
      "message": error.message,
      "status": "error",
      "data": null
    });
  }

  if (typeof rule != 'object') {
    error.message = "rule is not a Valid JSON Object.";
    return res.json({
      "message": error.message,
      "status": "error",
      "data": null
    });
  }

  if (data == "" || data == undefined || data == null) {
    error.message = "data is required";
    return res.json({
      "message": error.message,
      "status": "error",
      "data": null
    });
  }


  if (typeof data != 'object') {
    error.message = "data is not a Valid JSON Object.";
    return
  }

  for (let d = 0; d < data.length; d++) {

    let dataValue = data[d];

    if (isEmpty(dataValue)) {
      error.message = `${dataValue} is required`;
      console.log(`${dataValue} is required`);
    }

  }

  let field = rule.field;
  let condition = (rule.condition);
  let condition_value = rule.condition_value;


  // console.log(`${field}, ${condition}, ${condition_value}`);

  // result.push();
  if (validationRules[condition](data[field], condition_value)) {
    error.message = "###"
  }
  error.message = "###";


  if (error === "") {
    console.log(error.message);
    return res.json({
      "message": error.message,
      "status": "error",
      "data": null
    });

  } else {
    return res.json({
      "message": `field ${field} successfully validated.`,
      "status": "success",
      "data": {
        "validation": {
          "error": false,
          "field": field,
          "field_value": data[field],
          "condition": condition,
          "condition_value": condition_value
        }
      }
    });
  }

}

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