import { componentName } from "./componentName";

export function componentApiLink(muiCssSelector: string) {
    if (muiCssSelector) {
        let componentNameString = componentName(muiCssSelector);
        componentNameString = componentNameString
            .replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
        return `https://mui.com/material-ui/api/${componentNameString}/`;
    }
    return undefined;
}