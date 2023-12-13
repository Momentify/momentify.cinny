import React, { useState, useEffect } from 'react';

import initMatrix from '../../../client/initMatrix';
import { RoomBaseView } from '../../organisms/room/Room';
import { extractRoomIDFromURL } from '../../utils/RoomGetter';
import LoadingRoom from '../../organisms/loading-room/LoadingRoom';
import cons from '../../../client/state/cons';
import { getSecret } from '../../../client/state/auth';
import { GoBackScreen } from '../auth/Auth';
import { getRoomByRoomAddress } from '../../../util/matrixUtil';

export default function ClientContent() {
  const [roomInfo, setRoomInfo] = useState({
    room: null,
    eventId: null
  });

  const [roomName, setRoomName] = useState(null);
  const [hasDbRecord, setHasDbRecord] = useState(false);

  const { ACCESS_TOKEN } = cons.secretKey;
  const currentAccessToken = getSecret(ACCESS_TOKEN)

  const mx = initMatrix.matrixClient;  
  useEffect(() => {
    const roomIDParam = extractRoomIDFromURL(window.location.href);    
    // const roomIDParam = "!kcfwHVpVfyQIzXGYiu:staging-matrix.momentify.xyz"
    const r = mx.getRoom(roomIDParam);
    getRoomByRoomAddress(currentAccessToken, r?.roomId ?? null).then(res => {
      if (r && res?.room_name) {
        setRoomName(res.room_name)
        setHasDbRecord(true)      
      } else if (r && !res.room_name) {
        setRoomName(r.name)
        setHasDbRecord(false)      
      } else {
        setRoomName(false)      
      }
    })
  }, [mx]);


  useEffect(() => {
    const roomIDParam = extractRoomIDFromURL(window.location.href);    
    const r = mx.getRoom(roomIDParam); //storeRoom
    if (r && roomName) {
      r.name = roomName
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
  }, [mx, roomName]);

  const { room, eventId } = roomInfo;

  if (!room) {
    return <LoadingRoom />;
  }

  if (!hasDbRecord) {
    return <GoBackScreen message='Something went wrong. Please go back and try again'/>;
  }

  return <RoomBaseView room={room} eventId={eventId} data-testid="room-base-view.component" />;
}
