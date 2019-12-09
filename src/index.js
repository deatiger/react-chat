import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {RootContainer} from './containers';
import {MuiThemeProvider} from '@material-ui/core/styles'
import {theme} from './templates/theme'
import * as serviceWorker from './serviceWorker';
import {configureStore} from './redux';
const store = configureStore();

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <RootContainer />
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
);


// If you want your app to react offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
