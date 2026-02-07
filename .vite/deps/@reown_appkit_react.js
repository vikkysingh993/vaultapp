import {
  AppKitAccountButton,
  AppKitButton,
  AppKitConnectButton,
  AppKitNetworkButton
} from "./chunk-ANJ5LSRI.js";
import "./chunk-45V2BKLM.js";
import "./chunk-FCWMOQ6W.js";
import "./chunk-DZBKQJCW.js";
import "./chunk-IQEGP7WR.js";
import "./chunk-K2CKQ4TQ.js";
import "./chunk-HNDOXZVY.js";
import "./chunk-22QF7ZJZ.js";
import "./chunk-FVOYYMZY.js";
import "./chunk-MUJKQAU7.js";
import "./chunk-7D6WCINE.js";
import "./chunk-WQTP7ZZW.js";
import "./chunk-WS4IFUSH.js";
import "./chunk-7S4WWYYJ.js";
import "./chunk-6QOWD2HI.js";
import "./chunk-74OBZ4CW.js";
import "./chunk-UERTVBEI.js";
import "./chunk-RNHS7EQ7.js";
import "./chunk-MDRLPCB5.js";
import "./chunk-E5T743KA.js";
import "./chunk-AVD2HZ2K.js";
import "./chunk-HNB35IZC.js";
import "./chunk-REN4SLAU.js";
import "./chunk-LD4QFRZW.js";
import "./chunk-6SGY26QN.js";
import "./chunk-FS3CSUOV.js";
import "./chunk-EVS7TBFE.js";
import "./chunk-MGQGXLZU.js";
import "./chunk-CGXHVTOC.js";
import "./chunk-DWKMSPPV.js";
import "./chunk-PDGTLJDS.js";
import "./chunk-5VASF4MU.js";
import "./chunk-MH3UODJY.js";
import "./chunk-NLKUGHV7.js";
import {
  require_react
} from "./chunk-OKOAXSIJ.js";
import {
  AppKit,
  PACKAGE_VERSION,
  WcConstantsUtil
} from "./chunk-MUV5BU6L.js";
import "./chunk-JSP6JFXR.js";
import {
  AlertController
} from "./chunk-HTESJ4GB.js";
import "./chunk-6S4CJ3EG.js";
import {
  ApiController,
  AssetController,
  AssetUtil,
  ChainController,
  ConnectionController,
  ConnectionControllerUtil,
  ConnectorController,
  ConnectorControllerUtil,
  ConnectorUtil,
  CoreHelperUtil,
  OptionsController,
  ProviderController,
  PublicStateController,
  StorageUtil,
  WalletUtil,
  affectedToPathList,
  createProxy,
  isChanged,
  snapshot,
  subscribe
} from "./chunk-3D2UJM57.js";
import "./chunk-KXWSMVTS.js";
import "./chunk-V5F6BRPH.js";
import {
  ConstantsUtil
} from "./chunk-F2Y5DB6I.js";
import "./chunk-Y5BD77IA.js";
import "./chunk-5LNC5VWT.js";
import "./chunk-VFXVZLDY.js";
import "./chunk-W57XQINX.js";
import {
  __toESM
} from "./chunk-OS7ZSSJM.js";

// node_modules/@reown/appkit-controllers/dist/esm/exports/react.js
var import_react2 = __toESM(require_react());

