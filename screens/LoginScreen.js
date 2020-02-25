import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LoginOrCreateForm from '../components/LoginOrCreateForm';


class LoginScreen extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <LoginOrCreateForm />
            </View>
        );
    }
}

export default LoginScreen