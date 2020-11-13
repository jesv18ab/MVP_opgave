import React from 'react';
import {LogBox, StyleSheet, Text, View, Modal, TouchableHighlight} from 'react-native';
import * as firebase from 'firebase';

export default class modalView extends React.Component {
    state = {
        modalVisible: false,
        setModalVisible: false
    };
    componentDidMount() {
    }

    showModal =() =>{
        if (this.state.setModalVisible ===false && this.state.modalVisible === false){
            this.setState({setModalVisible: true, modalVisible: true })
        } else {
            this.setState({setModalVisible: false, modalVisible: false })
        }
    };
    render() {
        const {modalVisible} = this.state;
        const {setModalVisible} = this.state;
        return (
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={setModalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Hello World!</Text>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={this.showModal}>
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>

                <TouchableHighlight style={styles.openButton} onPress={this.showModal}>
                    <Text style={styles.textStyle}>Show Modal</Text>
                </TouchableHighlight>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
