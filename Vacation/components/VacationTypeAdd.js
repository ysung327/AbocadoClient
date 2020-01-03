import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, TouchableOpacity } from "react-native"
import { Card, Button, Input, Icon } from 'react-native-elements'

export default class VacationTypeAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalHeight : '30%',
            isEdit : this.props.navigation.getParam('isEdit', 'default'),
            id : this.props.navigation.getParam('id', 'default'),
            day : this.props.navigation.getParam('day', 'default'),
            title : this.props.navigation.getParam('title', 'default'),
        }
    }

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow
        )
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide
        )
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }

    _keyboardDidShow = () => {
        this.setState({
            modalHeight: '50%',
        })
    }

    _keyboardDidHide = () => {
        this.setState({
            modalHeight: '30%',
        })
    }

    _onPress = () => {
        if(this.state.isEdit) {
            this.editData(this.state.id)
        }
    }

    editData = (id)  => {
        const url = "http://ysung327.pythonanywhere.com/vacations/detail/" + id + '/';

        this.setState({ loading: true });
        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                day: this.state.day,
                title: this.state.title,
            })
        })
    };

    render() {
        let day = ''
        let title = ''
        this.state.day != null ? day = this.state.day + '일' : day = '입력하세요'
        this.state.title != null ? title = this.state.title : title = '입력하세요'
        return (
            <ScrollView 
            scrollEnabled={false}
            contentContainerStyle={styles.container}>
                <View style={[styles.modalContainer, {height: this.state.modalHeight}]}>
                    <View style={styles.innerContainer}>
                        <View style={styles.input}>
                            <Input
                            keyboardType='number-pad'
                            placeholder={day}
                            leftIcon={
                                <Icon
                                type='material-community'
                                name='calendar-today'
                                size={24}
                                color='black'
                                />
                            }
                            />
                            <Input
                            placeholder={title}
                            leftIcon={
                                <Icon
                                type='material-community'
                                name='details'
                                size={24}
                                color='black'
                                />
                            }
                            />
                        </View>
                        <Button title='추가' />
                    </View>
                </View>
            </ScrollView>
        )
        }
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent'
    },

    modalContainer: {
        backgroundColor: '#fff',
    },

    innerContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },

    input: {

    },
})