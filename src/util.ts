export const alphabetizeCssByClassName = (text: string) => {
  // Capture all keyframes CSS, remove them from the text, and
  // append them to the start of the final CSS result later
  const regexKeyframes = /@keyframes[^{]+\{([\s\S]+?\})\s*\}/g;
  const keyframes = text.match(regexKeyframes);

  let keyframesCss = "";
  if (keyframes !== null) {
    for (const match of keyframes) {
      text = text.replace(match, "");
      keyframesCss += `${match}\n\n`;
    }
  }

  // Regex to match media queries
  const regexMediaQuery = /@media[^{]+\{([\s\S]+?\})\s*\}/g;
  const mediaQueries = text.match(regexMediaQuery);

  // Capture all media queries CSS, remove them from the text, and
  // append them to the end of the final CSS result later
  let mediaQueriesCss = "";
  if (mediaQueries !== null) {
    for (const match of mediaQueries) {
      text = text.replace(match, "");
      mediaQueriesCss += `${match}\n\n`;
    }
  }

  const regexCssBlock = /.*?\{([\s\S]*?)\}.*?/g;
  const regularCssText = text.match(regexCssBlock);

  if (regularCssText === null || regularCssText?.length === 0) {
    return null;
  }

  // Match a class name within a matched CSS block
  // const regexClassName = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*\{/g;
  const regexClassName = /[^}]*(?=\{|$)/;

  // Sort the matched CSS by class name alphabetically
  const sorted = regularCssText.sort((a, b) => {
    const aMatch = a.match(regexClassName);
    const bMatch = b.match(regexClassName);
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

  // Create new CSS result file and write it to the editor document
  const lineBreak = "\n\n";
  const css = sorted.join(lineBreak);
  const result = keyframesCss + css + lineBreak + mediaQueriesCss;

  return result;
};
