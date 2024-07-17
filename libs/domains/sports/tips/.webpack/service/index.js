/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../../adapters/tips-adapter/index.ts":
/*!***********************************************!*\
  !*** ../../../adapters/tips-adapter/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TipsAdapter)
/* harmony export */ });
/* harmony import */ var node_html_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-html-parser */ "node-html-parser");
/* harmony import */ var node_html_parser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_html_parser__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _abcfinite_s3_client_custom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @abcfinite/s3-client-custom */ "../../../clients/s3-client-custom/index.ts");
/* harmony import */ var _clients_betapi_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../clients/betapi-client */ "../../../clients/betapi-client/index.ts");
/* harmony import */ var fast_csv__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fast-csv */ "fast-csv");
/* harmony import */ var fast_csv__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fast_csv__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var stream__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! stream */ "stream");
/* harmony import */ var stream__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(stream__WEBPACK_IMPORTED_MODULE_4__);





class TipsAdapter {
    async getTips() {
        const matchStatFile = await new _abcfinite_s3_client_custom__WEBPACK_IMPORTED_MODULE_1__["default"]().getFile('tennis-match-schedule-html', 'matchstat.html');
        let predictionCols = [];
        const matchStatHtml = (0,node_html_parser__WEBPACK_IMPORTED_MODULE_0__.parse)(matchStatFile);
        const predictions = matchStatHtml.getElementsByTagName('div').filter(div => div.attributes.class === 'ms-prediction-table');
        predictions.forEach(pred => {
            const pTitle = pred.querySelector('.prediction-title a').getAttribute('href');
            const pName = pred.querySelector('.player-name-pt').text.trim();
            const pTimeStage = pred.querySelector('.prediction-time');
            const pTimeStageArray = pTimeStage.text.replaceAll(/\s/g, '').split('/');
            const aOdds = pred.querySelector('.odds-item.item-border');
            const predPercentage = pred.querySelector('.prediction-item.item-border');
            const linkSplitted = decodeURIComponent(pTitle).split('/');
            if (pName.toLowerCase().includes('over')) {
                return;
            }
            const prediction = {
                date: pTimeStageArray[0],
                stage: pTimeStageArray[1],
                player1: pName,
                player2: pName.toLowerCase() === linkSplitted[5].toLowerCase() ? linkSplitted[6] : linkSplitted[5],
                odds: ((Math.round(Number(aOdds.text.replaceAll(/\s/g, '')) * 100) / 100) - 1).toFixed(2),
                percentage: predPercentage.text.replaceAll(/\s/g, '').replaceAll(/\%/g, ''),
            };
            if (!prediction.player1.includes('over')) {
                predictionCols.push(prediction);
            }
        });
        const events = await new _clients_betapi_client__WEBPACK_IMPORTED_MODULE_2__["default"]().getEvents();
        predictionCols = predictionCols.map(p => {
            let e = events.find(e => e.player1.toLowerCase() === p.player1.toLowerCase() || e.player2.toLowerCase() === p.player1.toLowerCase());
            if (e !== undefined && e !== null) {
                p.date = new Date(Number(e.time) * 1000).toLocaleDateString();
                const localDateTime = new Date(Number(e.time) * 1000).toLocaleString('en-GB', { timeZone: 'Australia/Sydney' }).split(',');
                p.time = localDateTime[1];
                if (p.time !== null && p.time !== undefined) {
                    p.date = localDateTime[0];
                }
            }
            return p;
        });
        return predictionCols.map(p => {
            if (p.time != null) {
                return `${p.date},${p.time},${p.stage},${p.player1},${p.player2},${p.percentage},${p.odds}`;
            }
            return `${p.date},00:00,${p.stage},${p.player1},${p.player2},${p.percentage},${p.odds}`;
        }).join('\r\n');
        // return  [].map(p => `${p.time},${p.player1},${p.player2},${p.percentage},${p.odds}`).join('\r\n')
    }
    async getCombineTips() {
        const matchStatCsvRowsCol = await this.matchStatCsvRows();
        const todayCsvCol = await this.todayCsvRows();
        return matchStatCsvRowsCol.map(m => {
            const cMatch = todayCsvCol.find(tm => m['fp'].toLowerCase() === tm['fav p'].toLowerCase());
            let percentage = '0,0';
            if (cMatch !== null && cMatch !== undefined) {
                percentage = `${cMatch['match no']},${cMatch['win percentage']}`;
            }
            return `${m['date']},${m['time']},${m['stage']},${m['fp']},${m['nfp']},${m['wp']},${m['odds']},${percentage}`;
        }).join('\r\n');
    }
    async todayCsvRows() {
        const matchStatCsv = await new _abcfinite_s3_client_custom__WEBPACK_IMPORTED_MODULE_1__["default"]().getFile('tennis-match-schedule', 'today.csv');
        const rows = [];
        return new Promise((resolve, reject) => {
            stream__WEBPACK_IMPORTED_MODULE_4__.Readable.from(matchStatCsv)
                .pipe(fast_csv__WEBPACK_IMPORTED_MODULE_3__.parse({ headers: true }))
                .on('error', error => reject(error))
                .on('data', row => rows.push(row))
                .on('end', _ => {
                resolve(rows);
            });
        });
    }
    async matchStatCsvRows() {
        const matchStatCsv = await new _abcfinite_s3_client_custom__WEBPACK_IMPORTED_MODULE_1__["default"]().getFile('tennis-match-schedule-html', 'matchstat_filtered.csv');
        const rows = [];
        return new Promise((resolve, reject) => {
            stream__WEBPACK_IMPORTED_MODULE_4__.Readable.from(matchStatCsv)
                .pipe(fast_csv__WEBPACK_IMPORTED_MODULE_3__.parse({ headers: true }))
                .on('error', error => reject(error))
                .on('data', row => rows.push(row))
                .on('end', _ => {
                resolve(rows);
            });
        });
    }
}


