import React, { Component } from 'react';
import { Button, View, Text, TextInput, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import { withNavigation } from 'react-navigation'


class LoginOrCreateForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            start_date: '',
            end_date: ''
        }
    }

    onUsernameChange(text) {
        this.setState({ username: text });
    }

    onPasswordChange(text) {
        this.setState({ password: text });
    }

    onStartDateChange(text) {
        this.setState({ start_date: text });
    }

    onEndDateChange(text) {
        this.setState({ end_date: text });
    }

    renderCreateForm() {
        if (this.props.create) {
        return (
            <View style={styles.fieldStyle}>
                <TextInput
                placeholder="입대일"
                autoCorrect={false}
                onChangeText={this.onStartDateChange.bind(this)}
                style={styles.textInputStyle}
                />
                <TextInput
                placeholder="전역일"
                autoCorrect={false}
                onChangeText={this.onEndDateChange.bind(this)}
                style={styles.textInputStyle}
                />
            </View>
        );
        }
    }

    renderButton() {
        const buttonText = this.props.create ? 'Create' : 'Login';
    
        return (
            <Button title={buttonText} onPress={this.handleRequest.bind(this)}/>
        );
    }


    renderCreateLink() {
        if (!this.props.create) {
        return (
            <Text style={styles.accountCreateTextStyle}>
                Or 
                <Text style={{ color: 'blue' }} onPress={() => this.props.navigation.navigate('Register')}>
                    {' Sign-up'}
                </Text>
            </Text>
        );
        }
    }

    handleRequest() {
        const endpoint = this.props.create ? 'register' : 'login';
        const payload = { username: this.state.username, password: this.state.password } 
        
        if (this.props.create) {
            payload.start_date = this.state.start_date;
            payload.end_date = this.state.end_date;
        }
        
        axios
            .post(`http://ysung327.pythonanywhere.com/user/auth/${endpoint}/`, payload)
            .then(response => {
                const { token, user } = response.data;
        
                // We set the returned token as the default authorization header
                axios.defaults.headers.common.Authorization = `Token ${token}`;
                
                // Navigate to the home screen
                this.props.navigation.navigate('Vacation', {token: token, user: user})
            })
            .catch(error => console.log(error));
    }


    render() {
        return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.formContainerStyle}>
                <View style={styles.fieldStyle}>
                    <TextInput
                    placeholder="username"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={this.onUsernameChange.bind(this)}
                    style={styles.textInputStyle}
                    />
                </View>
                <View style={styles.fieldStyle}>
                    <TextInput
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="password"
                    onChangeText={this.onPasswordChange.bind(this)}
                    style={styles.textInputStyle}
                    />
                </View>
                {this.renderCreateForm()}
            </View>
            <View style={styles.buttonContainerStyle}>
                {this.renderButton()}
                <View style={styles.accountCreateContainerStyle}>
                    {this.renderCreateLink()}
                </View>
            </View>
        </View>
        );
    }
    }


    const styles = StyleSheet.create({
    formContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInputStyle: {
        flex: 1,
        padding: 15
    },
    fieldStyle: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        padding: 25
    },
    accountCreateTextStyle: {
        color: 'black'
    },
    accountCreateContainerStyle: {
        padding: 25,
        alignItems: 'center'
    }
    });


export default LoginOrCreateForm
