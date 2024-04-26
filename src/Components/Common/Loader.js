import { memo } from 'react';
import LogoIcon from '../../Assets/Images/logo-icon.svg';

const Loader = () => {
  return (
    <div className="loader_wrapper">
      <div className="loader">
        <img src={LogoIcon} alt="" />
      </div>
    </div>
  );
};

export default memo(Loader);
