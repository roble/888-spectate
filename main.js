import {
  fetchBitcoinPrice,
  fetchCurrentBitcoinPrice,
  calculatePrice,
  formatCurrency,
  formatDatetime,
  getNextLottoDraw,
} from "./functions.js";

// variables
const amountEur = 100.0;
let currentBitcoinPrice = 0;

/**
 * Toggle the visibility of no record found message
 *
 * @returns void
 */
const hideOrShowTableNoRecords = () => {
  const tableNoRecords = document.getElementById("table_no_records");
  const showNoRecords =
    document.querySelectorAll("#table_records .table-row").length === 0;

  if (!showNoRecords) tableNoRecords.classList.add("display-none");
  else tableNoRecords.classList.remove("display-none");
};

/**
 * Show an error message
 *
 * @param {string} error
 */
const showError = (error) => {
  // Using alert but could be replaced with a notification system such as toast or modal
  alert(error);
};

/**
 *  Add new row to the table with the given values
 *
 * @param {string} date
 * @param {string} price
 */
const tableAddRow = (date, price) => {
  // create elements
  // using fragment because it is faster than creating elements one by one
  const fragment = document.createDocumentFragment();
  const tr = document.createElement("tr");
  const tdDate = document.createElement("td");
  const tdValue = document.createElement("td");

  // add classes
  tr.classList.add("table-row", "new-row");

  // set the values
  tdDate.innerHTML = date;
  tdValue.innerHTML = price;

  // append elements
  tr.appendChild(tdDate);
  tr.appendChild(tdValue);

  // append to the fragment
  fragment.appendChild(tr);

  // append to the table
  document.getElementById("table_records").appendChild(fragment);

  // show or hide no records message
  hideOrShowTableNoRecords();
};

/**
 * Handle submit click event
 *
 * @param {MouseEvent} event
 * @returns void
 */
const handleSubmit = (event) => {
  const { value } = document.getElementById("date");
  const date = new Date(value);
  const { target } = event;

  if (isNaN(date.getTime()))
    return showError(
      "The informed date is invalid, pick a valid date and try again"
    );

  // Disable the button to prevent multiple clicks
  // and show a kind of loading indicator
  target.disabled = true;
  document.getElementById("date").disabled = true;

  const nextDrawDate = getNextLottoDraw(date);

  fetchBitcoinPrice(nextDrawDate)
    .then((priceByDate) => {
      if (priceByDate === 0 || currentBitcoinPrice === 0)
        return showError(
          `No bitcoin price found for the next draw date: ${formatDatetime(
            nextDrawDate
          )}`
        );

      const price = calculatePrice(currentBitcoinPrice, priceByDate, amountEur);
      const formattedPrice = formatCurrency(price);
      const formattedDate = formatDatetime(nextDrawDate);

      tableAddRow(formattedDate, formattedPrice);

      const tableContainer = document.getElementById("table_container");
      tableContainer.scrollTop = tableContainer.scrollHeight;
    })
    .catch((error) => {
      showError(error);
    })
    .finally(() => {
      // Some visual feedback to indicate the button is ready to be clicked again
      setTimeout(() => {
        target.disabled = false;
        document.getElementById("date").disabled = false;
      }, 700);
    });
};

/**
 * Handle date enter key press event and call handleSubmit
 */
document.getElementById("date").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("submit").click();
  }
});

/**
 * Handle click event on the button to add a new record
 */
document.getElementById("submit").addEventListener("click", handleSubmit);

document.addEventListener("DOMContentLoaded", () => {
  // Fetch the current bitcoin price and store in a variable on document load
  fetchCurrentBitcoinPrice()
    .then((data) => {
      currentBitcoinPrice = data;
    })
    .catch((error) => {
      showError(error);
    });

  const now = new Date();
  // define the datepicker current date and time
  document.getElementById("date").value = now.toISOString().substring(0, 16);

  hideOrShowTableNoRecords();
});
