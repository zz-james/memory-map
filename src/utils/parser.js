class Token {
  constructor(line, column, category, lexeme) {
    this.line = line;
    this.column = column;
    this.category = category;
    this.lexeme = lexeme;
  }
}

// fix these declarations with consts
let token; // ?

let source = "";
let sourceIndex = 0;
let line = 0;
let column = 0;
let tokenList = [];
let prevChar = "\n";
let blankLine = true;

// constants
const LABEL = 0;
const OPERATOR = 1;
const ADDRESS = 2;
const OPERAND = 3;
const DIRECTIVE = 4;
const LEFTPAREN = 5;
const RIGHTPAREN = 6;
const COMMA = 7;
const NEWLINE = 8;
const ERROR = 9;
const EOF = 10;
const NAME = 11;

let keywords = {};
let smallTokens = { "": EOF };

/**
 * read the text from the textArea
 * and call tokeniser
 */
function main() {
  // read text
  try {
    // read the text
    source = document.getElementById("sourceCode").value;
  } catch (e) {
    console.log(e);
    throw new Error("there was a problem readin the text");
  }

  if (source.charAt(source.length - 1) != "\n") {
    source = source + "\n"; // add newline to end if missing
  }

  console.log("Category      Lexeme    Line    Col\n");

  try {
    tokeniser();
  } catch (e) {
    throw new Error(
      "\nError on " +
        token.lexeme +
        " line " +
        token.line +
        " column " +
        token.column
    );
  }
}

function tokeniser() {
  // global token
  let curchar = " "; // initialise curchar to space

  while (true) {
    while (curchar !== "\n" && curchar === " ") {
      // skip whitespace but not newlines
      curchar = getChar();
    }
    // construct and initialise new token
    token = new Token(line, column, null, "");

    if (/^\d+$/.test(curchar)) {
      // check if curchar is a digit
      // start of an unsigned int?
      token.category = UNSIGNED_INT;
      while (true) {
        token.lexeme += curchar;
        curchar = getChar();
        if (!/^\d+$/.test(curchar)) {
          // if char is not a digit then exit
          break;
        }
      }
    } else if (/^[A-Z]$/i.test(curchar)) {
      // check if curchar is alpha, start of a name?
      while (true) {
        token.lexeme += curchar;
        curchar = getChar();
        if (!(/^[a-z0-9]+$/i.test(curchar) || curchar === "_")) {
          // if char is not a digit or an alpha or an underscore then exit
          break;
        }
      }

      // determine if lexeme is a keyword or a name of variable
      if (token.lexeme in keywords) {
        token.category = keywords[token.lexeme];
      } else {
        token.category = NAME;
      }
    } else if (curchar === ".") {
      console.log("this is some kind of directive?");
      token.lexeme = DIRECTIVE;
      while (true) {
        token.lexeme += curchar;
        curchar = getChar();
        if (!(/^[a-z0-9]+$/i.test(curchar) || curchar === "_")) {
          // if char is not a digit or an alpha or an underscore then exit
          break;
        }
      }
    } else if (curchar in smallTokens) {
      token.category = smallTokens[curchar]; // get category
      token.lexeme = curchar;
      curchar = getChar();
    } else {
      token.category = ERROR; // invalid lexeme
      token.lexeme = curchar;
      throw new Error("Invalid token");
    }

    tokenList.push(token);
    displayToken(token);
    if (token.category == EOF) {
      // if we reach end of file then exit
      break;
    }
  }
}

function getChar() {
  // global sourceIndex, column, line, prevChar, blankLine

  // check if starting  a new line
  if (prevChar === "\n") {
    line += 1;
    column = 0;
    blankLine = true;
  }

  if (sourceIndex >= source.length) {
    column = 1;
    prevChar = "";
    return ""; // null string signals end of source
  }

  c = source[sourceIndex];
  sourceIndex += 1;
  column += 1;
  if (!c.trim() === "") {
    // c isn't whitespace then the line is not black
    blankLine = false;
  }
  prevChar = c;

  // if at end of blank line return space in the place of \n
  if (c === "\n" && blankLine) {
    return " ";
  } else {
    return c;
  }
}

function displayToken(t) {
  console.log(
    `${t.category}           ${(t.lexeme || "EOF").padStart(7)}       ${
      t.line
    }     ${t.column}`
  );
}

main();
