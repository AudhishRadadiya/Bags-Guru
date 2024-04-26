import { Col, Dropdown, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PlusIcon from '../../Assets/Images/plus.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { useSelector } from 'react-redux';
import { useCallback, useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { getSeverity } from 'Components/Sales/Order';
import { setAllCommon } from 'Store/Reducers/Common';
import { useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { getUserRolesList } from 'Services/baseService';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import { deleteRoleWisePermission } from 'Services/Settings/RolePermissionService';

const statusBodyTemplate = rowData => {
  return (
    <Tag
      value={rowData?.status}
      severity={getSeverity(rowData?.is_active === 1 ? true : false)}
    />
  );
};

export default function RolePermissions({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deletePopup, setDeletePopup] = useState(false);

  const { loading: settingLoading, userRoles } = useSelector(
    ({ settings }) => settings,
  );
  const { allCommon } = useSelector(({ common }) => common);
  const { filterToggle, rollFilters } = allCommon?.rollPermissions;

  useEffect(() => {
    dispatch(getUserRolesList());
  }, [dispatch]);

  const handleEdit = useCallback(
    role_id => {
      const role = userRoles?.find(x => x?._id === role_id);
      if (role) {
        navigate(`/update-role-and-permissions/${role_id}`, {
          state: { role },
        });
      }
    },
    [navigate, userRoles],
  );

  const handleDelete = useCallback(
    async role_id => {
      if (role_id) {
        const result = await dispatch(deleteRoleWisePermission(role_id));
        if (result) {
          setDeletePopup(false);
          dispatch(getUserRolesList());
        }
      }
    },
    [dispatch],
  );

  const rollPermissionAction = role => {
    return role?.name === 'Admin' ? null : (
      <div className="edit_row">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="ection_btn"
            disabled={is_edit_access || is_delete_access ? false : true}
          >
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {is_edit_access ? (
              <Dropdown.Item onClick={() => handleEdit(role?._id)}>
                <img src={EditIcon} alt="" /> Edit
              </Dropdown.Item>
            ) : null}
            {is_delete_access ? (
              <Dropdown.Item onClick={() => setDeletePopup(role?._id)}>
                <img src={TrashIcon} alt="" /> Delete
              </Dropdown.Item>
            ) : null}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const rolePermissionItemn = data => {
    return (
      <span
        onClick={() =>
          navigate(`/role-and-permissions-details/${data._id}`, {
            state: { isView: true },
          })
        }
      >
        {data?.name}
      </span>
    );
  };

  return (
    <>
      {/* {settingLoading && <Loader />} */}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col sm={5}>
                <div className="page_title">
                  <h3 className="m-0">Roles & Permissions</h3>
                </div>
              </Col>
              <Col sm={7}>
                <div className="right_filter_wrapper">
                  <ul>
                    <li className="search_input_wrap">
                      {/* <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          className="input_wrap small search_wrap"
                        />
                      </div> */}
                    </li>
                    <li>
                      <Button
                        className="btn_primary"
                        onClick={() =>
                          is_create_access &&
                          navigate('/add-role-and-permissions')
                        }
                        disabled={is_create_access ? false : true}
                      >
                        <img src={PlusIcon} alt="" /> Add Roles & Permissions
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper with_colspan_head cell_padding_large is_filter">
            <button
              type="button"
              className="table_filter_btn"
              onClick={() => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    rollPermissions: {
                      ...allCommon?.rollPermissions,
                      filterToggle: !filterToggle,
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={userRoles}
              sortMode="multiple"
              sortField="name"
              dataKey="_id"
              filters={rollFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    rollPermissions: {
                      ...allCommon?.rollPermissions,
                      rollFilters: event?.filters,
                    },
                  }),
                );
              }}
              sortOrder={1}
              filterDisplay="row"
              emptyMessage={settingLoading && <Skeleton count={10} />}
            >
              <Column
                field="name"
                header="Roles & Permissions"
                sortable
                filter={filterToggle}
                className="view_detail"
                body={rolePermissionItemn}
              ></Column>

              <Column
                field="status"
                header="Active"
                sortable
                filter={filterToggle}
                body={statusBodyTemplate}
              ></Column>
              <Column
                field="action"
                header="Action"
                body={rollPermissionAction}
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </>
  );
}
