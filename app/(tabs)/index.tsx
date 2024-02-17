import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { ButtonBlue } from '@/components/Buttons';
import { notInitialized } from 'react-redux/es/utils/useSyncExternalStore';
import { Image } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
//  web : 318216390124-8hpklpfd8vc865mkmpgrp8vcaf8sq124.apps.googleusercontent.com
// IOS : 318216390124-l0d27h0h46jnghk313mobk310m9madme.apps.googleusercontent.com
// Android : 318216390124-duiu99bf5oucme089cf96ae4qsna0sdq.apps.googleusercontent.com

WebBrowser.maybeCompleteAuthSession();

export default function TabOneScreen( ) {

  
  const [accessToken, setAccessToken] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [message, setMessage] = React.useState(null)
   
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({

    //  318216390124-8hpklpfd8vc865mkmpgrp8vcaf8sq124.apps.googleusercontent.com 
      webClientId: "318216390124-la5dh2b6lnde3vr3js26ck2fsirnc085.apps.googleusercontent.com",
      expoClientId: "318216390124-knnp84n9aqnv13kdm36vq2d4kg445baa.apps.googleusercontent.com",
      iosClientId: "318216390124-l0d27h0h46jnghk313mobk310m9madme.apps.googleusercontent.com",
       androidClientId: "318216390124-duiu99bf5oucme089cf96ae4qsna0sdq.apps.googleusercontent.com",
       
  });
 const [array, setArray] = React.useState([
    {"fechaDevolucion": "2023-08-28T11:48:32.948Z",
     "fechaInicial": "2023-08-28T11:48:32.948Z",
     "foto": "../../images/goku.jpg",
     "telefono": "1123254875",
     "user": "GrafPro"},
     {"fechaDevolucion": "2023-08-28T11:48:32.948Z",
     "fechaInicial": "2023-08-28T11:48:32.948Z",
     "foto": "../../images/teclado.jpg",
     "telefono": "1123232345",
     "user": "Perico"}
    ])
  React.useEffect(() => {

   setMessage(JSON.stringify(response))
    console.log("soy el mesasge: ",message)
  if(response?.type === "success") {
    setAccessToken(response.authentication.accessToken);
    console.log(response)
    accessToken && fetchUserInfo();
  } else {
    console.log("soy el no success:",response);
    }
  }, [ accessToken])

  async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    const userInfo = await response.json();
    setUser(userInfo)
    
  }


const ShowUserInfo = () => {
 
  if (user) {
    return(
      <View>
        <Text>Welcome</Text>
        {/* <Image source={{uri: user.picture}}></Image> */}
        <Text>{user}</Text>
      </View>
    )
  }
}


  return (
 
    <View style={{...styles.container, backgroundColor:"blue"}}>
      {ShowUserInfo()}
    
      <>
      <Text>Welcome</Text>
      <Text>Please login</Text>
      <ButtonBlue  text={accessToken ? "show your info" : "Login"}
       onPress={accessToken ? fetchUserInfo : promptAsync }/>
      </>
      
      <Text style={styles.title}>Mis Prestamos</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
       
      
      {
        array.map((e, index) =>{
          
          return(
            <View key={index} >
            <Text>Usuario: {e.user}</Text>
            <Text>Telefono: {e.telefono}</Text>
            <Text>Fecha de inicio de prestamo : {e.fechaInicial}</Text>
            <Text>Fecha de devolucion: {e.fechaDevolucion}</Text>
            <Text>Foto:</Text>
            <Image  style={{width: 40, height: 40}} source={{uri:e.foto}}></Image>
            </View>
          )
          })
      }
       
       <Text style={styles.pagina}>
      
       </Text>
    </View>

     
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  pagina:{
   backgroundColor:"blue"
  },
});


