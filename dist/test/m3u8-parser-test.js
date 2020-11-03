"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const m3u8_parser_1 = __importDefault(require("../dist/m3u8-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const assert_1 = __importDefault(require("assert"));
describe('m3u8 parser', () => {
    describe('Parse segments from a simple playlist', () => {
        it('Emits all segments', (done) => {
            let filepath = path_1.default.resolve(__dirname, 'playlists/simple.m3u8');
            let items = [];
            let endlist = false;
            const parser = new m3u8_parser_1.default();
            parser.on('item', (item) => { items.push(item); });
            parser.on('endlist', () => { endlist = true; });
            parser.on('error', done);
            let rs = fs_1.default.createReadStream(filepath, { highWaterMark: 16 });
            rs.pipe(parser);
            rs.on('end', () => {
                assert_1.default.ok(endlist);
                assert_1.default.deepEqual(items, [
                    { url: 'http://media.example.com/first.ts',
                        seq: 0, duration: 9009, range: null },
                    { url: 'http://media.example.com/second.ts',
                        seq: 1, duration: 9009, range: null },
                    { url: 'http://media.example.com/third.ts',
                        seq: 2, duration: 3003, range: null },
                ]);
                done();
            });
        });
    });
    describe('Parse segments from a live playlist', () => {
        it('Emits all segments', (done) => {
            let filepath = path_1.default.resolve(__dirname, 'playlists/live-1.1.m3u8');
            let items = [];
            let endlist = false;
            const parser = new m3u8_parser_1.default();
            parser.on('item', (item) => { items.push(item); });
            parser.on('endlist', () => { endlist = true; });
            parser.on('error', done);
            let rs = fs_1.default.createReadStream(filepath);
            rs.pipe(parser);
            rs.on('end', () => {
                assert_1.default.ok(!endlist);
                assert_1.default.deepEqual(items, [
                    { url: 'https://priv.example.com/fileSequence2681.ts',
                        seq: 2681, duration: 7975, range: null },
                    { url: 'https://priv.example.com/fileSequence2682.ts',
                        seq: 2682, duration: 7941, range: null },
                    { url: 'https://priv.example.com/fileSequence2683.ts',
                        seq: 2683, duration: 7975, range: null },
                ]);
                done();
            });
        });
    });
    describe('Plalist contains `EXT-X-MAP`', () => {
        it('Emits initialization segment', (done) => {
            let filepath = path_1.default.resolve(__dirname, 'playlists/x-map-1.m3u8');
            let items = [];
            let endlist = false;
            const parser = new m3u8_parser_1.default();
            parser.on('item', (item) => { items.push(item); });
            parser.on('endlist', () => { endlist = true; });
            parser.on('error', done);
            let rs = fs_1.default.createReadStream(filepath);
            rs.pipe(parser);
            rs.on('end', () => {
                assert_1.default.ok(endlist);
                assert_1.default.deepEqual(items, [
                    { url: 'init.mp4', init: true,
                        seq: 1, duration: 0, range: null },
                    { url: 'main1.mp4',
                        seq: 1, duration: 4969, range: null },
                    { url: 'main2.mp4',
                        seq: 2, duration: 4969, range: null },
                    { url: 'main3.mp4',
                        seq: 3, duration: 4969, range: null },
                    { url: 'main4.mp4',
                        seq: 4, duration: 4969, range: null },
                ]);
                done();
            });
        });
        describe('Without `URI`', () => {
            it('Emits error', (done) => {
                let filepath = path_1.default.resolve(__dirname, 'playlists/x-map-2.m3u8');
                let items = [];
                let endlist = false;
                const parser = new m3u8_parser_1.default();
                parser.on('item', (item) => { items.push(item); });
                parser.on('endlist', () => { endlist = true; });
                parser.on('error', (err) => {
                    assert_1.default.ok(!endlist);
                    assert_1.default.equal(items.length, 0);
                    assert_1.default.ok(err);
                    done();
                });
                let rs = fs_1.default.createReadStream(filepath);
                rs.pipe(parser);
                rs.on('end', () => {
                    done(new Error('should not emit end'));
                });
            });
        });
        describe('Twice in one playlist', () => {
            it('Emits initialization segment', (done) => {
                let filepath = path_1.default.resolve(__dirname, 'playlists/x-map-3.m3u8');
                let items = [];
                let endlist = false;
                const parser = new m3u8_parser_1.default();
                parser.on('item', (item) => { items.push(item); });
                parser.on('endlist', () => { endlist = true; });
                parser.on('error', done);
                let rs = fs_1.default.createReadStream(filepath);
                rs.pipe(parser);
                rs.on('end', () => {
                    assert_1.default.ok(endlist);
                    assert_1.default.deepEqual(items, [
                        { url: 'main.mp4', init: true,
                            seq: 1, duration: 0, range: { start: 0, end: 49 } },
                        { url: 'main.mp4',
                            seq: 1, duration: 4969, range: { start: 50, end: 124 } },
                        { url: 'main.mp4',
                            seq: 2, duration: 4969, range: { start: 125, end: 194 } },
                        { url: 'main.mp4', init: true,
                            seq: 3, duration: 0, range: { start: 195, end: 244 } },
                        { url: 'main.mp4',
                            seq: 3, duration: 4969, range: { start: 245, end: 314 } },
                        { url: 'main.mp4',
                            seq: 4, duration: 4969, range: { start: 315, end: 394 } },
                    ]);
                    done();
                });
            });
        });
    });
    describe('Playlist contains `EXT-X-BYTERANGE`', () => {
        it('Emits items with range', (done) => {
            let filepath = path_1.default.resolve(__dirname, 'playlists/x-byterange-1.m3u8');
            let items = [];
            let endlist = false;
            const parser = new m3u8_parser_1.default();
            parser.on('item', (item) => { items.push(item); });
            parser.on('endlist', () => { endlist = true; });
            parser.on('error', done);
            let rs = fs_1.default.createReadStream(filepath);
            rs.pipe(parser);
            rs.on('end', () => {
                assert_1.default.ok(endlist);
                assert_1.default.deepEqual(items, [
                    { url: 'main.mp4', init: true,
                        seq: 1, duration: 0, range: { start: 0, end: 49 } },
                    { url: 'main.mp4',
                        seq: 1, duration: 4969, range: { start: 50, end: 124 } },
                    { url: 'main.mp4',
                        seq: 2, duration: 4969, range: { start: 125, end: 194 } },
                    { url: 'main.mp4',
                        seq: 3, duration: 4969, range: { start: 195, end: 264 } },
                    { url: 'main.mp4',
                        seq: 4, duration: 4969, range: { start: 265, end: 344 } },
                ]);
                done();
            });
        });
    });
});
//# sourceMappingURL=m3u8-parser-test.js.map