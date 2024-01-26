/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../../adapters/bet-adapter/index.ts":
/*!**********************************************!*\
  !*** ../../../adapters/bet-adapter/index.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BetAdapter)
/* harmony export */ });
/* harmony import */ var _abcfinite_ladbrokes_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @abcfinite/ladbrokes-client */ "../../../clients/ladbrokes-client/index.ts");
/* harmony import */ var _abcfinite_dynamodb_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @abcfinite/dynamodb-client */ "../../../clients/dynamodb-client/index.ts");


class BetAdapter {
    constructor() {
    }
    async logBets() {
        const pendingBetDetails = await new _abcfinite_ladbrokes_client__WEBPACK_IMPORTED_MODULE_0__["default"]().getPendingBetsDetail();
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
            await (0,_abcfinite_dynamodb_client__WEBPACK_IMPORTED_MODULE_1__.putItem)('Bets', betRecord);
        }));
    }
}


/***/ }),

/***/ "../../../clients/dynamodb-client/index.ts":
/*!*************************************************!*\
  !*** ../../../clients/dynamodb-client/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getItem: () => (/* binding */ getItem),
/* harmony export */   putItem: () => (/* binding */ putItem),
/* harmony export */   removeItem: () => (/* binding */ removeItem)
/* harmony export */ });
/* harmony import */ var _src_items__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/items */ "../../../clients/dynamodb-client/src/items.ts");

const getItem = async (tableName, itemId, itemName) => (0,_src_items__WEBPACK_IMPORTED_MODULE_0__.get)(tableName, itemId, itemName);
const putItem = async (tableName, item) => (0,_src_items__WEBPACK_IMPORTED_MODULE_0__.put)(tableName, item);
const removeItem = (tableName, itemId) => (0,_src_items__WEBPACK_IMPORTED_MODULE_0__.remove)(tableName, itemId);


/***/ }),

/***/ "../../../clients/dynamodb-client/src/items.ts":
/*!*****************************************************!*\
  !*** ../../../clients/dynamodb-client/src/items.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   get: () => (/* binding */ get),
/* harmony export */   put: () => (/* binding */ put),
/* harmony export */   remove: () => (/* binding */ remove),
/* harmony export */   update: () => (/* binding */ update)
/* harmony export */ });
/* harmony import */ var _aws_sdk_client_dynamodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @aws-sdk/client-dynamodb */ "@aws-sdk/client-dynamodb");
/* harmony import */ var _aws_sdk_client_dynamodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_aws_sdk_client_dynamodb__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _aws_sdk_lib_dynamodb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @aws-sdk/lib-dynamodb */ "@aws-sdk/lib-dynamodb");
/* harmony import */ var _aws_sdk_lib_dynamodb__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_aws_sdk_lib_dynamodb__WEBPACK_IMPORTED_MODULE_1__);


const put = async (tableName, item) => {
    const client = new _aws_sdk_client_dynamodb__WEBPACK_IMPORTED_MODULE_0__.DynamoDBClient({});
    const docClient = _aws_sdk_lib_dynamodb__WEBPACK_IMPORTED_MODULE_1__.DynamoDBDocumentClient.from(client);
    const command = new _aws_sdk_lib_dynamodb__WEBPACK_IMPORTED_MODULE_1__.PutCommand({
        TableName: tableName,
        Item: item
    });
    const response = await docClient.send(command);
    console.log(response);
    return response;
};
const get = async (tableName, itemId, itemName) => {
    const client = new _aws_sdk_client_dynamodb__WEBPACK_IMPORTED_MODULE_0__.DynamoDBClient({});
    const docClient = _aws_sdk_lib_dynamodb__WEBPACK_IMPORTED_MODULE_1__.DynamoDBDocumentClient.from(client);
    const command = new _aws_sdk_lib_dynamodb__WEBPACK_IMPORTED_MODULE_1__.GetCommand({
        TableName: tableName,
        Key: {
            id: itemId,
            name: itemName
        },
    });
    const response = await docClient.send(command);
    console.log(response);
    return response;
};
const update = async () => {
};
const remove = async (tableName, itemId) => {
    const client = new _aws_sdk_client_dynamodb__WEBPACK_IMPORTED_MODULE_0__.DynamoDBClient({});
    const docClient = _aws_sdk_lib_dynamodb__WEBPACK_IMPORTED_MODULE_1__.DynamoDBDocumentClient.from(client);
    const command = new _aws_sdk_lib_dynamodb__WEBPACK_IMPORTED_MODULE_1__.DeleteCommand({
        TableName: tableName,
        Key: {
            id: itemId,
        },
    });
    const response = await docClient.send(command);
    console.log(response);
    return response;
};


/***/ }),

