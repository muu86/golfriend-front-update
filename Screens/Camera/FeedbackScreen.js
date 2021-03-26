import * as React from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    Image,
    Animated,
    Dimensions,
    Button,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import AuthContext from '../../Context/AuthContext';
import { SERVER_IP } from '../../ServerIp';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const ITEM_SIZE = width * 0.75;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) * 0.5;

const Info = ({ data, inputRange, scrollX }) => {
    const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
    });

    const good = Object.keys(data)
                    .filter(key => (
                        data[key][0] == 2
                    ))
                    .map((key, index) => ({
                        key: index,
                        info: data[key][2],
                    }));

    console.log(good);

    const normal = Object.keys(data)
                    .filter(key => (
                        data[key][0] == 1
                    ))
                    .map((key, index) => ({
                        key: index,
                        info: data[key][2],
                    }));

    const bad = Object.keys(data)
                    .filter(key => (
                        data[key][0] == 0
                    ))
                    .map((key, index) => ({
                        key: index,
                        info: data[key][2],
                    }));
    
    return (
        <ScrollView style={{ marginTop: 10, }}>
            {good && <Animated.FlatList
                data={good}
                keyExtractor={item => item.key.toString()}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                renderItem={({ item }) => (
                    <Animated.Text
                        style={{
                            opacity,
                        }}
                    >
                        <Ionicons name="checkmark-circle" size={32} color="#73E681" />
                        {item.info}
                    </Animated.Text>
                )}
            />}
            {normal && <Animated.FlatList
                data={normal}
                keyExtractor={item => item.key.toString()}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                renderItem={({ item }) => (
                    <Animated.Text
                        style={{
                            opacity,
                        }}
                    >
                        <Ionicons name="caret-up-circle" size={32} color="#FFF500" />
                        {item.info}
                    </Animated.Text>
                )}
            />}
            {bad && <Animated.FlatList
                data={bad}
                keyExtractor={item => item.key.toString()}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                renderItem={({ item }) => (
                    <Animated.Text
                        style={{
                            opacity,
                        }}
                    >
                        <Ionicons name="close-circle" size={32} color="#FF0000" />
                        {item.info}
                    </Animated.Text>
                )}
            />}
        </ScrollView>
    )
}

const Indicator = ({ data, scrollX }) => {
    data = [{ key: 'empty-left' }, ...data, { key: 'empty-right' }];
    const indicatorContainerWidth = width * 0.4
    return (
        <View
            style={{
                 position: 'absolute',
                 alignSelf: 'center',
                //  backgroundColor: 'red',
                 bottom: height * 0.91,
                 width: width,
                 flexDirection: 'row',
                 justifyContent: 'space-between',
            }}
        >
            {data.map((item, index) => {
                const inputRange = [
                    (index - 2) * ITEM_SIZE,
                    (index - 1) * ITEM_SIZE,
                    index * ITEM_SIZE,
                ];
            
                const itemWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [
                        indicatorContainerWidth / 10 * 0.5 ,
                        indicatorContainerWidth / 8 * 1.2 , 
                        indicatorContainerWidth / 10 * 0.5 ],
                    extrapolate: 'extend',
                });

                const itemColor = scrollX.interpolate({
                    inputRange,
                    outputRange: ['#E6E6E6', '#73E681', '#E6E6E6'],
                })

                if (!item.image) {
                    return
                }
                return(
                    <Animated.View 
                        style={{
                         width: itemWidth,
                         height: 5,
                         backgroundColor: itemColor,
                         borderRadius: 4,
                        }}
                        key={index}
                    />
                )
            })}
        </View>
    )
}

