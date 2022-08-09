/**
 * Check whether a given value is a date or not
 *
 * @param {Date} date
 * @returns
 */
function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Get the next date of the given day of the week
 *
 * @param {int} dayOfWeek
 * @param {Date} date
 * @returns Date
 */
function getNextDateFromDayOfWeek(dayOfWeek, inputDate = new Date()) {
  if (
    dayOfWeek === undefined ||
    dayOfWeek === null ||
    dayOfWeek < 0 ||
    dayOfWeek > 6
  )
    throw new Error("The day of the week must be between 0 and 6");

  if (!isValidDate(inputDate))
    throw new Error("Date must be a valid date object");

  const date = new Date(inputDate);

  const nextDay = new Date(
    date.setDate(date.getDate() + ((7 - date.getDay() + dayOfWeek) % 7 || 7))
  );

  return nextDay;
}

/**
 * Get the next lotto draw
 *
 * @param {Date} date
 * @returns Date
 */
function getNextLottoDraw(inputDate = new Date()) {
  if (!isValidDate(inputDate))
    throw new Error("Date must be a valid date object");

  const WEDNESDAY = 3;
  const SATURDAY = 6;
  const DRAW_TIME_HOUR = 20;

  const datetime = new Date(inputDate);
  const hour = datetime.getHours();
  const day = datetime.getDay(); // Day of the week: 0-6
  let nextDrawDay;

  const setDrawHour = (date) => {
    date.setHours(DRAW_TIME_HOUR, 0, 0, 0);
    return date;
  };

  const isDrawToday =
    (day === SATURDAY || day === WEDNESDAY) && hour < DRAW_TIME_HOUR;
  const isDrawSaturday = day > WEDNESDAY && day !== SATURDAY;

  if (isDrawToday) return setDrawHour(datetime);

  if (isDrawSaturday) {
    nextDrawDay = getNextDateFromDayOfWeek(SATURDAY, datetime);
  } else {
    nextDrawDay = getNextDateFromDayOfWeek(WEDNESDAY, datetime);
  }

  return setDrawHour(nextDrawDay);
}

/**
 * Fetch the current bitcoin price
 *
 * @returns Promise<Number>
 */
async function fetchCurrentBitcoinPrice() {
  const endpoint = "https://api.coingecko.com/api/v3/simple/price?";
  const args = new URLSearchParams({
    ids: "bitcoin",
    vs_currencies: "eur",
  });

  const response = await fetch(`${endpoint}${args}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch the current bitcoin price");
  }

  const data = await response.json();
  return data?.bitcoin?.eur || 0;
}

/**
 * Fetch the current bitcoin price
 *
 * @returns Promise<Number>
 */
async function fetchBitcoinPrice(date = new Date()) {
  if (date instanceof Date === false)
    throw new Error("date must be a Date object");

  const formattedDate = formatDate(date);

  const endpoint = "https://api.coingecko.com/api/v3/coins/bitcoin/history?";
  const args = new URLSearchParams({
    date: formattedDate,
  });

  const response = await fetch(`${endpoint}${args}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch bitcoin price");
  }

  const data = await response.json();
  return data?.market_data?.current_price?.eur || 0;
}

/**
 * Format the given value to a currency string
 *
 * @param {Number} value
 * @returns string
 */
function formatCurrency(value) {
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
  });

  return formatter.format(value);
}

/**
 * Left pad the given number with zeros
 *
 * @param {Number} num
 * @param {Number} size
 * @returns string
 */
function numLeftPad(num, size = 2) {
  return num.toString().padStart(size, "0");
}

/**
 * Format the given date to a string
 *
 * @param {Date} date
 * @returns string | format: dd-MM-yyyy
 */
function formatDate(date) {
  const day = numLeftPad(date.getDate());
  const month = numLeftPad(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

/**
 * Format the given date to a time string
 *
 * @param {Date} value
 * @returns string | format: HH:mm
 */
function formatTime(date) {
  const hour = numLeftPad(date.getHours());
  const mins = numLeftPad(date.getMinutes());

  return `${hour}:${mins}`;
}

/**
 * Format the given date to a datetime string
 *
 * @param {Date} value
 * @returns string | format: dd-MM-yyyy HH:mm
 */
function formatDatetime(date) {
  return formatDate(date) + " " + formatTime(date);
}

/**
 * Calculate the percentage of profit or loss
 * based on the current bitcoin price and
 * add to the given value
 *
 * @param {Number} currentPrice
 * @param {Number} datePrice
 * @param {Number} amount
 * @returns Number
 */
function calculatePrice(currentPrice, datePrice, amount) {
  const percent = amount / datePrice;
  return currentPrice * percent;
}