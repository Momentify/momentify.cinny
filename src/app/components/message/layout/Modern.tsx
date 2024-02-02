import React, { ReactNode } from 'react';
import { Box, as } from 'folds';
import * as css from './layout.css';

type ModernLayoutProps = {
  before?: ReactNode;
};

export const ModernLayout = as<'div', ModernLayoutProps>(({ before, children, ...props }, ref) => (
  <Box gap="300" {...props} ref={ref}>
    <Box className={css.ModernBefore} shrink="No">
      {before}
    </Box>
    <div className={`room_message_modern`}>
      {children}
    </div>
  </Box>
));
