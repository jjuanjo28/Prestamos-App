import React, { useEffect, useState } from 'react';

import {
  ScrollView,
  Image,
  StatusBar,
  StyleSheet,
  TextInput,
  Pressable, } from 'react-native';


import { Text, View } from './Themed';
import { ButtonBlue, ButtonRed } from "./Buttons"

import * as ImagePicker from "expo-image-picker";
import * as Contacts from "expo-contacts";
import DateTimePicker from '@react-native-community/datetimepicker';
import prestamo from "./prestamo"

export default function EditScreenInfo({ path }:{ path: string }) {
  const [prestamos, setPrestamos] = useState([])
  const [image, setImage] = useState("https://via.placeholder.com/200");
  const [contacts, setContacts] = useState(undefined);
  const [selectedName, setSelectedName] = useState(null); // Estado para almacenar el nombre selecciona
  const [hora, setHora] = useState(new Date())
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [hayFoto, setHayFoto] = useState(false)
  const [phone, setPhone] = useState("")
  const [date, setDate] = useState(new Date())
  const [dateText, setDateText] = useState("tu fecha de reclamo")
  const [showPickerDate, setShowPickerDate] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.ID,
            Contacts.Fields.Name,
            Contacts.Fields.LastName,
            Contacts.Fields.PhoneNumbers,
          ],
        });

        if (data.length > 0) {
          setContacts(data);

          // console.log("soy tel:", contact.phoneNumbers[0].number);
          // console.log("soy el nombre: ",contact.name);
        }
      }
    })();
  }, []);//  carga la base de usuarios que tiene la agenda del equipo
  useEffect(() => {
    console.log("aca estoy cambiado: ",prestamos); // Observa los cambios en el estado prestamos
  }, [prestamos]); 
  useEffect(() => {
  console.log(date)
  }, [date])
  
  const toogleDatepicker = () => {
    setShowPickerDate(!showPickerDate);
   }

  const onChage = ({type}, selectedDate) => {
            if(type == "set"){
              const currenDate = selectedDate || date
              setDate(currenDate)
              toogleDatepicker()
              const dateString = currenDate.toDateString()
              setDateText(dateString)

            } else {
              toogleDatepicker()
            }
  } 
  
  const tomarFotografia = async () => {

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    setHayFoto(true)
    } else {
      alert("no elegiste ninguna fotografia")
    }
  };


  function telefono(contact) {

    if(image == "https://via.placeholder.com/200" ){
     alert("primero debes tomar una foto")
     setSelectedName(null)
     return;
    }

    const currentHour = new Date();// Obtenemos la hora actual aquí
    
    setHora(currentHour);

    if (contact.phoneNumbers[0].number !== undefined) {
      setSelectedName(contact.name)
      setPhone(contact.phoneNumbers[0].number)
      let horaString = hora.getDate() + "/" +hora.getMonth()
      let dateString = date.getDate() + "/" + date.getMonth()
      console.log(dateString)
      let prest = new prestamo(horaString, contact.name, contact.phoneNumbers[0].number, image, dateString)
      
      setPrestamos([...prestamos, prest])
      console.log("soy prest",prest)
     
    } else {
      console.log(
        "el usuario " + contact.name + " no tiene telefono registrado"
      );
    }

  }

let confirmoPrestamo = () => {
  console.log(prestamos[0])
}

  let getContactRows = () => {
    if (contacts !== undefined) {
      return contacts.map((contact, index) => (
        <ButtonBlue
          key={index}
          text={contact.name}
          onPress={() => {
            telefono(contact);
            setSelectedContactId(contact.id)
           // setSelectedName(contact.name); // Al presionar un botón, guardamos el nombre seleccionado
          }}
        />
      ));
    }
  };
  return (
    
      <View style={styles.getStartedContainer}>

      
<Text style={{...styles.prestamo}}>PRESTAMOS</Text>

{/* <ButtonRed text="Seleccionar una Imagen" onPress={pickImage} /> */}

<Image
  style={{
    alignSelf: "center",
    height: 200,
    width: 200,
  }}
  source={{ uri: image }}
/>

{!hayFoto && (<ButtonRed text="Tomar Fotografia" onPress={tomarFotografia} />)}

 <View>

   {!showPickerDate && (
     <View>
     <Pressable
   onPress={toogleDatepicker}>
 
   <TextInput
     style={{...styles.input}}
     placeholder="tu fecha para reclamo"
     value={dateText}
     placeholderTextColor="#11182744"
     editable={false}
     />
  
   </Pressable>
   </View>
   )}

  {showPickerDate && (
    <View>
  <Text style={{...styles.fechaEntrega}}>Fecha de entrega</Text>
  <DateTimePicker
  mode="date"
  display="spinner"
  onChange={onChage}
  value={date}
  />
    </View>
  )}


 </View>

{/* Mostrar el nombre seleccionado en lugar de los botones */}
{selectedName ? 
<ButtonBlue text={contacts.find((contact) => contact.id === selectedContactId).name} />
               
 : 
 
   <ScrollView>{getContactRows()}</ScrollView>

   
   
   
   
  }
  <ButtonBlue text={"Confirmo prestamo"} onPress={confirmoPrestamo} />

<StatusBar style="auto" />



      </View>
      
    
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    backgroundColor:"yellow"
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  prestamo:{
    backgroundColor:"grey",
    fontSize: 20,
    margin: 15,
    textAlign:"center",
    borderRadius: 15,
    padding: 15,
    
 },
 fechaEntrega:{
    fontSize: 15,
    textAlign:"center",
    margin: 20
 },
 input:{
   textAlign: "center",
   margin: 10,
   backgroundColor: "orange"
 }
 
});
