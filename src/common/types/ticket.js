/**
 * @typedef {"PENDING" | "CONFIRMED" | "CANCELLED"} TicketStatusEnum
 */

/**
 * @typedef {Object} ITicketItem
 * @property {string} seatId
 * @property {string} seatLabel
 * @property {number} price
 * @property {string} type
 */

/**
 * @typedef {Object} ICustomerInfo
 * @property {string} userName
 * @property {string} phone
 */

/**
 * @typedef {Object} ITicket
 * @property {string} _id
 * @property {string} userId
 * @property {string} ticketId
 * @property {string} showtimeId
 * @property {TicketStatusEnum | string} status
 * @property {ICustomerInfo} customerInfo
 * @property {string} movieId
 * @property {string} movieName
 * @property {string} roomId
 * @property {string} roomName
 * @property {ITicketItem[]} items
 * @property {string} startTime
 * @property {string} qrCode
 * @property {number} totalPrice
 * @property {string=} usedTime
 * @property {boolean} isPaid
 * @property {string=} cancelDescription
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export {};
