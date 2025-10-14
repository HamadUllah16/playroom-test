'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './preview.module.css'

type PreviewProps = {
    src: string;
    maxPlayers: number;
    newWindow?: boolean;
  };
  

export default function Preview({src, maxPlayers=4, newWindow}: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [joinedIframes, setJoinedIframes] = useState(0);
  const [url, setUrl] = useState("");

  const scale = 0.75;
  
  useEffect(() => {
    setTimeout(() => {
      try {
        setUrl(iframeRef.current?.contentWindow?.location.href || "");
      } catch (err) {
         setUrl("")
         console.log(err)
      }
    }, 2000);
  }, []);
  
  const totalPlayers = 1 + joinedIframes;
  
  return (
    <div className={styles.container}>
      <FakeBrowser scale={scale} onClose={()=>{
        setJoinedIframes(Math.max(0, joinedIframes - 1));
      }}>
        {newWindow && 
        <div className={styles.newWindowCTA}>
          <a href={src} target='_blank'>Open in new window ↗</a>
        </div>}
      {!newWindow && <iframe 
        ref={iframeRef} width="380" height="700" style={{
        }} src={src}></iframe>}
      </FakeBrowser>
        {new Array(joinedIframes).fill(0).map((_, i) => (
          <FakeBrowser key={i} scale={scale} onClose={()=>{
            setJoinedIframes(Math.max(0, joinedIframes - 1));
          }}>
            <iframe 
            key={i}
            width="380" height="700" style={{
            }} src={url}></iframe>
          </FakeBrowser>
        ))}
      {!newWindow && totalPlayers < maxPlayers &&
      <a className={styles.btnNew}
      onClick={()=>{
        if (totalPlayers < maxPlayers) {
          setJoinedIframes(joinedIframes + 1);
        }
      }}>
        + Add a Player
      </a>}
    </div>
  )
}


function FakeBrowser({ onClose, children, scale }: { onClose: () => void, children: React.ReactNode, scale: number }) {
  return (
    <div 
      style={{transform: `scale(${scale})`, transformOrigin: "top left"}}
      className={styles.browser}>
      <div className={styles.browserNavigationBar}>
        <i onClick={onClose}></i><i></i><i></i>

      </div>

      <div className={styles.browserContainer}>
        {children}
      </div>
    </div>
  )
}