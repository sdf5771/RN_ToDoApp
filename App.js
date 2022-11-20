import React,{useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import {theme} from "./color";
import { Fontisto } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos"

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
        setToDos(JSON.parse(stringObj));
      }catch(e){
        console.log(e)
      }
    }

    await loadToDos();
  },[])
  const addToDo = async (event) => {
    if (text === "") return;

    //Save ToDo Logic
    const newToDos = Object.assign({}, toDos, {[Date.now()] : {text, work: working}})
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
  return (
    <View style={styles.mainContainer}>
      <StatusBar style="auto" />
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput value={text} returnKeyType="done" onSubmitEditing={addToDo} onChangeText={TextInputOnChangeHandler} placeholder={working ? "Add a To Do" : "Where do you wanna go?"} style={styles.input} />
      <ScrollView>
        {toDos !== null ? Object.keys(toDos).map(key => {
          return (
              toDos[key].work === working ?
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
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
});
