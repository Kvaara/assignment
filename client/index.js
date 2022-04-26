import styles from "./index.css";

import { createApp } from "petite-vue";

createApp({
  selectedIdx: 0,

  numberTotal: null,
  isNumberPrime: null,

  isResult: null,
  isLoading: false,

  firstNumber: null,
  secondNumber: null,

  singleNumber: null,

  noErrors: true,

  get isCurrentSelectViewFilled() {
    const isSumOfTwoSelected = this.selectedIdx == 0;

    if (isSumOfTwoSelected) {
      return this.isFirstAndSecondNumbersFilled;
    } else {
      return this.isSingleNumberFilled;
    }
  },

  get isFirstAndSecondNumbersFilled() {
    const isFirstNumberFilled = this.firstNumber || this.firstNumber === 0;
    const isSecondNumberFilled = this.secondNumber || this.secondNumber === 0;
    return isFirstNumberFilled && isSecondNumberFilled;
  },

  get isSingleNumberFilled() {
    const isSingleNumberFilled = this.singleNumber || this.singleNumber === 0;
    return isSingleNumberFilled;
  },

  get isAtLeastOneInputFilled() {
    const isSumOfTwoSelected = this.selectedIdx == 0;
    if (isSumOfTwoSelected) {
      return this.firstNumber || this.secondNumber;
    } else {
      return this.singleNumber;
    }
  },

  get isSumOfTwoSelected() {
    return this.selectedIdx == 0;
  },

  async calculatePrime() {
    this.noErrors = true;
    this.isLoading = true;

    const numbersObject = this.numbersObjectModel;
    if (this.isSumOfTwoSelected) {
      numbersObject.numbers.push(this.firstNumber);
      numbersObject.numbers.push(this.secondNumber);
    } else {
      numbersObject.numbers.push(this.singleNumber);
    }

    try {
      const response = await fetch("http://127.0.0.1:3000/calculate", {
        method: "POST",
        body: JSON.stringify(numbersObject),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      this.isNumberPrime = result.isPrime;
      this.numberTotal = result.total;
      this.isResult = true;
    } catch (err) {
      this.noErrors = false;
      console.error("There was an unexpected error:", err);
    }

    // Intentionaal delay so that users are more knowledgeable of the system's state
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
  },

  get numbersObjectModel() {
    return {
      numbers: [],
    };
  },

  clearCurrentSelectViewInputs() {
    if (this.isSumOfTwoSelected) {
      this.firstNumber = "";
      this.secondNumber = "";
    } else {
      this.singleNumber = "";
    }
  },
}).mount();
