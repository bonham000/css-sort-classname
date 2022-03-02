# css-sort-classname

This is a VS Code extension to sort a `.css` file alphabetically by classname. It was adapted from the [css-dictionary](https://github.com/waleedj99/css-dictionary) extension first built by @waleedj99.

This extension sorts an entire CSS file, applying the following rules:

* All `@keyframes` declarations are moved to the top of the file.
* All `@media` media query declarations are moved to the bottom of the file.
* All remaining CSS declarations are sorted alphabetically by classname and moved to the middle of the file.

## Features

Run the extension from the command menu under "CSS Sort by Classname" with a `.css` file open. The entire file will be sorted. There is no option to sort a sub-selection of the file.

## Requirements

Only `.css` files are supported.

## Extension Settings

n/a

## Known Issues

It's possible there are more complicated CSS selectors which may not match the extension regex code and fail to sort properly and result in incorrect sorting and mangled CSS output. A brief visual inspection of the results after sorting is recommended.

## Debugging

If there are issues or you want to modify/extend this project, there are unit tests in the `src/test/unit` folder which allow you to quickly run the CSS sorting logic and print out results for debugging. You can run these with the `yarn test:unit` command.

## Release Notes

### 0.0.1

Initial release of `css-sort-classname`.