/***/ "../../../clients/http-api-client/index.ts":
/*!*************************************************!*\
  !*** ../../../clients/http-api-client/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HttpApiClient)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

class HttpApiClient {
    constructor() { }
    async get(baseUrl, path, headers, params = {}) {
        let axiosResponse;
        let response = {
            value: null,
            status: null,
            statusText: null,
            hasValue: false,
            hasError: false,
            errorText: null,
        };
        axiosResponse = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(baseUrl + path, { headers, params });
        response.status = axiosResponse.status;
        response.value = axiosResponse.data;
        response.hasValue = axiosResponse.data !== undefined && axiosResponse.data !== null;
        return response;
    }
}


/***/ }),

/***/ "../../../clients/ladbrokes-client/index.ts":
/*!**************************************************!*\
  !*** ../../../clients/ladbrokes-client/index.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LadbrokesClient)
/* harmony export */ });
/* harmony import */ var _http_api_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../http-api-client */ "../../../clients/http-api-client/index.ts");
/* harmony import */ var _src_parsers_pendingBetsParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/parsers/pendingBetsParser */ "../../../clients/ladbrokes-client/src/parsers/pendingBetsParser.ts");
/* harmony import */ var _src_services_eventService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/services/eventService */ "../../../clients/ladbrokes-client/src/services/eventService.ts");
/* harmony import */ var _src_services_socket__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/services/socket */ "../../../clients/ladbrokes-client/src/services/socket.ts");




class LadbrokesClient {
    constructor() {
    }
    async getPendingBets() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': process.env.LADBROKES_BEARER_TOKEN
        };
        const httpApiClient = new _http_api_client__WEBPACK_IMPORTED_MODULE_0__["default"]();
        const result = await httpApiClient.get(process.env.LADBROKES_HOST, process.env.LADBROKES_PENDING_BETS_PATH, headers);
        const pendingBets = _src_parsers_pendingBetsParser__WEBPACK_IMPORTED_MODULE_1__["default"].parse(result.value);
        return pendingBets;
    }
    async getPendingBetsDetail() {
        const pendingBets = await new _src_services_socket__WEBPACK_IMPORTED_MODULE_3__["default"]().getPendingBetDetails();
        const betDetailList = await new _src_services_eventService__WEBPACK_IMPORTED_MODULE_2__["default"]().getEvents(pendingBets);
        return betDetailList;
    }
}


/***/ }),

/***/ "../../../clients/ladbrokes-client/src/parsers/betCollectionParser.ts":
/*!****************************************************************************!*\
  !*** ../../../clients/ladbrokes-client/src/parsers/betCollectionParser.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BetCollectionParser)
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

class BetCollectionParser {
    static parse(bodyJson) {
        const bets = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(bodyJson, 'bets', []);
        const betLegs = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(bodyJson, 'bet_legs', []);
        const betLegSelections = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(bodyJson, 'bet_leg_selections', []);
        const betCollection = Object.entries(bets).map(([key, value]) => {
            const betLegKey = Object.keys(betLegs).find(legKey => betLegs[legKey]['bet_id'] === key);
            const betLegSelection = Object.entries(betLegSelections).find(([_legSelectionKey, legSelectionValue]) => legSelectionValue['bet_leg_id'] === betLegKey);
            return {
                id: key,
                event: {
                    id: betLegSelection[1]['event_id'],
                    player1: null,
                    player2: null,
                    player1Odd: null,
                    player2Odd: null,
                    tournament: null,
                }
            };
        });
        return betCollection;
    }
}


/***/ }),

/***/ "../../../clients/ladbrokes-client/src/parsers/eventParser.ts":
/*!********************************************************************!*\
  !*** ../../../clients/ladbrokes-client/src/parsers/eventParser.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventParser)
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

class EventParser {
    static parse(bodyJson) {
        const eventsBody = Object.values(lodash__WEBPACK_IMPORTED_MODULE_0___default().get(bodyJson, 'events'))[0];
        const entrants = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(bodyJson, 'entrants');
        const mainMarketId = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(eventsBody, 'main_markets[0]');
        const markets = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(bodyJson, 'markets');
        const marketDetails = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(markets, mainMarketId);
        const entrantsIds = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(marketDetails, 'entrant_ids');
        const prices = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(bodyJson, 'prices');
        const entrant1PriceKey = Object.keys(prices).find(key => key.match(entrantsIds[0]) !== null);
        const entrant2PriceKey = Object.keys(prices).find(key => key.match(entrantsIds[1]) !== null);
        const entrant1Odd = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(prices, `${entrant1PriceKey}.odds`);
        const entrant2Odd = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(prices, `${entrant2PriceKey}.odds`);
        return {
            id: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(eventsBody, 'id'),
            player1: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(entrants, `${entrantsIds[0]}.name`, 'please check'),
            player2: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(entrants, `${entrantsIds[1]}.name`, 'please check'),
            player1Odd: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(entrant1Odd, 'numerator', 0) / lodash__WEBPACK_IMPORTED_MODULE_0___default().get(entrant1Odd, 'denominator', 1) + 1,
            player2Odd: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(entrant2Odd, 'numerator', 0) / lodash__WEBPACK_IMPORTED_MODULE_0___default().get(entrant2Odd, 'denominator', 1) + 1,
            tournament: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(eventsBody, 'competition.name', 'please check'),
        };
    }
}


/***/ }),

