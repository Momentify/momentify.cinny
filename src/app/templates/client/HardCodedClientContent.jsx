import React, { useState, useEffect } from 'react';

import initMatrix from '../../../client/initMatrix';
import { RoomBaseView } from '../../organisms/room/Room';
import { extractRoomIDFromURL } from '../../utils/RoomGetter';
import LoadingRoom from '../../organisms/loading-room/LoadingRoom';

export default function ClientContent() {
  const [roomInfo, setRoomInfo] = useState({
    room: null,
    eventId: null
  });

  const mx = initMatrix.matrixClient;  
  useEffect(() => {
    const roomID = extractRoomIDFromURL(window.location.href);
    const r = mx.getRoom(roomID);
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
  }, [mx]);

  const { room, eventId } = roomInfo;

  if (!room) {
    return <LoadingRoom />;
  }

  return <RoomBaseView room={room} eventId={eventId} data-testid="room-base-view.component" />;
}
