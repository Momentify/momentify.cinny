import React, { ReactNode } from 'react';
import { Box, as } from 'folds';
import * as css from './layout.css';

type BubbleLayoutProps = {
  before?: ReactNode;
};

export const BubbleLayout = as<'div', BubbleLayoutProps>(({ before, children, ...props }, ref) => (
  <Box gap="300" {...props} ref={ref} className={'room_message_zed'}>
    <Box className={css.BubbleBefore} shrink="No">
      {before}
    </Box>
    <Box className={`${css.BubbleContent} room_message_den`} direction="Column">
      {children}
    </Box>
  </Box>
));
