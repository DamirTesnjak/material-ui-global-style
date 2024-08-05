export function componentName(muiCssSelector: string) {
    const componentName = muiCssSelector.split("Classes")[0];
    return componentName[0]?.toUpperCase() + componentName.slice(1, componentName.length);
}