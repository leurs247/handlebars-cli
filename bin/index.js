#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

yargs(hideBin(process.argv))
	.command(
		"parse <input>",
		"Parse a file in handlebars",
		(yargs) => {
			yargs.positional("input", {
				type: "string",
				demandOption: true,
			});
			yargs.option("o", {
				alias: "output",
				type: "string",
				describe: "The name of the output file",
				demandOption: false,
			});
		},
		(argv) => {
			const customArgv = {
				...argv,
			};
			delete customArgv["_"];
			delete customArgv["$0"];
			delete customArgv.input;
			delete customArgv.output;

			const inputExt = path.extname(argv.input);
			const inputBasename = path.basename(argv.input, inputExt);
			let outputBasename = "";
			let outputExt = "";
			if (argv.output) {
				outputExt = path.extname(argv.output);
				outputBasename = path.basename(argv.output, outputExt);
			}

			let outputName = "";

			if (outputBasename === "") {
				outputName = `${inputBasename}-parsed`;
			} else {
				outputName = outputBasename;
			}

			if (outputExt === "") {
				outputName += inputExt;
			} else {
				outputName += outputExt;
			}

			const html = fs.readFileSync(argv.input, "utf-8");

			const template = Handlebars.compile(html);

			fs.writeFileSync(outputName, template(customArgv));
		}
	)
	.help(true)
	.parse();
