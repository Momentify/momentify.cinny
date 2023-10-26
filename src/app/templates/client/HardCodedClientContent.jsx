import React, { useState, useEffect } from 'react';

import initMatrix from '../../../client/initMatrix';
import { RoomBaseView } from '../../organisms/room/Room';
import Welcome from '../../organisms/welcome/Welcome';

export default function ClientContent() {
  const HARDCODED_ROOM_ID = '!kYMqhwuFgsgHDtLxcN:matrix.mbot.gg';

  const [roomInfo, setRoomInfo] = useState({
    room: null,
    eventId: null
  });

  const mx = initMatrix.matrixClient;

  useEffect(() => {
    const r = mx.getRoom(HARDCODED_ROOM_ID);
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
    return <Welcome />;
  }

  return <RoomBaseView room={room} eventId={eventId} data-testid="room-base-view.component" />;
}
