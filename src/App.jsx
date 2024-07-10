import { useState } from "react";
import { Box, Grid, Link, ListItemButton, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
                height: "88vh",
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
                return (<Typography key={className}>{className}</Typography>)
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

    return (
        <ThemeProvider
            theme={theme}
        >
            <Box sx={{ height: "100vh" }}>
                <Typography variant="h4">
                    MUI styles info explorer
                </Typography>
                <Grid container>
                    <Grid container xs={2}>
                        <Typography>
                            This web app is a tool, to help you find class names for CSS styling and general overview of
                            all valid keys when typing JSON for style override with a "ThemeProvider". For the latter, some
                            keys in a JSON object of a selected component will simply not work. This is because, the gathered keys
                            are collected from "@mui/material" library files and some of them are not included in components API.
                            <br/>
                            <br/>
                            To find out which keys are valid visit the selected component API page:
                            <br/>
                            The link is automatically generated for a selected component

                        </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{
                                height: "88vh",
                            }}>
                        <Typography variant="h6">
                            Components
                        </Typography>
                        {displayComponentsClassNamesInfo()}
                    </Grid>
                    <Grid container xs={8} sx={{
                                height: "88vh",
                            }}>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                {`Selected component ${componentName(muiClass)}`}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                        >
                            <Typography variant="h6">
                                CSS Class Names
                            </Typography>
                            <Box sx={{
                                height: "88vh",
                                overflowY: "scroll",
                            }}>
                                {themeStyleOverrideCSS()}
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                        >
                            <Typography variant="h6">
                                Style overrride
                            </Typography>
                            <Typography>
                                How to incoporate generated JSON, please visit: <br/>
                                <Link href="https://mui.com/material-ui/customization/theme-components/#theme-default-props">Theme style overrides</Link>
                            </Typography>
                            <Box
                                sx={{
                                    height: "88vh",
                                    overflowY: "scroll",
                                    whiteSpace: "pre"
                                }}
                            >
                                {JSON.stringify(themeStyleOverrideJSON(MuiClasses[muiClass]), null, "\t")}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

export default App;
