# Save DartPad Content

A simple Chrome Extension to save your code directly from dartpad.dev.

## Features

-   Save the current code content from DartPad with a single click.
-   Option to save via a browser action popup or a context menu item.
-   Downloads the code as a `.dart` file.

## Usage

1.  Navigate to [DartPad.dev](https://dartpad.dev/).
2.  Write or load your Dart code.
3.  Click the "Save DartPad Content" extension icon in your browser toolbar, then click "Save Dart File".
4.  Alternatively, right-click anywhere on the DartPad page and select "Save Dart file" from the context menu.
5.  The code will be downloaded as a `.dart` file to your default download location.

## Availability

You can find the "Save DartPad Content" extension on the following browser stores:

| Browser                                                                                                            | Link                                                                                                               |
| :----------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| <div align="center"><img src="https://www.svgrepo.com/show/475640/chrome-color.svg" alt="Chrome" width="25"></div> | [Chrome Web Store](https://chromewebstore.google.com/detail/save-dartpad-content/fcfjealhddncdknllmamkhpgnlmmblmk) |
| <div align="center"><img src="https://www.svgrepo.com/show/452204/firefox.svg" alt="Firefox" width="25"></div>     | [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/save-pad/)                                        |
| <div align="center"><img src="https://www.svgrepo.com/show/452079/opera.svg" alt="Opera" width="25"></div>         | [Chrome Web Store](https://chromewebstore.google.com/detail/save-dartpad-content/fcfjealhddncdknllmamkhpgnlmmblmk) |
| <div align="center"><img src="https://www.svgrepo.com/show/378791/edge.svg" alt="Edge" width="25"></div>           | [Chrome Web Store](https://chromewebstore.google.com/detail/save-dartpad-content/fcfjealhddncdknllmamkhpgnlmmblmk) |
| <div align="center"><img src="https://www.svgrepo.com/show/378778/brave.svg" alt="Brave" width="25"></div>         | [Chrome Web Store](https://chromewebstore.google.com/detail/save-dartpad-content/fcfjealhddncdknllmamkhpgnlmmblmk) |

## Installation

1.  Go to the [Chrome Web Store page](https://chromewebstore.google.com/detail/save-dartpad-content/fcfjealhddncdknllmamkhpgnlmmblmk).
2.  Click the "Add to Chrome" button.
3.  Confirm the installation when prompted.

## Development

This extension is built using standard Web Extension APIs.

-   `manifest.json`: Defines the extension's properties, permissions, and background scripts.
-   `popup.html` / `popup.js`: Provides the browser action popup interface and logic.
-   `background.js`: Handles events like context menu clicks and orchestrates the content script injection and download.
-   `content.js`: Injected into DartPad pages to extract the code content.

## Contributing

If you find any issues or have suggestions, please open an issue on the GitHub repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
