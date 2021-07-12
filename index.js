const db = require("./db.js");
const inquirer = require("inquirer");

module.exports.add = async (title) => {
  let list = await db.read();
  title.map((task) => {
    list.push({ name: task, done: false });
  });
  await db.write(list);
};
module.exports.clear = async () => {
  await db.write([]);
};

module.exports.showAll = async () => {
  let list = await db.read();
  let demoList = list.map((task, index) => {
    return {
      name: `${task.done ? "[√]" : "[_]"} ${index + 1} - ${task.name}`,
      value: index,
    };
  });
  let extraOperations = [
    {
      name: `exit`,
      value: -1,
    },
    {
      name: `+ create new task`,
      value: -2,
    },
  ];
  demoList.push(...extraOperations);
  inquirer
    .prompt([
      {
        type: "list",
        name: "taskIndex",
        message: "The current tasks' table:",
        choices: demoList,
      },
    ])
    .then(async (answer) => {
      let index = answer.taskIndex;
      if (index === -1) {
        return;
      } else if (index === -2) {
        inquirer
          .prompt({
            type: "input",
            name: "newTaskName",
            message: "Please input a new task:",
          })
          .then(async (answer) => {
            list.push({ name: answer.newTaskName, done: false });
            await db.write(list);
            console.log(`a new task "${answer.newTaskName}" has been created!`);
          });
      } else {
        inquirer
          .prompt({
            type: "list",
            name: "operationIndex",
            message: "Please choose your operation:",
            choices: [
              {
                name: "mark as finished",
                value: 0,
              },
              {
                name: "mark as unfinished",
                value: 1,
              },
              {
                name: "rename this task",
                value: 2,
              },
              { name: "remove this task", value: 3 },
              { name: "exit", value: 4 },
            ],
          })
          .then(async (answer) => {
            switch (answer.operationIndex) {
              case 0:
                list[index].done = true;
                await db.write(list);
                console.log(
                  `mark "task ${index + 1} - ${list[index].name}" as finished!`
                );
                break;
              case 1:
                list[index].done = false;
                await db.write(list);
                console.log(
                  `mark "task ${index + 1} - ${
                    list[index].name
                  }" as unfinished!`
                );
                break;
              case 2:
                inquirer
                  .prompt({
                    type: "input",
                    name: "newName",
                    message: "Please input a new name:",
                  })
                  .then(async (answer) => {
                    list[index].name = answer.newName;
                    await db.write(list);
                    console.log(
                      `task ${index + 1}'s name has been changed to "${
                        answer.newName
                      }"!`
                    );
                  });
                break;
              case 3:
                list.splice(index, 1);
                await db.write(list);
                console.log(
                  `"task ${index + 1} - ${list[index].name}" has been removed!`
                );
                break;
              default:
                return;
            }
          });
      }
    });
};
