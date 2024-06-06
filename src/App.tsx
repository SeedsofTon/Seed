// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { Unity, useUnityContext } from "react-unity-webgl";

// function App() {
//   const { unityProvider } = useUnityContext({
//     loaderUrl: "build/StageBuild.loader.js",
//     dataUrl: "build/StageBuild.data",
//     frameworkUrl: "build/StageBuild.framework.js",
//     codeUrl: "build/StageBuild.wasm",
//   });

//   return <Unity unityProvider={unityProvider} />;
// }

import { Fragment , useEffect, useState} from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "build/StageBuild.loader.js",
    dataUrl: "build/StageBuild.data.unityweb",
    frameworkUrl: "build/StageBuild.framework.js.unityweb",
    codeUrl: "build/StageBuild.wasm.unityweb",
  });

  const [devicePixelRatio, setDevicePixelRatio] = useState<undefined | number>(undefined);
  const [canvasWidth, setCanvasWidth] = useState<number | undefined>();
  const [canvasHeight, setCanvasHeight] = useState<number | undefined>();

  // const handleSendAddress = useCallback(() => {
  //   sendMessage('UnityNotify', 'SetWalletAddress', address);
  // }, [address, isConnected]);

  useEffect(() => {
    setDevicePixelRatio(window.devicePixelRatio);
  }, []);

  useEffect(
    function () {
      // A function which will update the device pixel ratio of the Unity
      // Application to match the device pixel ratio of the browser.
      const updateDevicePixelRatio = function () {
        setDevicePixelRatio(window.devicePixelRatio);
      };
      // A media matcher which watches for changes in the device pixel ratio.
      const mediaMatcher = window.matchMedia(`screen and (resolution: ${devicePixelRatio}dppx)`);
      // Adding an event listener to the media matcher which will update the
      // device pixel ratio of the Unity Application when the device pixel
      // ratio changes.
      mediaMatcher.addEventListener('change', updateDevicePixelRatio);
      return function () {
        // Removing the event listener when the component unmounts.
        mediaMatcher.removeEventListener('change', updateDevicePixelRatio);
      };
    },
    [devicePixelRatio]
  );

  useEffect(() => {
    const updateWidthAndHeight = () => {
      setCanvasWidth(window.innerWidth);
      setCanvasHeight(window.innerHeight - 64);
    };
    updateWidthAndHeight();

    window.addEventListener('resize', updateWidthAndHeight);
    return () => {
      window.removeEventListener('resize', updateWidthAndHeight);
    };
  }, []);

  return (
    <Fragment>
      {!isLoaded && (
        <p>loading...{Math.round(loadingProgression * 100)}%</p>
      )}
      <Unity
        unityProvider={unityProvider}
        devicePixelRatio={devicePixelRatio}
        style={{
          width: canvasWidth,
          height: canvasHeight,
        }}
      />
    </Fragment>
  );
}


export default App
