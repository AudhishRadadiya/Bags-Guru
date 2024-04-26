import { useEffect, useState } from 'react';
import FolderIcon from '../../Assets/Images/folder.svg';

export default function FileProgress({ icon, name }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (name) {
      let timeout = setInterval(() => {
        setWidth(prev => {
          if (prev !== 100) return prev + 1;
          return prev;
        });
      }, 10);
      return () => clearInterval(timeout);
    }
  }, [name]);

  return (
    <div className="progress">
      <div className="progress__content">
        <div className="progress__content__1">
          <img src={FolderIcon} alt="" />
          <p className="progress__content__1__filename">{name}</p>
        </div>
        <div className="progress__content__2">
          <div
            className="progress__content__2__bar"
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    </div>
  );
}
