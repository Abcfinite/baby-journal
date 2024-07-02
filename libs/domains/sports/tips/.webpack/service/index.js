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


class TipsAdapter {
    async getTips() {
        const matchStatFile = await new _abcfinite_s3_client_custom__WEBPACK_IMPORTED_MODULE_1__["default"]().getFile('tennis-matchstat', 'matchstat.html');
        const predictionCols = [];
        const matchStatHtml = (0,node_html_parser__WEBPACK_IMPORTED_MODULE_0__.parse)(matchStatFile);
        const predictions = matchStatHtml.getElementsByTagName('div').filter(div => div.attributes.class === 'ms-prediction-table');
        console.log('>>>>>predictions>>>', predictions.length);
        predictions.forEach(pred => {
            const pTime = pred.querySelector('.prediction-time');
            const pName = pred.querySelector('.player-name-pt');
            const aOdds = pred.querySelector('.odds-item.item-border');
            const predPercentage = pred.querySelector('.prediction-item.item-border');
            const prediction = {
                time: pTime.text.replaceAll(/\s/g, ''),
                player1: pName.text.replaceAll(/\s/g, ''),
                odds: aOdds.text.replaceAll(/\s/g, ''),
                percentage: predPercentage.text.replaceAll(/\s/g, '').replaceAll(/\%/g, ''),
            };
            if (!prediction.player1.includes('over')) {
                predictionCols.push(prediction);
            }
        });
        // new BetapiClient().getEvents()
        return predictionCols.map(p => `${p.time},${p.player1},${p.percentage},${p.odds}`).join('\r\n');
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

})();

module.exports = __webpack_exports__;
/******/ })()
;