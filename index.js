// Get process.stdin as the standard input object.
var standard_input = process.stdin;

// Set input character encoding.
standard_input.setEncoding('utf-8');

let fieldNumbers = [1, 2, 3, 4];

// Dungeon State ;)
const dungeon = {
    fields: {
        f0: {
            creatures: [],
            coordinates: { x: 0, y: 0, z: 0 },
            description: 'You stand before a large tower. You see an old wooden door before you',
            exits: {
                n: 'f1'
            }
        },
        f1: {
            creatures: [],
            coordinates: { x: 0, y: 1, z: -1 },
            description: 'You are in a dungeon! Behind you is an open door. Before you is a stairway.',
            exits: {
                n: 'f2',
                s: 'f0'
            }
        },
        f2: {
            creatures: [],
            coordinates: { x: 0, y: 2, z: -1 },
            description:
                'You are in a dungeon corridor, to the south is a stairway leading up. Large spiderwebs are hanging from the ceiling!',
            exits: {
                s: 'f1',
                n: 'f3',
                e: ''
            }
        },
        f3: {
            creatures: [],
            coordinates: { x: 0, y: 3, z: -1 },
            description: 'You are in a dungeon corridor.',
            exits: {
                s: 'f2',
                n: 'f4'
            }
        },
        f4: {
            creatures: [],
            coordinates: { x: 0, y: 4, z: -1 },
            description: 'You are in a narrow corridor. On the ground you see a skeleton!',
            exits: {
                s: 'f3',
                n: ''
            }
        }
    }
};

const player = {
    position: 'f0',
    health: 100,
    attack: 10,
    defense: 10
};

{
    console.log('\x1b[42m\x1b[30m' + ' *  *  *  *  *  * *  *  *  *  *  *  *  * ' + '\x1b[37m\x1b[40m');
    console.log('\x1b[42m\x1b[30m' + '                                         ' + '\x1b[37m\x1b[40m');
    console.log('\x1b[42m\x1b[30m' + '   Welcome, to the NeverEnding Dungeon   ' + '\x1b[37m\x1b[40m');
    console.log('\x1b[42m\x1b[30m' + '                                         ' + '\x1b[37m\x1b[40m');
    console.log('\x1b[42m\x1b[30m' + '         (game by Bartek Bugała)         ' + '\x1b[37m\x1b[40m');
    console.log('\x1b[42m\x1b[30m' + '                                         ' + '\x1b[37m\x1b[40m');
    console.log('\x1b[42m\x1b[30m' + ' *  *  *  *  *  * *  *  *  *  *  *  *  * ' + '\x1b[37m\x1b[40m');
    console.log('  ');
    colorNodeLog('For help write help or h', 'magenta');
    logPlayerPosition();
}
// Prompt user to input data in console.
// When user input data and click enter key.
standard_input.on('data', function (data) {
    if (data.startsWith('fight')) {
        let target = data.slice(6, -2);
        fight(target);
    }
    switch (data) {
        case 'c\r\n': {
            console.dir(getPlayerPosition().coordinates);
            break;
        }
        case 'd\r\n': {
            console.dir(dungeon);
            break;
        }
        case 'p\r\n': {
            console.log(player);
            break;
        }
        case 'exit\r\n': {
            // Program exit.
            console.log('You exit the game.');
            process.exit();
        }
        case 'N\r\n':
        case 'n\r\n': {
            playerMove('n');
            break;
        }
        case 'E\r\n':
        case 'e\r\n': {
            playerMove('e');
            break;
        }
        case 'S\r\n':
        case 's\r\n': {
            playerMove('s');
            break;
        }
        case 'W\r\n':
        case 'w\r\n': {
            playerMove('w');
            break;
        }
        case 'where\r\n': {
            logPlayerPosition();
            break;
        }
        case 'h\r\n':
        case 'help\r\n': {
            console.log('n, e, s, w, where, help, fight <name>');
            break;
        }
        default: {
            // Print user input in console.
            /*       colorNodeLog(`Player: ${data}`,'yellow'); */
            colorNodeLog('Where do you want to go?', 'yellow');
            logPlayerPosition();
        }
    }
});

function playerMove(direction) {
    let position = dungeon.fields[player.position];
    let exitDirection = position.exits[direction];
    if (exitDirection === '') {
        exitDirection = generateLocation(player.position, getOppositeDirection(direction));
        position.exits[direction] = exitDirection;
    }
    if (!exitDirection && exitDirection !== '') {
        colorNodeLog('You cannot go that way', 'magenta');
    } else {
        colorNodeLog(`You go ${getDirection(direction)}`, 'yellow');
        player.position = exitDirection;
        logPlayerPosition();
        randomCreature(10);
        randomEvent(25);
    }
}

function logPlayerPosition() {
    let position = dungeon.fields[player.position];
    colorNodeLog(position.description, 'green');
    if (position.creatures.length > 0) {
        colorNodeLog(position.creatures.map(el => el.name), 'magenta');
    }
    //console.log(position.description);
    colorNodeLog(
        `Possible exits: ${Object.keys(position.exits)
            .toString()
            .toUpperCase()}`,
        'yellow'
    );
}

function getPlayerPosition() {
    return dungeon.fields[player.position];
}

