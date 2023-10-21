const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "cuemode" is now active!');

    let disposable = vscode.commands.registerCommand('cuemode.cueMode', function () {
        const config = vscode.workspace.getConfiguration('cuemode');

        const colorTheme = config.get('colorTheme');
        const maxWidth = config.get('maxWidth');
        const fontSize = config.get('fontSize');
        const lineHeight = config.get('lineHeight');
        const padding = config.get('padding');
        const scrollSpeed = config.get('scrollSpeed');

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            let document = editor.document;
            let selection = editor.selection;

            // Get the selected text or the entire document if nothing is selected
            let text;
            if (!selection.isEmpty) {
                text = document.getText(selection);
            } else {
                text = document.getText();
            }

            // Get the filename of the current document
            let filename = path.basename(document.uri.fsPath);

            const panel = vscode.window.createWebviewPanel(
                'cueMode',
                `${filename} - Cue Mode`,
                vscode.ViewColumn.One,
                {
                    // Enable scripts in the webview
                    enableScripts: true,

                    // And restrict the webview to only loading content from our extension's `media` directory.
                    localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],

                    // Make sure all keyboard events are sent to the webview
                    retainContextWhenHidden: true
                }
            );

            vscode.workspace.onDidChangeTextDocument((e) => {
                if(e.document === editor.document){
                    panel.webview.html = getWebviewContent(editor.document.getText(), colorTheme, maxWidth, fontSize, lineHeight, padding, scrollSpeed);
                }
            });

            // Pass the selected text to the webview
            panel.webview.html = getWebviewContent(text, colorTheme, maxWidth, fontSize, lineHeight, padding, scrollSpeed);
        }
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(text, colorTheme, maxWidth, fontSize, lineHeight, padding, scrollSpeed) {
    const colorThemes = {
        "classic": { "color": "white", "backgroundColor": "black" },
        "inverted": { "color": "black", "backgroundColor": "white" },
        "midnightBlue": { "color": "#282C34", "backgroundColor": "#8C92AC" },
        "sunset": { "color": "#FF4500", "backgroundColor": "#FFD700" },
        "forest": { "color": "#228B22", "backgroundColor": "#F5F5DC" },
        "ocean": { "color": "#1E90FF", "backgroundColor": "#F0F8FF" },
        "rose": { "color": "#DB7093", "backgroundColor": "#FFF0F5" },
    };    

    const color = colorThemes[colorTheme].color;
    const backgroundColor = colorThemes[colorTheme].backgroundColor;

    const htmlPath = path.join(__dirname, 'webview.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    html = html.replace('${color}', color);
    html = html.replace('${backgroundColor}', backgroundColor);
    html = html.replace('${maxWidth}', maxWidth);
    html = html.replace('${fontSize}', fontSize);
    html = html.replace('${lineHeight}', lineHeight);
    html = html.replace('${padding}', padding);
    html = html.replace('${scrollSpeed}', scrollSpeed);
    html = html.replace('${text}', text);

    return html;
}


function deactivate() {}

module.exports = {
    activate,
    deactivate
}
