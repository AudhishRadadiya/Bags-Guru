import { useCallback, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Checkbox } from 'primereact/checkbox';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addRolePermissionSchema } from 'Schemas/Settings/addRolePermissionSchema';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import {
  createUserRoleWithPermission,
  getRoleWisePermission,
  updateModulePermission,
} from 'Services/Settings/RolePermissionService';
import { clearSelectedRolePermissions } from 'Store/Reducers/Settings/SettingSlice';
import Loader from 'Components/Common/Loader';
import { getUserRolesList } from 'Services/baseService';

const subPermissions = [
  'create',
  'view',
  'delete',
  'print',
  'import',
  'export',
  'edit',
];

export default function AddRolePermissions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role_id } = useParams();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');

  const {
    loading: settingLoading,
    settingsCRUDLoading,
    selectedRolePermission,
  } = useSelector(({ settings }) => settings);

  const loadData = useCallback(() => {
    dispatch(getRoleWisePermission(role_id, state?.role));
  }, [dispatch, role_id, state?.role]);

  useEffect(() => {
    if (locationPath?.length < 3) dispatch(clearSelectedRolePermissions());
    else if (role_id) loadData();
    return () => dispatch(clearSelectedRolePermissions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role_id, locationPath?.length]);

  const submitHandle = useCallback(
    async values => {
      let result;
      if (role_id) {
        const payload = {
          ...values,
          role_id: role_id,
        };
        result = await dispatch(updateModulePermission(payload));
      } else {
        const payload = {
          ...values,
        };
        result = await dispatch(createUserRoleWithPermission(payload));
      }
      if (result) {
        dispatch(clearSelectedRolePermissions());
        let res = dispatch(getUserRolesList());
        if (res) {
          navigate('/role-and-permissions');
        }
      }
    },
    [dispatch, navigate, role_id],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: selectedRolePermission,
    validationSchema: addRolePermissionSchema,
    onSubmit: submitHandle,
  });

  const handleCheckboxes = useCallback(
    (mainI, subI, val) => {
      setFieldValue(
        `permission[${mainI}].sub_module_permission[${subI}].import`,
        val,
      );
      setFieldValue(
        `permission[${mainI}].sub_module_permission[${subI}].create`,
        val,
      );
      setFieldValue(
        `permission[${mainI}].sub_module_permission[${subI}].view`,
        val,
      );
      setFieldValue(
        `permission[${mainI}].sub_module_permission[${subI}].print`,
        val,
      );
      setFieldValue(
        `permission[${mainI}].sub_module_permission[${subI}].delete`,
        val,
      );
      setFieldValue(
        `permission[${mainI}].sub_module_permission[${subI}].edit`,
        val,
      );
      setFieldValue(
        `permission[${mainI}].sub_module_permission[${subI}].export`,
        val,
      );
    },
    [setFieldValue],
  );

  const onSelectRowAll = useCallback(
    (mainIndex, subIndex, val) => {
      setFieldValue(`permission[${mainIndex}].isSelectedAll`, val);
      handleCheckboxes(mainIndex, subIndex, val);
    },
    [handleCheckboxes, setFieldValue],
  );

  const onSelectAll = useCallback(
    (mainIndex, val) => {
      setFieldValue(`permission[${mainIndex}].isSelectedAll`, val);
      for (
        let i = 0;
        i < values?.permission[mainIndex].sub_module_permission?.length;
        i++
      ) {
        handleCheckboxes(mainIndex, i, val);
      }
    },
    [handleCheckboxes, setFieldValue, values?.permission],
  );

  const areAllSubPermissionsSelected = useCallback(
    (mainIndex, subIndex) => {
      return subPermissions.every(
        permission =>
          values?.permission?.[mainIndex]?.sub_module_permission?.[subIndex]?.[
            permission
          ] === 1,
      );
    },
    [values?.permission],
  );

  const areAllPermissionsSelected = useCallback(
    mainIndex => {
      return subPermissions.every(permission =>
        values?.permission?.[mainIndex]?.sub_module_permission?.every(
          sub => sub[permission] === 1,
        ),
      );
    },
    [values?.permission],
  );

  const onCancel = useCallback(() => {
    dispatch(clearSelectedRolePermissions());
    navigate('/role-and-permissions');
  }, [dispatch, navigate]);

  return (
    <>
      {settingsCRUDLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="border rounded-3 bg_white p-3">
          <Col md={12}>
            <div className="page_title">
              <h3 className="mb-3">Roles & Permissions</h3>
            </div>
          </Col>
          <Row>
            <Col lg={3} md={4}>
              <div className="form_group mb-3">
                <label htmlFor="role">
                  Role Name <span className="text-danger fs-4">*</span>
                </label>
                <InputText
                  id="role"
                  placeholder="Role Name"
                  name="name"
                  value={values?.name || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!!role_id}
                />
                {touched?.name && errors?.name && (
                  <p className="text-danger">{errors?.name}</p>
                )}
              </div>
            </Col>
            <Col lg={3} md={4}>
              <div className="form_group mb-3">
                <label htmlFor="comment">Comment</label>
                <InputText
                  id="comment"
                  placeholder="Write Comment"
                  name="comment"
                  value={values?.comment || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={state?.isView}
                />
                {touched?.comment && errors?.comment && (
                  <p className="text-danger">{errors?.comment}</p>
                )}
              </div>
            </Col>
            <Col lg={3} md={4}>
              <div className="form_group">
                <label>Status</label>
              </div>
              <div className="d-flex flex-wrap gap-3 custom_radio_wrappper mb-3">
                <Checkbox
                  value={values?.is_active}
                  inputId="is_active"
                  name="is_active"
                  checked={values?.is_active === 1}
                  onChange={e =>
                    setFieldValue('is_active', e.target.checked ? 1 : 0)
                  }
                  disabled={state?.isView}
                />
                <label htmlFor="Create1">Active </label>

                {touched?.is_active && errors?.is_active && (
                  <p className="text-danger">{errors?.is_active}</p>
                )}
              </div>
            </Col>
          </Row>
          <div className="accordion_wrapper">
            <Accordion activeIndex={0}>
              {values?.permission?.map((x, mainI) => {
                return (
                  <AccordionTab
                    key={mainI}
                    header={
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{x?.name}</span>
                        <div className="form_group checkbox_wrap with_input mt-0 justify-content-end align-items-center">
                          <Checkbox
                            inputId="Active"
                            name="Active"
                            value={x?.isSelectedAll}
                            onChange={e =>
                              onSelectAll(mainI, e.target.checked ? 1 : 0)
                            }
                            checked={areAllPermissionsSelected(mainI)}
                            disabled={state?.isView}
                          />
                          <label htmlFor="Active" className="ms-1">
                            Select All
                          </label>
                        </div>
                      </div>
                    }
                  >
                    {x?.sub_module_permission?.map((y, subI) => {
                      return (
                        <section className="m-0" key={subI}>
                          <Row>
                            <Col lg={2}>
                              <span className="grey_text">{y?.name}</span>
                            </Col>
                            <Col lg={8}>
                              <div className="add_role_check_wrap">
                                <ul>
                                  <li>
                                    <div className="form_group checkbox_wrap with_input mt-0">
                                      <Checkbox
                                        inputId="Create"
                                        name="create"
                                        value={y?.create}
                                        onChange={e =>
                                          setFieldValue(
                                            `permission[${mainI}].sub_module_permission[${subI}].create`,
                                            e.target.checked ? 1 : 0,
                                          )
                                        }
                                        checked={
                                          values?.permission[mainI]
                                            ?.sub_module_permission[subI]
                                            ?.create === 1
                                        }
                                        disabled={state?.isView}
                                      />
                                      <label htmlFor="Create">Create</label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="form_group checkbox_wrap with_input mt-0">
                                      <Checkbox
                                        inputId="Edit"
                                        name="Edit"
                                        value={y?.edit}
                                        onChange={e =>
                                          setFieldValue(
                                            `permission[${mainI}].sub_module_permission[${subI}].edit`,
                                            e.target.checked ? 1 : 0,
                                          )
                                        }
                                        checked={
                                          values?.permission[mainI]
                                            ?.sub_module_permission[subI]
                                            ?.edit === 1
                                        }
                                        disabled={state?.isView}
                                      />
                                      <label htmlFor="Edit">Edit</label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="form_group checkbox_wrap with_input mt-0">
                                      <Checkbox
                                        inputId="View"
                                        name="View"
                                        value={y?.view}
                                        onChange={e =>
                                          setFieldValue(
                                            `permission[${mainI}].sub_module_permission[${subI}].view`,
                                            e.target.checked ? 1 : 0,
                                          )
                                        }
                                        checked={
                                          values?.permission[mainI]
                                            ?.sub_module_permission[subI]
                                            ?.view === 1
                                        }
                                        disabled={state?.isView}
                                      />
                                      <label htmlFor="View">View</label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="form_group checkbox_wrap with_input mt-0">
                                      <Checkbox
                                        inputId="Export"
                                        name="Export"
                                        value={y?.export}
                                        onChange={e =>
                                          setFieldValue(
                                            `permission[${mainI}].sub_module_permission[${subI}].export`,
                                            e.target.checked ? 1 : 0,
                                          )
                                        }
                                        checked={
                                          values?.permission[mainI]
                                            ?.sub_module_permission[subI]
                                            ?.export === 1
                                        }
                                        disabled={state?.isView}
                                      />
                                      <label htmlFor="Export">Export</label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="form_group checkbox_wrap with_input mt-0">
                                      <Checkbox
                                        inputId="Import"
                                        name="Import"
                                        value={y?.import}
                                        onChange={e =>
                                          setFieldValue(
                                            `permission[${mainI}].sub_module_permission[${subI}].import`,
                                            e.target.checked ? 1 : 0,
                                          )
                                        }
                                        checked={
                                          values?.permission[mainI]
                                            ?.sub_module_permission[subI]
                                            ?.import === 1
                                        }
                                        disabled={state?.isView}
                                      />
                                      <label htmlFor="Import">Import</label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="form_group checkbox_wrap with_input mt-0">
                                      <Checkbox
                                        inputId="Delete"
                                        name="Delete"
                                        value={y?.delete}
                                        onChange={e =>
                                          setFieldValue(
                                            `permission[${mainI}].sub_module_permission[${subI}].delete`,
                                            e.target.checked ? 1 : 0,
                                          )
                                        }
                                        checked={
                                          values?.permission[mainI]
                                            ?.sub_module_permission[subI]
                                            ?.delete === 1
                                        }
                                        disabled={state?.isView}
                                      />
                                      <label htmlFor="Delete">Delete</label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="form_group checkbox_wrap with_input mt-0">
                                      <Checkbox
                                        inputId="Print"
                                        name="Print"
                                        value={y?.print}
                                        onChange={e =>
                                          setFieldValue(
                                            `permission[${mainI}].sub_module_permission[${subI}].print`,
                                            e.target.checked ? 1 : 0,
                                          )
                                        }
                                        checked={
                                          values?.permission[mainI]
                                            ?.sub_module_permission[subI]
                                            ?.print === 1
                                        }
                                        disabled={state?.isView}
                                      />
                                      <label htmlFor="Print">Print</label>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </Col>
                            <Col lg={2}>
                              <div className="form_group checkbox_wrap with_input mt-0 justify-content-lg-end">
                                <Checkbox
                                  inputId="Active"
                                  name="Active"
                                  value="Active"
                                  onChange={e =>
                                    onSelectRowAll(
                                      mainI,
                                      subI,
                                      e.target.checked ? 1 : 0,
                                      values,
                                    )
                                  }
                                  checked={areAllSubPermissionsSelected(
                                    mainI,
                                    subI,
                                  )}
                                  disabled={state?.isView}
                                />
                                <label htmlFor="Active" className="ms-1">
                                  Select All
                                </label>
                              </div>
                            </Col>
                          </Row>
                        </section>
                      );
                    })}
                  </AccordionTab>
                );
              })}
            </Accordion>
          </div>
          <div className="button_group d-flex align-items-center justify-content-end pt-3">
            <Button
              type="button"
              className="btn_border btn btn-primary"
              onClick={onCancel}
              disabled={settingsCRUDLoading}
            >
              Cancel
            </Button>
            {locationPath &&
              locationPath[1] !== 'role-and-permissions-details' && (
                <Button
                  type="button"
                  className="btn_primary ms-3 btn btn-primary"
                  onClick={() => handleSubmit(values)}
                >
                  {role_id ? 'Update' : 'Save'}
                </Button>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
