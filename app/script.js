import React, { useMemo, useState, useEffect } from 'react';
import { render } from 'react-dom';

const App = () => {
  const [status, setStatus] = useState('off')
  const [time, setTime] = useState(0)
  const [timer, setTimer] = useState(null)
  const currentTime = useMemo(() => time, [time])
  const pageTitle = useMemo(() => <h1>Protect your eyes</h1>, [])

  const padTo2Digits = (num, length = 2) => {
    return num.toString().padStart(length, '0');
  }
  const formatTime = (time) => {
    let seconds = Math.floor(time);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;
    return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
  }
  const startTime = (seconds = 1200, workStatus = 'work') => {
    setStatus(workStatus)
    setTime(seconds)
    if (seconds === 1200 && time === 0) playBell()
    setTimer(setInterval(() => {
      setTime(prevValue => prevValue - 1);
    }, 1000))
  }

  const stopTime = () => {
    setStatus('off')
    setTime(0)
    clearInterval(timer)
  }
  const closeApp = () => {
    window.close()
  }
  const playBell = () => {
    const audioElement = new Audio("./sounds/bell.wav");
    audioElement.play()
  }
  const renderDescription = () => (
    <div>
      <p>According to optometrists in order to save your eyes, you should follow the 20/20/20. It means you should to rest your eyes every 20 minutes for 20 seconds by looking more than 20 feet away.</p>
      <p>This app will help you track your time and inform you when it's time to rest.</p>
    </div>
  )
  const renderImage = () => {
    if (status === 'work') return <img src="./images/work.png" />
    if (status === 'rest') return <img src="./images/rest.png" />
  }
  const renderTimer = () => <div className="timer">{formatTime(currentTime)}</div>
  const renderButton = () => (
    status === 'off'
      ? <button className="btn" onClick={() => startTime()}>Start</button>
      : <button className="btn" onClick={() => stopTime()}>Stop</button>
  )

  useEffect(() => {
    if (currentTime === 0) {
      // playBell()
      clearInterval(timer);
      if (status === 'work') startTime(20, 'rest')
      if (status === 'rest') startTime(1200, 'work')
    }
  }, [currentTime, timer]);

  return (
    <div>
      {pageTitle}
      {status === 'off' && renderDescription()}

      {status !== 'off' &&
        <div>
          {renderImage()}
          {renderTimer()}
        </div>
      }

      {renderButton()}
      <button className="btn btn-close" onClick={() => closeApp()}>X</button>
    </div>
  )
}


render(<App />, document.querySelector('#app'));
