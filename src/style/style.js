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
            backgroundColor: "#ffffff",
            // fontSize: "12px",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "#c0c7c8",
            borderTop: "2px solid #ffffff",
            borderLeft: "2px solid #ffffff",
            borderBottom: "2px solid #020102",
            borderRight: "2px solid #020102",
            borderRadius: "0px",
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            backgroundColor: "#ffffff",
            borderTop: "2px solid #020102",
            borderLeft: "2px solid #020102",
            borderBottom: "2px solid #808080",
            borderRight: "2px solid #808080",
            borderRadius: "0px",
            height: "36px",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: "0px",
            fontSize: "15px",
            height: "36px",
          },
        },
      },
      MuiSimpleTreeView: {
        styleOverrides: {
          root: {
            height: '100%',
            backgroundColor: "#ffffff",
            MuiTreeItem: {
              backgroundColor: "#ffffff",
            },
          },
        },
      },
      MuiTreeItem: {
        styleOverrides: {
          root: {
            "& .MuiTreeItem-label": {
              fontSize: "14px",
            },
            "& .Mui-selected": {
              borderRadius: '0px',
              backgroundColor: '#00134d',
              color: '#ffffff',
            },
            "& .Mui-selected.Mui-focused": {
              borderRadius: '0px',
              backgroundColor: '#00134d',
              color: '#ffffff',
            },
            "& .MuiTreeItem-content.Mui-selected": {
              borderRadius: '0px',
              backgroundColor: '#00134d',
              color: '#ffffff',
              ":hover": {
                backgroundColor: '#00134d',
              }
            },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: "15px",
            ":hover": {
              backgroundColor: "#00134d",
              fontSize: "15px",
              color: "#ffffff",
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            fontSize: "15px",
            ":hover": {
              backgroundColor: "#00134d",
              fontSize: "15px",
              color: "#ffffff",
            },
          },
        },
      },
      MuiTreeItemContent: {
        styleOverrides: {
          root: {
            ":hover": {
              backgroundColor: "#00134d",
              fontSize: "15px",
              color: "#ffffff",
            },
          },
        },
      },
    },
  };
  
  export default style;
  