/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../../adapters/player-adapter/index.ts":
/*!*************************************************!*\
  !*** ../../../adapters/player-adapter/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlayerAdater)
/* harmony export */ });
/* harmony import */ var _abcfinite_tennislive_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @abcfinite/tennislive-client */ "../../../clients/tennislive-client/index.ts");

class PlayerAdater {
    async checkPlayer(player1Name, player2Name) {
        console.log('>>>>player1Name');
        console.log(player1Name);
        console.log('>>>>player2Name');
        console.log(player2Name);
        const tennisLiveClient = new _abcfinite_tennislive_client__WEBPACK_IMPORTED_MODULE_0__["default"]();
        const player1 = await tennisLiveClient.getPlayer(player1Name);
        console.log('>>>>player1');
        console.log(player1);
        const player2 = await tennisLiveClient.getPlayer(player2Name);
        console.log('>>>>player2');
        console.log(player2);
    }
}


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

/***/ "../../../clients/tennislive-client/index.ts":
/*!***************************************************!*\
  !*** ../../../clients/tennislive-client/index.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TennisliveClient)
/* harmony export */ });
/* harmony import */ var _src_services_playerService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/services/playerService */ "../../../clients/tennislive-client/src/services/playerService.ts");
/* harmony import */ var _src_parsers_matchesDetailParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/parsers/matchesDetailParser */ "../../../clients/tennislive-client/src/parsers/matchesDetailParser.ts");
// manually find sport event
// fetch info on the sport event


class TennisliveClient {
    constructor() {
    }
    async getPlayer(playerName) {
        const playerDetailUrl = await new _src_services_playerService__WEBPACK_IMPORTED_MODULE_0__["default"]().getPlayerUrl(playerName);
        if (playerDetailUrl === null || playerDetailUrl === undefined)
            return {};
        const player = await new _src_services_playerService__WEBPACK_IMPORTED_MODULE_0__["default"]().getPlayerDetailHtml(playerDetailUrl);
        new _src_parsers_matchesDetailParser__WEBPACK_IMPORTED_MODULE_1__["default"]().parse(player);
        await Promise.all(player.parsedPreviousMatches.map(async (prevMatch, index) => {
            const newPlayerData = await new _src_services_playerService__WEBPACK_IMPORTED_MODULE_0__["default"]().getPlayerDetailHtml(prevMatch.player.url, false);
            player.parsedPreviousMatches[index].player = newPlayerData;
        }));
        return player;
    }
}


/***/ }),

/***/ "../../../clients/tennislive-client/src/parsers/matchesDetailParser.ts":
/*!*****************************************************************************!*\
  !*** ../../../clients/tennislive-client/src/parsers/matchesDetailParser.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MatchesDetailParser)
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

class MatchesDetailParser {
    parse(startPlayerData) {
        const matchesShown = startPlayerData.previousMatches.getElementsByTagName("tr");
        startPlayerData.previousMatches = null;
        const matchesShownLength = matchesShown.length < 20 ? matchesShown.length : 20;
        const matches = [];
        Array.from(matchesShown).slice(0, matchesShownLength).forEach(element => {
            const player = {
                id: '',
                name: '',
                country: '',
                dob: '',
                currentRanking: 0,
                highestRanking: 0,
                matchesTotal: 0,
                matchesWon: 0,
                url: null,
                previousMatches: null,
                parsedPreviousMatches: null,
            };
            const match = {
                player: player,
                result: 'lost'
            };
            element.childNodes.forEach(td => {
                td.childNodes.forEach(content => {
                    const attributes = content.attributes;
                    if (lodash__WEBPACK_IMPORTED_MODULE_0___default().get(attributes, 'title', null) === '') {
                        player['url'] = content.attributes['href'];
                    }
                    const alt = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(attributes, 'alt', null);
                    if (alt !== null && (alt === 'win' || alt === 'lost')) {
                        match['result'] = content.attributes['alt'];
                    }
                });
            });
            matches.push(match);
        });
        startPlayerData.parsedPreviousMatches = matches;
        return startPlayerData;
    }
}


/***/ }),

/***/ "../../../clients/tennislive-client/src/parsers/playerDetailParser.ts":
/*!****************************************************************************!*\
  !*** ../../../clients/tennislive-client/src/parsers/playerDetailParser.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlayerDetailParser)
/* harmony export */ });
/* harmony import */ var node_html_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-html-parser */ "node-html-parser");
/* harmony import */ var node_html_parser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_html_parser__WEBPACK_IMPORTED_MODULE_0__);

