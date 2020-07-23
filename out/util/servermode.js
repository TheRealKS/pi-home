"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMode = void 0;
var ServerMode;
(function (ServerMode) {
    ServerMode[ServerMode["PRODUCTION"] = 0] = "PRODUCTION";
    ServerMode[ServerMode["ERRORONLY"] = 1] = "ERRORONLY";
    ServerMode[ServerMode["VERBOSE"] = 2] = "VERBOSE";
    ServerMode[ServerMode["REALLYVERBOSE"] = 3] = "REALLYVERBOSE";
})(ServerMode = exports.ServerMode || (exports.ServerMode = {}));