/***/ "../../../clients/ladbrokes-client/src/parsers/pendingBetsParser.ts":
/*!**************************************************************************!*\
  !*** ../../../clients/ladbrokes-client/src/parsers/pendingBetsParser.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PendingBetsParser)
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

class PendingBetsParser {
    static parse(bodyJson) {
        const pendingBetCounts = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(bodyJson, 'pending_bet_count');
        return {
            pendingBetCounts
        };
    }
}


/***/ }),

/***/ "../../../clients/ladbrokes-client/src/services/eventService.ts":
/*!**********************************************************************!*\
  !*** ../../../clients/ladbrokes-client/src/services/eventService.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventService)
/* harmony export */ });
/* harmony import */ var _abcfinite_http_api_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @abcfinite/http-api-client */ "../../../clients/http-api-client/index.ts");
/* harmony import */ var _parsers_eventParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parsers/eventParser */ "../../../clients/ladbrokes-client/src/parsers/eventParser.ts");


class EventService {
    constructor() {
    }
    async getEvent(eventId) {
        const headers = {
            'Content-Type': 'application/json'
        };
        const params = {
            id: eventId
        };
        const httpApiClient = new _abcfinite_http_api_client__WEBPACK_IMPORTED_MODULE_0__["default"]();
        const result = await httpApiClient.get(process.env.LADBROKES_HOST, process.env.LADBROKES_EVENT_CARD_PATH, headers, params);
        const event = _parsers_eventParser__WEBPACK_IMPORTED_MODULE_1__["default"].parse(result.value);
        return event;
    }
    async getEvents(bets) {
        const betsResult = Promise.all(bets.map(async (bet) => {
            bet.event = await this.getEvent(bet.event.id);
            return bet;
        }));
        return betsResult;
    }
}


/***/ }),

/***/ "../../../clients/ladbrokes-client/src/services/socket.ts":
/*!****************************************************************!*\
  !*** ../../../clients/ladbrokes-client/src/services/socket.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Socket)
/* harmony export */ });
/* harmony import */ var _abcfinite_http_api_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @abcfinite/http-api-client */ "../../../clients/http-api-client/index.ts");
/* harmony import */ var _parsers_betCollectionParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parsers/betCollectionParser */ "../../../clients/ladbrokes-client/src/parsers/betCollectionParser.ts");


class Socket {
    constructor() {
    }
    async getPendingBetDetails() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': process.env.LADBROKES_BEARER_TOKEN
        };
        const params = {
            method: 'transactionsbyclientidwithfilters',
            'client_id': 'c0616a90-07cd-435c-ac7f-4476857c6c1e',
            'transaction_type_ids': '["3a71227e-727c-4180-984d-87bf92f0f456"]',
            'bet_status_ids': '["6d91cb72-215e-47d1-93d0-e2105db3165c"]',
            'compact_combo_bets': true,
        };
        const httpApiClient = new _abcfinite_http_api_client__WEBPACK_IMPORTED_MODULE_0__["default"]();
        const result = await httpApiClient.get(process.env.LADBROKES_SOCKET_HOST, process.env.LADBROKES_SOCKET_TRANSACTION_PATH, headers, params);
        const pendingBets = _parsers_betCollectionParser__WEBPACK_IMPORTED_MODULE_1__["default"].parse(result.value['data']);
        return pendingBets;
    }
}


/***/ }),

/***/ "@aws-sdk/client-dynamodb":
/*!*******************************************!*\
  !*** external "@aws-sdk/client-dynamodb" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/client-dynamodb");

/***/ }),

/***/ "@aws-sdk/lib-dynamodb":
/*!****************************************!*\
  !*** external "@aws-sdk/lib-dynamodb" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/lib-dynamodb");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("lodash");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logBets: () => (/* binding */ logBets)
/* harmony export */ });
/* harmony import */ var _abcfinite_bet_adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @abcfinite/bet-adapter */ "../../../adapters/bet-adapter/index.ts");

const logBets = async (event) => {
    await new _abcfinite_bet_adapter__WEBPACK_IMPORTED_MODULE_0__["default"]().logBets();
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
};

})();

module.exports = __webpack_exports__;
/******/ })()
;