const ImageList = ({ data, scrollX }) => {

    data = [{ key: 'empty-left' }, ...data, { key: 'empty-right' }];
    const { getJWT } = React.useContext(AuthContext);
    const token = getJWT();

    return (
        <View style={{ flex: 1 }}>
            <Animated.FlatList
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={item => item.key}
                horizontal
                bounces={false}
                decelerationRate={0}
                // contentContainerStyle={{ alignItems: 'center' }}
                snapToInterval={ITEM_SIZE}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                  )}
                renderItem={({ item, index }) => {
                    if (!item.image) {
                        return <View style={{ width: EMPTY_ITEM_SIZE }} />;
                    }

                    const inputRange = [
                        (index - 2) * ITEM_SIZE,
                        (index - 1) * ITEM_SIZE,
                        index * ITEM_SIZE,
                    ];

                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.9, 1, 0.9],
                        // extrapolate: 'clamp',
                    })

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0, 1, 0],
                    })

                    console.log(item);
                    return (
                        <View style={styles.viewContainer}>
                            <Animated.View
                                style={{
                                    // marginHorizontal: 10,
                                    // marginVertical: 0,
                                    margin: 0,
                                    padding: 0,
                                    // alignItems: 'center',
                                    borderRadius: 30,
                                    // backgroundColor: 'black',
                                    transform: [{ scale }],
                                }}
                            >
                                <Image
                                    style={styles.poseImage}
                                    source={{ 
                                        uri: `http://${SERVER_IP}:80/get-image/${item.image}_${index - 1}`,
                                        headers: {
                                            'Authorization': `Bearer ${token}` 
                                        }
                                    }}
                                />
                            </Animated.View>
                            <Animated.Text
                                style={{
                                    marginTop: 20,
                                    opacity,
                                    fontWeight: 'bold',
                                    fontSize: 30,
                                }}
                            >
                                {item.key}
                                {/* <Info data={item.feedback} scrollX={scrollX} /> */}
                            </Animated.Text>
                            <Info data={item.feedback} inputRange={inputRange} scrollX={scrollX} />
                        </View>    
                    )
                }}
            />
        </View>
    )
}

const FeedbackScreen = ({ navigation, route }) => {
    const { getJWT } = React.useContext(AuthContext);
    const token = getJWT();

    const { data } = route.params;
    // const data = TEST_DATA;
    const scrollX = React.useRef(new Animated.Value(0)).current;

    // 스택 헤더 바에 버튼 추가
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity
                        style={{ 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            marginHorizontal: 10
                        }}
                        onPress={() => console.log('hit')} 
                    >
                        <AntDesign style={{ marginHorizontal: 10 }} name="sharealt" size={20} />
                        <Text style={{ fontSize: 10, }}>공유</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            marginHorizontal: 10
                        }}
                        onPress={() => {
                            Alert.alert(
                                '공유',
                                "동영상을 소셜에 업로드하시겠습니까?",
                                [
                                    {
                                        "text": "확인",
                                        onPress: async () => {
                                            await axios.post(`http://${SERVER_IP}:80/post-video-social/${data[0].image}`, {
                                                    "memo": "first upload",
                                                },
                                                {
                                                headers: {
                                                    'Authorization': `Bearer ${token}`,
                                                }
                                            })
                                            .catch(error => {
                                                // console.log(error);
                                                // if (error.response.status === 401) {
                                                //     await signOut();
                                                // }
                                                if (error.response) {
                                                    // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
                                                    console.log(error.response.data);
                                                    console.log(error.response.status);
                                                    console.log(error.response.headers);
                                                }
                                                else if (error.request) {
                                                    // 요청이 이루어 졌으나 응답을 받지 못했습니다.
                                                    // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
                                                    // Node.js의 http.ClientRequest 인스턴스입니다.
                                                    console.log(error.request);
                                                }
                                                else {
                                                    // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
                                                    console.log('Error', error.message);
                                                }
                                                console.log(error.config);
                                            })
                                        }
                                    }
                                ],
                                {
                                    "cancelable": true,
                                }
                            )
                        }}  
                    >
                        <Entypo name="slideshare" size={20} />
                        <Text style={{ fontSize: 10, }}>소셜업로드</Text>
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <ImageList data={data} scrollX={scrollX} />
            {/* <InfoList data={data} scrollX={scrollX} /> */}
            <Indicator data={data} scrollX={scrollX} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    viewContainer: {
        width: ITEM_SIZE,
        marginTop: 30,
    },
    poseImage: {
        width: '100%',
        height: height * 0.5,
        resizeMode: 'contain',
        // backgroundColor: 'blue',
        borderRadius: 30,
        marginHorizontal: 0,
        paddingHorizontal: 0,
    }
})

export default FeedbackScreen;