const style = {
    components: {
      MuiListItemButton: {
        styleOverrides: {
          root: {
            textTransform: "capitalize",
            color: "#000000",
            ":hover": {
              borderBottom: "2px solid #020102",
            },
            ":active": {
              borderBottom: "2px solid #ffffff",
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: "Roboto, sans-serif",
          },
        },
      },
    },
  };
  
  export default style;
  