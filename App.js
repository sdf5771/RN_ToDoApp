import React,{useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import {theme} from "./color";
import { Fontisto } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos"
const completeIconToDo = {
  complete : "checkbox-active",
  incomplete : "checkbox-passive"
}

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const TextInputOnChangeHandler = (event) => {setText(event)}
  const saveToDos = async(toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }
  useEffect(async()=>{
    const loadToDos = async() => {
      try{
        const stringObj = await AsyncStorage.getItem(STORAGE_KEY);
        if(stringObj){
          setToDos(JSON.parse(stringObj));
        }
      }catch(e){
        console.log(e)
      }
    }

    await loadToDos();
  },[])
  const addToDo = async (event) => {
    if (text === "") return;

    //Save ToDo Logic
    const newToDos = Object.assign({}, toDos, {[Date.now()] : {text, work: working, complete: "incomplete"}})
    setToDos(newToDos)
    await saveToDos(newToDos);
    //text empty setting
    setText("");
  }
  const deleteToDo = async (key) => {
    Alert.alert('Delete To Do',`Are you sure you want to delete`,
        [{text: "Sure", style: "destructive", onPress: async() => {
            const newToDos = {...toDos}
            delete newToDos[key]
            setToDos(newToDos)
            await saveToDos(newToDos);
          }}, {text: "Cancel"}])

  }
  const completeToDo = async (key) => {
    const newToDos = {...toDos}
    newToDos[key].complete = newToDos[key].complete === 'incomplete' ? 'complete' : 'incomplete'
    setToDos(newToDos)
    await saveToDos(newToDos);
  }
  const modifyToDo = async (key) => {
    Alert.prompt("Edit To Do", 'Edit To Do Text', [{text: 'Edit', onPress: async(editText) => {
        const newToDos = {...toDos}
        newToDos[key].text = editText
        setToDos(newToDos)
        await saveToDos(newToDos);
      }}, {text: 'cancel'}])
  }
  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.mainHeader}>
        <TouchableOpacity style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}} onPress={work}>
          <Text style={{...styles.btnText, marginRight: 10, color: working ? "white" : theme.grey}}>Work</Text>
          <Fontisto name="nervous" size={24} color={working ? "white" : theme.grey} />
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}} onPress={travel}>
          <Fontisto name="laughing" size={24} color={!working ? "white" : theme.grey} />
          <Text style={{...styles.btnText, marginLeft: 10, color: !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput value={text} returnKeyType="done" onSubmitEditing={addToDo} onChangeText={TextInputOnChangeHandler} placeholder={working ? "Add a To Do" : "Where do you wanna go?"} style={styles.input} />
      <ScrollView>
        {toDos !== null ? Object.keys(toDos).map(key => {
          return (
              toDos[key].work === working ?
              <View style={styles.toDo} key={key}>
                <TouchableOpacity onPress={() => completeToDo(key)}>
                  <Fontisto name={toDos[key].complete ? completeIconToDo[toDos[key].complete] : completeIconToDo["incomplete"]} size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => modifyToDo(key)}>
                  <Text style={toDos[key].complete === 'incomplete' ? styles.toDoText : styles.toDoTextComplete}>{toDos[key].text}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color={theme.grey} />
                </TouchableOpacity>
              </View> : null
          )
        }) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20
  },
  mainHeader: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  toDoTextComplete: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: 'line-through',
  },
});
