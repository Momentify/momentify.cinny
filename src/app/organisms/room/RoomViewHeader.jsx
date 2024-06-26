import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './RoomViewHeader.scss';

import { twemojify } from '../../../util/twemojify';
import { blurOnBubbling } from '../../atoms/button/script';

import initMatrix from '../../../client/initMatrix';
import cons from '../../../client/state/cons';
import navigation from '../../../client/state/navigation';
import {
} from '../../../client/action/navigation';

import Text from '../../atoms/text/Text';
import IconButton from '../../atoms/button/IconButton';
import Header, { TitleWrapper } from '../../atoms/header/Header';

import BackArrowIC from '../../../../public/res/ic/outlined/chevron-left.svg';

import { useForceUpdate } from '../../hooks/useForceUpdate';
import BackButton from '../../../momentify/BackButton';
import Avatar from '../../atoms/avatar/Avatar';
import colorMXID from '../../../util/colorMXID';

function RoomViewHeader({ roomId }) {
  const [, forceUpdate] = useForceUpdate();
  const mx = initMatrix.matrixClient;
  const isDM = initMatrix.roomList.directs.has(roomId);
  const room = mx.getRoom(roomId);
  let avatarSrc = room.getAvatarUrl(mx.baseUrl, 50, 50, 'crop') ??  room.room_avatar
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
      <BackButton className="room-header__back-btn" style={{marginRight: "15px"}}/>
      <button
        ref={roomHeaderBtnRef}
        className="room-header__btn"
        // onClick={() => toggleRoomSettings()}
        type="button"
        onMouseUp={(e) => blurOnBubbling(e, '.room-header__btn')}
      >
        {/* <Avatar imageSrc={avatarSrc} text={roomName} bgColor={colorMXID(roomId)} size="small" /> */}
        <TitleWrapper>
          <Text variant="h2" weight="medium" primary>
            {twemojify(roomName)}
          </Text>
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
  roomId: PropTypes.string.isRequired
};

export default RoomViewHeader;
