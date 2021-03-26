import React, { useRef, useState, useContext } from 'react';
import {
    StyleSheet,
    View,
    Button,
    Text,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import { Video, AVPlaybackStatus } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import AuthContext from '../../Context/AuthContext';

import { SERVER_IP} from '../../ServerIp';
// const SERVER_IP = "192.168.55.147";
const POSE_NAME = ["address", "take away", "back swing", "top", "down swing", "impact", "release", "follow through"];

const VideoScreen = ({ navigation, route }) => {
    const WIDTH = Dimensions.get('window').width; 

    const video = useRef();
    const [status, setStatus] = useState({});
    const { getJWT } = useContext(AuthContext);

    const sendVideo = async () => {
        const userToken = await getJWT();
        const formData = new FormData();
        formData.append('video',{
            name: "video_upload",
            type: 'video/mp4',
            uri: route.params.uri,
        })
        // console.log(uri);
        let result = await fetch(`http://${SERVER_IP}:80/uploads`, {
            method : 'POST',
            headers : {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userToken}`, 
            },
            body: formData,
        })
        .then(res => res.json())
        .catch(e => console.log(e));

        console.log(result);        
        console.log('uploading to server')

        let imageNumber = Object.keys(result);
        // Array.splice => imageNumber 는 "image_path" 제외된 숫자로 된 Array
    
        const imagePath = result[imageNumber.splice(-1, 1)];
        console.log(imagePath);

        await FileSystem.makeDirectoryAsync(
            FileSystem.documentDirectory + imagePath
        );

        let images = imageNumber.map(index => (
            FileSystem.downloadAsync(
                `http://${SERVER_IP}:80/images/${imagePath}/${index}`,
                FileSystem.documentDirectory + imagePath + `/${index}.png`
            )
        ));
        images = await Promise.all(images);

        const data = Object.keys(result)
                        .filter(key => (
                            key !== 'image_path'
                        ))
                        .map(key => ({
                            key: POSE_NAME[key],
                            feedback: result[key],
                            image: images[key].uri,
                        }));
        
        console.log(images);
        console.log('Feedback 페이지로 이동');

        navigation.navigate('Feedback', {
            data: data,
        })
    }

    return (
        <View style={styles.container}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'blue',
                }}
            >
                <Video
                    ref={video}
                    style={{
                        flex: 1,
                        width: WIDTH,
                        height: WIDTH * 4 / 3,
                    }}
                    source={{
                        uri: route.params.uri,
                    }}
                    useNativeControls
                    isLooping
                    resizeMode='contain'
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            </View>
            <View style={styles.buttons}>
                {/* <Button
                    title={status.isPlaying ? 'Pause' : 'Play'}
                    onPress={() =>
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                    }
                /> */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#90ee90',
                        borderRadius: 20,
                        width: 100,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => 
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                    }
                >
                    <Text>
                        {status.isPlaying ? 'Pause' : 'Play'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#90ee90',
                        borderRadius: 20,
                        width: 100,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={sendVideo}
                >
                    <Text>
                        분석하기
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

export default VideoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
    },
    // video: {
    //     flex: 1,
    //     alignSelf: 'center',
    //     width: 320,
    //     height: 200,
    // },
    buttons: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
})