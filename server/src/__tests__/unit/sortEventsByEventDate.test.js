const { sortEventsByEventDate } = require("../../helpers/sortEventsHelper");

describe("sortEventsByEventDate function", () => {
  describe("given each element in param array does NOT have eventDate property", () => {
    it("should throw an erorr", () => {
      const events = [
        { _id: "1", eventName: "Event 1", eventDate: new Date(2022, 0, 1) },
        { _id: "2", eventName: "Event 2", eventDate: new Date(2022, 0, 2) },
        { _id: "3", eventName: "Missing eventDate" },
      ];

      expect(() => sortEventsByEventDate(events)).toThrow(
        new Error("Each event obj must have eventDate property")
      );
    });
  });

  describe('given all the elements are valid', () => { 

    it('should return sorted events', () => { 

        const today = new Date(Date.now())

        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const events = [
            { _id: "1", eventName: "Event 1", eventDate: today},
            { _id: "2", eventName: "Event 2", eventDate: yesterday },
            { _id: "3", eventName: "Event 3", eventDate: tomorrow },
          ];

        const result = sortEventsByEventDate(events)
        
        expect(result).toHaveLength(events.length)
        expect(result).toEqual([events[1], events[0], events[2]])
     })
   })
});
