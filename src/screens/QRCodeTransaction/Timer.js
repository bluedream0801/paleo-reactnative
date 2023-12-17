import React, { useState, useEffect, useRef } from 'react'
import moment from "moment";

const Timer = ({time, onExpire}) => {
  
  const [validTime, setValidTime] = useState(time);
  const timer = useRef()
  
  useEffect(() => {
    timer.current = setInterval(() => {
      setValidTime((old) => {
        if (old > 0) {
          return old - 1;
        } else {
          clearInterval(timer.current);
          onExpire();
          return 0;
        }
      });       
    }, 1000);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    }
  }, []);
  
  return (
    <>
      {moment(validTime * 1000).format("mm:ss")}
    </>
  )
}

export default Timer
