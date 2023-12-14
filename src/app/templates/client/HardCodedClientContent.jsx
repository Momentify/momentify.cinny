import React, { useState, useEffect } from 'react';

import initMatrix from '../../../client/initMatrix';
import { RoomBaseView } from '../../organisms/room/Room';
import { extractRoomIDFromURL } from '../../utils/RoomGetter';
import LoadingRoom from '../../organisms/loading-room/LoadingRoom';
import cons from '../../../client/state/cons';
import { getSecret } from '../../../client/state/auth';
import { GoBackScreen } from '../auth/Auth';
import { getRoomByRoomAddress } from '../../../util/matrixUtil';
import { selectRoom } from '../../../client/action/navigation';
import navigation from '../../../client/state/navigation';
import * as roomActions from '../../../client/action/room';
export default function ClientContent() {
  const [roomInfo, setRoomInfo] = useState({
    room: null,
    eventId: null
  });

  // const [roomName, setRoomName] = useState(null);
  // const [hasDbRecord, setHasDbRecord] = useState(false);
  const [hasInitialRoomLoaded, setHasInitialRoomLoaded] = useState(false);
  // const [hasFinalRoomLoaded, setHasFinalRoomLoaded] = useState(false);

  // const { ACCESS_TOKEN } = cons.secretKey;
  // const currentAccessToken = getSecret(ACCESS_TOKEN)

  const mx = initMatrix.matrixClient; 
  useEffect(() => {
    const roomIDParam = "!kcfwHVpVfyQIzXGYiu:staging-matrix.momentify.xyz"
    const r = mx.getRoom(roomIDParam); //storeRoom
    if (r) {      
      setRoomInfo({        
        room: r,
        eventId: null
      });
    } else {
      setRoomInfo({
        room: null,
        eventId: null
      });
    }

    setHasInitialRoomLoaded(true)    
  }, [mx]);
 
  // useEffect(() => {
  //   const roomIDParam = extractRoomIDFromURL(window.location.href);
  //   // const roomIDParam = "!kcfwHVpVfyQIzXGYiu:staging-matrix.momentify.xyz"
  //   const r = mx.getRoom(roomIDParam);
  //   console.log('resultroom', r)
  //   getRoomByRoomAddress(currentAccessToken, r?.roomId ?? null).then(res => {
  //     if (r && res?.room_name) {
  //       setRoomName(res.room_name)
  //       setHasDbRecord(true)      
  //     } else if (r && !res?.room_name) {
  //       setRoomName(r.name)
  //       setHasDbRecord(false)      
  //     } else {
  //       setRoomName(false)      
  //     }      
  //   })
  // }, [hasInitialRoomLoaded]);

  // useEffect(() => {
  //   const roomIDParam = extractRoomIDFromURL(window.location.href);    
  //   const r = mx.getRoom(roomIDParam); //storeRoom
  //   if (r && roomName) {
  //     r.name = roomName
  //     setRoomInfo({        
  //       room: r,
  //       eventId: null
  //     });
  //   } else {
  //     setRoomInfo({
  //       room: null,
  //       eventId: null
  //     });
  //   }
  //   setHasFinalRoomLoaded(true)
  // }, [roomName]);

  useEffect(() => {
    if(!hasInitialRoomLoaded) return
    const roomIDParam2 = extractRoomIDFromURL(window.location.href);
    // if(!roomIDParam2) {
    //   return
    // }
    const br = mx.getRoom(roomIDParam2);    
    // console.log('================@@@@@@@@@@bongkey', br?.room)
    const handleRoomSelected = (rId, pRoomId, eId) => {
      roomInfo.roomTimeline?.removeInternalListeners();      
      const r2 = mx.getRoom(rId); //storeRoom
      if (r2) {      
        setRoomInfo({        
          room: r2,
          eventId: null
        });
      } else {
        setRoomInfo({
          room: null,
          eventId: null
        });
      }
    };    
    navigation.on(cons.events.navigation.ROOM_SELECTED, handleRoomSelected);
    // if(!!br?.room && roomIDParam2 != br?.room?.name) {
      
    // }
    roomActions.join('!hNaJOyaiUsxMQJxgCu:staging-matrix.momentify.xyz').then(res => {
      // console.log('resked',res)
      selectRoom(res);
    })
    // roomActions.createRoom({
    //   name: 'test room #03',
    //   joinRule: 'public',
    //   isEncrypted: false,      
    //   isSpace: false      
    // }).then(res => {
    //   console.log('boro', res)
    //   const roomID = res.room_id
    //   // selectRoom(roomID);
    // }) 
    // selectRoom(`!qLEGAxHxMvKMyTiwWE:staging-matrix.momentify.xyz`)   
    return () => {
      navigation.removeListener(cons.events.navigation.ROOM_SELECTED, handleRoomSelected);
    };
  }, [hasInitialRoomLoaded])

  const { room, eventId } = roomInfo;

  if (!room) {
    return <LoadingRoom />;
  }

  // if (!hasDbRecord) {
  //   return <GoBackScreen message='Something went wrong. Please go back and try again'/>;
  // }

  return <RoomBaseView room={room} eventId={eventId} data-testid="room-base-view.component" />;
}
