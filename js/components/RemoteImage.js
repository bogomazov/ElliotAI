import React, {Component} from 'react';

// Keep this wrapper for now, in case we decide to cache images again.
export default RemoteImage = ({style, source}) => {
  return <Image style={style} source={source}/>
}
