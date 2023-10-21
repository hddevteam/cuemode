const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "cuemode" is now active!');

    let disposable = vscode.commands.registerCommand('cuemode.cueMode', function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

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

        // Update the webview content when the document changes
        vscode.workspace.onDidChangeTextDocument((e) => {
            if(e.document === editor.document){
                panel.webview.html = getWebviewContent(editor.document.getText(), getConfig());
            }
        });

        // Update the webview content when the configuration changes
        vscode.workspace.onDidChangeConfiguration((e) => {
            if(e.affectsConfiguration('cuemode')){
                panel.webview.html = getWebviewContent(editor.document.getText(), getConfig());
            }
        });

        // Pass the selected text to the webview
        panel.webview.html = getWebviewContent(text, getConfig());
    });

    context.subscriptions.push(disposable);
}

function getConfig() {
    const config = vscode.workspace.getConfiguration('cuemode');
    return {
        colorTheme: config.get('colorTheme'),
        maxWidth: config.get('maxWidth'),
        fontSize: config.get('fontSize'),
        lineHeight: config.get('lineHeight'),
        padding: config.get('padding'),
        scrollSpeed: config.get('scrollSpeed'),
    };
}

function getWebviewContent(text, config) {
    const colorThemes = {
        "classic": { "color": "white", "backgroundColor": "black" },
        "inverted": { "color": "black", "backgroundColor": "white" },
        "midnightBlue": { "color": "#282C34", "backgroundColor": "#8C92AC" },
        "sunset": { "color": "#FF4500", "backgroundColor": "#FFD700" },
        "forest": { "color": "#228B22", "backgroundColor": "#F5F5DC" },
        "ocean": { "color": "#1E90FF", "backgroundColor": "#F0F8FF" },
        "rose": { "color": "#DB7093", "backgroundColor": "#FFF0F5" },
    };    

    const color = colorThemes[config.colorTheme].color;
    const backgroundColor = colorThemes[config.colorTheme].backgroundColor;

    const htmlPath = path.join(__dirname, 'webview.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    html = html.replace('${color}', color);
    html = html.replace('${backgroundColor}', backgroundColor);
    html = html.replace('${maxWidth}', config.maxWidth);
    html = html.replace('${fontSize}', config.fontSize);
    html = html.replace('${lineHeight}', config.lineHeight);
    html = html.replace('${padding}', config.padding);
    html = html.replace('${scrollSpeed}', config.scrollSpeed);
    html = html.replace('${text}', text);

    return html;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
