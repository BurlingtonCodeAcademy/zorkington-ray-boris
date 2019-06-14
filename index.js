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

// remember the StateMachine lecture
// https://bootcamp.burlingtoncodeacademy.com/lessons/cs/state-machines
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

start();

async function start() {
  enterState("roomOne");
  let humanResponse = await ask(`182 Main St. You are standing on Main Street between 
Church and South Winooski. There is a door here. A keypad sits on the handle.
On the door is a handwritten sign.\n`);
  while (currentState === "roomOne") {
    if (humanResponse.toLowerCase() === "read sign") {
      humanResponse = await ask(`The sign says "Welcome to Burlington Code Academy! Come on up to
      the third floor. If the door is locked, use the code 12345"\n`);
    }
    if (humanResponse.toLowerCase() === "take sign") {
      humanResponse = await ask("That would be selfish. How will other students find their way?\n"
      );
    }
    if (humanResponse.toLowerCase() === "open door") {
      humanResponse = await ask("The door is locked. There is a keypad on the door handle.\n"
      );
    }
    if (humanResponse.toLowerCase() === "enter code 12345" && "key in 12345") {
      enterState("roomTwo");
      humanResponse = await ask(`Success! The door opens. You enter the foyer and the door shuts behind you.\n`
      );
      /*} else if(humanResponse.toLowerCase() === 'enter code 54321') {  
        humanResponse = await ask('Bzzzzt! The door is still locked.'); */
       } else {
      humanResponse = await ask("Bzzzzt! The door is still locked.\n");
    }
  }
  }


/*while (currentState === 'roomTwo') {
  if(humanResponse === 'foyer') {
    console.log('we made it');

  }
}

  

  /* let gargle = "Sorry, I don't know how to gargle."
  let readSign = 'The sign says "Welcome to Burlington Code Academy! Come on up to the third floor. If the door is locked, use the code 12345"';
  let takeSign = 'That would be selfish. How will other students find their way?';
  let openDoor = 'The door is locked. There is a keypad on the door handle.';
  let enterCorrectCode = 'Success! The door opens. You enter the foyer and the door shuts behind you.';
  let enterWrongCode = 'Bzzzzt! The door is still locked.';

while (humanResponse.toLowerCase() !== 'open door', 'gargle' ) {
  humanResponse = await ask(openDoor);
}
console.log('hey');
process.exit(); */
