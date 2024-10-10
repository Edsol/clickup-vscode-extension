import * as vscode from 'vscode';
import * as l10n from '@vscode/l10n';

import * as fs from 'fs';
import * as path from 'path';

if (vscode.l10n.uri?.fsPath) {
    l10n.config({
        fsPath: vscode.l10n.uri?.fsPath
    });
}

export class Utils {
    window: any;

    constructor(window: any) {
        this.window = window;
    }

    confirmDialog(message: string, yesCallback?: CallableFunction, noCallable?: CallableFunction) {
        this.window.showInformationMessage(l10n.t("Are you sure you want to eliminate this task?"), l10n.t("Yes"), l10n.t("No"))
            .then((answer: string) => {
                if (answer === l10n.t("Yes")) {
                    if (yesCallback) {
                        yesCallback();
                    }
                } else {
                    if (noCallable) {
                        noCallable();
                    }
                }
            });
    }
}

function getColorTheme() {
    const colorTheme = vscode.window.activeColorTheme;

    // 1: Light, 2: Dark, 3: High Contrast
    switch (colorTheme.kind) {
        case 1:
            return 'light';
        case 2:
            return 'dark';
        case 3:
            return 'high-contrast';
    }

}

const colorTheme = getColorTheme();
export const isDark = colorTheme === 'dark';

// Funzione per ottenere il percorso di un'icona SVG colorata
export function getColoredIconPath(svgPath: string, color?: string): string {
    // Leggi il contenuto dell'SVG originale
    const svgContent = fs.readFileSync(svgPath, 'utf8');

    if (!color) {
        color = isDark ? "#FFFFFF" : "#4C4E52";
    }

    // Sostituisci l'attributo fill con il colore specificato
    const coloredSvgContent = svgContent.replace(/fill=".*?"/g, `fill="${color}"`);

    // Salva l'icona modificata in una cartella temporanea
    const tempPath = path.join(__filename, '..', '..', '..', '..', 'resources', 'temp_icons');
    if (!fs.existsSync(tempPath)) {
        fs.mkdirSync(tempPath, { recursive: true });
    }

    const tempIconPath = path.join(tempPath, `icon-${color.replace('#', '')}.svg`);
    fs.writeFileSync(tempIconPath, coloredSvgContent);

    return tempIconPath;
}