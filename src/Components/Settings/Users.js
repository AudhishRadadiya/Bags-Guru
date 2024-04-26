import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import PlusIcon from '../../Assets/Images/plus.svg';
import FilterIcon from '../../Assets/Images/filter.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ActionBtn from '../../Assets/Images/action.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import { Tag } from 'primereact/tag';
import _ from 'lodash';
import {
  deleteUser,
  deleteUserFilter,
  getUserList,
  getUserListFilter,
} from 'Services/Settings/userService';
import { useDispatch } from 'react-redux';
import CustomPaginator from 'Components/Common/CustomPaginator';
import { useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import { addFilter, updateFilter } from 'Services/partiesService';
import { getActiveOperatorRoleList } from 'Services/Settings/companyService';
import FilterOverlay from 'Components/Common/FilterOverlay';
import Skeleton from 'react-loading-skeleton';
import { statusObj } from 'Helper/Common';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { setIsGetInitialValuesUser } from 'Store/Reducers/Settings/User.slice';

const filterDetails = [
  { label: 'Emp No', value: 'emp_no', type: 'inputBox' },
  { label: 'Name', value: 'first_name', type: 'inputBox' },
  { label: 'Email', value: 'email', type: 'inputBox' },
  { label: 'Mobile', value: 'mobile_no', type: 'inputBox' },
  {
    label: 'Factory Location',
    value: 'factory_location_name',
    type: 'inputBox',
  },
  { label: 'DOB', value: 'dob', type: 'inputBox' },
  { label: 'DOJ', value: 'joining_date_formatted', type: 'inputBox' },
  { label: 'Type', value: 'role_type', type: 'dropDown' },
  { label: 'Designation', value: 'designation', type: 'dropDown' },
  { label: 'Status', value: 'is_active', type: 'dropDown' },
];

const roleType = [
  { label: 'Operator', value: 'operator' },
  { label: 'Staff', value: 'office_staff' },
];

const getSeverity = status => {
  switch (status) {
    case 'No':
      return 'danger';
    case 'Yes':
      return 'success';
    case 'renewal':
      return null;
    default:
      return;
  }
};

const content = (data, index, handleFilterEdit, handleFilterDelete) => {
  return (
    <>
      <span className="edit_icon" onClick={e => handleFilterEdit(data, index)}>
        <img src={EditIcon} alt="" />
      </span>
      <InputText
        value={data?.filter_name}
        readOnly
        onClick={e => handleFilterEdit(data, index)}
        style={{ cursor: 'pointer' }}
      />
      <Button
        className="btn_transperant"
        onClick={e => {
          handleFilterDelete(e, data, index);
        }}
      >
        <img src={TrashIcon} alt="" />
      </Button>
    </>
  );
};

export default function Users({ hasAccess }) {
  const { is_create_access, is_delete_access, is_edit_access } = hasAccess;
  const op = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  // const [selectRoleType, setSelectRoleType] = useState('operator');

  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const {
    usersLoading,
    usersCRUDLoading,
    userList,
    userCount,
    listFilter,
    isGetInitialValuesUser,
  } = useSelector(({ user }) => user);
  const {
    loading: settingLoading,
    userRoles,
    activeOperatorRole,
  } = useSelector(({ settings }) => settings);

  const { filterToggle, userFilters, searchQuery } = allCommon?.user;
  const { applied, filters, currentPage, pageLimit, selectedItemIndex } =
    allFilters?.user;

  const loadRequiredData = useCallback(() => {
    dispatch(
      getUserListFilter({
        module_name: 'users',
      }),
    );
    dispatch(getActiveOperatorRoleList());
  }, [dispatch]);

  useEffect(() => {
    loadRequiredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getUserList(pageLimit, currentPage, searchQuery, applied));
  }, [currentPage, pageLimit, applied, dispatch]);

  const filterOption = useMemo(() => {
    let flterOptionArray = [...filterDetails];
    if (filters?.length > 0) {
      flterOptionArray = flterOptionArray.map(item => {
        if (filters.find(item2 => item2.filter === item.value)) {
          return { ...item, disabled: true };
        }
        return item;
      });
    }
    return flterOptionArray;
  }, [filters]);

  const filterOptions = useMemo(() => {
    // const isOpDesignation =
    //   selectRoleType === 'operator' ? activeOperatorRole : [];
    // const isStaffDesignation =
    //   selectRoleType === 'office_staff' ? userRoles : [];

    return {
      role_type: roleType,
      // designation:
      //   selectRoleType === 'operator' ? isOpDesignation : isStaffDesignation,
      designation: activeOperatorRole?.concat(userRoles),
      is_active: statusObj,
      role_name: userRoles,
    };
  }, [userRoles, activeOperatorRole]);

  const onPageChange = useCallback(
    page => {
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(
        setAllFilters({
          ...allFilters,
          user: { ...allFilters?.user, currentPage: pageIndex },
        }),
      );
    },
    [currentPage, dispatch, allFilters],
  );
  const onPageRowsChange = useCallback(
    page => {
      dispatch(
        setAllFilters({
          ...allFilters,
          user: {
            ...allFilters?.user,
            currentPage: page === 0 ? 0 : 1,
            pageLimit: page,
          },
        }),
      );
    },
    [allFilters, dispatch],
  );

  const handleEdit = useCallback(
    user_id => {
      dispatch(
        setIsGetInitialValuesUser({
          ...isGetInitialValuesUser,
          update: false,
        }),
      );
      navigate(`/update-user/${user_id}`);
    },
    [dispatch, navigate],
  );

  const handleDelete = useCallback(
    async company_id => {
      if (company_id) {
        const result = await dispatch(deleteUser(company_id));
        if (result) {
          setDeletePopup(false);
          dispatch(getUserList(pageLimit, 1, searchQuery, applied));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageLimit],
  );

  const userAction = user => {
    return (
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
            {is_edit_access && (
              <Dropdown.Item onClick={() => handleEdit(user?._id)}>
                <img src={EditIcon} alt="" /> Edit
              </Dropdown.Item>
            )}
            {is_delete_access && (
              <Dropdown.Item
                onClick={() => {
                  setDeletePopup(user?._id);
                }}
              >
                <img src={TrashIcon} alt="" /> Delete
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const handleSaveFilter = useCallback(async () => {
    let res;
    setSaveFilterModal(false);

    const filterConvertToString = filters?.map(item => {
      if (Array.isArray(item?.value)) {
        let updated = item?.value?.join(', ');
        return { ...item, value: updated };
      } else {
        return item;
      }
    });

    if (isEdit) {
      let editPayload = {
        filter_id: filterId,
        module_name: 'users',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'users',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };

      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      dispatch(getUserList(pageLimit, 1, searchQuery, applied));
      dispatch(
        setAllFilters({
          ...allFilters,
          user: { ...allFilters?.user, currentPage: 1 },
        }),
      );
      loadRequiredData();
    }
    dispatch(
      setAllFilters({
        ...allFilters,
        user: { ...allFilters?.user, currentPage: 1 },
      }),
    );

    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [
    dispatch,
    filterId,
    filters,
    isEdit,
    loadRequiredData,
    nameFilter,
    allFilters,
    pageLimit,
    searchQuery,
    applied,
  ]);

  const handleAddFilter = useCallback(() => {
    dispatch(
      setAllFilters({
        ...allFilters,
        user: {
          ...allFilters?.user,
          filters: [...allFilters?.user?.filters, { filter: '', value: '' }],
        },
      }),
    );
  }, [allFilters, dispatch]);

  const applyFilterHandler = useCallback(() => {
    let filterArray = [];

    filters.forEach(item => {
      if (item.value) {
        filterArray.push(item);
      }
    });

    if (filterArray?.length > 0) {
      let filterObj = {};
      filterArray.forEach(item => {
        filterObj = { ...filterObj, ...{ [item.filter]: item.value } };
      });

      dispatch(
        setAllFilters({
          ...allFilters,
          user: { ...allFilters?.user, applied: filterObj },
        }),
      );
    }
  }, [filters, allFilters, dispatch]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        dispatch(
          setAllFilters({
            ...allFilters,
            user: {
              ...allFilters?.user,
              applied: {},
              filters: [],
              selectedItemIndex: '',
            },
          }),
        );
      } else {
        dispatch(
          setAllFilters({
            ...allFilters,
            user: {
              ...allFilters?.user,
              filters: [],
              selectedItemIndex: '',
            },
          }),
        );
      }
      if (isEdit) {
        setIsEdit(false);
      }
      op.current?.hide();
    },
    [allFilters, dispatch, applied, isEdit],
  );

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      dispatch(
        setAllFilters({
          ...allFilters,
          user: {
            ...allFilters?.user,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.user?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.user.selectedItemIndex !== ''
                ? ''
                : allFilters.user.selectedItemIndex,
          },
        }),
      );

      if (updatedFilters?.length === 0 && isEdit === true) {
        setIsEdit(false);
        setNameFilter('');
      }
    },
    [filters, dispatch, allFilters, isEdit],
  );

  // const handleFilterChange = useCallback(
  //   (index, field, value) => {
  //     const updatedFilters = [...filters];
  //     updatedFilters[index] =
  //       field === 'filter'
  //         ? { ...updatedFilters[index], [field]: value, value: '' }
  //         : { ...updatedFilters[index], [field]: value };
  //     if (
  //       updatedFilters[index].filter === 'role_type' &&
  //       value === 'operator'
  //     ) {
  //       setSelectRoleType('operator');
  //       const isDesignationIndex = updatedFilters?.findIndex(
  //         x => x?.filter === 'designation',
  //       );
  //       if (isDesignationIndex > 0)
  //         updatedFilters[isDesignationIndex].value = '';
  //     } else if (
  //       updatedFilters[index].filter === 'role_type' &&
  //       value === 'office_staff'
  //     ) {
  //       const isDesignationIndex = updatedFilters?.findIndex(
  //         x => x?.filter === 'designation',
  //       );
  //       if (isDesignationIndex > 0)
  //         updatedFilters[isDesignationIndex].value = '';
  //       setSelectRoleType('office_staff');
  //     }
  //     dispatch(
  //       setAllFilters({
  //         ...allFilters,
  //         user: { ...allFilters?.user, filters: updatedFilters },
  //       }),
  //     );
  //   },
  //   [filters, dispatch, allFilters],
  // );

  const handleFilterChange = (index, field, value) => {
    const updatedFilters = [...filters];

    if (field === 'filter' && updatedFilters[index]['value'] !== '') {
      updatedFilters[index] = {
        ...updatedFilters[index],
        [field]: value,
        value: '',
      };
    } else {
      updatedFilters[index] = { ...updatedFilters[index], [field]: value };
    }
    dispatch(
      setAllFilters({
        ...allFilters,
        user: { ...allFilters?.user, filters: updatedFilters },
      }),
    );
  };

  const selectedFilters = useMemo(() => {
    let filter = filters?.map(filter => {
      let filterDetail = filterDetails?.find(
        detail => detail.value === filter.filter,
      );
      return filterDetail ? filterDetail : null;
    });
    return filter;
  }, [filters]);

  const handleFilterEdit = useCallback(
    (data, index) => {
      const updatedFilterData = {
        ...data,
        filter_list: data.filter_list.map(item => {
          const findObj = filterDetails?.find(
            obj => obj?.value === item?.filter && obj?.type === 'dropDown',
          );
          if (findObj) {
            return { ...item, value: item.value.split(', ') };
          } else {
            return { ...item };
          }
        }),
      };

      dispatch(
        setAllFilters({
          ...allFilters,
          user: {
            ...allFilters?.user,
            filters: updatedFilterData?.filter_list,
            selectedItemIndex: index,
          },
        }),
      );
      setIsEdit(true);
      setNameFilter(
        data?.filter_name === 'role_name' ? 'role' : data?.filter_name,
      );
      setFilterId(data?._id);
    },
    [allFilters, dispatch],
  );

  const handleFilterDelete = useCallback(
    async (e, data, index) => {
      const res = await dispatch(
        deleteUserFilter({
          filter_id: data?._id,
          module_name: 'users',
        }),
      );
      if (res) {
        dispatch(
          setAllFilters({
            ...allFilters,
            user: {
              ...allFilters?.user,
              currentPage: 1,
              filters: [],
              applied: {},
              selectedItemIndex: '',
            },
          }),
        );
        loadRequiredData();
        dispatch(getUserList(pageLimit, 1, searchQuery, applied));
        setNameFilter('');
      }
    },
    [dispatch, pageLimit, searchQuery, applied, allFilters, loadRequiredData],
  );

  const statusBodyTemplate = rowData => {
    return (
      <Tag value={rowData?.status} severity={getSeverity(rowData?.status)} />
    );
  };

  const handleViewUser = data => {
    return (
      <span
        onClick={() => {
          // dispatch(
          //   setIsGetInitialValuesUser({
          //     ...isGetInitialValuesUser,
          //     view: false,
          //   }),
          // );
          navigate(`/user-details/${data._id}`, { state: { isView: true } });
        }}
      >
        {data?.first_name}
      </span>
    );
  };

  const handleSearchInput = e => {
    dispatch(
      setAllFilters({
        ...allFilters,
        user: {
          ...allFilters?.user,
          currentPage: 1,
        },
      }),
    );
    dispatch(getUserList(pageLimit, currentPage, e.target.value, applied));
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      {/* {(settingLoading || usersLoading || usersCRUDLoading) && <Loader />} */}
      {usersCRUDLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col md={3}>
                <div className="page_title">
                  <h3 className="m-0">Users</h3>
                </div>
              </Col>
              <Col md={9}>
                <div className="right_filter_wrapper">
                  <ul>
                    <li className="search_input_wrap">
                      <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          value={searchQuery}
                          className="input_wrap small search_wrap"
                          onChange={e => {
                            debounceHandleSearchInput(e);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                user: {
                                  ...allCommon?.user,
                                  searchQuery: e.target.value,
                                },
                              }),
                            );
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <Button
                        className={
                          Object.keys(applied)?.length > 0
                            ? 'btn_border filter_btn applied'
                            : 'btn_border filter_btn'
                        }
                        onClick={e => op.current?.toggle(e)}
                      >
                        <img src={FilterIcon} alt="" /> Filter
                      </Button>
                    </li>
                    <li>
                      <Button
                        className="btn_primary"
                        onClick={() => {
                          // is_create_access && navigate('/add-user')
                          if (is_create_access) {
                            dispatch(
                              setIsGetInitialValuesUser({
                                ...isGetInitialValuesUser,
                                add: false,
                              }),
                            );
                            navigate('/add-user');
                          }
                        }}
                        disabled={is_create_access ? false : true}
                      >
                        <img src={PlusIcon} alt="" />
                        Add User
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
                    user: {
                      ...allCommon?.user,
                      filterToggle: !filterToggle,
                    },
                  }),
                );
              }}
            >
              <img src={SearchIcon} alt="" />
            </button>
            <DataTable
              value={userList}
              sortMode="multiple"
              sortField="name"
              sortOrder={1}
              dataKey="_id"
              filters={userFilters}
              onFilter={event => {
                dispatch(
                  setAllCommon({
                    ...allCommon,
                    user: {
                      ...allCommon?.user,
                      userFilters: event?.filters,
                    },
                  }),
                );
              }}
              filterDisplay="row"
              emptyMessage={
                (settingLoading || usersLoading || usersCRUDLoading) && (
                  <Skeleton count={10} />
                )
              }
            >
              <Column
                field="emp_no"
                header="Emp No"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="first_name"
                header="Name"
                sortable
                filter={filterToggle}
                className="view_detail"
                body={handleViewUser}
              ></Column>
              <Column
                field="email"
                header="Email"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="mobile_no"
                header="Mobile"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="factory_location_name"
                header="Factory Location"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="dob"
                header="DOB"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="joining_date_formatted"
                header="DOJ"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="type"
                header="Type"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="designation"
                header="Designation"
                sortable
                filter={filterToggle}
              ></Column>
              <Column
                field="status"
                header="Active"
                sortable
                filter={filterToggle}
                body={statusBodyTemplate}
              ></Column>
              <Column field="action" header="Action" body={userAction}></Column>
            </DataTable>
            <CustomPaginator
              dataList={userList}
              pageLimit={pageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={currentPage}
              totalCount={userCount}
            />
          </div>
        </div>
        <Dialog
          header={`${isEdit ? 'Update' : 'Save'}  Personal Filters`}
          visible={saveFilterModal}
          draggable={false}
          className="modal_Wrapper modal_small"
          onHide={() => setSaveFilterModal(false)}
        >
          <div className="form_group mb-3">
            <InputText
              placeholder="Name your filter"
              name="nameFilter"
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
            />
          </div>
          <Button className="btn_primary" onClick={handleSaveFilter}>
            {isEdit ? 'Update Filter' : 'Save Filter'}
          </Button>
        </Dialog>
      </div>
      <FilterOverlay
        op={op}
        filters={filters}
        filterOption={filterOption}
        filterOptions={filterOptions}
        setNameFilter={setNameFilter}
        handleFilterChange={handleFilterChange}
        handleRemoveFilter={handleRemoveFilter}
        handleAddFilter={handleAddFilter}
        handleFilterEdit={handleFilterEdit}
        handleFilterDelete={handleFilterDelete}
        applyFilterHandler={applyFilterHandler}
        clearAppliedFilter={clearAppliedFilter}
        selectedFilters={selectedFilters}
        listFilter={listFilter}
        setSaveFilterModal={setSaveFilterModal}
        selectedItemIndex={selectedItemIndex}
        content={content}
      />
      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />
    </>
  );
}
