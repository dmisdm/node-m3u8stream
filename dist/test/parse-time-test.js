"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const parse_time_1 = require("../dist/parse-time");
describe('parse-time', () => {
    it('Time format 00:00:00.000', () => {
        assert_1.default.equal(parse_time_1.humanStr('25.000'), 25000);
        assert_1.default.equal(parse_time_1.humanStr('05:30'), 60000 * 5 + 30000);
        assert_1.default.equal(parse_time_1.humanStr('01:05:30'), 60000 * 60 + 60000 * 5 + 30000);
        assert_1.default.equal(parse_time_1.humanStr('1:30.123'), 60000 + 30000 + 123);
    });
    it('Time format 0ms, 0s, 0m, 0h', () => {
        assert_1.default.equal(parse_time_1.humanStr('2ms'), 2);
        assert_1.default.equal(parse_time_1.humanStr('1m'), 60000);
        assert_1.default.equal(parse_time_1.humanStr('1m10s'), 60000 + 10000);
        assert_1.default.equal(parse_time_1.humanStr('2hm10s500ms'), 3600000 * 2 + 10000 + 500);
    });
    it('No format', () => {
        assert_1.default.equal(parse_time_1.humanStr('1000'), 1000);
        assert_1.default.equal(parse_time_1.humanStr(200), 200);
    });
});
//# sourceMappingURL=parse-time-test.js.map