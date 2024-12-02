/*
  I wanted way to make my Wordle scores fun by being able
  to replace the emojis. I got sick of editing them by hand.
  So I just decided to make a simple vanilla JavaScript
  application to make it easier for me and my kids.

  No build systems no dependencies just some raw HTML/CSS/JS
*/

const emojis = [
  "😊",
  "👍",
  "❤️",
  "😂",
  "🎉",
  "🌟",
  "😎",
  "🐶",
  "🍕",
  "🚀",
  "🌈",
  "🏆",
  "🎵",
  "✨",
  "☕",
  "🏅",
  "📚",
  "🔥",
  "😍",
  "💡",
];
const EMOJI_REGEX = /[⬜⬛🟨🟩]/g;
const ABSENT_REGEX = /[⬜⬛]/g;
const PRESENT_REGEX = /[🟨]/g;
const CORRECT_REGEX = /[🟩]/g;
const board = document.querySelector(".board-display");
const tilesRows = document.querySelectorAll(".tilesRow");
const buttonPaste = document.querySelector(".board-actionButton_paste");
const buttonCopy = document.querySelector(".board-actionButton_copy");
const absentInput = document.querySelector('input[name="absent"]');
const presentInput = document.querySelector('input[name="present"]');
const correctInput = document.querySelector('input[name="correct"]');
const replacementEmoji = {
  absent: "",
  present: "",
  correct: "",
};

let clipboardData = "";

buttonPaste.addEventListener("click", handleOnPaste);
buttonCopy.addEventListener("click", handleOnClickCopy);

function setBoard(data) {
  clearBoard();

  const pointLines = data
    .trim()
    .split("\n")
    .filter((line) => EMOJI_REGEX.test(line));
  const rows = [];

  tilesRows.forEach((row, rowIndex) => {
    const tiles = row.querySelectorAll(".tile");

    tiles.forEach((tile, tileIndex) => {
      if (!pointLines[rowIndex]) return;

      const classSufix = getClassSufix([...pointLines[rowIndex]][tileIndex]);

      tile.classList.add(`tile_${classSufix}`);
    });
  });
}

function clearBoard() {
  tilesRows.forEach((row, rowIndex) => {
    const tiles = row.querySelectorAll(".tile");

    tiles.forEach((tile, tileIndex) => {
      tile.classList.remove("tile_show");
      Object.keys(replacementEmoji).forEach((sufix) => {
        tile.classList.remove(`tile_${sufix}`);
      });
    });
  });
}

function getClassSufix(emoji) {
  switch (emoji) {
    case "⬜":
    case "⬛":
      return "absent";
    case "🟨":
      return "present";
    case "🟩":
      return "correct";
    default:
      return "";
  }
}

async function handleOnPaste() {
  try {
    const text = await navigator.clipboard.readText();

    clipboardData = text;
    setBoard(text);
    setTiles();
    playCopiedAnimation();
  } catch (error) {
    console.error(error);
  }
}

async function handleOnClickCopy() {
  try {
    let scoreOutput = `${clipboardData}`;

    scoreOutput = scoreOutput.replaceAll("⬜", replacementEmoji.absent || "⬜");
    scoreOutput = scoreOutput.replaceAll("⬛", replacementEmoji.absent || "⬛");
    scoreOutput = scoreOutput.replaceAll(
      "🟨",
      replacementEmoji.present || "🟨"
    );
    scoreOutput = scoreOutput.replaceAll(
      "🟩",
      replacementEmoji.correct || "🟩"
    );

    await navigator.clipboard.writeText(scoreOutput);
    playCopiedAnimation();
  } catch (error) {
    console.error(error);
  }
}

function playCopiedAnimation() {
  board.classList.remove("board-display_copied");

  setTimeout(() => {
    board.classList.add("board-display_copied");
  }, 50);
}

function handleOnChangeInput(event, sufix) {
  const { value } = event.target;

  replacementEmoji[sufix] = value;

  setTiles();
}

function setTiles() {
  Object.keys(replacementEmoji).forEach((sufix) => {
    const value = replacementEmoji[sufix];

    if (!value) return;

    tilesRows.forEach((row) => {
      const tiles = row.querySelectorAll(`.tile_${sufix}`);

      tiles.forEach((tile) => {
        const span = tile.querySelector("span");

        if (value) {
          span.style.backgroundImage = svgBkg(value);
        }

        if (value) {
          tile.classList.add("tile_show");
        } else {
          tile.classList.remove("tile_show");
        }
      });
    });
  });
}

absentInput.addEventListener("input", (event) => {
  handleOnChangeInput(event, "absent");
});

presentInput.addEventListener("input", (event) => {
  handleOnChangeInput(event, "present");
});

correctInput.addEventListener("input", (event) => {
  handleOnChangeInput(event, "correct");
});

// Function to set the favicon
function setFavicon(emoji) {
  // Create a canvas element
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;

  const ctx = canvas.getContext("2d");
  ctx.font = "28px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);

  // Convert the canvas to a data URL
  const faviconURL = canvas.toDataURL("image/png");

  // Set the favicon link element
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  link.href = faviconURL;
}

// Function to select a random emoji from the array
function getRandomEmoji() {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}

function svgBkg(value) {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${value}</text></svg>')`;
}

const toggleButton = document.querySelector(".toggleTheme");

toggleButton.addEventListener("click", function () {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const prefers =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  if (!currentTheme) {
    const newTheme = prefers === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  } else {
    if (currentTheme === prefers) {
      const newTheme = currentTheme === "light" ? "dark" : "light";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    }

    if (currentTheme !== prefers) {
      document.documentElement.removeAttribute("data-theme", undefined);
      localStorage.removeItem("theme", prefers);
    }
  }
});

setTimeout(() => {
  setFavicon(getRandomEmoji());
}, 1000);

// Update the favicon every 30 seconds
setInterval(() => {
  setFavicon(getRandomEmoji());
}, 10000);
