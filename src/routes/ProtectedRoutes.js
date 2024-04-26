import { clearToken } from 'Helper/AuthTokenHelper';
import { logout } from 'Services/authService';
import store from 'Store';
import { setCurrentUser } from 'Store/Reducers/Auth/auth.slice';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

// const handleAccess = roleName => {
//   return store.dispatch(isRoleAccess(roleName));
// };

const ProtectedRoutes = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const UserPreferences = localStorage.getItem('UserPreferences');
  const token = JSON.parse(UserPreferences)?.token;

  const isRoleAccess = roleName => {
    const userPreferences = JSON.parse(localStorage.getItem('UserPreferences'));
    const isOperator = userPreferences?.operator;
    const userPermission = userPreferences?.permission;
    const operatorPermission = userPreferences?.operatorPermission;
    const permissions =
      isOperator === true ? operatorPermission : userPermission;

    if (isOperator || roleName?.subModule === 'Other') {
      if (
        (isOperator && roleName?.subModule === 'Order Operator') ||
        (isOperator && roleName?.subModule === 'Stock(Raw Material)') ||
        (isOperator && roleName?.subModule === 'MFG Live Operator') ||
        (isOperator && roleName?.subModule === 'Pending Jobs') ||
        roleName?.subModule === 'Other'
      ) {
        return {
          is_create_access: true,
          is_edit_access: true,
          is_view_access: true,
          is_export_access: true,
          is_import_access: true,
          is_delete_access: true,
          is_print_access: true,
        };
      }
    }

    if (permissions?.length) {
      const roleNameMainModule = roleName?.mainModule;
      const roleNameSubModule = roleName?.subModule;

      const isMainModule = permissions?.find(
        x => x?.name === roleNameMainModule,
      );
      const access = isMainModule?.sub_module?.find(
        x => x?.name === roleNameSubModule,
      )?.permission;

      if (access)
        return {
          is_create_access: access?.create,
          is_edit_access: access?.edit,
          is_view_access: access?.view,
          is_export_access: access?.export,
          is_import_access: access?.import,
          is_delete_access: access?.delete,
          is_print_access: access?.print,
        };
    }
  };

  const fetchRoleAccess = useCallback(() => {
    if (!token) {
      clearToken();
      store.dispatch(setCurrentUser({}));
      dispatch(logout());
      navigate('/');
      return <Navigate to="/" replace={true} />;
    } else {
      let updatedAccessPermission = {
        is_create_access: false,
        is_edit_access: false,
        is_view_access: false,
        is_export_access: false,
        is_import_access: false,
        is_delete_access: false,
        is_print_access: false,
      };

      if (children?.props?.role) {
        updatedAccessPermission = isRoleAccess(children.props.role);
      }

      return updatedAccessPermission?.is_view_access ? (
        <children.type
          hasAccess={updatedAccessPermission}
          {...children.props}
        />
      ) : (
        <Navigate to="/access-denied" replace={true} />
      );
    }
  }, [dispatch, children, navigate, token]);

  if (!token) {
    return <Navigate to="/" replace={true} />;
  }

  return fetchRoleAccess();
};

export default ProtectedRoutes;
