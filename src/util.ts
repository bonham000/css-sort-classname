type MatchResult = {
  text: string;
  index: number;
};

/**
 * Match a regular expression and return match results
 * which include index position of matches.
 */
const matchRegex = (regex: RegExp, text: string): MatchResult[] => {
  let match;
  let result: MatchResult[] = [];
  while ((match = regex.exec(text)) !== null) {
    result.push({
      text: match[0],
      index: match.index,
    });
  }
  return result;
};

/**
 * Check if a match index is preceded by a comment.
 */
const isPrecededByComments = (text: string, matchIndex: number) => {
  for (let i = matchIndex - 1; i > 0; i--) {
    const char = text.charAt(i);
    if (char === "/") {
      if (text.charAt(i - 1) === "*") {
        return true;
      }
    } else if (char === "}") {
      return false;
    }
  }

  return false;
};

/**
 * Find a comment from a matched position given all of the
 * matched comments. This mutates the comments array and
 * removes the identified comment.
 */
const findCommentFromPosition = (
  position: number,
  comments: MatchResult[]
): MatchResult | null => {
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    if (i === comments.length - 1) {
      return comment;
    }

    const next = comments[i + 1];
    if (position > comment.index && position < next.index) {
      return comment;
    }
  }

  return null;
};

/**
 * Get the comment preceding a block of CSS, if it exists.
 */
const getPossiblePrecedingComment = (
  text: string,
  match: MatchResult,
  comments: MatchResult[]
): MatchResult | null => {
  if (isPrecededByComments(text, match.index)) {
    const comment = findCommentFromPosition(match.index, comments);
    return comment;
  }

  return null;
};

/**
 * ALphabetize a CSS text input by classname and return the result.
 *
 * This function:
 *
 * 1. Extract all comments
 * 2. Extract all @keyframes and @media query declarations
 * 3. Extracts all CSS blocks
 * 4. Sorts CSS blocks alphabetically by classname
 * 5. Map the comments to the appropriate final position based on index
 */
export const alphabetizeCssByClassName = (text: string) => {
  const lineBreak = "\n\n";

  // Match and extract all comments
  const regexComments = /\/\*[\s\S]*?\*\//g;

  // Array to keep track of matched to text to remove from original
  let toReplace = [];
  let comments = matchRegex(regexComments, text);

  // Regex to match @keyframes
  const regexKeyframes = /@keyframes[^{]+\{([\s\S]+?\})\s*\}/g;
  const keyframes = matchRegex(regexKeyframes, text);

  // Capture all keyframes CSS, remove them from the text, and
  // append them to the start of the final CSS result later
  let keyframesCss = "";
  if (keyframes !== null) {
    for (const match of keyframes) {
      const comment = getPossiblePrecedingComment(text, match, comments);
      if (comment) {
        keyframesCss += comment.text + "\n";
        toReplace.push(comment.text);
        comments = matchRegex(regexComments, text);
      }

      toReplace.push(match.text);
      keyframesCss += match.text + lineBreak;
    }
  }

  // Regex to match @media queries
  const regexMediaQuery = /@media[^{]+\{([\s\S]+?\})\s*\}/g;
  const mediaQueries = matchRegex(regexMediaQuery, text);

  for (const x of toReplace) {
    text = text.replace(x, "");
  }

  // Reset/update these
  toReplace = [];
  comments = matchRegex(regexComments, text);

  // Capture all media queries CSS, remove them from the text, and
  // append them to the end of the final CSS result later
  let mediaQueriesCss = "";
  if (mediaQueries !== null) {
    for (const match of mediaQueries) {
      const comment = getPossiblePrecedingComment(text, match, comments);
      if (comment) {
        mediaQueriesCss += comment.text + "\n";
        toReplace.push(comment.text);
      }

      toReplace.push(match.text);
      mediaQueriesCss += match.text + lineBreak;
    }
  }

  for (const x of toReplace) {
    text = text.replace(x, "");
  }

  // Reset/update these
  toReplace = [];
  comments = matchRegex(regexComments, text);

  // Map all CSS blocks
  const regexCssBlock = /.*?\{([\s\S]*?)\}.*?/g;
  const regularCssText = matchRegex(regexCssBlock, text);

  // Match a class name within a matched CSS block
  const regexClassName = /[^}]*(?=\{|$)/;

  // Sort the matched CSS by class name alphabetically
  const sorted = regularCssText.sort((a, b) => {
    const aMatch = a.text.match(regexClassName);
    const bMatch = b.text.match(regexClassName);
    if (aMatch !== null && bMatch !== null) {
      const aString = aMatch[0].slice(1);
      const bString = bMatch[0].slice(1);
      if (aString < bString) {
        return -1;
      } else if (bString > aString) {
        return 1;
      }
    }

    return 0;
  });

  // Map the comments to the sorted CSS blocks
  const sortedWithComments = sorted.map((match) => {
    const comment = getPossiblePrecedingComment(text, match, comments);
    let result = "";
    if (comment) {
      result += comment.text + "\n";
      // text = text.replace(comment.text, "");
    }

    result += match.text;
    return result;
  });

  // Create new CSS result file and write it to the editor document
  const css = sortedWithComments.join(lineBreak);
  const result = keyframesCss + css + lineBreak + mediaQueriesCss;

  // Trim extra trailing newline character
  return result.slice(0, -1);
};
