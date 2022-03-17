import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Button, Input, Icon } from "react-native-elements";
import { db } from '../firebase';

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "New Chat",
      headerBackTitle: "Chats",
    })
  }, [])

  const createChat = async () => {
    await db.collection("chats").add({
      chatName: input
    }).then(() => {
      navigation.goBack();
    }).catch((error) => alert(error));
  }

  return (
    <View style={styles.container}>
      <Input 
        placeholder="Chat Name" 
        value={input} 
        onChangeText={(text) => setInput(text)} 
        onSubmitEditing={createChat} 
        leftIcon={
          <Icon name="wechat" type="antdesign" size={24} color="black" />
        }
        />
        <Button disabled={!input} onPress={createChat} title="Create Chat" />
    </View>
  )
}

export default AddChatScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
    },
})