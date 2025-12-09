/**
 * @typedef {Object} ISeat
 * @property {string} _id
 * @property {string|Object} roomId
 * @property {string} label
 * @property {number} col
 * @property {number} row
 * @property {number} span
 * @property {{ seatType: string, value: number }[]} [price]
 * @property {"NORMAL" | "VIP" | "COUPLE"} type
 * @property {boolean} status
 */

/**
 * @typedef {ISeat & {
 *   userId: string|null,
 *   bookingStatus: string
 * }} ISeatStatus
 */
