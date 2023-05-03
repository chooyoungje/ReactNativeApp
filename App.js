import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, TextInput,ScrollView, Alert, Platform } from 'react-native';
import { theme } from './colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';
import BouncyCheckbox from "react-native-bouncy-checkbox";


const STORAGE_KEY = "@toDos";
export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({}); 

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    try{
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch(e){
      console.log(e)
    }
  }
  const loadToDos = async () => {
    try{
      const s = await AsyncStorage.getItem(STORAGE_KEY); 
      return s != null ? setToDos(JSON.parse(s)) : null
           
    } catch(e){
      console.log(e)
    }
  }
  useEffect(()=> {
    loadToDos},[]);
  const addToDo = async () => {
    if(text ===""){
      return;
    }
    const newToDos = {...toDos, [Date.now()]:{text, working}}
    setToDos(newToDos)
    await saveToDos(newToDos)
    setText("");
  };

  const deleteToDo = async (key) => {
    if(Platform.OS === "web"){
      const ok = confirm("Do you want to delete this??")
      if(ok){
        const newToDos = {...toDos} 
        delete newToDos[key]
        setToDos(newToDos)
        await saveToDos(newToDos)
      }
    } else{
      Alert.alert("Delete To DO", 
              "Are you sure?", 
                [{text : "Cancel"}
                ,{text : "Ok", onPress : async ()=>{
                  const newToDos = {...toDos} 
                  delete newToDos[key]
                  setToDos(newToDos)
                  await saveToDos(newToDos)
                }
              }])
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>

        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color : working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color : !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>

          <TextInput
            returnKeyType='done'
            onSubmitEditing={addToDo}
            value={text}
            onChangeText={onChangeText}
            placeholder={working ? "Add a To Do": "Add a Travel List"} 
            style = {styles.input}/>
      <ScrollView>
        {Object.keys(toDos).map(key =>
          toDos[key].working === working ?  
        <View style={styles.toDo} key={key}>
          <Text style={styles.toDoText} >{toDos[key].text}</Text>
          <TouchableOpacity onPress={()=>deleteToDo(key)}>
            <Fontisto name="trash" size={24} color="white" />
          </TouchableOpacity>
        </View>
        : null
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal : "20px"
  },
  header : {
    flexDirection : "row",
    marginTop : 100,
    justifyContent : "space-between",
  },
  btnText : {
    fontSize : 40,
    fontWeight : "600",
  },
  input : {
    backgroundColor : "white",
    paddingVertical : 15,
    paddingHorizontal : 20,
    borderRadius : 30,
    marginVertical : 20,
    fontSize : 18,
  },
  toDo : {
    backgroundColor : theme.grey,
    marginBottom : 10,
    paddingVertical : 20,
    paddingHorizontal : 40,
    borderRadius : 15,
    flexDirection : "row",
    alignItems : "center",
    justifyContent : 'space-between',

  },
  toDoText : {
    color : "white",
    fontSize : 16,
    fontWeight : "500"
  },
});
