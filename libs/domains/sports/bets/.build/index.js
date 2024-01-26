var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import BetAdapter from '@abcfinite/bet-adapter';
export const logBets = (event) => __awaiter(void 0, void 0, void 0, function* () {
    yield new BetAdapter().logBets();
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'your pending bets stored successfully in dynamodb',
            input: event,
        }, null, 2),
    };
    return new Promise((resolve) => {
        resolve(response);
    });
});
//# sourceMappingURL=index.js.map