/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StatusBar, View, WebView} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const main = 'https://peaknic.github.io/T-Message_B/';


type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {uri: main, visible: true};
    }

    showSpinner() {
        console.log('Show Spinner');
        this.setState({visible: true});
    }

    hideSpinner() {
        console.log('Hide Spinner');
        this.setState({visible: false});
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Spinner
                    visible={this.state.visible}
                    textContent={''}
                    textStyle={{color: '#FFF'}}
                />

                <StatusBar backgroundColor="#fff" barStyle="dark-content"/>

                <WebView
                    source={{uri: this.state.uri}}
                    onLoadStart={() => (this.showSpinner())}
                    onLoad={() => (this.hideSpinner())}
                />
            </View>
        );
    }
}
