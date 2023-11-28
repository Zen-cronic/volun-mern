const { formatInTimeZone } = require("date-fns-tz");
const convertLocalDateString = require("../../helpers/convertLocalDateString");

jest.mock("date-fns-tz")

describe("convertLocalDateString helper", () => {
  describe("given that the param is not an instance of Date", () => {
    it('should thrown an Error', () => { 

        const falseParams = [123, "str", {date: "2023-11-12T00:00"}, [1, 3, 4]]

        // expect(() => (

        //     falseParams.forEach(param => (convertLocalDateString(param)))
        // )).toThrow('a Non-Date cannot be convereted to a String - date event filter')

        falseParams.forEach(param => {

            expect(() => (convertLocalDateString(param))).toThrow(/a Non-Date cannot be convereted to a String - date event filter/)
        })

        
     })
  })

  describe('given that the param is an instance of Date', () => { 

    it('should convert the date to local date using format', () => { 

      formatInTimeZone.mockReturnValue("2023-12-01 00:00:00 EST")

      const formatString = "yyyy-MM-dd HH:mm:ss zzz"
      const timeZone = 'America/Toronto'
      const mockDate = new Date('2023-12-01T04:00:00')
      const mockResult = "2023-12-01 00:00:00 EST"

      const result = formatInTimeZone(mockDate, timeZone, formatString)

      expect(result).toBe(mockResult)
      expect(formatInTimeZone).toHaveBeenCalledWith(mockDate, timeZone, formatString)

     })
  })
});
