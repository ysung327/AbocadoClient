import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Card, Button } from 'react-native-elements'

export default class VacationTypeDetail extends Component {
    constructor(props) {
        super(props);
        this.state  = {
            data: [],
            type_of_detail: this.props.navigation.getParam('type_of_detail', 'default'),
            uploaded: false,
        }
    }

    componentDidMount() {
        this.fetchDataFromApi(this.state.type_of_detail);
    }
    
    componentDidUpdate() {
        if (this.state.uploaded == true) {
            this.fetchDataFromApi(this.state.type_of_detail)
            this.setState({uploaded: false})
        }
    }

    fetchDataFromApi = (type_of_detail)  => {
        const url = "http://ysung327.pythonanywhere.com/vacations/type/";

        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type_of_detail: type_of_detail,
            })
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                data: res,
            });
        console.log(this.state.data)
        })
        .catch((error) => {
        console.log(error);
        });
    };

    _renderItem = ({item}) => {
        return (
            <TouchableOpacity 
                onPress={()=>this.props.navigation.navigate(
                    'typeAdd',
                    {
                        onUpload: this.onUpload, 
                        isEdit: true,
                        id: item.id, 
                        day: item.day, 
                        title: item.title
                    }
                )}>
                <Card 
                containerStyle={styles.itemContainer} 
                wrapperStyle={{padding:0}}>         
                    <View style={styles.itemDay}>
                        <Text style={styles.itemContent}>{item.day}</Text>
                    </View>
                    <View style={styles.itemTitle}>
                        <Text style={styles.itemText}>{item.title}</Text>
                    </View>
                </Card>
            </TouchableOpacity>
        )
    }

    _btnPress = () => {
        this.props.navigation.navigate(
            'typeAdd',
            {
                onUpload: this.onUpload, 
                isEdit: false, 
                type_of_detail: this.state.type_of_detail, 
                id: null, 
                day: null, 
                title: null
            }
        )
    }

    onUpload = () => {
        this.setState({ uploaded: true })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 0, paddingRight: 0 }}
                />
                <Button title="+" onPress={this._btnPress}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        borderWidth: 0.3,
        borderColor: 'gray',
        borderRadius: 5,
    },

    itemDay:{
        flex: 1,
        alignItems: 'center',
    },

    itemContent: {
        fontSize: 25,
    },

    itemTitle: {
        flex: 3,
        alignItems: 'center',
    },

    itemText: {
        fontSize: 17,
    },
})
