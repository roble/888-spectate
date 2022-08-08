import {
  calculatePrice,
  fetchBitcoinPrice,
  fetchCurrentBitcoinPrice,
  formatCurrency,
  formatDate,
  formatDatetime,
  formatTime,
  getNextDateFromDayOfWeek,
  getNextLottoDraw,
  isValidDate,
  numLeftPad,
} from "../src/functions";

// Mock the fetch api
const response = {
  json: () => ({
    bitcoin: {
      eur: 22987.65,
    },
    market_data: {
      current_price: {
        eur: 33765.43,
      },
    },
  }),
  status: 200,
};

global.fetch = jest.fn(() => Promise.resolve(response));

// Basic tests
describe("Functions", () => {
  /**
   * getNextLottoDraw
   */
  describe("getNextLottoDraw", () => {
    it("should return a date instance", () => {
      expect(getNextLottoDraw()).toBeInstanceOf(Date);
      expect(getNextLottoDraw(new Date())).toBeInstanceOf(Date);
    });

    it("should return the next draw from the given date", () => {
      let date = new Date(2022, 7, 5, 19, 30, 15, 1); // august friday at 19:30:15
      let expectedDate = new Date(2022, 7, 6, 20); // next saturday at 20:00
      expect(getNextLottoDraw(date)).toEqual(expectedDate);

      date = new Date(2022, 7, 6, 20, 0, 0); // saturday at 20:00
      expectedDate = new Date(2022, 7, 10, 20); // next wednesday at 20:00
      expect(getNextLottoDraw(date)).toEqual(expectedDate);

      date = new Date(2022, 7, 3, 12); // wednesday at 12:00
      expectedDate = new Date(2022, 7, 3, 20); // same day at 20:00
      expect(getNextLottoDraw(date)).toEqual(expectedDate);

      date = new Date(2022, 1, 21, 12); // mon at 12:00
      expectedDate = new Date(2022, 1, 23, 20); // same day at 20:00
      expect(getNextLottoDraw(date)).toEqual(expectedDate);

      date = new Date(2015, 0, 1, 12); // thu at 12:00
      expectedDate = new Date(2015, 0, 3, 20); // sat day at 20:00
      expect(getNextLottoDraw(date)).toEqual(expectedDate);
    });

    it("should throw an error with an invalid input date parameter", () => {
      expect(() => {
        getNextLottoDraw(null);
      }).toThrowError("Date must be a valid date object");

      expect(() => {
        getNextLottoDraw(new Date("invalid date"));
      }).toThrowError("Date must be a valid date object");
    });
  });

  /**
   * fetchCurrentBitcoinPrice
   */
  describe("fetchCurrentBitcoinPrice", () => {
    it("should return the current bitcoin price", async () => {
      const price = await fetchCurrentBitcoinPrice();
      expect(price).toBe(22987.65);
    });
  });

  /**
   * fetchBitcoinPrice
   */
  describe("fetchBitcoinPrice", () => {
    it("should return the bitcoin price for the given date", async () => {
      const price = await fetchBitcoinPrice(new Date());
      expect(price).toBe(33765.43);
    });
  });

  /**
   * getNextDateFromDayOfWeek
   */
  describe("getNextDateFromDayOfWeek", () => {
    it("should return a date instance", () => {
      expect(getNextDateFromDayOfWeek(5)).toBeInstanceOf(Date);
      expect(getNextDateFromDayOfWeek(6, new Date(2000, 1, 1))).toBeInstanceOf(
        Date
      );
    });

    it("should return the next day of the week", () => {
      const date = new Date(2022, 7, 5); //Friday
      const day = date.getDay();

      expect(getNextDateFromDayOfWeek(day, date)).toEqual(
        new Date(2022, 7, 12) // next friday
      );
    });
  });

  /**
   * isValidDate
   */
  describe("isValidDate", () => {
    it("should return bool for the given date", () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date("invalid date"))).toBe(false);
    });
  });

  /**
   * formatCurrency
   */
  describe("formatCurrency", () => {
    it("should return a currency string formatted", () => {
      expect(formatCurrency(100.0)).toEqual("€100.00");
      expect(formatCurrency(10000.01)).toEqual("€10,000.01");
    });
  });

  /**
   * numLeftPad
   */
  describe("numLeftPad", () => {
    it("should return a number with left-pad zeros", () => {
      expect(numLeftPad(0)).toEqual("00");
      expect(numLeftPad(0, 3)).toEqual("000");
      expect(numLeftPad(1, 3)).toEqual("001");
      expect(numLeftPad(9, 10)).toEqual("0000000009");
    });
  });

  /**
   * formatDate
   */
  describe("formatDate", () => {
    it("should format a date object to dd-mm-yyyy format", () => {
      expect(formatDate(new Date(2022, 0, 1))).toEqual("01-01-2022");
    });
  });

  /**
   * formatTime
   */
  describe("formatTime", () => {
    it("should format a date object to time HH:mm format", () => {
      expect(formatTime(new Date(2022, 0, 1, 23, 37))).toEqual("23:37");
    });
  });

  /**
   * formatDatetime
   */
  describe("formatDatetime", () => {
    it("should format a date object to date and time dd-MM-yyyy HH:mm format", () => {
      expect(formatDatetime(new Date(2022, 11, 31, 23, 37))).toEqual(
        "31-12-2022 23:37"
      );
    });
  });

  /**
   * calculatePrice
   */
  describe("calculatePrice", () => {
    it("should calculate the percentage of profit or loss based on the given euro value and return it", () => {
      expect(calculatePrice(1000, 100, 100)).toEqual(1000); //profit
      expect(calculatePrice(100, 1000, 100)).toEqual(10); //loss
      expect(calculatePrice(100, 100, 100)).toEqual(100); // tie
      // Real references: 2013-08-06 , currentDate: 2022-08-01
      expect(calculatePrice(22794, 72.8867, 100)).toEqual(31273.195246869454);
    });
  });
});
