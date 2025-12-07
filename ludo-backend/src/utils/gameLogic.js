export const COLORS = ["red", "green", "blue", "yellow"];

// Just some sample safe cells on the main path
const SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47];

export const createInitialGameState = (players) => {
  const tokens = {};
  players.forEach((p) => {
    tokens[p.color] = [-1, -1, -1, -1]; // 4 tokens at home
  });

  return {
    players,             // [{ userId, username, color }]
    tokens,              // { red: [...], blue: [...] }
    currentTurn: players[0].color,
    diceValue: null,
    status: "playing",
    winnerColor: null
  };
};

export const rollDice = () => {
  return Math.floor(Math.random() * 6) + 1;
};

export const canMoveToken = (state, color, tokenIndex, dice) => {
  const pos = state.tokens[color][tokenIndex];

  if (pos === 57) return false; // already finished

  if (pos === -1) {
    // at home, needs 6 to come out
    return dice === 6;
  }

  const target = pos + dice;
  return target <= 57;
};

export const moveToken = (state, color, tokenIndex, dice) => {
  if (!canMoveToken(state, color, tokenIndex, dice)) {
    return state;
  }

  const newState = {
    ...state,
    tokens: { ...state.tokens }
  };

  const tokensForColor = [...newState.tokens[color]];
  let pos = tokensForColor[tokenIndex];

  if (pos === -1 && dice === 6) {
    pos = 0;
  } else {
    pos += dice;
  }

  if (pos > 57) {
    // invalid overflow
    return state;
  }

  // Handle cutting (if not safe and on main track)
  if (pos >= 0 && pos <= 50 && !SAFE_CELLS.includes(pos)) {
    for (const otherColor of Object.keys(newState.tokens)) {
      if (otherColor === color) continue;
      const arr = [...newState.tokens[otherColor]];
      arr.forEach((p, idx) => {
        if (p === pos) {
          arr[idx] = -1; // send back home
        }
      });
      newState.tokens[otherColor] = arr;
    }
  }

  tokensForColor[tokenIndex] = pos;
  newState.tokens[color] = tokensForColor;

  // Check win (all 4 tokens finished)
  const allFinished = newState.tokens[color].every((p) => p === 57);
  if (allFinished) {
    newState.status = "finished";
    newState.winnerColor = color;
  }

  return newState;
};
