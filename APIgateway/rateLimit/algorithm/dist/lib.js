"use strict";
// /source/lib.ts
// The option parser and rate limiting middleware
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var memory_store_js_1 = require("./memory-store.js");
/**
 * Type guard to check if a store is legacy store.
 *
 * @param store {LegacyStore | Store} - The store to check.
 *
 * @return {boolean} - Whether the store is a legacy store.
 */
var isLegacyStore = function (store) {
    // Check that `incr` exists but `increment` does not - store authors might want
    // to keep both around for backwards compatibility.
    return typeof store.incr === 'function' &&
        typeof store.increment !== 'function';
};
/**
 * Converts a legacy store to the promisified version.
 *
 * @param store {LegacyStore | Store} - The store passed to the middleware.
 *
 * @returns {Store} - The promisified version of the store.
 */
var promisifyStore = function (passedStore) {
    if (!isLegacyStore(passedStore)) {
        // It's not an old store, return as is
        return passedStore;
    }
    var legacyStore = passedStore;
    // A promisified version of the store
    var PromisifiedStore = /** @class */ (function () {
        function PromisifiedStore() {
        }
        PromisifiedStore.prototype.increment = function (key) {
            return __awaiter(this, void 0, Promise, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            legacyStore.incr(key, function (error, totalHits, resetTime) {
                                if (error)
                                    reject(error);
                                resolve({ totalHits: totalHits, resetTime: resetTime });
                            });
                        })];
                });
            });
        };
        PromisifiedStore.prototype.decrement = function (key) {
            return __awaiter(this, void 0, Promise, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, legacyStore.decrement(key)];
                });
            });
        };
        PromisifiedStore.prototype.resetKey = function (key) {
            return __awaiter(this, void 0, Promise, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, legacyStore.resetKey(key)];
                });
            });
        };
        PromisifiedStore.prototype.resetAll = function () {
            return __awaiter(this, void 0, Promise, function () {
                return __generator(this, function (_a) {
                    if (typeof legacyStore.resetAll === 'function')
                        return [2 /*return*/, legacyStore.resetAll()];
                    return [2 /*return*/];
                });
            });
        };
        return PromisifiedStore;
    }());
    return new PromisifiedStore();
};
/**
 * Type-checks and adds the defaults for options the user has not specified.
 *
 * @param options {Options} - The options the user specifies.
 *
 * @returns {Configuration} - A complete configuration object.
 */
var parseOptions = function (passedOptions) {
    var _a, _b, _c;
    // Passing undefined should be equivalent to not passing an option at all, so we'll
    // omit all fields where their value is undefined.
    var notUndefinedOptions = omitUndefinedOptions(passedOptions);
    // See ./types.ts#Options for a detailed description of the options and their
    // defaults.
    var config = __assign(__assign({ windowMs: 60 * 1000, max: 5, message: 'Too many requests, please try again later.', statusCode: 429, legacyHeaders: (_a = passedOptions.headers) !== null && _a !== void 0 ? _a : true, standardHeaders: (_b = passedOptions.draft_polli_ratelimit_headers) !== null && _b !== void 0 ? _b : false, requestPropertyName: 'rateLimit', skipFailedRequests: false, skipSuccessfulRequests: false, requestWasSuccessful: function (_request, response) {
            return response.statusCode < 400;
        }, skip: function (_request, _response) { return false; }, keyGenerator: function (request, _response) {
            if (!request.ip) {
                console.error('WARN | `express-rate-limit` | `request.ip` is undefined. You can avoid this by providing a custom `keyGenerator` function, but it may be indicative of a larger issue.');
            }
            return request.ip;
        },
        handler: function (_request, response, _next, _optionsUsed) {
            response.status(config.statusCode).send(config.message);
        },
        onLimitReached: function (_request, _response, _optionsUsed) { } }, notUndefinedOptions), { 
        // Note that this field is declared after the user's options are spread in,
        // so that this field doesn't get overriden with an un-promisified store!
        store: promisifyStore((_c = notUndefinedOptions.store) !== null && _c !== void 0 ? _c : new memory_store_js_1["default"]()) });
    // Ensure that the store passed implements the `Store` interface
    if (typeof config.store.increment !== 'function' ||
        typeof config.store.decrement !== 'function' ||
        typeof config.store.resetKey !== 'function' ||
        (typeof config.store.resetAll !== 'undefined' &&
            typeof config.store.resetAll !== 'function') ||
        (typeof config.store.init !== 'undefined' &&
            typeof config.store.init !== 'function')) {
        throw new TypeError('An invalid store was passed. Please ensure that the store is a class that implements the `Store` interface.');
    }
    return config;
};
/**
 * Just pass on any errors for the developer to handle, usually as a HTTP 500
 * Internal Server Error.
 *
 * @param fn {RequestHandler} - The request handler for which to handle errors.
 *
 * @returns {RequestHandler} - The request handler wrapped with a `.catch` clause.
 *
 * @private
 */
