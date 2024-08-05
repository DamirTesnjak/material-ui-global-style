import { componentName } from "./componentName";
import { GetComponentPropsArgs } from "../types/GetComponentPropsArgs";

export function getComponentProps(args: GetComponentPropsArgs) {
    const {
        componentClass,
        getJsonDisplayAsHTML
    } = args;
    const componentNameString = componentName(componentClass);

    const fetchTypeScriptComponentCode = () => {
        const url = `https://raw.githubusercontent.com/mui/material-ui/next/packages/mui-material/src/${componentNameString}/${componentNameString}.d.ts`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "text/plain"
            }
        })
            .then((res) => {
                if (res) {
                    res.text()
                        .then((tSCode) => {
                            const codeLines = tSCode.split("\n");

                            // parsing the code
                            let startIndex = 0;
                            for (startIndex; startIndex < codeLines.length; startIndex++) {
                                const targetCodeLineV1 = `export interface ${componentNameString}Props<`;
                                const targetCodeLineV2 = `export interface ${componentNameString}Props {`;
                                const targetCodeLineV3 = `export interface ${componentNameString}OwnProps {`;
                                const targetCodeLineV4 = `export interface ${componentNameString}Props extends StandardProps<React.HTMLAttributes<HTMLDivElement>> {`;
                                const targetCodeLineV5 = `export type ${componentNameString}TypeMap<`;
                                const targetCodeLineV6 = `export interface ${componentNameString}Props extends StandardProps<PaperProps, 'variant'>, ${componentNameString}SlotsAndSlotProps {`;
                                const targetCodeLineV7 = `export interface ${componentNameString}Props extends TypographyProps<'div'>`
                                const targetCodeLineV8 = `export interface ${componentNameString}TypeMap<`
                                const targetCodeLineV9 = `export interface ${componentNameString}Props`;
                                const targetCodeLineV10 = `export interface Base${componentNameString}Props<Value = unknown>`;
                                const targetCodeLineV11 = `export interface ${componentNameString}OwnProps`;
                                const targetCodeLineV12 = `export interface ${componentNameString}Props extends TypographyProps<'div'> {`;

                                const wordExist = codeLines[startIndex] === targetCodeLineV1
                                    || codeLines[startIndex] === targetCodeLineV2
                                    || codeLines[startIndex] === targetCodeLineV3
                                    || codeLines[startIndex] === targetCodeLineV4
                                    || codeLines[startIndex] === targetCodeLineV5
                                    || codeLines[startIndex] === targetCodeLineV6
                                    || codeLines[startIndex] === targetCodeLineV7
                                    || codeLines[startIndex] === targetCodeLineV8
                                    || codeLines[startIndex] === targetCodeLineV9
                                    || codeLines[startIndex] === targetCodeLineV10
                                    || codeLines[startIndex] === targetCodeLineV11
                                    || codeLines[startIndex] === targetCodeLineV12
                                if (wordExist) {
                                    break;
                                }
                            }

                            let endIndex = startIndex;
                            for (endIndex; endIndex < codeLines.length; endIndex++) {
                                if (codeLines[endIndex] === "") {
                                    break;
                                }
                            }
                            const codeToParse = codeLines.slice(startIndex, endIndex);

                            let parseIndexStart = 0;
                            for (parseIndexStart; parseIndexStart < codeToParse.length; parseIndexStart++) {
                                const startLine = codeToParse[parseIndexStart].includes("/**");
                                if (startLine) {
                                    break;
                                }
                            }

                            const propsList = codeToParse.slice(parseIndexStart, codeToParse.length);
                            const propsListCleaned = propsList.filter(
                                (line) => (line.includes(":")
                                    || line.includes("<")
                                    || line.includes(">")
                                    || line.includes("&")
                                    || line.includes("{")
                                    || line.includes("}")
                                    || line.includes("@default")
                                )
                            );

                            // returned parsed lines of code as HTML items
                            const propListAsHtmlElements = propsListCleaned.map((propLine) => {
                                const propLineIndex = propsListCleaned.indexOf(propLine);
                                const returnAsHTML = (defaultValue = "") => {
                                    if ((propLine.includes(":")
                                        || propLine.includes("<")
                                        || propLine.includes(">")
                                        || propLine.includes("&")
                                        || propLine.includes("{")
                                        || propLine.includes("}")) && !propLine.includes("*")
                                    ) {
                                        const propLineSplit = propLine.split(":");
                                        const newPropValue = function () {
                                            if (Number(defaultValue)) {
                                                return (
                                                    <span style={{ display: 'inline-block', color: "#3333ff" }}>
                                                        <pre>{Number(defaultValue)}</pre>
                                                    </span>
                                                );
                                            }
                                            if (defaultValue.includes("{}")) (<span style={{ display: 'inline-block' }}>{"{"}</span>);
                                            if (defaultValue.includes('true')) {
                                                return (
                                                    <span style={{ display: 'inline-block', color: "#cc33ff" }}>
                                                        <pre>true</pre>
                                                    </span>
                                                );
                                            }
                                            if (defaultValue.includes('false')) {
                                                return (
                                                    <span style={{ display: 'inline-block', color: "#cc33ff" }}>
                                                        <pre>false</pre>
                                                    </span>);
                                            }
                                            if (defaultValue[defaultValue.length - 1] === " ") {
                                                return (
                                                    <span style={{ display: 'inline-block' }}>
                                                        <pre>{defaultValue.slice(0, defaultValue.length - 1)}</pre>
                                                    </span>
                                                );
                                            }
                                            if (defaultValue.includes('')) {
                                                return (
                                                    <span style={{ display: 'inline-block' }}>
                                                        <pre>{defaultValue.slice(0, defaultValue.length)}</pre>
                                                    </span>
                                                );
                                            }
                                        }();
                                        return (
                                            <div>
                                                <span style={{ display: 'inline-block', color: "#e67300" }}>
                                                    <pre>{propLineSplit[0].replace("?", "")}:</pre>
                                                </span>
                                                {newPropValue}
                                            </div>
                                        )
                                    }
                                    return (<div/>)
                                }

                                if (propLineIndex > 0 && propsListCleaned[propLineIndex - 1].includes("@default")) {

                                    // default value of a prop
                                    const defaultValue = propsListCleaned[propLineIndex - 1].split(" @default ")[1];
                                    return returnAsHTML(` ${defaultValue}, otherwise it is ${propsListCleaned[propLineIndex]}`.replace("   ", " ").replace("?", ""));
                                } else {
                                    if (propLine.includes("*")) {
                                        return <></>
                                    }
                                    const nonDefaultProps = propLine.split("; ");
                                    const nonDefaultPropsAsHTML = nonDefaultProps.map((lineAsHTML) => {
                                        const nonDefaultPropline = lineAsHTML.replace(";", ",")
                                            .replace("?", "")

                                        if (nonDefaultPropline.includes(":")) {
                                            const propLineSplitted = nonDefaultPropline.split(":")
                                            return (
                                                <div>
                                                    <span style={{ display: 'inline-block', color: "#e67300" }}>
                                                        <pre>{propLineSplitted[0]}:</pre>
                                                    </span>
                                                    <span style={{ display: 'inline-block' }}>
                                                        <pre>
                                                            {propLineSplitted.slice(1, propLineSplitted.length)}
                                                        </pre>
                                                    </span>
                                                </div>
                                            )
                                        }
                                        return (
                                            <div>
                                                <pre>{nonDefaultPropline}</pre>
                                            </div>
                                        )
                                    })
                                    return nonDefaultPropsAsHTML;
                                }
                            })
                            getJsonDisplayAsHTML(propListAsHtmlElements)
                        });
                }
            })
            .catch((err) => console.log('err', err))
    }
    fetchTypeScriptComponentCode();
}