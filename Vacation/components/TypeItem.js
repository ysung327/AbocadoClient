import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Card, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation';

class TypeItem extends Component {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        this.props.navigation.navigate('typeAdd', {isEdit: true, id: this.props.item.id, day: this.props.item.day, title: this.props.item.title})
    }
    
    render() {
        return (
            <TouchableOpacity onPress={this.onPress}>
                <Card 
                containerStyle={styles.container} 
                wrapperStyle={{padding:0}}>         
                    <View style={styles.day}>
                        <Text style={styles.content}>{this.props.item.day}</Text>
                    </View>
                    <View style={styles.title}>
                        <Text style={styles.text}>{this.props.item.title}</Text>
                    </View>
                </Card>
            </TouchableOpacity>
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

export default withNavigation(TypeItem);