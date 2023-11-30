const { nonArrayValues } = require("../../config/testNonValues");
const filterArrSortLoose = require("../../helpers/filterArrSortLoose");


describe("filterArrSortLoose function", () => {
  describe("given the param is NOT an array", () => {
    it("should throw an error", () => {
   const falseValues = nonArrayValues

      falseValues.forEach((val) => {
        expect(() => filterArrSortLoose(val)).toThrow(
          new Error("Arr to be filtered but MUST be a 2d arr for loose filter")
        );
      });
    });
  });

  describe("given each element in the param array is NOT an array", () => {
    it("should throw an error", () => {
      const mockArray = [[1], [1, 2, 3], [3], 5, 4];

      expect(() => filterArrSortLoose(mockArray)).toThrow(
        new Error("each elem must be an arr - an arr of arr")
      );
    });
  });

  describe("given a successful loose filter has been sorted", () => {
    it("should return the sorted array", () => {
      const mockArray = [[1], [1, 2, 3], [3, 4, 5]];

      const expectedArray = [1, 2, 3, 4, 5];
      const result = filterArrSortLoose(mockArray);

      expect(result).toEqual(expect.arrayContaining(expectedArray));
    });
  });
});