// node_modules/valtio/esm/react.mjs
var import_react = __toESM(require_react(), 1);
var useAffectedDebugValue = (state, affected) => {
  const pathList = (0, import_react.useRef)(void 0);
  (0, import_react.useEffect)(() => {
    pathList.current = affectedToPathList(state, affected, true);
  });
  (0, import_react.useDebugValue)(pathList.current);
};
var condUseAffectedDebugValue = useAffectedDebugValue;
var targetCache = /* @__PURE__ */ new WeakMap();
function useSnapshot(proxyObject, options) {
  const notifyInSync = options == null ? void 0 : options.sync;
  const affected = (0, import_react.useMemo)(
    () => proxyObject && /* @__PURE__ */ new WeakMap(),
    [proxyObject]
  );
  const lastSnapshot = (0, import_react.useRef)(void 0);
  let inRender = true;
  const currSnapshot = (0, import_react.useSyncExternalStore)(
    (0, import_react.useCallback)(
      (callback) => {
        const unsub = subscribe(proxyObject, callback, notifyInSync);
        callback();
        return unsub;
      },
      [proxyObject, notifyInSync]
    ),
    () => {
      const nextSnapshot = snapshot(proxyObject);
      try {
        if (!inRender && lastSnapshot.current && !isChanged(
          lastSnapshot.current,
          nextSnapshot,
          affected,
          /* @__PURE__ */ new WeakMap()
        )) {
          return lastSnapshot.current;
        }
      } catch (e) {
      }
      return nextSnapshot;
    },
    () => snapshot(proxyObject)
  );
  inRender = false;
  (0, import_react.useLayoutEffect)(() => {
    lastSnapshot.current = currSnapshot;
  });
  if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production") {
    condUseAffectedDebugValue(currSnapshot, affected);
  }
  const proxyCache = (0, import_react.useMemo)(() => /* @__PURE__ */ new WeakMap(), []);
  return createProxy(currSnapshot, affected, proxyCache, targetCache);
}

// node_modules/@reown/appkit-controllers/dist/esm/src/utils/ApiControllerUtil.js
var ApiControllerUtil = {
  /**
   * Finds a wallet by ID across all wallet arrays (wallets, recommended, featured, search, etc.)
   * This is useful when a wallet might be in different arrays depending on the context
   */
  getWalletById(walletId) {
    if (!walletId) {
      return void 0;
    }
    const { state } = ApiController;
    const searchArrays = [
      state.search,
      state.recommended,
      state.allRecommended,
      state.featured,
      state.allFeatured,
      state.wallets,
      state.filteredWallets,
      state.explorerWallets,
      state.explorerFilteredWallets
    ];
    for (const walletArray of searchArrays) {
      const wallet = walletArray.find((w) => w.id === walletId);
      if (wallet) {
        return wallet;
      }
    }
    return void 0;
  }
};

// node_modules/@reown/appkit-controllers/dist/esm/src/utils/ConnectUtil.js
var ConnectUtil = {
  /**
   * Maps the initial connect view wallets into WalletItems. Includes WalletConnect wallet and injected wallets. If user doesn't have any injected wallets, it'll fill the list with most ranked WalletConnect wallets.
   * @returns The WalletItems for the initial connect view.
   */
  getInitialWallets() {
    return ConnectorUtil.connectorList().map((connector) => {
      if (connector.kind === "connector") {
        return this.mapConnectorToWalletItem(connector.connector, connector.subtype);
      } else if (connector.kind === "wallet") {
        return this.mapWalletToWalletItem(connector.wallet);
      }
      return null;
    }).filter(Boolean);
  },
  /**
   * Maps the WalletGuide explorer wallets to WalletItems including search results.
   * @returns The WalletItems for the WalletGuide explorer wallets.
   */
  getWalletConnectWallets(wcAllWallets, wcSearchWallets) {
    if (wcSearchWallets.length > 0) {
      return wcSearchWallets.map(ConnectUtil.mapWalletToWalletItem);
    }
    return WalletUtil.getWalletConnectWallets(wcAllWallets).map(ConnectUtil.mapWalletToWalletItem);
  },
  /**
   * Maps the connector to a WalletItem.
   * @param connector - The connector to map to a WalletItem.
   * @param subType - The subtype of the connector.
   * @returns The WalletItem for the connector.
   */
  mapConnectorToWalletItem(connector, subType) {
    var _a, _b;
    const hasMultipleConnectors = (_a = connector.connectors) == null ? void 0 : _a.length;
    const connectors = hasMultipleConnectors ? ((_b = connector.connectors) == null ? void 0 : _b.map((c) => ({
      id: c.id,
      chain: c.chain,
      chainImageUrl: AssetUtil.getChainNamespaceImageUrl(c.chain)
    }))) || [] : [
      {
        id: connector.id,
        chain: connector.chain,
        chainImageUrl: AssetUtil.getChainNamespaceImageUrl(connector.chain)
      }
    ];
    return {
      id: connector.id,
      connectors: subType === "walletConnect" ? [] : connectors,
      name: connector.name,
      imageUrl: connector.imageUrl || AssetUtil.getAssetImageUrl(connector.imageId),
      isInjected: subType !== "walletConnect",
      isRecent: false,
      walletInfo: {}
    };
  },
  /**
   * Maps the WalletGuide explorer wallet to a WalletItem.
   * @param w - The WalletGuide explorer wallet.
   * @returns The WalletItem for the WalletGuide explorer wallet.
   */
  mapWalletToWalletItem(w) {
    return {
      id: w.id,
      connectors: [],
      name: w.name,
      imageUrl: AssetUtil.getWalletImageUrl(w.image_id),
      isInjected: false,
      isRecent: false,
      walletInfo: {
        description: w.description,
        supportedChains: w.chains,
        website: w.homepage,
        installationLinks: {
          appStore: w.app_store,
          playStore: w.play_store,
          chromeStore: w.chrome_store,
          desktopLink: w.desktop_link
        },
        deepLink: w.mobile_link,
        isCertified: w.badge_type === "certified"
      }
    };
  }
};