/***/ }),

/***/ "../../../clients/betapi-client/index.ts":
/*!***********************************************!*\
  !*** ../../../clients/betapi-client/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BetapiClient)
/* harmony export */ });
/* harmony import */ var _src_parsers_pagingParser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/parsers/pagingParser */ "../../../clients/betapi-client/src/parsers/pagingParser.ts");
/* harmony import */ var _http_api_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../http-api-client */ "../../../clients/http-api-client/index.ts");
/* harmony import */ var _src_parsers_eventParser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/parsers/eventParser */ "../../../clients/betapi-client/src/parsers/eventParser.ts");



class BetapiClient {
    constructor() {
    }
    async getEvents() {
        const httpApiClient = new _http_api_client__WEBPACK_IMPORTED_MODULE_1__["default"]();
        const result = await httpApiClient.get('https://api.b365api.com', '/v3/events/upcoming', null, { sport_id: '13', token: '196561-yXe5Z8ulO9UAvk' });
        let fullIncomingEvents = [];
        const paging = _src_parsers_pagingParser__WEBPACK_IMPORTED_MODULE_0__["default"].parse(result.value['pager']);
        const numberOfPageTurn = Math.floor(paging.total / paging.perPage);
        const pageOneEvents = result.value['results'].map(r => {
            return _src_parsers_eventParser__WEBPACK_IMPORTED_MODULE_2__["default"].parse(r);
        });
        fullIncomingEvents = fullIncomingEvents.concat(pageOneEvents);
        let fetchPageActions = [];
        for (let page = 0; page < numberOfPageTurn; page++) {
            fetchPageActions.push(this.getEveryPage(page));
            // fullIncomingEvents = fullIncomingEvents.concat(await this.getEveryPage(page))
        }
        let parsedEvents = await Promise.all(fetchPageActions);
        parsedEvents.map(pe => fullIncomingEvents = fullIncomingEvents.concat(pe));
        return fullIncomingEvents;
    }
    async getEveryPage(pageNo) {
        const httpApiClient = new _http_api_client__WEBPACK_IMPORTED_MODULE_1__["default"]();
        const loopResult = await httpApiClient.get('https://api.b365api.com', '/v3/events/upcoming', null, { sport_id: '13', token: '196561-yXe5Z8ulO9UAvk', page: 2 + pageNo });
        const parsedEvents = loopResult.value['results'].map(r => {
            return _src_parsers_eventParser__WEBPACK_IMPORTED_MODULE_2__["default"].parse(r);
        });
        return parsedEvents;
    }
}


/***/ }),

/***/ "../../../clients/betapi-client/src/parsers/eventParser.ts":
/*!*****************************************************************!*\
  !*** ../../../clients/betapi-client/src/parsers/eventParser.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventParser)
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

class EventParser {
    static parse(event) {
        return {
            id: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(event, 'id', ''),
            time: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(event, 'time', ''),
            player1: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(event, 'home.name', ''),
            player2: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(event, 'away.name', '')
        };
    }
}


/***/ }),

