import { useState } from "react";
import { Box, Grid, Link, ListItem, ListItemButton, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import hljs from 'highlight.js';

import { MuiClasses } from "./constants/muiClasses";
import { components } from "./constants/components";
import style from './style/style';

import './App.css';

const theme = createTheme(style);

function App() {
    const [muiClass, setMuiClass] = useState("");

    function componentName(classes) {
        const componentName = classes.split("Classes")[0];
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
        if (MuiClasses[muiClass]) {
            const classNames = Object.values(MuiClasses[muiClass]);
            return classNames.map((className) => {
                return (<ListItem key={className}>{className}</ListItem>)
            })
        }
    }

    function themeStyleOverrideJSON() {
        if (MuiClasses[muiClass]) {
            const componentClassesKeys = Object.keys(MuiClasses[muiClass]);
            const componentClassesKeyValues = Object.values(MuiClasses[muiClass]);
            const componentClassName = componentClassesKeyValues[0].split("-")[0];
            const componentProperName = componentClassName.replace("Mui", "");
            const styleOverridesKeysJson = {}

            componentClassesKeys.forEach((classKey) => {
                styleOverridesKeysJson[classKey] = {}
            });

            return {
                [componentClassName]: {
                    defaultProps: {
                        ...getComponentProps(components[componentProperName])
                    },
                    styleOverrides: {
                        ...styleOverridesKeysJson
                    }
                }
            }
        }
    }

    function getComponentProps(component) {
        // eslint-disable-next-line react/forbid-foreign-prop-types
        if (component) {
            const propertiesKeys = Object.keys(component.propTypes);
            const propertiesJson = {}

            propertiesKeys.forEach((property) => {
                propertiesJson[property] = {}
            });
            return propertiesJson;
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
        return null;
    }

    const parseJSON = () => {
        const hJson = `<pre>${hljs.highlight(`${JSON.stringify(themeStyleOverrideJSON(MuiClasses[muiClass]), undefined, 2)}`, { language: 'json' }).value}</pre>`;
        return { __html: hJson || "" };
    }

    return (
        <ThemeProvider
            theme={theme}
        >
            <Box sx={{ height: "100vh" }}>
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
                            {muiClass && (<Link href={generateComponentLink()} target="_blank">{`${componentName(muiClass)} API`}</Link>)}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={2}
                        sx={{
                             height: "86vh",
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
                            height: "86vh",
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
                                How to incoporate generated JSON, please visit: <br/>
                                <Link href="https://mui.com/material-ui/customization/theme-components/#theme-default-props" target="_blank">Theme style overrides</Link>
                            </Typography>
                            <Box
                                sx={{
                                    height: "65vh",
                                    overflowY: "scroll",
                                }}
                            >
                             <div dangerouslySetInnerHTML={parseJSON()} />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

export default App;
