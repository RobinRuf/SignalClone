import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from 'expo-status-bar';
import { db, auth } from "../firebase";
import firebase from "firebase/compat/app";

const ChatScreen = ({ navigation, route }) => {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <Avatar 
                        rounded 
                        source={{ 
                            uri: 
                            messages[0]?.data.photoURL,
                        }} />
                    <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
                        {route.params.chatName}
                    </Text>
                </View>
            )         
        });
    }, [navigation, messages])

    const sendMessage = () => {
        Keyboard.dismiss();

        db.collection("chats").doc(route.params.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        })

        setInput("");
    };

    useLayoutEffect(() => {
        const unsubscribe = db.collection("chats").doc(route.params.id)
        .collection("messages").orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => setMessages(
            snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }))
        ));

        return unsubscribe;
    }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar style="light" />
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={90}>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
            <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
            {messages.map(({ id, data }) =>
                    data.email === auth.currentUser.email ? (
                        <View key={id} style={styles.receiver}>
                            <Avatar 
                                position="absolute" 
                                rounded 
                                bottom={-15} 
                                right={-5} 
                                size={30} 
                                source={{
                                    uri: data.photoURL,
                                }} 
                            />
                            <Text style={styles.receiverText}>{data.message}</Text>
                        </View>
                    ) : (
                        <View key={id} style={styles.sender}>
                            <Avatar 
                                position="absolute" 
                                rounded 
                                bottom={-15} 
                                left={-5} 
                                size={30} 
                                source={{
                                    uri: data.photoURL,
                                }} 
                            />
                            <Text style={styles.senderName}>{data.displayName}</Text>
                            <Text style={styles.senderText}>{data.message}</Text>
                        </View>
                    )
                )}
            </ScrollView>
            <View style={styles.footer}>
                <TextInput value={input} onChangeText={(text) => setInput(text)} placeholder="Signal Message" style={styles.textInput}/>
                <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                    <Ionicons name="send" size={24} color="#2B68E6" />
                </TouchableOpacity>
            </View>
        </>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    receiver: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative",
    },
    sender: {
        padding: 15,
        backgroundColor: "#2B68E6",
        alignSelf: "flex-start",
        borderRadius: 20,
        margin: 15,
        maxWidth: "80%",
        position: "relative",
    },
    receiverText: {
        color: "black",
        fontSize: 14,
    },
    senderText: {
        color: "white",
        fontSize: 14,
    },
    senderName: {
        paddingRight: 10,
        paddingBottom: 5,
        fontSize: 10,
        color: "white",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "gray",
        borderRadius: 30,
    },
})