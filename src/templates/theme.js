import {createMuiTheme} from '@material-ui/core/styles'

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#48dbfb',
      main: '#3498db',
      dark: '#2980b9',
      contrastText: '#fff',
    },
    secondary: {
      light: '#f7f9fb',
      main: '#f7f9fb',
      dark: '#f7f9fb',
      contrastText: '#000000',
    },
    accent: {
      light: '#f9ca24',
      main: '#f1c40f',
      dark: '#f39c12',
      contrastText: '#7f8c8d',
    }
  },
});