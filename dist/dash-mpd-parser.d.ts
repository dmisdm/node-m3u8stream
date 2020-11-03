import { Writable } from "stream-browserify";
import { Parser } from "./parser";
/**
 * A wrapper around sax that emits segments.
 */
export default class DashMPDParser extends Writable implements Parser {
  private _parser;
  constructor(targetID?: string);
  _write(chunk: Buffer, encoding: string, callback: () => void): void;
}
