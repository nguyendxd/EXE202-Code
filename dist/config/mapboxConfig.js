"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directionsClient = exports.geocodingClient = void 0;
const mapbox_sdk_1 = __importDefault(require("@mapbox/mapbox-sdk"));
const geocoding_1 = __importDefault(require("@mapbox/mapbox-sdk/services/geocoding"));
const directions_1 = __importDefault(require("@mapbox/mapbox-sdk/services/directions"));
const baseClient = (0, mapbox_sdk_1.default)({
    accessToken: process.env.MAPBOX_ACCESS_TOKEN
});
const geocodingClient = (0, geocoding_1.default)(baseClient);
exports.geocodingClient = geocodingClient;
const directionsClient = (0, directions_1.default)(baseClient);
exports.directionsClient = directionsClient;
