import EventEmitter from 'events';
import * as sdk from 'matrix-js-sdk';
import Olm from '@matrix-org/olm';
// import { logger } from 'matrix-js-sdk/lib/logger';

import { getSecret } from './state/auth';
import cons from './state/cons';
import RoomList from './state/RoomList';
import AccountData from './state/AccountData';
import RoomsInput from './state/RoomsInput';
import Notifications from './state/Notifications';
import { cryptoCallbacks } from './state/secretStorageKeys';
import navigation from './state/navigation';

global.Olm = Olm;

// logger.disableAll();

class InitMatrix extends EventEmitter {
  constructor() {
    super();

    navigation.initMatrix = this;
  }

  async init() {
    if (this.matrixClient) {
      console.warn('Client is already initialized!');
      this.matrixClient.stopClient();
      console.warn('Client stopped');
      // return;
    }

    await this.startClient();
    console.warn('Client started');
    this.setupSync();
    this.listenEvents();
  }

  async startClient() {
    const indexedDBStore = new sdk.IndexedDBStore({
      indexedDB: global.indexedDB,
      localStorage: global.localStorage,
      dbName: 'web-sync-store',
    });
    await indexedDBStore.startup();

    const { ACCESS_TOKEN, DEVICE_ID, USER_ID, BASE_URL } = cons.secretKey;

    const theSecrets = {
      accessToken: 'syt_Y2x3cnFqdDJvMDNkbHY5d2lxcTZrbGFveg_MlhmFvzAeghOHZAldIuX_3qPSTj',
      deviceId: 'WPIVYKNWTO',
      userId: '@clwrqjt2o03dlv9wiqq6klaoz:staging-matrix.momentify.xyz',
      baseUrl: 'https://staging-matrix.momentify.xyz',
    };

    this.matrixClient = sdk.createClient({
      baseUrl: theSecrets.baseUrl,
      accessToken: theSecrets.accessToken,
      userId: theSecrets.userId,
      store: indexedDBStore,
      cryptoStore: new sdk.IndexedDBCryptoStore(global.indexedDB, 'crypto-store'),
      deviceId: theSecrets.deviceId,
      timelineSupport: true,
      cryptoCallbacks,
      verificationMethods: ['m.sas.v1'],
    });

    await this.matrixClient.initCrypto();

    await this.matrixClient.startClient({
      lazyLoadMembers: true,
    });
    this.matrixClient.setGlobalErrorOnUnknownDevices(false);
  }

  isClientRunning() {
    return !!this.matrixClient;
  }

  setupSync() {
    const sync = {
      NULL: () => {
        console.log('NULL state');
      },
      SYNCING: () => {
        console.log('SYNCING state');
      },
      PREPARED: (prevState) => {
        console.log('PREPARED state');
        console.log('Previous state: ', prevState);
        // TODO: remove global.initMatrix at end
        global.initMatrix = this;
        if (prevState === null) {
          this.roomList = new RoomList(this.matrixClient);
          this.accountData = new AccountData(this.roomList);
          this.roomsInput = new RoomsInput(this.matrixClient, this.roomList);
          this.notifications = new Notifications(this.roomList);
          this.emit('init_loading_finished');
          this.notifications._initNoti();
        } else {
          this.notifications?._initNoti();
        }
      },
      RECONNECTING: () => {
        console.log('RECONNECTING state');
      },
      CATCHUP: () => {
        console.log('CATCHUP state');
      },
      ERROR: () => {
        console.log('ERROR state');
      },
      STOPPED: () => {
        console.log('STOPPED state');
      },
    };
    this.matrixClient.on('sync', (state, prevState) => sync[state](prevState));
  }

  listenEvents() {
    this.matrixClient.on('Session.logged_out', async () => {
      this.matrixClient.stopClient();
      await this.matrixClient.clearStores();
      ['cinny_user_id', 'cinny_hs_base_url', 'cinny_device_id', 'cinny_access_token'].forEach(
        (key) => {
          window.localStorage.removeItem(key);
        }
      );
    });
  }

  stopClient() {
    if (this.matrixClient) this.matrixClient.stopClient();
  }

  async logout({ reloadOnLogout = true, clearCinnyKeysOnly = false }) {
    this.matrixClient.stopClient();
    try {
      await this.matrixClient.logout();
    } catch {
      // ignore if failed to logout
    }
    await this.matrixClient.clearStores();

    if (clearCinnyKeysOnly) {
      ['cinny_user_id', 'cinny_hs_base_url', 'cinny_device_id', 'cinny_access_token'].forEach(
        (key) => {
          window.localStorage.removeItem(key);
        }
      );
    } else {
      window.localStorage.clear();
    }

    if (reloadOnLogout) window.location.reload();
  }

  clearCacheAndReload() {
    this.matrixClient.stopClient();
    this.matrixClient.store.deleteAllData().then(() => {
      window.location.reload();
    });
  }
}

const initMatrix = new InitMatrix();

export default initMatrix;
