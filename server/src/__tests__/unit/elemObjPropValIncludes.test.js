const elemObjPropValIncludes = require("../../helpers/elemObjPropValIncludes");

describe("elemObjPropValIncludes function", () => {
  const generateMockArray = (testProperty, missingObjIndex, len) => {
    return Array.from({ length: len }, (_, i) => {
      return i === missingObjIndex
        ? { eventShifts: [] }
        : { [testProperty]: i + 1, eventShifts: [] };
    });
  };

  const mockProperty = "eventId";

  describe("given the first param is not an array object", () => {
    it("should throw an error", () => {
      const nonArrayValues = [
        123,
        "string",
        true,
        null,
        undefined,
        {},
        () => {},
        new Date(),
      ];

      nonArrayValues.forEach((val) => {
        expect(() =>
          elemObjPropValIncludes(val, expect.any(String), expect.anything())
        ).toThrow(new Error("elemObjPropValIncludes arr param must be an arr"));
      });
    });
  });

  describe("given the second param is not a string", () => {
    it("should throw an error", () => {
      const nonStringValues = [
        123,
        true,
        null,
        undefined,
        [],
        {},
        () => {},
        new Date(),
      ];

      nonStringValues.forEach((val) => {
        expect(() =>
          elemObjPropValIncludes([], val, expect.anything())
        ).toThrow(
          new Error("elemObjPropValIncludes propKey param must be an string")
        );
      });
    });
  });

  describe("given at least one object in the first param array does not contain the property defined by the second param string", () => {
    it("should throw an error", () => {
      const mockArray = generateMockArray(mockProperty, 1, 5);
      // console.log(mockArray);
      expect(() =>
        elemObjPropValIncludes(mockArray, mockProperty, expect.anything())
      ).toThrow(
        new Error(
          "all elem obj in the arr must contain propKey: eventId : as a property key"
        )
      );
    });
  });

  describe("given a matching object is found", () => {
    it("should return the index of the found object", () => {
      const mockArray = generateMockArray(mockProperty, null, 5);
      // console.log(mockArray);

      //3rd arg of fx must be a val that's the same as only one of the obj's property val

      //customize generateMockArray to pass in length and the 3rd arg is within 1 to len
      const result = elemObjPropValIncludes(mockArray, mockProperty, 1);

      expect(result).toEqual(expect.any(Number));
      expect(result).not.toEqual(-1);
    });
  });

  describe("given a matching object is not found", () => {
    it("should return -1", () => {
      const mockArray = generateMockArray(mockProperty, null, 5);

      const result = elemObjPropValIncludes(mockArray, mockProperty, 10);

      expect(result).toEqual(-1);
    });
  });
});
