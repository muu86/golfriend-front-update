import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    Image,
} from 'react-native';

import axios from 'axios';
import { SERVER_IP } from '../../ServerIp';

const Awards = ({ token, badges }) => {
    // const [data, setData] = useState(null); 

    // useEffect(() => {
    //     (async () => {
            
    //         await axios.get(`http://${SERVER_IP}:80/get-my-badges`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         })
    //             .then(res => {
    //                 console.log('badges: ', res.data);
    //                 setData(res.data.badges);
    //                 console.log('setData', res.data.badges);
    //             })
    //             .catch(e => console.log(e));
    //     })();
    // }, []);

    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
        >
            {Object.keys(badges).map((item, index) => {
                // console.log(item)
                return (
                    <Image
                        style={{ width: 70, height: 70, resizeMode: 'contain', }}
                        key={index}
                        source={{
                            uri: `http://${SERVER_IP}:80/get-badge-image/${badges[item]}`,
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            // cache: 'reload'
                        }}
                    />
                );
            })
            }
            
        </ScrollView>
    )
}

export default Awards;
