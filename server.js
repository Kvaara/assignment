const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

const port = 3000;

// Without this, frontend would not work properly with NodeJS backend because of CORS issues.
app.use(cors());

// Using the express.json middleware helps us to parse JSON while only looking at the Content-Type: Application/json headers.
app.use(express.json());

// Assigning a static path will ease the development experience a bit.
app.use(express.static(path.resolve(__dirname, "client")));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/calculate", (req, res) => {
  const { numbers } = req.body;

  if (numbers) {
    const areAllNumbersValid = validateAllNumbers(numbers);

    if (areAllNumbersValid) {
      const numbersSummedTogether = sumAllNumbersTogether(numbers);
      const isPrime = calcIsNumberPrime(numbersSummedTogether);
      const response = {
        total: numbersSummedTogether,
        isPrime,
      };
      return res.status(200).json(response);
    } else {
      return res
        .status(500)
        .send(
          `${numbers}: is full of integers and/or it's not in a correct form.`
        );
    }
  } else {
    return res.status(500).send(`Body is empty.`);
  }
});

validateAllNumbers = (numbers) => {
  let isValid = false;
  for (const number of numbers) {
    isValid = isNumberValid(number);
  }
  return isValid;
};

isNumberValid = (number) => {
  const isNumberInteger = Number.isInteger(number);
  return isNumberInteger;
};

sumAllNumbersTogether = (numbers) => {
  let sum = 0;
  for (const number of numbers) {
    sum += number;
  }

  return sum;
};

calcIsNumberPrime = (number) => {
  let isNumberPrime = true;

  // 1 is always not prime and is an exception to the formula.
  if (number === 1) {
    isNumberPrime = false;
  } else if (number > 1) {
    // Main formula for calculating prime numbers
    for (let i = 2; i < number; i++) {
      if (number % i == 0) {
        isNumberPrime = false;
        break;
      }
    }
  } else {
    // 0 and negative numbers will always be non-prime.
    isNumberPrime = false;
  }

  return isNumberPrime;
};

// Without this the server would not listen to requests and it wouldn't be up-and-running.
app.listen(port, () => {
  console.log("Server is up an running on port:", port);
  console.log(`You can visit it here: http://localhost:${port}`);
});
