import { useState } from "react";
import { indexOf } from "lodash";
import { Box, Grid, Link, ListItem, ListItemButton, Typography, ThemeOptions } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { MuiClasses } from "./constants/muiClasses";
import { components } from "./constants/components";
import style from './style/style';

import './App.css';

type ClassesNames = string;
type ComponentClassesKeyValues = string[];
type MuiClasses = typeof MuiClasses & {
    [x: string]: any,
}
const theme = createTheme(style as ThemeOptions);

function App() {
    const [muiClass, setMuiClass] = useState("");
    const [jsonDisplayAsHTML, getJsonDisplayAsHTML] = useState([]);

    function componentName(classesNames: ClassesNames) {
        const componentName = classesNames.split("Classes")[0];
        return componentName[0]?.toUpperCase() + componentName.slice(1, componentName.length);
    }

    function displayComponentsClassNamesInfo() {
        const muiComponentsClasses = Object.keys(MuiClasses);
        return (
            <Box sx={{
                height: "80vh",
                overflowY: "scroll",
            }}>
                {
                    muiComponentsClasses.map((muiClassItem) => {
                        return (
                            <ListItemButton
                                key={muiClassItem}
                                onClick={() => {
                                    setMuiClass(muiClassItem);
                                    getComponentProps(muiClassItem);
                                }}
                                selected={muiClassItem === muiClass}
                            >
                                {componentName(muiClassItem)}
                            </ListItemButton>)
                    })
                }
            </Box>)
    }

    function themeStyleOverrideCSS() {
        if (MuiClasses[muiClass as keyof typeof MuiClasses]) {
            const classNames = Object.values(MuiClasses[muiClass as keyof typeof MuiClasses]);
            return classNames.map((className) => {
                return (<ListItem key={className}>{className}</ListItem>)
            })
        }
    }

    function themeStyleOverrideJSON() {
        if (MuiClasses[muiClass as keyof typeof MuiClasses]) {
            const componentNameString = componentName(muiClass);
            const componentClassesKeyValues: ComponentClassesKeyValues = Object
                .values(MuiClasses[muiClass as keyof typeof MuiClasses])
                .filter((className) => className.includes(componentNameString));

            const componentClassName = componentClassesKeyValues[0].split("-")[0];
            const componentProperName = componentClassName.replace("Mui", "");

            const componentClasses = componentClassesKeyValues.map((classKey) => {
                const styleOverrideProp = classKey.split(`Mui${componentNameString}-`)[1];
                return (
                    <div>
                        <span style={{ color: "#e67300" }}>{`${styleOverrideProp}: `}</span><span>{"{}"}</span>
                    </div>
                )
            });

            return (
                <div style={{ fontSize: '13px' }}>
                    <div style={{ paddingLeft: '0px' }}>{`{`}</div>
                    <div style={{ paddingLeft: '20px' }}><span style={{ color: "#e67300" }}>{`${componentClassName}: `}</span><span>{"{"}</span></div>
                    <div style={{ paddingLeft: '40px' }}><span style={{ color: "#e67300" }}>{`defaultProps `}</span><span>{"{"}</span></div>
                    <div style={{ paddingLeft: '60px' }}>{jsonDisplayAsHTML}</div>
                    <div style={{ paddingLeft: '40px' }}>{`},`}</div>
                    <div style={{ paddingLeft: '40px' }}><span style={{ color: "#e67300" }}>{`styleOverrides `}</span><span>{"{"}</span></div>
                    <div style={{ paddingLeft: '60px' }}>{componentClasses}</div>
                    <div style={{ paddingLeft: '40px' }}>{`}`}</div>
                    <div style={{ paddingLeft: '20px' }}>{`}`}</div>
                    <div>{`}`}</div>
                </div>
            )

        }
    }

    function getComponentProps(componentClass: ClassesNames) {
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
                                const tSCodeArrayOfString = tSCode.split("\n");
                                console.log('tSCodeArrayOfString', tSCodeArrayOfString);
                                // extracting relevant code
                                //------------------------------------------------------------
                                let startIndex = 0;
                                for (startIndex; startIndex < tSCodeArrayOfString.length; startIndex++) {
                                    const interfaceStartLineV1 = `export interface ${componentNameString}Props<`;
                                    const interfaceStartLineV2 = `export interface ${componentNameString}Props {`;
                                    const interfaceStartLineV3 = `export interface ${componentNameString}OwnProps {`;
                                    const interfaceStartLineV4 = `export interface ${componentNameString}Props extends StandardProps<React.HTMLAttributes<HTMLDivElement>> {`;
                                    const interfaceStartLineV5 = `export type ${componentNameString}TypeMap<`;
                                    const interfaceStartLineV6 = `export interface ${componentNameString}Props extends StandardProps<PaperProps, 'variant'>, ${componentNameString}SlotsAndSlotProps {`;
                                    const interfaceStartLineV7 = `export interface ${componentNameString}Props extends TypographyProps<'div'>`
                                    const interfaceStartLineV8 = `export interface ${componentNameString}TypeMap<`
                                    const interfaceStartLineV9 = `export interface ${componentNameString}Props`;
                                    const interfaceStartLineV10 = `export interface Base${componentNameString}Props<Value = unknown>`;
                                    const interfaceStartLineV11 = `export interface ${componentNameString}OwnProps`;
                                    const interfaceStartLineV12 = `export interface ${componentNameString}Props extends TypographyProps<'div'> {`;

                                    const wordExist = tSCodeArrayOfString[startIndex] === interfaceStartLineV1
                                        || tSCodeArrayOfString[startIndex] === interfaceStartLineV2
                                        || tSCodeArrayOfString[startIndex] === interfaceStartLineV3
                                        || tSCodeArrayOfString[startIndex] === interfaceStartLineV4
                                        || tSCodeArrayOfString[startIndex] === interfaceStartLineV5
                                        || tSCodeArrayOfString[startIndex] === interfaceStartLineV6
                                        || tSCodeArrayOfString[startIndex] === interfaceStartLineV7
                                        || tSCodeArrayOfString[startIndex] === interfaceStartLineV8
                                        || tSCodeArrayOfString[startIndex] === interfaceStartLineV9
                                        || tSCodeArrayOfString[startIndex] === interfaceStartLineV10
                                        || tSCodeArrayOfString[startIndex] === interfaceStartLineV11
                                        || tSCodeArrayOfString[startIndex] === interfaceStartLineV12
                                    if (wordExist) {
                                        break;
                                    }
                                }

                                let endIndex = startIndex;
                                for (endIndex; endIndex < tSCodeArrayOfString.length; endIndex++) {
                                    if (tSCodeArrayOfString[endIndex] === "") {
                                        break;
                                    }
                                }
                                const extractedTypeOrInterface = tSCodeArrayOfString.slice(startIndex, endIndex);

                                let extractedCodeIndexStart = 0;
                                for (extractedCodeIndexStart; extractedCodeIndexStart < extractedTypeOrInterface.length; extractedCodeIndexStart++) {
                                    const startLine = extractedTypeOrInterface[extractedCodeIndexStart].includes("/**");
                                    if (startLine) {
                                        break;
                                    }
                                }

                                const extractedPropsList = extractedTypeOrInterface.slice(extractedCodeIndexStart, extractedTypeOrInterface.length);
                                const extractedPropsListCleaned = extractedPropsList.filter(
                                    (line) => (line.includes(":")
                                        || line.includes("<")
                                        || line.includes(">")
                                        || line.includes("&")
                                        || line.includes("{")
                                        || line.includes("}")
                                        || line.includes("@default")
                                    )
                                );
                                console.log("extractedPropsListCleaned", extractedPropsListCleaned);

                                const propListAsHtmlElements = extractedPropsListCleaned.map((line) => {
                                    const lineIndex = extractedPropsListCleaned.indexOf(line);
                                    const returnAsHTML = (defaultValue = "") => {
                                        if ((line.includes(":")
                                            || line.includes("<")
                                            || line.includes(">")
                                            || line.includes("&")
                                            || line.includes("{")
                                            || line.includes("}")) && !line.includes("*")
                                        ) {
                                            const lineSplit = line.split(":");
                                            const newPropValue = function () {
                                                if (Number(defaultValue)) {
                                                    return (<span style={{
                                                        display: 'inline-block',
                                                        color: "#3333ff"
                                                    }}>
                                                        <pre>
                                                            {Number(defaultValue)}
                                                        </pre>
                                                    </span>);
                                                }
                                                if (defaultValue.includes("{}")) {
                                                    return (<span style={{
                                                        display: 'inline-block',
                                                    }}>{"{"}</span>);
                                                }
                                                if (defaultValue.includes('true')) {
                                                    return (<span style={{
                                                        display: 'inline-block',
                                                        color: "#cc33ff"
                                                    }}>
                                                        <pre>
                                                            true
                                                        </pre>
                                                    </span>);
                                                }
                                                if (defaultValue.includes('false')) {
                                                    return (<span style={{
                                                        display: 'inline-block',
                                                        color: "#cc33ff"
                                                    }}>
                                                        <pre>
                                                            false
                                                        </pre>
                                                    </span>);
                                                }
                                                if (defaultValue[defaultValue.length - 1] === " ") {
                                                    return (<span style={{
                                                        display: 'inline-block',
                                                        // color: "#009933"
                                                    }}>
                                                        <pre>
                                                            {defaultValue.slice(0, defaultValue.length - 1)}
                                                        </pre>
                                                    </span>);
                                                }
                                                if (defaultValue.includes('')) {
                                                    return (<span style={{
                                                        display: 'inline-block',
                                                        // color: "#009933"
                                                    }}>
                                                        <pre>
                                                            {defaultValue.slice(0, defaultValue.length)}
                                                        </pre>
                                                    </span>);
                                                }
                                            }();
                                            return (
                                                <div>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        color: "#e67300",
                                                    }}>
                                                        <pre>
                                                            {lineSplit[0].replace("?", "")}:
                                                        </pre>
                                                    </span>
                                                    {newPropValue}
                                                </div>
                                            )
                                        }
                                        return (
                                            <>
                                            </>
                                        )
                                    }

                                    if (lineIndex > 0 && extractedPropsListCleaned[lineIndex - 1].includes("@default")) {
                                        const defaultValue = extractedPropsListCleaned[lineIndex - 1].split(" @default ")[1];
                                        return returnAsHTML(` ${defaultValue}, otherwise it is ${extractedPropsListCleaned[lineIndex]}`.replace("   ", " ").replace("?", ""));
                                    } else {
                                        if (line.includes("*")) {
                                            return <></>
                                        }
                                        const nonDefaultProps = line.split("; ");
                                        console.log("nonDefaultProps", nonDefaultProps);
                                        const nonDefaultPropsAsHTML = nonDefaultProps.map((lineAsHTML) => {
                                            const nonDefaultPropline = lineAsHTML.replace(";", ",")
                                                .replace("?", "")

                                            if (nonDefaultPropline.includes(":")) {
                                                const lineSplitted = nonDefaultPropline.split(":")
                                                return (<div>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        color: "#e67300",
                                                    }}>
                                                        <pre>
                                                            {lineSplitted[0]}:
                                                        </pre>
                                                    </span>
                                                    <span style={{ display: 'inline-block' }}>
                                                        <pre>
                                                            {lineSplitted.slice(1, lineSplitted.length)}
                                                        </pre>
                                                    </span>
                                                </div>)
                                            }
                                            return (
                                                <div><span><pre>{nonDefaultPropline}</pre></span></div>
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

    function generateComponentLink() {
        if (muiClass) {
            const componentNameString = componentName(muiClass);
            const componentNameKebabCase = componentNameString
                .replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
            const link = `https://mui.com/material-ui/api/${componentNameKebabCase}/`;
            return link;
        }
        return undefined;
    }

    return (
        <ThemeProvider
            theme={theme}
        >
            <Box>
                <Typography variant="h4">
                    MaterialUI styles values overview
                </Typography>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={2}
                    >
                        <p>
                        This web app is a tool, to help you find class names for CSS styling and look at an overview of JSON objects,
                        their keys, default values & types, used for overriding default styles of MaterialUI components.
                        Information was fetched from the GitHub page <code>https://github.com/mui/material-ui/tree/next/packages/mui-material/src</code> and
                        then parsed from library <code>*.d.ts</code> files. For some components parsing was not completely successful,
                        so please visit the link below for the selected component!
                        </p>
                        <Typography>
                            {muiClass && (<Link component="a" href={generateComponentLink()} target="_blank">{`${componentName(muiClass)} API`}</Link>)}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={2}
                        sx={{
                            // height: "86vh",
                        }}
                    >
                        <h5>
                            Components
                        </h5>
                        {displayComponentsClassNamesInfo()}
                    </Grid>
                    <Grid
                        container
                        xs={12}
                        sm={12}
                        md={8}
                        sx={{
                            // height: "86vh",
                        }}
                    >
                        <Grid item xs={12}>
                            <h5>
                                {`Selected component ${componentName(muiClass)}`}
                            </h5>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                        >
                            <h6>
                                CSS Class Names
                            </h6>
                            <Box sx={{
                                height: "74vh",
                                overflowY: "scroll",
                            }}>
                                {themeStyleOverrideCSS()}
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                        >
                            <h6>
                                Theme style overrride
                            </h6>
                            <Typography>
                                How to incoporate theme styles overwrite, please visit: <br />
                                <Link href="https://mui.com/material-ui/customization/theme-components/#theme-default-props" target="_blank">Theme style overrides</Link>
                            </Typography>
                            <Box
                                sx={{
                                    height: "65vh",
                                    overflowY: "scroll",
                                }}
                            >
                                {themeStyleOverrideJSON()}
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid xs={12} sm={12} md={12}>
                        <Typography>
                            Damir Tešnjak
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

export default App;
