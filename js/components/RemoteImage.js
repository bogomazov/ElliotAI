import React, {Component} from 'react';
import {CachedImage} from "react-native-img-cache";

export default RemoteImage = ({style, source}) => {
  return <CachedImage style={style} source={source}/>
}
