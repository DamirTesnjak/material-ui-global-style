import { useState } from "react";
import { indexOf } from "lodash";
import { Box, Grid, Link, ListItem, ListItemButton, Typography, ThemeOptions } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { MuiClasses } from "./constants/muiClasses";
import { components } from "./constants/components";
import style from './style/style';

import './App.css';

type ClassesNames = string;
type generateComponentPropLinkArg = string;
type ComponentClassesKeyValues = string[];
type MuiClasses = typeof MuiClasses & {
    [x: string]: any,
}
const theme = createTheme(style as ThemeOptions);

function App() {
    const [muiClass, setMuiClass] = useState("");

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
                                onClick={() => setMuiClass(muiClassItem)}
                                selected={muiClassItem === muiClass}
                            >
                                {componentName(muiClassItem)}
                            </ListItemButton>)
                    })
                }
            </Box>)
    }

    function themeStyleOverrideCSS() {
        if (MuiClasses[muiClass as keyof typeof MuiClasses] ) {
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
                <div style={{fontSize: '13px'}}>
                    <div style={{paddingLeft: '0px'}}>{`{`}</div>
                    <div style={{paddingLeft: '20px'}}><span style={{ color: "#e67300" }}>{`${componentClassName}: `}</span><span>{"{"}</span></div>
                    <div style={{paddingLeft: '40px'}}><span style={{ color: "#e67300" }}>{`defaultProps `}</span><span>{"{"}</span></div>
                    <div style={{paddingLeft: '60px'}}>{getComponentProps(components[componentProperName as keyof typeof components])}</div>
                    <div style={{paddingLeft: '40px'}}>{`},`}</div>
                    <div style={{paddingLeft: '40px'}}><span style={{ color: "#e67300" }}>{`styleOverrides `}</span><span>{"{"}</span></div>
                    <div style={{paddingLeft: '60px'}}>{componentClasses}</div>
                    <div style={{paddingLeft: '40px'}}>{`}`}</div>
                    <div style={{paddingLeft: '20px'}}>{`}`}</div>
                    <div>{`}`}</div>
                </div>
            )
            
        }
    }

    function getComponentProps(component: any) {
        // eslint-disable-next-line react/forbid-foreign-prop-types
        if (component) {
            const componentsList: string[] = Object.keys(components);

            const componentCodeAsArrayOfStrings: string[] = component.render.toString().split("\n");

            console.log('componentCodeAsArrayOfStrings', componentCodeAsArrayOfStrings);
            const sliceEndIndex = indexOf(componentCodeAsArrayOfStrings, "    } = props,");
            let sliceStartIndex = indexOf(componentCodeAsArrayOfStrings, "    } = props,");

            if (sliceStartIndex > -1) {
                while (componentCodeAsArrayOfStrings[sliceStartIndex] !== "  const {") {
                    sliceStartIndex--;
                }
                const arrayOfComponentsPropsAsString = componentCodeAsArrayOfStrings.slice(sliceStartIndex + 1, sliceEndIndex);
                let arrayOfComponentProps = arrayOfComponentsPropsAsString.map((propAsString) => {
                    const newProp = propAsString.replace(/[ ,]+/g, " ")
                        .split(" = ");

                    // component property key
                    const newPropKey = function (){
                        let componentKeyProp = newProp[0].replaceAll(" ", "")
                        if(componentKeyProp.includes(":")) {
                            componentKeyProp = componentKeyProp.split(":")[0];
                            return componentKeyProp;
                        }
                        return componentKeyProp;
                    }();
                    
                    // component property value
                    const newPropValue = function () {
                        let i = 0;
                        for (i; i < componentsList.length; i++) {
                            if (newProp[1] && newProp[1].includes(componentsList[i])) {
                                const componentName = newProp[1].replaceAll(/[^A-Za-z0-9]/g, ",").split(',')[1]
                                return <span style={{ color: "#ff0066" }}>{`<${componentName} />`}</span>;
                            };
                        }
                        if (newProp[1] && Number(newProp[1])) {
                            return <span style={{ color: "#3333ff" }}>{Number(newProp[1])}</span>;
                        }
                        if (newProp[1] && newProp[1].includes("{}")) {
                            return "{}";
                        }
                        if (newProp[1] && newProp[1].includes('true')) {
                            return (<span style={{ color: "#cc33ff" }}>true</span>);
                        }
                        if (newProp[1] && newProp[1].includes('false')) {
                            return (<span style={{ color: "#cc33ff" }}>false</span>);
                        }
                        if (newProp[1] && newProp[1][newProp[1].length - 1] === " ") {
                            return newProp[1].slice(0, newProp[1].length - 1);
                        }
                        if (newProp[1] && newProp[1].includes('')) {
                            return <span style={{ color: "#009933" }}>{newProp[1].slice(0, newProp[1].length)}</span>;
                        }
                        if (!newProp[1]) {
                            return (
                            <Link
                                component="a"
                                href={generateComponentPropLink(newPropKey)}
                                target="_blank"
                            >
                                    {newPropKey}
                            </Link>)
                        }
                    }();

                    const reqex = new RegExp("[{()}//]", "g");

                    console.log('reqex.test(newPropKey)', reqex.test(newPropKey));


                    if (newPropKey.length > 1 && !reqex.test(newPropKey)) {
                        return (<div>
                            <span style={{ color: "#e67300" }}>{newPropKey}: </span><span>{newPropValue}</span>
                        </div>)
                    } else {
                        (<></>)
                    }
                });

                console.log('arrayOfComponentProps', arrayOfComponentProps);
                return arrayOfComponentProps;
            }
        }
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

    function generateComponentPropLink(prop: generateComponentPropLinkArg) {
        if (muiClass) {
            const componentNameString = componentName(muiClass);
            const componentNameKebabCase = componentNameString
                .replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
            const link = `https://mui.com/material-ui/api/${componentNameKebabCase}/#${componentNameKebabCase}-prop-${prop}`;
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
                    MUI styles info explorer
                </Typography>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={2}
                    >
                        <p>
                            This web app is a tool, to help you find class names for CSS styling and overview of
                            keys of the JSON object for "ThemeProvider". For the latter, some
                            keys in a JSON object of a selected component will simply not work. This is because, the gathered keys
                            are collected from <code>"@mui/material"</code> library files and some of them are not included in component's API.
                        </p>
                        <p>
                            To find out which keys are valid visit API page of selected component.
                            The link is automatically generated for selected component,
                        </p>
                        <Typography>
                            {muiClass && (<Link component= "a" href={generateComponentLink()} target="_blank">{`${componentName(muiClass)} API`}</Link>)}
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
                                Style overrride
                            </h6>
                            <Typography>
                                How to incoporate generated JSON, please visit: <br />
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