var handleAsyncErrors = function (fn) {
    return function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.resolve(fn(request, response, next))["catch"](next)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    next(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
};
/**
 *
 * Create an instance of IP rate-limiting middleware for Express.
 *
 * @param passedOptions {Options} - Options to configure the rate limiter.
 *
 * @returns {RateLimitRequestHandler} - The middleware that rate-limits clients based on your configuration.
 *
 * @public
 */
var rateLimit = function (passedOptions) {
    // Parse the options and add the default values for unspecified options
    var options = parseOptions(passedOptions !== null && passedOptions !== void 0 ? passedOptions : {});
    // Call the `init` method on the store, if it exists
    if (typeof options.store.init === 'function')
        options.store.init(options);
    // Then return the actual middleware
    var middleware = handleAsyncErrors(function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
        var skip, augmentedRequest, key, _a, totalHits, resetTime, retrieveQuota, maxHits, deltaSeconds, decremented_1, decrementKey_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, options.skip(request, response)];
                case 1:
                    skip = _b.sent();
                    if (skip) {
                        next();
                        return [2 /*return*/];
                    }
                    augmentedRequest = request;
                    return [4 /*yield*/, options.keyGenerator(request, response)
                        // Increment the client's hit counter by one
                    ];
                case 2:
                    key = _b.sent();
                    return [4 /*yield*/, options.store.increment(key)
                        // Get the quota (max number of hits) for each client
                    ];
                case 3:
                    _a = _b.sent(), totalHits = _a.totalHits, resetTime = _a.resetTime;
                    retrieveQuota = typeof options.max === 'function'
                        ? options.max(request, response)
                        : options.max;
                    return [4 /*yield*/, retrieveQuota
                        // Set the rate limit information on the augmented request object
                    ];
                case 4:
                    maxHits = _b.sent();
                    // Set the rate limit information on the augmented request object
                    augmentedRequest[options.requestPropertyName] = {
                        limit: maxHits,
                        current: totalHits,
                        remaining: Math.max(maxHits - totalHits, 0),
                        resetTime: resetTime
                    };
                    // Set the X-RateLimit headers on the response object if enabled
                    if (options.legacyHeaders && !response.headersSent) {
                        response.setHeader('X-RateLimit-Limit', maxHits);
                        response.setHeader('X-RateLimit-Remaining', augmentedRequest[options.requestPropertyName].remaining);
                        // If we have a resetTime, also provide the current date to help avoid issues with incorrect clocks
                        if (resetTime instanceof Date) {
                            response.setHeader('Date', new Date().toUTCString());
                            response.setHeader('X-RateLimit-Reset', Math.ceil(resetTime.getTime() / 1000));
                        }
                    }
                    // Set the standardized RateLimit headers on the response object
                    // if enabled
                    if (options.standardHeaders && !response.headersSent) {
                        response.setHeader('RateLimit-Limit', maxHits);
                        response.setHeader('RateLimit-Remaining', augmentedRequest[options.requestPropertyName].remaining);
                        if (resetTime) {
                            deltaSeconds = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
                            response.setHeader('RateLimit-Reset', Math.max(0, deltaSeconds));
                        }
                    }
                    // If we are to skip failed/successfull requests, decrement the
                    // counter accordingly once we know the status code of the request
                    if (options.skipFailedRequests || options.skipSuccessfulRequests) {
                        decremented_1 = false;
                        decrementKey_1 = function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!decremented_1) return [3 /*break*/, 2];
                                        return [4 /*yield*/, options.store.decrement(key)];
                                    case 1:
                                        _a.sent();
                                        decremented_1 = true;
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); };
                        if (options.skipFailedRequests) {
                            response.on('finish', function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!options.requestWasSuccessful(request, response)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, decrementKey_1()];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); });
                            response.on('close', function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!response.writableEnded) return [3 /*break*/, 2];
                                            return [4 /*yield*/, decrementKey_1()];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); });
                            response.on('error', function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, decrementKey_1()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        if (options.skipSuccessfulRequests) {
                            response.on('finish', function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!options.requestWasSuccessful(request, response)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, decrementKey_1()];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                    }
                    // Call the `onLimitReached` callback on the first request where client
                    // exceeds their rate limit
                    // NOTE: `onLimitReached` is deprecated, this should be removed in v7.x
                    if (maxHits && totalHits === maxHits + 1) {
                        options.onLimitReached(request, response, options);
                    }
                    // If the client has exceeded their rate limit, set the Retry-After header
                    // and call the `handler` function
                    if (maxHits && totalHits > maxHits) {
                        if ((options.legacyHeaders || options.standardHeaders) &&
                            !response.headersSent) {
                            response.setHeader('Retry-After', Math.ceil(options.windowMs / 1000));
                        }
                        options.handler(request, response, next, options);
                        return [2 /*return*/];
                    }
                    next();
                    return [2 /*return*/];
            }
        });
    }); });
    middleware.resetKey =
        options.store.resetKey.bind(options.store);
    return middleware;
};
/**
 *
 * Remove any options where their value is set to undefined. This avoids overwriting defaults
 * in the case a user passes undefined instead of simply omitting the key.
 *
 * @param passedOptions {Options} - The options to omit.
 *
 * @returns {Options} - The same options, but with all undefined fields omitted.
 *
 * @private
 */
var omitUndefinedOptions = function (passedOptions) {
    var omittedOptions = {};
    for (var _i = 0, _a = Object.keys(passedOptions); _i < _a.length; _i++) {
        var k = _a[_i];
        var key = k;
        if (passedOptions[key] !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            omittedOptions[key] = passedOptions[key];
        }
    }
    return omittedOptions;
};
// Export it to the world!
exports["default"] = rateLimit;
