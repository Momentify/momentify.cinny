/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { ReactNode } from 'react';
import FocusTrap from 'focus-trap-react';
import { isKeyHotkey } from 'is-hotkey';
import { Header, Menu, Scroll, config, Icons, Icon, IconButton } from 'folds';

import * as css from './AutocompleteMenu.css';
import { preventScrollWithArrowKey } from '../../../utils/keyboard';

type AutocompleteMenuProps = {
  requestClose: () => void;
  headerContent: ReactNode;
  children: ReactNode;
};
export function AutocompleteMenu({ headerContent, requestClose, children }: AutocompleteMenuProps) {
  return (
    <div
      className={css.AutocompleteMenuBase}
      data-testid="user-mention-autocomplete_outer-div-focus-trap"
    >
      <div
        className={css.AutocompleteMenuContainer}
        data-testid="user-mention-autocomplete_inner-div-focus-trap"
      >
        <FocusTrap
          active
          focusTrapOptions={{
            initialFocus: false,
            // don't use 'onDeactivate' this when in federation mode
            // since Momentify is running on React 18
            returnFocusOnDeactivate: false,
            clickOutsideDeactivates: true,
            allowOutsideClick: true,
            isKeyForward: (evt: KeyboardEvent) => isKeyHotkey('arrowdown', evt),
            isKeyBackward: (evt: KeyboardEvent) => isKeyHotkey('arrowup', evt),
          }}
        >
          <Menu className={css.AutocompleteMenu} style={{ justifyContent: 'space-between' }}>
            <Header className={css.AutocompleteMenuHeader} size="400">
              {headerContent}
              <IconButton onClick={requestClose}>
                <Icon src={Icons.Cross} />
              </IconButton>
            </Header>
            <Scroll style={{ flexGrow: 1 }} onKeyDown={preventScrollWithArrowKey}>
              <div style={{ padding: config.space.S200 }}>{children}</div>
            </Scroll>
          </Menu>
        </FocusTrap>
      </div>
    </div>
  );
}
