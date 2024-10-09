"use strict";
/**
 * Use type guards to narrow down types with minimal efforts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWsExecutionEventV5 = exports.isWsAccountOrderEventV5 = exports.isWsPositionEventV5 = exports.isWsOrderbookEventV5 = void 0;
/**
 * Type guard to detect a V5 orderbook event (delta & snapshots)
 *
 * @param event
 * @returns
 */
function isWsOrderbookEventV5(event) {
    if (typeof event !== 'object' ||
        !event ||
        typeof event['topic'] !== 'string' ||
        typeof event['type'] !== 'string') {
        return false;
    }
    return (['delta', 'snapshot'].includes(event['type']) &&
        event['topic'].startsWith('orderbook'));
}
exports.isWsOrderbookEventV5 = isWsOrderbookEventV5;
/**
 * Type guard to detect a V5 position event.
 *
 * @param event
 * @returns
 */
function isWsPositionEventV5(event) {
    if (typeof event !== 'object' ||
        !event ||
        typeof event['topic'] !== 'string') {
        return false;
    }
    return event['topic'] === 'position';
}
exports.isWsPositionEventV5 = isWsPositionEventV5;
/**
 * Type guard to detect a V5 order event.
 *
 * @param event
 * @returns
 */
function isWsAccountOrderEventV5(event) {
    if (typeof event !== 'object' ||
        !event ||
        typeof event['topic'] !== 'string') {
        return false;
    }
    return event['topic'] === 'order';
}
exports.isWsAccountOrderEventV5 = isWsAccountOrderEventV5;
/**
 * Type guard to detect a V5 execution event.
 *
 * @param event
 * @returns
 */
function isWsExecutionEventV5(event) {
    if (typeof event !== 'object' ||
        !event ||
        typeof event['topic'] !== 'string') {
        return false;
    }
    return event['topic'] === 'execution';
}
exports.isWsExecutionEventV5 = isWsExecutionEventV5;
//# sourceMappingURL=typeGuards.js.map