import React, { useRef } from 'react';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

export default function TapGesture(props) {
  const doubleTapRef = useRef(null);

  const onSingleTapEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      if (props.onSingleTap) {
        props.onSingleTap();
      }
    }
  };

  const onDoubleTapEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      if (props.onDoubleTap) {
        props.onDoubleTap();
      }
    }
  };

  return (
    <>
      <TapGestureHandler
        onHandlerStateChange={onSingleTapEvent}
        waitFor={doubleTapRef}
      >
        <TapGestureHandler
          ref={doubleTapRef}
          onHandlerStateChange={onDoubleTapEvent}
          numberOfTaps={2}
        >
          {props.children}
        </TapGestureHandler>
      </TapGestureHandler>
    </>
  );
}