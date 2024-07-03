import React, { useState, useEffect } from 'react';

import initMatrix from '../../../client/initMatrix';
import cons from '../../../client/state/cons';
import navigation from '../../../client/state/navigation';
import { openNavigation, selectRoom } from '../../../client/action/navigation';

import Welcome from '../../organisms/loading-room/LoadingRoom';
// import Welcome from '../../organisms/welcome/Welcome';
import { RoomBaseView } from '../../organisms/room/Room';
import * as roomActions from '../../../client/action/room';
import { extractRoomIDFromURL, extractRoomIDFromURLWithoutParam } from '../../utils/RoomGetter';
import ErrorPage from '../../../momentify/ErrorPage';
import { getRoomByRoomAddress, setJoinedRoom } from '../../../util/matrixUtil';
import { getSecret } from '../../../client/state/auth';

export function ClientContent() {
  const [roomInfo, setRoomInfo] = useState({
    room: null,
    eventId: null,
  });

  const [hasDbRecord, setHasDbRecord] = useState(true);
  const [hasRoomInCache, setHasRoomInCache] = useState(true);
  const mx = initMatrix.matrixClient;

  useEffect(() => {
    const roomIDParam =
      extractRoomIDFromURL(window.location.href) ??
      extractRoomIDFromURLWithoutParam(window.location.href) ??
      '!kmqjpSwcyKMCnnpJFQ:staging-matrix.momentify.xyz';

    if (!roomIDParam) {
      setHasDbRecord(false);
      return;
    }

    // if (!hasRoomInCache) {
    //   return;
    // }

    getRoomByRoomAddress(
      'syt_Y2x3cnFqdDJvMDNkbHY5d2lxcTZrbGFveg_MlhmFvzAeghOHZAldIuX_3qPSTj',
      roomIDParam ?? null
    )
      .then((dbRoom) => {
        console.log(dbRoom);
        if (!dbRoom?.room_address || !dbRoom?.room_name) {
          setHasDbRecord(false);
          return;
        }

        setJoinedRoom(
          dbRoom.room_address,
          '@clwrqjt2o03dlv9wiqq6klaoz:staging-matrix.momentify.xyz'
        )
          .then((res) => {
            console.log('setJoinedRoomSuccess', res);
          })
          .catch((err) => {
            console.error('setJoinedRoomError', err);
          });
        roomActions
          .join(dbRoom.room_address)
          .then((res) => {
            selectRoom(res);
          })
          .catch((err) => {
            setHasDbRecord(false);
            console.error('roomActions.join.error', err);
          });
      })
      .catch((err) => {
        setHasDbRecord(false);
        console.error('getRoomByRoomAddress.error', err);
      });
  }, [hasRoomInCache]);

  useEffect(() => {
    const handleRoomSelected = (rId, pRoomId, eId) => {
      roomInfo.roomTimeline?.removeInternalListeners();
      const r = mx.getRoom(rId);

      if (!r) {
        setHasRoomInCache(false);
        setRoomInfo({
          room: null,
          eventId: null,
        });
        return;
      }
      getRoomByRoomAddress(
        'syt_Y2x3cnFqdDJvMDNkbHY5d2lxcTZrbGFveg_MlhmFvzAeghOHZAldIuX_3qPSTj',
        r?.roomId ?? null
      )
        .then((res) => {
          // console.log('trigger', res) // Reminder: don't remove this console.log
          if (r && !!res?.room_name) {
            r.room_avatar = res?.event_image ?? null;
            r.name = res?.room_event_name ?? res.room_name ?? r.name;
            setRoomInfo({
              room: r,
              eventId: eId ?? null,
            });
          } else if (r && !res?.room_name) {
            r.room_avatar = res?.event_image ?? null;
            setRoomInfo({
              room: r,
              eventId: eId ?? null,
            });
          } else {
            setRoomInfo({
              room: null,
              eventId: null,
            });
          }
        })
        .catch((err) => {
          setHasDbRecord(false);
          console.error('getRoomByRoomAddress.error', err);
        });
    };

    navigation.on(cons.events.navigation.ROOM_SELECTED, handleRoomSelected);
    return () => {
      navigation.removeListener(cons.events.navigation.ROOM_SELECTED, handleRoomSelected);
    };
  }, [roomInfo, mx]);

  const { room, eventId } = roomInfo;

  if (!hasDbRecord) {
    return <ErrorPage errorMessage={'Something went wrong. Please go back and try again.'} />;
  }

  if (!room) {
    setTimeout(() => openNavigation());
    return <Welcome />;
  }

  return <RoomBaseView room={room} eventId={eventId} />;
}
