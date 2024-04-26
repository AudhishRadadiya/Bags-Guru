import NotFoundImg from '../../Assets/Images/404.png';

export default function NotFound() {
  return (
    <div className="main_Wrapper">
      <div className="not_found_wrapper">
        <div className="not_found_inner">
          <img src={NotFoundImg} alt="" />
          <div className="not_found_text">
            <h2>Page Note Found</h2>
            <p>
              We're sorry, but the page you're looking for doesn't exist or you
              don't have permission to access it, If you believe this is an
              error, please contact the administrator or go back to the previous
              page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
