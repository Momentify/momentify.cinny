/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable no-unneeded-ternary */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './RoomViewHeader.scss';
import dayjs from 'dayjs';
import { twemojify } from '../../../util/twemojify';
import { blurOnBubbling } from '../../atoms/button/script';

import initMatrix from '../../../client/initMatrix';
import cons from '../../../client/state/cons';
import navigation from '../../../client/state/navigation';
import {} from '../../../client/action/navigation';

import Text from '../../atoms/text/Text';
import IconButton from '../../atoms/button/IconButton';
import Header, { TitleWrapper } from '../../atoms/header/Header';

import BackArrowIC from '../../../../public/res/ic/outlined/chevron-left.svg';

import { useForceUpdate } from '../../hooks/useForceUpdate';
import BackButton from '../../../momentify/BackButton';
import Avatar from '../../atoms/avatar/Avatar';
import colorMXID from '../../../util/colorMXID';

import BookMark from '../../../../public/BookMark.svg';
import Clock from '../../../../public/Clock.svg';
import Share from '../../../../public/ShareIcon.svg';
import Event from '../../../../public/EventIcon.svg';
import Momentify from '../../../../public/favicon-32x32.png';

function RoomViewHeader({ roomId }) {
  const [, forceUpdate] = useForceUpdate();
  const mx = initMatrix.matrixClient;
  const isDM = initMatrix.roomList.directs.has(roomId);
  const room = mx.getRoom(roomId);
  let avatarSrc = room.getAvatarUrl(mx.baseUrl, 50, 50, 'crop') ?? room.room_avatar;
  avatarSrc = isDM
    ? room.getAvatarFallbackMember()?.getAvatarUrl(mx.baseUrl, 36, 36, 'crop')
    : avatarSrc;
  const roomName = room.name;
  const roomHeaderBtnRef = useRef(null);
  useEffect(() => {
    const settingsToggle = (isVisibile) => {
      const rawIcon = roomHeaderBtnRef.current.lastElementChild;
      rawIcon.style.transform = isVisibile ? 'rotateX(180deg)' : 'rotateX(0deg)';
    };
    navigation.on(cons.events.navigation.ROOM_SETTINGS_TOGGLED, settingsToggle);
    return () => {
      navigation.removeListener(cons.events.navigation.ROOM_SETTINGS_TOGGLED, settingsToggle);
    };
  }, []);

  useEffect(() => {
    const { roomList } = initMatrix;
    const handleProfileUpdate = (rId) => {
      if (roomId !== rId) return;
      forceUpdate();
    };

    roomList.on(cons.events.roomList.ROOM_PROFILE_UPDATED, handleProfileUpdate);
    return () => {
      roomList.removeListener(cons.events.roomList.ROOM_PROFILE_UPDATED, handleProfileUpdate);
    };
  }, [roomId]);

  const [formattedDifference, setFormattedDifference] = useState('');
  const [isPost, setIsPost] = useState(false);

  useEffect(() => {
    const calculateDifference = () => {
      let givenDate = dayjs(room?.artist?.date);
      const now = dayjs();

      let diffInMs = givenDate.diff(now);

      if (room.performance_id != null) {
        givenDate = givenDate.endOf('day');
        // Add 48 hours to the given date
        givenDate = givenDate.add(48, 'hour');
        // Recalculate the difference
        diffInMs = givenDate.diff(now);
      }

      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      let formattedDifference;

      if (diffInHours < 48) {
        const hours = diffInHours;
        const minutes = diffInMinutes % 60;
        setIsPost(true);
        formattedDifference = `${hours}h ${minutes}m`;
      } else {
        const days = diffInDays;
        const hours = diffInHours % 24;
        formattedDifference = `${days}d ${hours}h`;
        setIsPost(false);
      }

      setFormattedDifference(formattedDifference);
    };

    // Initial calculation
    calculateDifference();

    // Set interval to update every minute
    const intervalId = setInterval(calculateDifference, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [room?.artist?.date]);

  const handleClick = async () => {
    const url =
      room.performance_id != null
        ? `/performances/${room.performance_id}`
        : `/events/${room.event.id}`;
    const title = `${room.event.event_name}`;
    const text =
      room.performance_id != null
        ? `Check these moments out - ${room.event.event_name}`
        : `Check this event out - ${room.event.event_name}`;

    // Check if the browser has navigator
    if (!navigator) {
      return;
    }

    // Check if the browser supports sharing links
    if (!navigator?.canShare || !navigator?.share) {
      return;
    }

    // Set the shared files
    const sharedFiles = [];
    const shareData = { title, text, url };
    if (sharedFiles.length) shareData.files = sharedFiles;

    // Check if the data can be shared by the browser
    if (!navigator.canShare(shareData)) {
      return;
    }

    // Share the data using the browser's share API
    await navigator.share(shareData).catch((err) => console.warn(err));
  };
  return (
    <Header>
      {/* <IconButton
        src={BackArrowIC}
        className="room-header__back-btn"
        tooltip="Return to previous page"
        onClick={() => {
          window.history.go(-1);
          initMatrix.stopClient();
        }}
      /> */}
      <BackButton className="room-header__back-btn" style={{ marginRight: '15px' }} />
      <button
        ref={roomHeaderBtnRef}
        className="room-header__btn"
        // onClick={() => toggleRoomSettings()}
        type="button"
        // onMouseUp={(e) => blurOnBubbling(e, '.room-header__btn')}
      >
        {/* <Avatar imageSrc={avatarSrc} text={roomName} bgColor={colorMXID(roomId)} size="small" /> */}
        <TitleWrapper style={{ gap: '16px !important' }}>
          <img
            alt="artist_image"
            src={room?.artist?.image ?? Momentify}
            style={{
              width: 40,
              height: 40,
              borderRadius: room?.artist?.image ? `50%` : null,
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              minWidth: 0, // Ensures the div can shrink
              gap: 4,
            }}
          >
            <text
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#F7F7F7',
                fontFamily: 'Suisse Intl',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                paddingBottom: 6,
              }}
            >
              {room?.artist?.headline_artist ?? 'Momentify Support'}
            </text>
            {room?.artist && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <img
                  alt="event"
                  src={Event}
                  style={{
                    background: 'none',
                    width: 10,
                    height: 10,
                    position: 'relative',
                    bottom: 2,
                  }}
                />
                <text
                  style={{
                    fontSize: 10,
                    fontWeight: 400,
                    color: '#F7F7F7',
                    opacity: 0.6,
                    fontFamily: 'Suisse Intl',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {room.artist.venue_name}
                </text>
              </div>
            )}
          </div>
          {room?.artist && (
            <>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',

                    alignContent: 'center',
                    gap: 8,
                  }}
                >
                  <img alt="bookmark" src={BookMark} style={{ background: 'none' }} />
                  <text
                    style={{
                      fontSize: 10,
                      fontWeight: 400,
                      color: '#79D3BE',
                      whiteSpace: 'nowrap',
                      fontFamily: 'Suisse Intl',
                    }}
                  >
                    {dayjs(room.artist.date).format('ddd D MMM')}
                  </text>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    whiteSpace: 'nowrap',
                    alignContent: 'center',
                    gap: 8,
                  }}
                >
                  <img alt="clock" src={Clock} style={{ background: 'none' }} />
                  <text
                    style={{
                      fontSize: 10,
                      fontWeight: 400,
                      color: '#F7F7F7',
                      opacity: 0.6,
                      fontFamily: 'Suisse Intl',
                    }}
                  >
                    {formattedDifference}
                  </text>
                </div>
              </div>
              <img
                style={{
                  width: '17.27px',
                  height: '20px',
                  background: 'none',
                }}
                alt="share"
                src={Share}
                onClick={() => handleClick()}
              />
            </>
          )}
        </TitleWrapper>
        {/* <RawIcon src={ChevronBottomIC} /> */}
      </button>
      {/* {mx.isRoomEncrypted(roomId) === false && (
        <IconButton
          onClick={() => toggleRoomSettings(tabText.SEARCH)}
          tooltip="Search"
          src={SearchIC}
        />
      )} */}
      {/* <IconButton
        className="room-header__drawer-btn"
        onClick={() => {
          setPeopleDrawer((t) => !t);
        }}
        tooltip="People"
        src={UserIC}
      /> */}
      {/* <IconButton
        className="room-header__members-btn"
        onClick={() => toggleRoomSettings(tabText.MEMBERS)}
        tooltip="Members"
        src={UserIC}
      /> */}
      {/* <IconButton onClick={openRoomOptions} tooltip="Options" src={VerticalMenuIC} /> */}
    </Header>
  );
}
RoomViewHeader.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default RoomViewHeader;
