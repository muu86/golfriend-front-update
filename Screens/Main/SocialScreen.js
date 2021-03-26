import React, { useState, useEffect } from 'react';
import  { 
    StatusBar,
    View, 
    StyleSheet, 
    Text,
    FlatList,
} from "react-native";
import { Video } from 'expo-av';
import AuthContext from "../../Context/AuthContext";

const SocialItem = ({ token }) => {
    
    // useEffect(() => {

    // })
    
    const video = React.useRef(null);

    return (
        <View style={styles.InstaContainer}>
            <Text>Hi~</Text>
        </View>
    )
}

const SocialScreen = () =>{
    
    const { getJWT } = React.useContext(AuthContext);
    const token = getJWT();

    const [data, setData] = useState();
    // useEffect(() => {

    // })
    return(
        <>
            <StatusBar backgroundColor ={"#FFF"} barStyle={"dark-content"}></StatusBar>
            <View styles={styles.mainContainer}>
                {/* 헤더 */}
                {/* <View></View> */}

                {/* 바디 */}
                <FlatList
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    // keyExtractor={}
                    data={data}
                    renderItem={(item, index) => {
                        return <SocialItem token={token} />
                    }}
                />
            </View>
        </>
    );
};

export default SocialScreen;


const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:"white",
        flexDirection:"column",
        justifyContent: 'center',
        alignItems: 'center',

    },
    container:{
        flex:1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        
    },
    InstaContainer:{
        width:"100%",
        height:650,
        marginTop:15,
        borderBottomWidth:1,
        marginBottom:30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text :{
        fontSize:20,
        color: 'red',
        fontWeight: 'bold',
        textAlign:"center",
        
    }
});