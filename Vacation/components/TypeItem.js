import React, { Component } from 'react';
import { StyleSheet, Text, View } from "react-native"
import { Card, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class TypeItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card containerStyle={styles.container} wrapperStyle={{padding:0}}>         
                <View style={styles.day}>
                  <Text style={styles.content}>{this.props.item.day}</Text>
                </View>
                <View style={styles.title}>
                  <Text style={styles.text}>{this.props.item.title}</Text>
                </View>
            </Card>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        borderWidth: 0.3,
        borderColor: 'gray',
        borderRadius: 5,
    },

    day:{
        flex: 1,
        alignItems: 'center',
    },

    content: {
        fontSize: 25,
    },

    title: {
        flex: 3,
        alignItems: 'center',
    },

    text: {
        fontSize: 17,
    },
})
