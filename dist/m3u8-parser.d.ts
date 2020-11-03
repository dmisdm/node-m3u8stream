/// <reference types="node" />
import { Writable } from "stream-browserify";
import { Parser } from "./parser";
/**
 * A very simple m3u8 playlist file parser that detects tags and segments.
 */
export default class m3u8Parser extends Writable implements Parser {
    private _lastLine;
    private _seq;
    private _nextItemDuration;
    private _nextItemRange;
    private _lastItemRangeEnd;
    constructor();
    _parseAttrList(value: string): {
        [key: string]: string;
    };
    _parseRange(value: string): {
        start: number;
        end: number;
    };
    _parseLine(line: string): void;
    _write(chunk: Buffer, encoding: string, callback: () => void): void;
}