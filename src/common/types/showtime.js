/**
 * @typedef {import("./movie").IMovie} IMovie
 * @typedef {import("./room").IRoom} IRoom
 */

/**
 * @typedef {Object} IMovieHasShowtime
 * @property {string} _id
 * @property {string} name
 * @property {number} duration
 * @property {string} poster
 * @property {number} showtimeCount
 * @property {string} firstStartTime
 * @property {string} lastStartTime
 * @property {number[]} dayOfWeeks
 * @property {IRoom[]} [externalRoom]   // <-- ĐÃ THÊM DÒNG NÀY
 */

/**
 * @typedef {Object} IPriceShowTime
 * @property {string} seatType
 * @property {number} value
 * @property {string} _id
 */

/**
 * @typedef {"scheduled" | "sold_out" | "in_progress" | "ended" | "cancelled"} IShowtimeStatus
 */

/**
 * @typedef {Object} IShowtime
 * @property {string} _id
 * @property {IMovie} movieId
 * @property {IRoom} roomId
 * @property {string} startTime
 * @property {number} dayOfWeek
 * @property {string} endTime
 * @property {IPriceShowTime[]} price
 * @property {IShowtimeStatus} status
 * @property {string} [cancelDescription]
 * @property {string} [createdAt]
 * @property {string} updatedAt
 */

/**
 * @typedef {Object.<string, IShowtime[]>} IWeekdayShowtime
 */

/**
 * @typedef {Object} IShowtimePrice
 * @property {"Regular" | "VIP" | "Couple" | string} seatType
 * @property {number} value
 */

/**
 * @typedef {Object} ICreateManyShowtimePayload
 * @property {string} movieId
 * @property {string} roomId
 * @property {IShowtimePrice[]} price
 * @property {string} startDate
 * @property {string} endDate
 * @property {number[]} dayOfWeeks
 * @property {string} fixedHour
 */

/**
 * @typedef {Object} ICreateShowtimePayload
 * @property {string} movieId
 * @property {string} roomId
 * @property {IShowtimePrice[]} price
 * @property {string} startTime
 */

/**
 * @typedef {Object} IUpdateShowtimePayload
 * @property {string} roomId
 * @property {IShowtimePrice[]} price
 * @property {string} startTime
 * @property {string} status
 * @property {string} [cancelDescription]
 */
