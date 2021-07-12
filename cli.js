#!/usr/bin/env node
const { program } = require("commander");
const api = require("./index.js");

if (process.argv.length === 2) {
  api.showAll();
  return;
}

// program
//   .option("-d, --debug", "output extra debugging")
//   .option("-s, --small", "small pizza size")
//   .option("-p, --pizza-type <type>", "flavour of pizza");

program
  .command("add")
  .description("add tasks")
  .action((...args) => {
    taskNames = args[1].args;
    if (taskNames.length === 0) {
      console.log("Please input task names!");
      return;
    }
    api.add(taskNames).then(
      () => console.log("Adding succeeded!"),
      () => console.log("Adding failed!")
    );
  });

program
  .command("clear")
  .description("clear all tasks")
  .action(() => {
    api.clear().then(
      () => console.log("Clearing succeeded!"),
      () => console.log("Clearing failed!")
    );
  });

program
  .command("showAll")
  .description("show all tasks")
  .action(() => {
    api.showAll();
  });

program.parse(process.argv);