// node_modules/@reown/appkit-controllers/dist/esm/exports/react.js
function useAppKitProvider(chainNamespace) {
  const { providers, providerIds } = useSnapshot(ProviderController.state);
  const walletProvider = providers[chainNamespace];
  const walletProviderType = providerIds[chainNamespace];
  return {
    walletProvider,
    walletProviderType
  };
}
function useAppKitNetworkCore() {
  const { activeCaipNetwork } = useSnapshot(ChainController.state);
  return {
    caipNetwork: activeCaipNetwork,
    chainId: activeCaipNetwork == null ? void 0 : activeCaipNetwork.id,
    caipNetworkId: activeCaipNetwork == null ? void 0 : activeCaipNetwork.caipNetworkId
  };
}
function useAppKitAccount(options) {
  var _a;
  const state = useSnapshot(ChainController.state);
  const { activeConnectorIds } = useSnapshot(ConnectorController.state);
  const chainNamespace = (options == null ? void 0 : options.namespace) || state.activeChain;
  if (!chainNamespace) {
    return {
      allAccounts: [],
      address: void 0,
      caipAddress: void 0,
      status: void 0,
      isConnected: false,
      embeddedWalletInfo: void 0
    };
  }
  const chainAccountState = (_a = state.chains.get(chainNamespace)) == null ? void 0 : _a.accountState;
  const authConnector = ConnectorController.getAuthConnector(chainNamespace);
  const activeConnectorId = activeConnectorIds[chainNamespace];
  const connections = ConnectionController.getConnections(chainNamespace);
  const allAccounts = connections.flatMap((connection) => connection.accounts.map(({ address, type, publicKey }) => CoreHelperUtil.createAccount(chainNamespace, address, type || "eoa", publicKey)));
  return {
    allAccounts,
    caipAddress: chainAccountState == null ? void 0 : chainAccountState.caipAddress,
    address: CoreHelperUtil.getPlainAddress(chainAccountState == null ? void 0 : chainAccountState.caipAddress),
    isConnected: Boolean(chainAccountState == null ? void 0 : chainAccountState.caipAddress),
    status: chainAccountState == null ? void 0 : chainAccountState.status,
    embeddedWalletInfo: authConnector && activeConnectorId === ConstantsUtil.CONNECTOR_ID.AUTH ? {
      user: (chainAccountState == null ? void 0 : chainAccountState.user) ? {
        ...chainAccountState.user,
        /*
         * Getting the username from the chain controller works well for social logins,
         * but Farcaster uses a different connection flow and doesn’t emit the username via events.
         * Since the username is stored in local storage before the chain controller updates,
         * it’s safe to use the local storage value here.
         */
        username: StorageUtil.getConnectedSocialUsername()
      } : void 0,
      authProvider: (chainAccountState == null ? void 0 : chainAccountState.socialProvider) || "email",
      accountType: chainAccountState == null ? void 0 : chainAccountState.preferredAccountType,
      isSmartAccountDeployed: Boolean(chainAccountState == null ? void 0 : chainAccountState.smartAccountDeployed)
    } : void 0
  };
}
function useDisconnect() {
  async function disconnect(props) {
    await ConnectionController.disconnect(props);
  }
  return { disconnect };
}
function useAppKitConnections(namespace) {
  useSnapshot(ConnectionController.state);
  useSnapshot(ConnectorController.state);
  useSnapshot(AssetController.state);
  const { activeChain } = useSnapshot(ChainController.state);
  const { remoteFeatures } = useSnapshot(OptionsController.state);
  const chainNamespace = namespace ?? activeChain;
  const isMultiWalletEnabled = Boolean(remoteFeatures == null ? void 0 : remoteFeatures.multiWallet);
  if (!chainNamespace) {
    throw new Error("No namespace found");
  }
  const formatConnection = (0, import_react2.useCallback)((connection) => {
    const connector = ConnectorController.getConnectorById(connection.connectorId);
    const name = ConnectorController.getConnectorName(connector == null ? void 0 : connector.name);
    const icon = AssetUtil.getConnectorImage(connector);
    const networkImage = AssetUtil.getNetworkImage(connection.caipNetwork);
    return {
      name,
      icon,
      networkIcon: networkImage,
      ...connection
    };
  }, []);
  const { connections, recentConnections } = ConnectionControllerUtil.getConnectionsData(chainNamespace);
  if (!isMultiWalletEnabled) {
    AlertController.open(ConstantsUtil.REMOTE_FEATURES_ALERTS.MULTI_WALLET_NOT_ENABLED.CONNECTIONS_HOOK, "info");
    return {
      connections: [],
      recentConnections: []
    };
  }
  return {
    connections: connections.map(formatConnection),
    recentConnections: recentConnections.map(formatConnection)
  };
}
function useAppKitConnection({ namespace, onSuccess, onError }) {
  const { connections, isSwitchingConnection } = useSnapshot(ConnectionController.state);
  const { activeConnectorIds } = useSnapshot(ConnectorController.state);
  const { activeChain } = useSnapshot(ChainController.state);
  const { remoteFeatures } = useSnapshot(OptionsController.state);
  const chainNamespace = namespace ?? activeChain;
  if (!chainNamespace) {
    throw new Error("No namespace found");
  }
  const isMultiWalletEnabled = Boolean(remoteFeatures == null ? void 0 : remoteFeatures.multiWallet);
  const switchConnection = (0, import_react2.useCallback)(async ({ connection: _connection, address }) => {
    try {
      ConnectionController.setIsSwitchingConnection(true);
      await ConnectionController.switchConnection({
        connection: _connection,
        address,
        namespace: chainNamespace,
        onChange({ address: newAddress, namespace: newNamespace, hasSwitchedAccount, hasSwitchedWallet }) {
          onSuccess == null ? void 0 : onSuccess({
            address: newAddress,
            namespace: newNamespace,
            hasSwitchedAccount,
            hasSwitchedWallet,
            hasDeletedWallet: false
          });
        }
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Something went wrong");
      onError == null ? void 0 : onError(error);
    } finally {
      ConnectionController.setIsSwitchingConnection(false);
    }
  }, [chainNamespace, onSuccess, onError]);
  const deleteConnection = (0, import_react2.useCallback)(({ address, connectorId: connectorId2 }) => {
    StorageUtil.deleteAddressFromConnection({ connectorId: connectorId2, address, namespace: chainNamespace });
    ConnectionController.syncStorageConnections();
    onSuccess == null ? void 0 : onSuccess({
      address,
      namespace: chainNamespace,
      hasSwitchedAccount: false,
      hasSwitchedWallet: false,
      hasDeletedWallet: true
    });
  }, [chainNamespace]);
  if (!isMultiWalletEnabled) {
    AlertController.open(ConstantsUtil.REMOTE_FEATURES_ALERTS.MULTI_WALLET_NOT_ENABLED.CONNECTION_HOOK, "info");
    return {
      connection: void 0,
      isPending: false,
      switchConnection: () => Promise.resolve(void 0),
      deleteConnection: () => ({})
    };
  }
  const connectorId = activeConnectorIds[chainNamespace];
  const connList = connections.get(chainNamespace);
  const connection = connList == null ? void 0 : connList.find((c) => c.connectorId.toLowerCase() === (connectorId == null ? void 0 : connectorId.toLowerCase()));
  return {
    connection,
    isPending: isSwitchingConnection,
    switchConnection,
    deleteConnection
  };
}
function useAppKitWallets() {
  const { features, remoteFeatures } = useSnapshot(OptionsController.state);
  const isHeadlessEnabled = Boolean((features == null ? void 0 : features.headless) && (remoteFeatures == null ? void 0 : remoteFeatures.headless));
  const [isFetchingWallets, setIsFetchingWallets] = (0, import_react2.useState)(false);
  const { wcUri, wcFetchingUri } = useSnapshot(ConnectionController.state);
  const { wallets: wcAllWallets, search: wcSearchWallets, page, count } = useSnapshot(ApiController.state);
  const { initialized, connectingWallet } = useSnapshot(PublicStateController.state);
  async function fetchWallets(fetchOptions) {
    setIsFetchingWallets(true);
    try {
      if (fetchOptions == null ? void 0 : fetchOptions.query) {
        await ApiController.searchWallet({ search: fetchOptions == null ? void 0 : fetchOptions.query });
      } else {
        ApiController.state.search = [];
        await ApiController.fetchWalletsByPage({
          page: (fetchOptions == null ? void 0 : fetchOptions.page) ?? 1
        });
      }
    } catch (error) {
      console.error("Failed to fetch WalletConnect wallets:", error);
    } finally {
      setIsFetchingWallets(false);
    }
  }
  async function connect(_wallet, namespace) {
    PublicStateController.set({ connectingWallet: _wallet });
    try {
      const walletConnector = _wallet == null ? void 0 : _wallet.connectors.find((c) => c.chain === namespace);
      const connector = walletConnector && namespace ? ConnectorController.getConnector({ id: walletConnector == null ? void 0 : walletConnector.id, namespace }) : void 0;
      if ((_wallet == null ? void 0 : _wallet.isInjected) && connector) {
        await ConnectorControllerUtil.connectExternal(connector);
      } else {
        await ConnectionController.connectWalletConnect({ cache: "never" });
      }
    } catch (error) {
      PublicStateController.set({ connectingWallet: void 0 });
      throw error;
    }
  }
  function resetWcUri() {
    ConnectionController.resetUri();
  }
  const lastHandledUriRef = (0, import_react2.useRef)(void 0);
  (0, import_react2.useEffect)(() => {
    lastHandledUriRef.current = void 0;
  }, [connectingWallet == null ? void 0 : connectingWallet.id]);
  (0, import_react2.useEffect)(() => {
    const unsubscribe = ConnectionController.subscribeKey("wcUri", (wcUri2) => {
      var _a;
      if (!wcUri2) {
        lastHandledUriRef.current = void 0;
        return;
      }
      if (wcUri2 === lastHandledUriRef.current || ConnectionController.state.wcLinking) {
        return;
      }
      const isMobile = CoreHelperUtil.isMobile();
      const wcWallet = ApiControllerUtil.getWalletById((_a = PublicStateController.state.connectingWallet) == null ? void 0 : _a.id);
      if (isMobile && (wcWallet == null ? void 0 : wcWallet.mobile_link)) {
        lastHandledUriRef.current = wcUri2;
        ConnectionControllerUtil.onConnectMobile(wcWallet);
      }
    });
    return () => unsubscribe();
  }, []);
  (0, import_react2.useEffect)(() => {
    if (initialized && (remoteFeatures == null ? void 0 : remoteFeatures.headless) !== void 0 && (!isHeadlessEnabled || !(remoteFeatures == null ? void 0 : remoteFeatures.headless))) {
      AlertController.open(ConstantsUtil.REMOTE_FEATURES_ALERTS.HEADLESS_NOT_ENABLED.DEFAULT, "info");
    }
  }, [initialized, isHeadlessEnabled, remoteFeatures == null ? void 0 : remoteFeatures.headless]);
  if (!isHeadlessEnabled || !(remoteFeatures == null ? void 0 : remoteFeatures.headless)) {
    return {
      wallets: [],
      wcWallets: [],
      isFetchingWallets: false,
      isFetchingWcUri: false,
      isInitialized: false,
      wcUri: void 0,
      connectingWallet: void 0,
      page: 0,
      count: 0,
      connect: () => Promise.resolve(),
      fetchWallets: () => Promise.resolve(),
      resetWcUri
    };
  }
  return {
    wallets: ConnectUtil.getInitialWallets(),
    wcWallets: ConnectUtil.getWalletConnectWallets(wcAllWallets, wcSearchWallets),
    isFetchingWallets,
    isFetchingWcUri: wcFetchingUri,
    isInitialized: initialized,
    wcUri,
    connectingWallet,
    page,
    count,
    connect,
    fetchWallets,
    resetWcUri
  };
}

// node_modules/@reown/appkit/dist/esm/src/library/react/index.js
var import_react3 = __toESM(require_react(), 1);
var modal = void 0;
function getAppKit(appKit) {
  if (appKit) {
    modal = appKit;
  }
}
function useAppKitTheme() {
  if (!modal) {
    throw new Error('Please call "createAppKit" before using "useAppKitTheme" hook');
  }
  function setThemeMode(themeMode2) {
    if (themeMode2) {
      modal == null ? void 0 : modal.setThemeMode(themeMode2);
    }
  }
  function setThemeVariables(themeVariables2) {
    if (themeVariables2) {
      modal == null ? void 0 : modal.setThemeVariables(themeVariables2);
    }
  }
  const [themeMode, setInternalThemeMode] = (0, import_react3.useState)(modal.getThemeMode());
  const [themeVariables, setInternalThemeVariables] = (0, import_react3.useState)(modal.getThemeVariables());
  (0, import_react3.useEffect)(() => {
    const unsubscribe = modal == null ? void 0 : modal.subscribeTheme((state) => {
      setInternalThemeMode(state.themeMode);
      setInternalThemeVariables(state.themeVariables);
    });
    return () => {
      unsubscribe == null ? void 0 : unsubscribe();
    };
  }, []);
  return {
    themeMode,
    themeVariables,
    setThemeMode,
    setThemeVariables
  };
}
function useAppKit() {
  if (!modal) {
    throw new Error('Please call "createAppKit" before using "useAppKit" hook');
  }
  async function open(options) {
    return modal == null ? void 0 : modal.open(options);
  }
  async function close() {
    await (modal == null ? void 0 : modal.close());
  }
  return { open, close };
}
function useWalletInfo(namespace) {
  if (!modal) {
    throw new Error('Please call "createAppKit" before using "useWalletInfo" hook');
  }
  const [walletInfo, setWalletInfo] = (0, import_react3.useState)(() => modal == null ? void 0 : modal.getWalletInfo(namespace));
  (0, import_react3.useEffect)(() => {
    setWalletInfo(modal == null ? void 0 : modal.getWalletInfo(namespace));
    const unsubscribe = modal == null ? void 0 : modal.subscribeWalletInfo((newWalletInfo) => {
      setWalletInfo(newWalletInfo);
    }, namespace);
    return () => unsubscribe == null ? void 0 : unsubscribe();
  }, [namespace]);
  return { walletInfo };
}
function useAppKitState() {
  if (!modal) {
    throw new Error('Please call "createAppKit" before using "useAppKitState" hook');
  }
  const [state, setState] = (0, import_react3.useState)({ ...modal.getState(), initialized: false });
  const [remoteFeatures, setRemoteFeatures] = (0, import_react3.useState)(modal.getRemoteFeatures());
  (0, import_react3.useEffect)(() => {
    if (modal) {
      setState({ ...modal.getState() });
      setRemoteFeatures(modal.getRemoteFeatures());
      const unsubscribe = modal == null ? void 0 : modal.subscribeState((newState) => {
        setState({ ...newState });
      });
      const unsubscribeRemoteFeatures = modal == null ? void 0 : modal.subscribeRemoteFeatures((newState) => {
        setRemoteFeatures(newState);
      });
      return () => {
        unsubscribe == null ? void 0 : unsubscribe();
        unsubscribeRemoteFeatures == null ? void 0 : unsubscribeRemoteFeatures();
      };
    }
    return () => null;
  }, []);
  return { ...state, ...remoteFeatures ?? {} };
}
function useAppKitEvents() {
  if (!modal) {
    throw new Error('Please call "createAppKit" before using "useAppKitEvents" hook');
  }
  const [event, setEvents] = (0, import_react3.useState)(modal.getEvent());
  (0, import_react3.useEffect)(() => {
    const unsubscribe = modal == null ? void 0 : modal.subscribeEvents((newEvent) => {
      setEvents({ ...newEvent });
    });
    return () => {
      unsubscribe == null ? void 0 : unsubscribe();
    };
  }, []);
  return event;
}

// node_modules/@reown/appkit/dist/esm/src/utils/BalanceUtil.js
async function _internalFetchBalance(appKit) {
  if (!appKit) {
    throw new Error("AppKit not initialized when  fetchBalance was called.");
  }
  return await updateBalance(appKit);
}
async function updateBalance(appKit) {
  var _a;
  const address = appKit.getAddress();
  const chainNamespace = appKit.getActiveChainNamespace();
  const chainId = (_a = appKit.getCaipNetwork()) == null ? void 0 : _a.id;
  if (!address || !chainNamespace || !chainId) {
    return {
      data: void 0,
      error: "Not able to retrieve balance",
      isSuccess: false,
      isError: true
    };
  }
  const balance = await appKit.updateNativeBalance(address, chainId, chainNamespace);
  return {
    data: balance,
    error: balance ? null : "No balance found",
    isSuccess: Boolean(balance),
    isError: !balance
  };
}

// node_modules/@reown/appkit/dist/esm/src/library/react/components.js
var import_react4 = __toESM(require_react(), 1);

// node_modules/@lit/react/development/create-component.js
var NODE_MODE = false;
var DEV_MODE = true;
var reservedReactProperties = /* @__PURE__ */ new Set([
  "children",
  "localName",
  "ref",
  "style",
  "className"
]);
var listenedEvents = /* @__PURE__ */ new WeakMap();
var addOrUpdateEventListener = (node, event, listener) => {
  let events = listenedEvents.get(node);
  if (events === void 0) {
    listenedEvents.set(node, events = /* @__PURE__ */ new Map());
  }
  let handler = events.get(event);
  if (listener !== void 0) {
    if (handler === void 0) {
      events.set(event, handler = { handleEvent: listener });
      node.addEventListener(event, handler);
    } else {
      handler.handleEvent = listener;
    }
  } else if (handler !== void 0) {
    events.delete(event);
    node.removeEventListener(event, handler);
  }
};
var setProperty = (node, name, value, old, events) => {
  const event = events == null ? void 0 : events[name];
  if (event !== void 0) {
    if (value !== old) {
      addOrUpdateEventListener(node, event, value);
    }
    return;
  }
  node[name] = value;
  if ((value === void 0 || value === null) && name in HTMLElement.prototype) {
    node.removeAttribute(name);
  }
};
var createComponent = ({ react: React2, tagName, elementClass, events, displayName }) => {
  const eventProps = new Set(Object.keys(events ?? {}));
  if (DEV_MODE && !NODE_MODE) {
    for (const p of reservedReactProperties) {
      if (p in elementClass.prototype && !(p in HTMLElement.prototype)) {
        console.warn(`${tagName} contains property ${p} which is a React reserved property. It will be used by React and not set on the element.`);
      }
    }
  }
  const ReactComponent = React2.forwardRef((props, ref) => {
    const prevElemPropsRef = React2.useRef(/* @__PURE__ */ new Map());
    const elementRef = React2.useRef(null);
    const reactProps = {};
    const elementProps = {};
    for (const [k, v] of Object.entries(props)) {
      if (reservedReactProperties.has(k)) {
        reactProps[k === "className" ? "class" : k] = v;
        continue;
      }
      if (eventProps.has(k) || k in elementClass.prototype) {
        elementProps[k] = v;
        continue;
      }
      reactProps[k] = v;
    }
    if (!NODE_MODE) {
      React2.useLayoutEffect(() => {
        if (elementRef.current === null) {
          return;
        }
        const newElemProps = /* @__PURE__ */ new Map();
        for (const key in elementProps) {
          setProperty(elementRef.current, key, props[key], prevElemPropsRef.current.get(key), events);
          prevElemPropsRef.current.delete(key);
          newElemProps.set(key, props[key]);
        }
        for (const [key, value] of prevElemPropsRef.current) {
          setProperty(elementRef.current, key, void 0, value, events);
        }
        prevElemPropsRef.current = newElemProps;
      });
      React2.useLayoutEffect(() => {
        var _a;
        (_a = elementRef.current) == null ? void 0 : _a.removeAttribute("defer-hydration");
      }, []);
    }
    if (NODE_MODE) {
      if ((React2.createElement.name === "litPatchedCreateElement" || globalThis.litSsrReactEnabled) && Object.keys(elementProps).length) {
        reactProps["_$litProps$"] = elementProps;
      }
    } else {
      reactProps["suppressHydrationWarning"] = true;
    }
    return React2.createElement(tagName, {
      ...reactProps,
      ref: React2.useCallback((node) => {
        elementRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref !== null) {
          ref.current = node;
        }
      }, [ref])
    });
  });
  ReactComponent.displayName = displayName ?? elementClass.name;
  return ReactComponent;
};

// node_modules/@reown/appkit/dist/esm/src/library/react/components.js
var AppKitButton2 = createComponent({
  tagName: "appkit-button",
  elementClass: AppKitButton,
  react: import_react4.default
});
var AppKitNetworkButton2 = createComponent({
  tagName: "appkit-network-button",
  elementClass: AppKitNetworkButton,
  react: import_react4.default
});
var AppKitConnectButton2 = createComponent({
  tagName: "appkit-connect-button",
  elementClass: AppKitConnectButton,
  react: import_react4.default
});
var AppKitAccountButton2 = createComponent({
  tagName: "appkit-account-button",
  elementClass: AppKitAccountButton,
  react: import_react4.default
});

// node_modules/@reown/appkit/dist/esm/src/library/react/providers.js
var import_react6 = __toESM(require_react(), 1);
var appkit = null;
function memoizeCreateAppKit(config) {
  if (!appkit) {
    appkit = createAppKit(config);
  }
  return appkit;
}
function AppKitProvider({ children, ...props }) {
  memoizeCreateAppKit(props);
  return children;
}

// node_modules/@reown/appkit/dist/esm/exports/react.js
var modal2 = void 0;
function createAppKit(options) {
  if (!modal2) {
    modal2 = new AppKit({
      ...options,
      sdkVersion: CoreHelperUtil.generateSdkVersion(options.adapters ?? [], "react", PACKAGE_VERSION)
    });
    getAppKit(modal2);
  }
  return modal2;
}
function useAppKitNetwork() {
  const { caipNetwork, caipNetworkId, chainId } = useAppKitNetworkCore();
  async function switchNetwork(network) {
    await (modal2 == null ? void 0 : modal2.switchNetwork(network));
  }
  return {
    caipNetwork,
    caipNetworkId,
    chainId,
    switchNetwork
  };
}
function useAppKitBalance() {
  async function fetchBalance() {
    return await _internalFetchBalance(modal2);
  }
  return {
    fetchBalance
  };
}
export {
  AppKit,
  AppKitAccountButton2 as AppKitAccountButton,
  AppKitButton2 as AppKitButton,
  AppKitConnectButton2 as AppKitConnectButton,
  AppKitNetworkButton2 as AppKitNetworkButton,
  AppKitProvider,
  CoreHelperUtil,
  WcConstantsUtil,
  createAppKit,
  getAppKit,
  modal2 as modal,
  useAppKit,
  useAppKitAccount,
  useAppKitBalance,
  useAppKitConnection,
  useAppKitConnections,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitNetworkCore,
  useAppKitProvider,
  useAppKitState,
  useAppKitTheme,
  useAppKitWallets,
  useDisconnect,
  useWalletInfo
};
/*! Bundled license information:

@lit/react/development/create-component.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/react/development/index.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=@reown_appkit_react.js.map
