import React, { useEffect, useRef } from 'react';
import { SceneManager } from './Scene';

export function CanvasContainer({ theme, onSceneInit }) {
  const containerRef = useRef(null);
  const sceneManagerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Initialize Three.js scene manager
      const sceneManager = new SceneManager(containerRef.current);
      sceneManagerRef.current = sceneManager;
      
      // Apply initial theme
      sceneManager.setTheme(theme);
      
      // Propagate initialization up
      if (onSceneInit) {
        onSceneInit(sceneManager);
      }

      return () => {
        if (sceneManagerRef.current) {
          sceneManagerRef.current.destroy();
          sceneManagerRef.current = null;
        }
      };
    }
  }, []);

  // Update theme when state changes
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setTheme(theme);
    }
  }, [theme]);

  return <div id="canvas-container" ref={containerRef}></div>;
}
