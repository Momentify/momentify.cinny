import React from 'react';
import { Avatar, AvatarFallback, AvatarImage, Box, Text, as, color } from 'folds';
import { Room } from 'matrix-js-sdk';
import { useStateEvent } from '../../hooks/useStateEvent';
import { StateEvent } from '../../../types/matrix/room';
import { getMemberDisplayName, getStateEvent } from '../../utils/room';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import { getMxIdLocalPart } from '../../utils/matrix';
import { timeDayMonthYear, timeHourMinute } from '../../utils/time';

export type RoomIntroProps = {
  room: Room;
};

export const RoomIntro = as<'div', RoomIntroProps>(({ room, ...props }, ref) => {
  const mx = useMatrixClient();
  const createEvent = getStateEvent(room, StateEvent.RoomCreate);
  const avatarEvent = useStateEvent(room, StateEvent.RoomAvatar);
  const nameEvent = useStateEvent(room, StateEvent.RoomName);
  const topicEvent = useStateEvent(room, StateEvent.RoomTopic);

  const ts = createEvent?.getTs();
  const creatorId = createEvent?.getSender();
  const creatorName =
    creatorId && (getMemberDisplayName(room, creatorId) ?? getMxIdLocalPart(creatorId));
  const avatarMxc = (avatarEvent?.getContent().url as string) || undefined;
  const avatarHttpUrl = avatarMxc ? mx.mxcUrlToHttp(avatarMxc) : undefined;
  const name = (nameEvent?.getContent().name || room.name) as string;
  const topic = (topicEvent?.getContent().topic as string) || undefined;

  return (
    <Box direction="Column" grow="Yes" gap="500" {...props} ref={ref}>
      <Box>
        <Avatar size="500">
          {avatarHttpUrl ? (
            <AvatarImage src={avatarHttpUrl} alt={name} />
          ) : (
            <AvatarFallback
              style={{
                backgroundColor: color.SurfaceVariant.Container,
                color: color.SurfaceVariant.OnContainer,
              }}
            >
              <Text size="H2">{name[0]}</Text>
            </AvatarFallback>
          )}
        </Avatar>
      </Box>
      <Box direction="Column" gap="300">
        <Box direction="Column" gap="100">
          {/* <Text size="H3" priority="500">
            {name}
          </Text> */}
          <Text size="T400" priority="400">
            {typeof topic === 'string' ? topic : 'This is the beginning of conversation.'}
          </Text>
          {creatorName && ts && (
            <Text size="T200" priority="300">
              {/* {'Created by '}
              <b>@{creatorName}</b> */}
              {`Created on ${timeDayMonthYear(ts)} ${timeHourMinute(ts)}`}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
});
