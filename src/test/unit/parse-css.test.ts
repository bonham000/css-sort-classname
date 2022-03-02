import * as assert from "assert";
import expect from "expect";
import toMatchSnapshot from "expect-mocha-snapshot";
import { readFileSync, writeFileSync } from "fs";
import { alphabetizeCssByClassName } from "../../util";

expect.extend({ toMatchSnapshot });

describe("correctly alphabetizes CSS by classname", function () {
  it("alphabetizeCssByClassName", function () {
    const TEST_CSS = readFileSync("./src/test/unit/input.css", "utf-8");
    const result = alphabetizeCssByClassName(TEST_CSS);

    // Write file output for manual viewing
    writeFileSync("./src/test/unit/output.css", String(result), "utf-8");

    // Note: it would be nice to use Jest snapshots instead of this
    // @ts-ignore
    expect(result).toMatchSnapshot(this);
  });
});
