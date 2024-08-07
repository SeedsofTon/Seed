
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  useLaunchParams,
  useMiniApp,
  useViewport,
  useThemeParams,
  useMainButton,
  retrieveLaunchParams,
  useUtils,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { type FC, useEffect, useCallback, useRef} from 'react';
import copy from 'copy-to-clipboard';

const sharedtext = "Come and play with me, let's be friends and get Airdrop tokens for free!\n\
💸  10k Coins as a first-time gift\n\
🔥  50k Coins if you have Telegram Premium"
const appUrl = "https://t.me/my_dev01_bot/miniapp?startapp="
const apiUrl = "https://game-api.seedsofton.xyz/"
const telegramLink = "https://t.me/SeedsofTON"
const xLink = "https://twitter.com/SeedsofTon"
const youtubeLink = "https://www.youtube.com/@seedsofton"


export const App: FC = () => {

  const { unityProvider, 
    sendMessage, 
    addEventListener, 
    removeEventListener, 
    loadingProgression, 
    isLoaded 
  } = useUnityContext({
    loaderUrl: 'build/StageBuild.loader.js',
    dataUrl: 'build/StageBuild.data.unityweb',
    frameworkUrl: 'build/StageBuild.framework.js.unityweb',
    codeUrl: 'build/StageBuild.wasm.unityweb',
  });

  const rootDivRef = useRef<HTMLDivElement>(null); 
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const viewport = useViewport();
  const themeParams = useThemeParams();
  const mainButton = useMainButton();
  const utils = useUtils();
  const { initDataRaw } = retrieveLaunchParams();

  const canvasWidth = viewport?.width;
  const canvasHeight = viewport?.height;
  
  useEffect(() => {  
    miniApp.setBgColor('#000000');
    miniApp.setHeaderColor('#000000');
    miniApp.ready()
    mainButton.hide();
  }, []);

  useEffect(() => {  
    viewport?.expand();  
  }, [viewport]);

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  const handleGameIsReady = useCallback(() => {  
    
    const originalString = lp.startParam ? lp.startParam : "d";  
    const startParam = originalString.slice(0, -1); 
    sendMessage('WebMessage', 'SetStartParam', startParam);
    sendMessage('WebMessage', 'SetInitDataRaw', initDataRaw);
    console.log("" + apiUrl);
    sendMessage('WebMessage', 'SetAPIURL', apiUrl);
  }, [isLoaded]);

  const handleShareURL = useCallback((...parameters: any[]) => {  
    
    utils.shareURL(appUrl + parameters[0] + "d", sharedtext)
  }, [isLoaded]);

  const handleCopyURL = useCallback((...parameters: any[]) => {  
    try {  
      const text = appUrl + parameters[0] + "d" + "\n" + sharedtext;  
      copy(text);
      console.log('Copy to clipboard');  
    } catch (err) {  
      console.error('Copy to clipboard fail:', err);  
    }  
  }, [isLoaded]);

  const handleOpenSomething = useCallback((...parameters: any[]) => {  
    console.log({ parameters });
    try {  
      const handle = parameters[0]
      switch(handle)
      {
        case "tg_community":
          utils.openTelegramLink(telegramLink);
          break;
        case "xxx":
          utils.openLink(xLink);
          break;
        case "youtube":
          utils.openLink(youtubeLink);
          break;
      }
    } catch (err) {  
      
    }  
  }, [isLoaded]);

  const handleTelegramClick = () => {  
    utils.openTelegramLink(telegramLink);  
  };  
  
  const handleXClick = () => {  
    utils.openLink(xLink);
  };  
  
  const handleYoutubeClick = () => {  
    utils.openLink(youtubeLink);  
  };

  useEffect(() => {  
    addEventListener("OnGameIsReady", handleGameIsReady);  
    addEventListener("ShareURL", handleShareURL);  
    addEventListener("CopyURL", handleCopyURL); 
    addEventListener("OpenSomething", handleOpenSomething);
    return () => {  
      removeEventListener("OnGameIsReady", handleGameIsReady);  
      removeEventListener("ShareURL", handleShareURL);  
      removeEventListener("CopyURL", handleCopyURL);  
      removeEventListener("OpenSomething", handleOpenSomething);
    };  
  }, [addEventListener, removeEventListener, isLoaded]);

  return (
    <AppRoot>
      <div
        ref={rootDivRef}
        style={{
          width: canvasWidth,
          height: canvasHeight,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {!isLoaded ? (
          <div
            style={{
              width: canvasWidth,
              height: canvasHeight,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'rgba(0, 0, 0, 1)',
            }}
          >
            <img src="./loading-web.png"
              alt="Loading"  
              style={{  
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                //marginBottom: '20px',
              }}  
            />
            <p  
              style={{  
                position: 'absolute',  
                fontFamily: 'LanaPixel',  
                fontSize: '38px',  
                color: 'white',   
                //textShadow: '2px 2px 4px #000000',
              }}  
            >  
              loading...{Math.round(loadingProgression * 100)}%  
            </p> 
            
            <img src="./buttons/telegram.png"
              alt="Loading"  
              style={{  
                width: 'auto',  
                height: 'auto',  
                maxWidth: '100%',  
                maxHeight: '100%',  
                position: 'absolute',  
                bottom: '100px',
                left: 'calc(50% - 100px)', 
                transform: 'translateX(-50%)',
              }}  
              onClick={handleTelegramClick}
            />

            <img src="./buttons/x.png"
              alt="Loading"  
              style={{  
                width: 'auto',  
                height: 'auto',  
                maxWidth: '100%',  
                maxHeight: '100%',  
                position: 'absolute',  
                bottom: '100px', 
                left: 'calc(50%)',   
                transform: 'translateX(-50%)',
              }}
              onClick={handleXClick}
            />

            <img src="./buttons/youtube.png"
              alt="Loading"  
              style={{  
                width: 'auto',  
                height: 'auto',  
                maxWidth: '100%',  
                maxHeight: '100%',  
                position: 'absolute',  
                bottom: '100px', 
                left: 'calc(50% + 100px)',
                transform: 'translateX(-50%)',
              }}
              onClick={handleYoutubeClick}  
            />
          </div>
        ) : null}
        <Unity
          unityProvider={unityProvider}
          devicePixelRatio={devicePixelRatio}
          style={{
            width: canvasWidth,
            height: canvasHeight,
            visibility: isLoaded ? "visible" : "hidden"
          }}
        />
      </div>
    </AppRoot>
  );
};
