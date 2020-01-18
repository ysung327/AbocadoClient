import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, TouchableOpacity, Alert } from "react-native"
import { Card, Button, Input, Icon } from 'react-native-elements'

export default class VacationDetailAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            modalHeight : '70%',
            pk : this.props.navigation.getParam('pk', 'default'),
        }
    }

    componentWillMount () {
        this.fetchDataFromApi();
    }

    fetchDataFromApi = ()  => {
        const url = "http://ysung327.pythonanywhere.com/vacations/detail/";

        this.setState({ loading: true });

        fetch(url)
        .then(res => res.json())
        .then(res => {
                this.setState({
                data: res,
                });
                //console.log(this.state.data)
        })
        .catch((error) => {
                console.log(error);
        });
    };

    goBack = () => {
        this.props.navigation.goBack()
        this.props.navigation.state.params.onUpload()    
    }

    _pressAdd = () => {
        if(this.state.isEdit) {
            this.editData(this.state.id)
        }
        else {
            this.addData()
        }
    }

    _pressDelete = () => {
        this.deleteData(this.state.id)
    }

    editData = (id)  => {
        const url = "http://ysung327.pythonanywhere.com/vacations/detail/" + id + '/';

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
        
        this.goBack()
    };

    deleteData = (id)  => {
        const url = "http://ysung327.pythonanywhere.com/vacations/detail/" + id + '/';
        fetch( url, { method: 'DELETE' })
        this.goBack()
    };

    addData = ()  => {
        const url = "http://ysung327.pythonanywhere.com/vacations/detail/add/";

        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type_of_detail: this.state.type_of_detail,
                day: this.state.day,
                title: this.state.title,
            })
        })
        
        this.goBack()
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
                        { this.state.isEdit == true &&
                            <Button title='삭제' onPress={this._pressDelete}/>
                        }
                        <View style={styles.input}>
                            <Input
                            keyboardType='number-pad'
                            placeholder={day}
                            onChangeText={(text) => this.setState({dayTemp: text})}
                            value={this.state.dayTemp}
                            onEndEditing={() => this.setState({day: this.state.dayTemp})}
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
                            onChangeText={(text) => {this.setState({titleTemp: text})}}
                            value={this.state.titleTemp}
                            onEndEditing={() => this.setState({title: this.state.titleTemp})}
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
                        <Button title='추가' onPress={this._pressAdd}/>
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