import React, { useState, useEffect } from 'react';

import initMatrix from '../../../client/initMatrix';
import cons from '../../../client/state/cons';
import navigation from '../../../client/state/navigation';
import { openNavigation, selectRoom } from '../../../client/action/navigation';

import Welcome from '../../organisms/loading-room/LoadingRoom';
// import Welcome from '../../organisms/welcome/Welcome';
import { RoomBaseView } from '../../organisms/room/Room';
import * as roomActions from '../../../client/action/room';
import { extractRoomIDFromURL } from '../../utils/RoomGetter';
import ErrorPage from '../../../momentify/ErrorPage';
import { getRoomByRoomAddress } from '../../../util/matrixUtil';
import { getSecret } from '../../../client/state/auth';
import { getStateEvent } from '../../utils/room';
import { StateEvent } from '../../../types/matrix/room';

export function ClientContent() {
  const [roomInfo, setRoomInfo] = useState({
    room: null,
    eventId: null,
  });

  const [hasDbRecord, setHasDbRecord] = useState(true);
  const mx = initMatrix.matrixClient;
  
  useEffect(() => {
    const handleRoomSelected = (rId, pRoomId, eId) => {
      roomInfo.roomTimeline?.removeInternalListeners();
      const r = mx.getRoom(rId);
      getRoomByRoomAddress(getSecret(cons.secretKey.ACCESS_TOKEN), r?.roomId ?? null).then(res => {
        r.room_avatar = res?.event_image ?? null
        if (r && !!res?.room_name) {
          r.name = res?.room_event_name ?? res.room_name
          setRoomInfo({
            room: r,
            eventId: eId ?? null,
          });
          setHasDbRecord(true)      
        } else if (r && !res?.room_name) {
          setRoomInfo({
            room: r,
            eventId: eId ?? null,
          });
          setHasDbRecord(false)      
        } else {
          setRoomInfo({
            room: null,
            eventId: null,
          });
          setHasDbRecord(false) 
        }      
      })
    };

    navigation.on(cons.events.navigation.ROOM_SELECTED, handleRoomSelected);
    return () => {
      navigation.removeListener(cons.events.navigation.ROOM_SELECTED, handleRoomSelected);
    };
  }, [roomInfo, mx]);

  useEffect(() => {
    const roomIDParam = extractRoomIDFromURL(window.location.href) ?? '!kcfwHVpVfyQIzXGYiu:staging-matrix.momentify.xyz';
    setTimeout(() => {
      getRoomByRoomAddress(getSecret(cons.secretKey.ACCESS_TOKEN), roomIDParam ?? null).then(dbRoom => {
       if(!!dbRoom.room_address) {
        setHasDbRecord(true)
        roomActions.join(dbRoom.room_address).then(res => {
          selectRoom(res);
        }).catch(err => {
          setHasDbRecord(false)
          console.error('roomActions.join.error', err)
        })
       } else {
        setHasDbRecord(false)
       }
      })
    })
  }, [])

  const { room, eventId } = roomInfo;

  if(!hasDbRecord) {
    return <ErrorPage errorMessage={"Something went wrong. Please go back and try again."}/>;
  }

  if (!room) {
    setTimeout(() => openNavigation());
    return <Welcome />;    
  }

  return <RoomBaseView room={room} eventId={eventId} />;
}