/***/ "../../../clients/betapi-client/src/parsers/pagingParser.ts":
/*!******************************************************************!*\
  !*** ../../../clients/betapi-client/src/parsers/pagingParser.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PagingParser)
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

class PagingParser {
    static parse(pager) {
        return {
            page: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(pager, 'page', 0),
            perPage: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(pager, 'per_page', 0),
            total: lodash__WEBPACK_IMPORTED_MODULE_0___default().get(pager, 'total', 0),
        };
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
        try {
            let instance = axios__WEBPACK_IMPORTED_MODULE_0___default().create({
                timeout: 10000, //optional
            });
            axiosResponse = await instance.get(baseUrl + path, { headers, params });
            response.status = axiosResponse.status;
            response.value = axiosResponse.data;
            response.hasValue = axiosResponse.data !== undefined && axiosResponse.data !== null;
        }
        catch (err) {
            console.error(err);
        }
        return response;
    }
}


/***/ }),

/***/ "../../../clients/s3-client-custom/index.ts":
/*!**************************************************!*\
  !*** ../../../clients/s3-client-custom/index.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ S3ClientCustom)
/* harmony export */ });
/* harmony import */ var _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @aws-sdk/client-s3 */ "@aws-sdk/client-s3");
/* harmony import */ var _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__);

class S3ClientCustom {
    constructor() { }
    async getFileList(bucketName) {
        const client = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.S3Client({});
        const command = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.ListObjectsV2Command({
            Bucket: bucketName,
            // The default and maximum number of keys returned is 1000. This limits it to
            // one for demonstration purposes.
            MaxKeys: 1,
        });
        try {
            let isTruncated = true;
            const fileList = [];
            while (isTruncated) {
                const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);
                if (Contents === null || Contents === undefined) {
                    return [];
                }
                Contents.map((c) => fileList.push(c.Key));
                isTruncated = IsTruncated;
                command.input.ContinuationToken = NextContinuationToken;
            }
            return fileList;
        }
        catch (err) {
            console.error(err);
        }
    }
    async getFile(bucketName, fileName) {
        const client = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.S3Client({});
        const command = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.GetObjectCommand({
            Bucket: bucketName,
            Key: fileName,
        });
        try {
            const response = await client.send(command);
            // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
            const str = await response.Body.transformToString();
            return str;
        }
        catch (err) {
            console.error(err);
        }
    }
    async deleteAllFiles(bucketName) {
        const fileList = await this.getFileList(bucketName);
        const client = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.S3Client({});
        await Promise.all(fileList.map(async (f) => {
            const command = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.DeleteObjectCommand({
                Bucket: bucketName,
                Key: f,
            });
            try {
                const response = await client.send(command);
                return response;
            }
            catch (err) {
                console.error(err);
            }
        }));
        return 'success';
    }
    async putFile(bucketName, fileName, content) {
        const client = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.S3Client({});
        const command = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: content,
        });
        try {
            const response = await client.send(command);
            console.log(response);
        }
        catch (err) {
            console.error(err);
        }
        return 'success';
    }
}


/***/ }),

/***/ "@aws-sdk/client-s3":
/*!*************************************!*\
  !*** external "@aws-sdk/client-s3" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/client-s3");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "fast-csv":
/*!***************************!*\
  !*** external "fast-csv" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("fast-csv");

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

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

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
/* harmony export */   getCombineTips: () => (/* binding */ getCombineTips),
/* harmony export */   getLatestTips: () => (/* binding */ getLatestTips)
/* harmony export */ });
/* harmony import */ var _abcfinite_tips_adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @abcfinite/tips-adapter */ "../../../adapters/tips-adapter/index.ts");

const getLatestTips = async (event) => {
    const result = await new _abcfinite_tips_adapter__WEBPACK_IMPORTED_MODULE_0__["default"]().getTips();
    const response = {
        statusCode: 200,
        body: JSON.stringify(result, null, 2),
    };
    return new Promise((resolve) => {
        resolve(response);
    });
};
const getCombineTips = async (event) => {
    const result = await new _abcfinite_tips_adapter__WEBPACK_IMPORTED_MODULE_0__["default"]().getCombineTips();
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