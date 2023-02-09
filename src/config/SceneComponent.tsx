import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";
import { BabylonjsProps } from "babylonjs-hook";

export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest }: BabylonjsProps & React.CanvasHTMLAttributes<HTMLCanvasElement>) => {
  const reactCanvas = useRef(null);

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
    const scene = new Scene(engine, sceneOptions);

    
    if (scene.isReady()) {

        scene.debugLayer.show();

      onSceneReady(scene);

    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    engine.runRenderLoop(() => {

      if (typeof onRender === "function") onRender(scene);
      
      scene.render();

    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {

      window.addEventListener("resize", resize);
    }

    scene.debugLayer.show({overlay: true});

    return () => {
      scene.getEngine().dispose();


      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

  return <canvas ref={reactCanvas} {...rest} />;
};