class PlayerDetailParser {
    static parse(html, keepPreviousMatches = true) {
        const root = (0,node_html_parser__WEBPACK_IMPORTED_MODULE_0__.parse)(html);
        const playerStatsElement = root.getElementsByTagName("div").find(div => div.attributes.class === "player_stats");
        const player = {
            id: '',
            name: '',
            country: '',
            dob: '',
            currentRanking: 0,
            highestRanking: 0,
            matchesTotal: 0,
            matchesWon: 0,
            url: '',
            previousMatches: null,
            parsedPreviousMatches: null
        };
        if (keepPreviousMatches) {
            player['previousMatches'] = root.getElementsByTagName("table")
                .findLast(table => table.attributes.class === "table_pmatches");
        }
        let post = 0;
        playerStatsElement.childNodes.forEach(element => {
            if (element.rawText.trim() === 'Name:') {
                player['name'] = playerStatsElement.childNodes[post + 1].rawText.trim();
            }
            if (element.rawText.trim() === 'Country:') {
                player['country'] = playerStatsElement.childNodes[post + 1].rawText.trim();
            }
            if (element.rawText.trim() === 'Birthdate:') {
                const dobAge = playerStatsElement.childNodes[post + 1].rawText.trim();
                player['dob'] = dobAge.split(',')[0];
            }
            if (element.rawText.trim() === 'ATP ranking' || element.rawText.trim() === 'WTA ranking') {
                player['currentRanking'] = Number(playerStatsElement.childNodes[post + 2].rawText.trim());
            }
            if (element.rawText.trim() === "TOP ranking's position:") {
                player['highestRanking'] = Number(playerStatsElement.childNodes[post + 1].rawText.trim());
            }
            if (element.rawText.trim() === 'Matches total:') {
                player['matchesTotal'] = Number(playerStatsElement.childNodes[post + 1].rawText.trim());
            }
            if (element.rawText.trim() === 'Win:') {
                player['matchesWon'] = Number(playerStatsElement.childNodes[post + 1].rawText.trim());
            }
            ++post;
        });
        player['id'] = player['name'].toLocaleLowerCase().replaceAll(' ', '') + '#' + player['dob'];
        return player;
    }
}


/***/ }),

/***/ "../../../clients/tennislive-client/src/parsers/playerListParser.ts":
/*!**************************************************************************!*\
  !*** ../../../clients/tennislive-client/src/parsers/playerListParser.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlayerListParser)
/* harmony export */ });
/* harmony import */ var node_html_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-html-parser */ "node-html-parser");
/* harmony import */ var node_html_parser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_html_parser__WEBPACK_IMPORTED_MODULE_0__);

class PlayerListParser {
    static parse(html) {
        const root = (0,node_html_parser__WEBPACK_IMPORTED_MODULE_0__.parse)(html);
        const links = root.querySelectorAll("a");
        if (links.length > 1) {
            console.log('too many result check name');
        }
        else if (links.length == 1) {
            return links[0].getAttribute('href');
        }
        return null;
    }
}


/***/ }),

/***/ "../../../clients/tennislive-client/src/services/playerService.ts":
/*!************************************************************************!*\
  !*** ../../../clients/tennislive-client/src/services/playerService.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlayerService)
/* harmony export */ });
/* harmony import */ var _abcfinite_http_api_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @abcfinite/http-api-client */ "../../../clients/http-api-client/index.ts");
/* harmony import */ var _parsers_playerListParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parsers/playerListParser */ "../../../clients/tennislive-client/src/parsers/playerListParser.ts");
/* harmony import */ var _parsers_playerDetailParser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../parsers/playerDetailParser */ "../../../clients/tennislive-client/src/parsers/playerDetailParser.ts");



class PlayerService {
    constructor() {
    }
    async getPlayerUrl(playerName) {
        const headers = {
            Host: 'www.tennislive.net',
            Referer: process.env.TENNISLIVE_HOST
        };
        const httpApiClient = new _abcfinite_http_api_client__WEBPACK_IMPORTED_MODULE_0__["default"]();
        const result = await httpApiClient.get(process.env.TENNISLIVE_HOST, process.env.TENNISLIVE_PATH + '?qe=' + playerName, headers);
        return _parsers_playerListParser__WEBPACK_IMPORTED_MODULE_1__["default"].parse(result.value);
    }
    async getPlayerDetailHtml(playerDetailUrl, keepPreviousMatches = true) {
        const headers = {
            Host: 'www.tennislive.net',
            Referer: process.env.TENNISLIVE_HOST
        };
        const httpApiClient = new _abcfinite_http_api_client__WEBPACK_IMPORTED_MODULE_0__["default"]();
        const result = await httpApiClient.get(process.env.TENNISLIVE_HOST, playerDetailUrl.replace(process.env.TENNISLIVE_HOST, ''), headers);
        return _parsers_playerDetailParser__WEBPACK_IMPORTED_MODULE_2__["default"].parse(result.value, keepPreviousMatches);
    }
}


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

/***/ }),

/***/ "node-html-parser":
/*!***********************************!*\
  !*** external "node-html-parser" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("node-html-parser");

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
/* harmony export */   checkPlayer: () => (/* binding */ checkPlayer)
/* harmony export */ });
/* harmony import */ var _abcfinite_player_adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @abcfinite/player-adapter */ "../../../adapters/player-adapter/index.ts");

const checkPlayer = async (event) => {
    const { player1, player2 } = event.queryStringParameters;
    console.log('>>>player1 : ', player1);
    console.log('>>>player2 : ', player2);
    const result = await new _abcfinite_player_adapter__WEBPACK_IMPORTED_MODULE_0__["default"]().checkPlayer(player1, player2);
    const response = {
        statusCode: 200,
        body: JSON.stringify(result, null, 2),
    };
    return new Promise((resolve) => {
        resolve(response);
    });
};

})();

module.exports = __webpack_exports__;
/******/ })()
;