function generateLocation(positionBefore, cameFrom) {
    fieldNumbers.push(fieldNumbers.length + 1);
    let newField = 'f' + fieldNumbers.length;
    dungeon.fields[newField] = {};
    dungeon.fields[newField].exits = {};
    dungeon.fields[newField].creatures = [];
    dungeon.fields[newField].description = generateDescription();
    dungeon.fields[newField].exits = generateExits(dungeon.fields[newField]);
    dungeon.fields[newField].exits[cameFrom] = positionBefore;
    dungeon.fields[newField].coordinates = dungeon.fields[positionBefore].coordinates;
    switch (cameFrom) {
        case 's': {
            dungeon.fields[newField].coordinates.y + 1;
            break;
        }
        case 'w': {
            dungeon.fields[newField].coordinates.x + 1;
            break;
        }
        case 'n': {
            dungeon.fields[newField].coordinates.y - 1;
            break;
        }
        case 'e': {
            dungeon.fields[newField].coordinates.x - 1;
            break;
        }
    }
    dungeon.fields[newField].coordinates;

    return newField;
}

function generateExits(currentLocation) {
    let allExits = ['n', 's', 'e', 'w'];
    let currentExits = Object.keys(currentLocation.exits);
    let newExits = randFromArray(allExits, true);
    let combinedExits = [...newExits, ...currentExits];
    let exitsObject = {};
    combinedExits = [...new Set(combinedExits)].forEach(el => {
        exitsObject[el] = '';
    });
    return exitsObject;
}

function getOppositeDirection(direction) {
    switch (direction) {
        case 'n': {
            return 's';
        }
        case 's': {
            return 'n';
        }
        case 'e': {
            return 'w';
        }
        case 'w': {
            return 'e';
        }
        default:
            throw 'error';
    }
}

function getDirection(shortDirection) {
    switch (shortDirection) {
        case 'n': {
            return 'north';
        }
        case 'e': {
            return 'east';
        }
        case 's': {
            return 'south';
        }
        case 'w': {
            return 'west';
        }
        case 'd': {
            return 'down';
        }
        case 'u': {
            return 'up';
        }
    }
}

function generateDescription() {
    const beginnings = ['You are in a', 'You enter a', 'You look arround, and discover, you are in a', 'You step into'];
    const rooms = ['room', 'corridor', 'hall', 'tunnel'];
    const adjectives = ['dark', 'strange', 'smelly', 'moist', 'flooded'];
    return `${randFromArray(beginnings)} ${randFromArray(adjectives)} ${randFromArray(rooms)}.`;
}
/*If moreThanOne is true returns array*/
function randFromArray(array, moreThanOne = false) {
    if (moreThanOne === false) {
        return array[Math.floor(Math.random() * array.length)].toString();
    }
    return array.filter(() => Math.floor(Math.random() * 2));
}

function colorNodeLog(msg, color = 'white', bgColor) {
    switch (color) {
        case 'black':
            color = '\x1b[30m';
            break;
        case 'red':
            color = '\x1b[31m';
            break;
        case 'green':
            color = '\x1b[32m';
            break;
        case 'yellow':
            color = '\x1b[33m';
            break;
        case 'blue':
            color = '\x1b[34m';
            break;
        case 'magenta':
            color = '\x1b[35m';
            break;
        case 'cyan':
            color = '\x1b[36m';
            break;
        case 'white':
            color = '\x1b[37m';
            break;
        default:
            color = '\x1b[37m';
            break;
    }
    let colorCodes = color;
    if (typeof bgColor !== 'undefined') {
        switch (bgColor) {
            case 'black':
                bgColor = '\x1b[40m';
                break;
            case 'red':
                bgColor = '\x1b[41m';
                break;
            case 'green':
                bgColor = '\x1b[42m';
                break;
            case 'yellow':
                bgColor = '\x1b[43m';
                break;
            case 'blue':
                bgColor = '\x1b[44m';
                break;
            case 'magenta':
                bgColor = '\x1b[45m';
                break;
            case 'cyan':
                bgColor = '\x1b[46m';
                break;
            case 'white':
                bgColor = '\x1b[47m';
                break;
            default:
                bgColor = '\x1b[40m';
                break;
        }
        colorCodes = color + '%s' + bgColor;
    }

    console.log(colorCodes, msg + '\x1b[37m');
}

function randNum(outOf) {
    return Math.floor(Math.random() * (outOf + 1));
}

function randomCreature(chance = 0) {
    let random = Math.floor(Math.random() * 101);
    let creaturesInLocation = dungeon.fields[player.position].creatures.map(el => el).length;
    if (random <= chance - (creaturesInLocation * 10)) {
        const creatures = ['rat', 'roach', 'snake', 'bat', 'toad', 'lizard', 'insect'];
        const adjectives = ['Large', 'Nasty', 'Small', 'Weird', 'Grey', 'Dirty', 'Crippled'];
        let creature = randFromArray(adjectives) + ' ' + randFromArray(creatures);
        //let creatureId = uuid.v4();
        dungeon.fields[player.position].creatures.push({
            name: creature,
            health: randNum(10),
            attack: randNum(5),
            defense: randNum(3)
        });
        return colorNodeLog(`A ${creature} is sitting in the corner`, 'red');
    }
}

function randomEvent(chance = 0) {
    let random = Math.floor(Math.random() * 101);
    if (chance === random) {
        colorNodeLog('YOU FOUND THE TREASURE! YOU WON THE GAME','red');
        process.exit();
    }

}

function fight(target) {
    if (dungeon.fields[player.position].creatures !== {}) {
        let newCreatures = dungeon.fields[player.position].creatures.filter((el) => {
            if (el.name.includes(target)) {
                colorNodeLog(`${target} was killed`, 'red');
                return false
            } else {
                colorNodeLog(`There is no ${target}`, 'magenta');
                return true
            }
        })
        dungeon.fields[player.position].creatures = newCreatures;
    } else {
        colorNodeLog(`There is nothing to fight with`, 'magenta');
    }
    


}
