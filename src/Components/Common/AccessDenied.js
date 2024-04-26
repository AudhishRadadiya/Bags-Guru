import AccessDeniedImg from '../../Assets/Images/access-denied.svg';

export default function AccessDenied() {
  return (
    <div className="main_Wrapper">
      <div className="access_denied_wrapper">
        <div className="access_denied_inner">
          <img src={AccessDeniedImg} alt="" />
          <div className="access_denied_text">
            <h2>Access Denied</h2>
            <p>
              We're sorry, but you don't have permission to access the requested
              page. If you believe this is an error, please contact the
              administrator or go back to the previous page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
