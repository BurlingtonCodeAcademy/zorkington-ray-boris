const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
let states = {
  undefined: { canChangeTo: ["roomOne"] },
  roomOne: { canChangeTo: ["roomTwo"] },
  roomTwo: { canChangeTo: ["roomThree"] },
  roomThree: { canChangeTo: ["roomOne"] }
};
let currentState = "undefined";

function enterState(newState) {
  let validTransitions = states[currentState].canChangeTo;
  if (validTransitions.includes(newState)) {
    currentState = newState;
  } else {
    throw "Invalid state transition attempted - from " +
      currentState +
      " to " +
      newState;
  }
}
let pickUpItem = function(humanInv, roomInv) {
  let roomItem = roomInv.pop();
  humanInv.push(roomItem);
};
let dropItem = function(humanInv, roomInv) {
  let humanItem = humanInv.pop();
  roomInv.push(humanItem);
};
start();
async function start() {
  enterState("roomOne");
  let roomInventory = ["Seven Days"];
  let humanInventory = [];
  let humanResponse = await ask(`182 Main St. You are standing on Main Street between 
    Church and South Winooski. There is a door here. A keypad sits on the handle.
    On the door is a handwritten sign.\n`);

  while (currentState === "roomOne") {
    if (humanResponse.toLowerCase() === "read sign") {
      humanResponse = await ask(`The sign says "Welcome to Burlington Code Academy! Come on up to
      the third floor. If the door is locked, use the code 12345"\n`);
    } else if (humanResponse.toLowerCase() === "take sign") {
      humanResponse = await ask("That would be selfish. How will other students find their way?\n");
    } else if (humanResponse.toLowerCase() === "open door") {
      humanResponse = await ask("The door is locked. There is a keypad on the door handle.\n");
    } else if (humanResponse.toLowerCase() === "key in 12345" || humanResponse.toLowerCase() === "enter code 12345") {
      console.log(`\nSuccess! The door opens. You enter the foyer and the door shuts behind you.\n\n`);
      enterState("roomTwo");
      humanResponse = await ask(`You are in a foyer. Or maybe it's an antechamber. Or a vestibule. Or an entryway. 
      Or an atrium. Or a narthex. But let's forget all that fancy flatlander vocabulary, and just call it a foyer. 
      In Vermont, this is pronounced
      "FO-ee-yurr".
      A copy of Seven Days lies in a corner.\n`);
    } else if (humanResponse.toLowerCase().includes("enter code") || humanResponse.toLowerCase().includes("key in")) {
      humanResponse = await ask("Bzzzzt! The door is still locked.\n");
    } else if (humanResponse.toLowerCase() === "gargle") {
      humanResponse = await ask("Sorry, I don't know how to gargle.\n");
    } else {
      humanResponse = await ask("Evaluate your surroundings! Refer to previous directions.\n");
    }
  }

  while (currentState === "roomTwo") {
    if (humanResponse.toLowerCase() === "take paper" ||
        humanResponse.toLowerCase() === "take seven days" ||
        humanResponse.toLowerCase() === "pick up paper" ||
        humanResponse.toLowerCase() === "pick up seven days") {
    pickUpItem(humanInventory, roomInventory);
    humanResponse = await ask(`You pick up the paper and leaf through it looking for comics 
    and ignoring the articles, just like everybody else does.\n`);
    } else if (humanResponse.toLowerCase() === "i" ||
               humanResponse.toLowerCase() === "inventory" ||
               humanResponse.toLowerCase() === "take inventory") {
        if(!humanInventory.includes('Seven Days')) {
          humanResponse = await ask('Your inventory is empty =(')
        }
      humanResponse = await ask(`You are carrying: A copy of ${humanInventory}, Vermont's Alt-Weekly\n`);
    } else if (humanResponse.toLowerCase() === "drop paper" && humanInventory.includes('Seven Days') ||
               humanResponse.toLowerCase() === "drop seven days" && humanInventory.includes('Seven Days')) {
      dropItem(humanInventory, roomInventory);
      humanResponse = await ask(`you have dropped ${roomInventory} and now you are a litterer\n`);
    } else {
      humanResponse = await ask("Evaluate your surroundings! Refer to previous directions.\n");
    }
  }
}

//console.log('hey');
//process.exit();
