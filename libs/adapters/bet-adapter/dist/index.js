"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ladbrokes_client_1 = __importDefault(require("@abcfinite/ladbrokes-client"));
const dynamodb_client_1 = require("@abcfinite/dynamodb-client");
class BetAdapter {
    constructor() {
    }
    async logBets() {
        const pendingBetDetails = await new ladbrokes_client_1.default().getPendingBetsDetail();
        Promise.all(pendingBetDetails.map(async (bet) => {
            const betRecord = {
                Id: bet.id,
                EventId: bet.event.id,
                Player1: bet.event.player1,
                Player2: bet.event.player2,
                Player1Odd: bet.event.player1Odd,
                Player2Odd: bet.event.player2Odd,
                Tournament: bet.event.tournament,
            };
            await (0, dynamodb_client_1.putItem)('Bets', betRecord);
        }));
    }
}
exports.default = BetAdapter;
