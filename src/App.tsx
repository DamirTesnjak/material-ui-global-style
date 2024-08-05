import { useState } from "react";
import { Box, Grid, Link, ListItemButton, Typography, ThemeOptions } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { CssSelectorItemList } from "./components/CssSelectorItemList"
import { ThemeStyleOverrideObject } from "./components/ThemeStyleOverrideObject";
import { muiCssSelectors } from "./constants/muiCssSelectors";
import { componentName } from "./methods/componentName";
import { componentApiLink } from "./methods/componentApiLink";
import { getComponentProps } from "./methods/getComponentProps";
import style from './style/style';

import './App.css';

const theme = createTheme(style as ThemeOptions);

function App() {
    const [muiCssSelector, setMuiClass] = useState("");
    const [jsonDisplayAsHTML, getJsonDisplayAsHTML] = useState([<></>]);

    function displayComponentsClassNamesInfo() {
        const muiComponentsClasses = Object.keys(muiCssSelectors);
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
                                    getComponentProps({
                                        componentClass: muiClassItem,
                                        getJsonDisplayAsHTML,
                                    });
                                }}
                                selected={muiClassItem === muiCssSelector}
                            >
                                {componentName(muiClassItem)}
                            </ListItemButton>)
                    })
                }
            </Box>)
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
                            {muiCssSelector && (<Link component="a" href={componentApiLink(muiCssSelector)} target="_blank">{`${componentName(muiCssSelector)} API`}</Link>)}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={2}
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
                                {`Selected component ${componentName(muiCssSelector)}`}
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
                                <CssSelectorItemList args={{
                                    muiCssSelectors,
                                    muiCssSelector,
                                }}/>
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
                                <ThemeStyleOverrideObject args={{
                                    muiCssSelectors,
                                    muiCssSelector,
                                    jsonDisplayAsHTML,
                                }}/>
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
