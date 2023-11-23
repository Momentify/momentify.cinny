import React, { useState, useEffect } from 'react';

import initMatrix from '../../../client/initMatrix';
import { RoomBaseView } from '../../organisms/room/Room';
import Welcome from '../../organisms/welcome/Welcome';

const HARDCODED_ROOM_ID = '!kYMqhwuFgsgHDtLxcN:matrix.mbot.gg';
const CONFIGURABLE_TEST_ROOM = import.meta.env.VITE_SUPPORT_ROOM_ID;

export default function ClientContent() {
  const [roomInfo, setRoomInfo] = useState({
    room: null,
    eventId: null
  });
  // let currentRoomIdfromLocalStorage = localStorage.getItem("current_room_address") ?? CONFIGURABLE_TEST_ROOM
  const [currentRoomID, setCurrentRoomID] = useState(localStorage.getItem("current_room_address") ?? CONFIGURABLE_TEST_ROOM)
  // const mx = initMatrix.matrixClient;  
  
  useEffect(() => {
    // console.log({roomId})
    // const r = mx.getRoom(currentRoomID);
    console.log({currentRoomID})
    const r = mx.getRoom(CONFIGURABLE_TEST_ROOM ?? HARDCODED_ROOM_ID);
    // const r = mx.getRoom(roomId)
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
