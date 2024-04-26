import { Button } from 'react-bootstrap';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Col, Dropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import FilterIcon from '../../Assets/Images/filter.svg';
import ImportIcon from '../../Assets/Images/import.svg';
import ExportIcon from '../../Assets/Images/export.svg';
import SearchIcon from '../../Assets/Images/search.svg';
import PlusIcon from '../../Assets/Images/plus.svg';
import ActionBtn from '../../Assets/Images/action.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import _ from 'lodash';
import {
  addFilter,
  deleteFilter,
  deletePartiesDetails,
  getExportPartiesExcel,
  getExportPartiesPdf,
  getExportTransportersPartiesExcel,
  getExportTransportersPartiesPdf,
  getListFilter,
  getPartiesActiveIndustry,
  getPartiesActivePartyTypes,
  getPartiesAdvisor,
  getPartiesCitiesWithoutState,
  getPartiesCustomerSource,
  getPartiesCustomerSourceDetail,
  getPartiesList,
  getPartiesStateWithoutCountry,
  getTransporterPartiesList,
  updateFilter,
} from 'Services/partiesService';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ConfirmDialog from 'Components/Common/ConfirmDialog';
import CustomPaginator from 'Components/Common/CustomPaginator';
import FilterOverlay from 'Components/Common/FilterOverlay';
import Skeleton from 'react-loading-skeleton';
import { statusObj } from 'Helper/Common';
import { Tag } from 'primereact/tag';
import { setAllCommon, setAllFilters } from 'Store/Reducers/Common';
import { getSingleListGC } from 'Services/Settings/generalConfigurationService';
import {
  clearAddSelectedPartyData,
  clearPartiesInitialValues,
  setImporttedParties,
  setIsGetInitialValuesParty,
  setOnlyTransporterPartyList,
} from 'Store/Reducers/Parties/parties.slice';
import Loader from 'Components/Common/Loader';

const partiesFilterDetails = [
  { label: 'Party Type', value: 'party_type', type: 'dropDown' },
  { label: 'Party Name', value: 'party_name', type: 'inputBox' },
  { label: 'Contact Number', value: 'personal_contact_no', type: 'inputBox' },
  { label: 'State', value: 'state_name', type: 'dropDown' },
  { label: 'City', value: 'city_name', type: 'dropDown' },
  { label: 'Present Advisor', value: 'present_advisor', type: 'dropDown' },
  { label: 'Industry', value: 'industry', type: 'dropDown' },
  { label: 'Customer Source', value: 'customer_source', type: 'dropDown' },
  {
    label: 'Customer Source detail',
    value: 'customer_source_detail_name',
    type: 'dropDown',
  },
  { label: 'GST', value: 'gst', type: 'inputBox' },
  { label: 'Mobile App', value: 'is_mobile_app_registered', type: 'dropDown' },
  { label: 'Rate List', value: 'bag_rate_list', type: 'dropDown' },
];
const transporterFilterDetails = [
  { label: 'Party Name', value: 'party_name', type: 'inputBox' },
  { label: 'Contact Number', value: 'personal_contact_no', type: 'inputBox' },
  { label: 'State', value: 'state_name', type: 'dropDown' },
  { label: 'City', value: 'city_name', type: 'dropDown' },
  { label: 'Present Advisor', value: 'present_advisor', type: 'dropDown' },
  { label: 'Industry', value: 'industry', type: 'dropDown' },
  { label: 'Customer Source', value: 'customer_source', type: 'dropDown' },
  {
    label: 'Customer Source detail',
    value: 'customer_source_detail_name',
    type: 'dropDown',
  },
  { label: 'GST', value: 'gst', type: 'inputBox' },
  { label: 'Mobile App', value: 'is_mobile_app_registered', type: 'dropDown' },
  { label: 'Rate List', value: 'bag_rate_list', type: 'dropDown' },
];

const HomePage = ({ hasAccess }) => {
  const {
    is_create_access,
    is_delete_access,
    is_edit_access,
    is_import_access,
    is_export_access,
  } = hasAccess;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    listParties,
    partiesListCount,
    partiesLoading,
    partiesListLoading,
    partiesActivePartyTypes,
    partiesStateWithoutCountry,
    partiesCitiesWithoutState,
    partiesAdvisor,
    partiesActiveIndustry,
    partiesCustomerSource,
    listFilter,
    onlyTransporterPartyList,
    partiesCustomerSourceDetail,
    partiesCRUDLoading,
    isGetInitialValuesParty,
  } = useSelector(({ parties }) => parties);

  const { singleListGC, gCLoading } = useSelector(
    ({ generalConfiguration }) => generalConfiguration,
  );

  const { allFilters, allCommon } = useSelector(({ common }) => common);
  const {
    filterToggle,
    transporterFilterToggle,
    searchQuery,
    isTransporterOnly,
    partyFilters,
    transporterFilters,
  } = allCommon?.parties;
  const {
    applied,
    filters,
    currentPage,
    pageLimit,
    selectedItemIndex,
    transporterPageLimit,
    transporterCurrentPage,
  } = allFilters?.parties;

  const op = useRef(null);
  // const [filters, setFilters] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const rateListObj = [...Array(singleListGC?.mobile_rate_list_count)]?.map(
    (_, index) => ({
      label: `Rate List ${index + 1}`,
      value: index + 1,
    }),
  );

  const handleListingData = useCallback(
    data => {
      if (isTransporterOnly) {
        dispatch(
          getTransporterPartiesList(
            transporterPageLimit,
            transporterCurrentPage,
            searchQuery,
            applied,
          ),
        );
      } else {
        dispatch(getPartiesList(pageLimit, currentPage, searchQuery, applied));
      }
    },
    [
      applied,
      currentPage,
      dispatch,
      isTransporterOnly,
      pageLimit,
      searchQuery,
      transporterCurrentPage,
      transporterPageLimit,
    ],
  );

  // useEffect(() => {
  //   // const getData = setTimeout(() => {
  //   if (isTransporterOnly) {
  //     dispatch(
  //       getTransporterPartiesList(
  //         transporterPageLimit,
  //         transporterCurrentPage,
  //         searchQuery,
  //         applied,
  //       ),
  //     );
  //   } else {
  //     dispatch(getPartiesList(pageLimit, currentPage, searchQuery, applied));
  //   }
  //   // }, 700);
  //   // return () => clearTimeout(getData);
  // }, [
  //   applied,
  //   currentPage,
  //   dispatch,
  //   pageLimit,
  //   // searchQuery,
  //   isTransporterOnly,
  //   transporterCurrentPage,
  //   transporterPageLimit,
  // ]);

  const loadRequiredData = useCallback(() => {
    dispatch(
      getListFilter({
        module_name: 'parties',
      }),
    );
    handleListingData();
    dispatch(getPartiesActivePartyTypes());
    dispatch(getPartiesStateWithoutCountry());
    dispatch(getPartiesCitiesWithoutState());
    dispatch(getPartiesAdvisor());
    dispatch(getPartiesActiveIndustry());
    dispatch(getPartiesCustomerSource());
    dispatch(getPartiesCustomerSourceDetail());
    dispatch(getSingleListGC());
  }, [dispatch, handleListingData]);

  useEffect(() => {
    loadRequiredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customerSourceDetailOptions = useMemo(() => {
    return partiesCustomerSourceDetail?.map(customerSource => ({
      label: customerSource?.name,
      value: customerSource?.name,
    }));
  }, [partiesCustomerSourceDetail]);

  const onPageChange = useCallback(
    page => {
      // dispatch(setListParties([]));
      let pageIndex = currentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;

      dispatch(
        setAllFilters({
          ...allFilters,
          parties: { ...allFilters?.parties, currentPage: pageIndex },
        }),
      );

      dispatch(getPartiesList(pageLimit, pageIndex, searchQuery, applied));
    },
    [currentPage, dispatch, allFilters, searchQuery, applied, pageLimit],
  );

  const onTransporterPageChange = useCallback(
    page => {
      dispatch(
        setOnlyTransporterPartyList({ ...onlyTransporterPartyList, list: [] }),
      );
      let pageIndex = transporterCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(
        setAllFilters({
          ...allFilters,
          parties: {
            ...allFilters?.parties,
            transporterCurrentPage: pageIndex,
          },
        }),
      );
      dispatch(
        getTransporterPartiesList(
          transporterPageLimit,
          pageIndex,
          searchQuery,
          applied,
        ),
      );
    },
    [
      dispatch,
      onlyTransporterPartyList,
      transporterCurrentPage,
      allFilters,
      transporterPageLimit,
      searchQuery,
      applied,
    ],
  );

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
        parties: { ...allFilters?.parties, filters: updatedFilters },
      }),
    );
  };

  const handleAddFilter = () => {
    dispatch(
      setAllFilters({
        ...allFilters,
        parties: {
          ...allFilters?.parties,
          filters: [...allFilters?.parties?.filters, { filter: '', value: '' }],
        },
      }),
    );
  };

  const handleRemoveFilter = useCallback(
    index => {
      const updatedFilters = [...filters];
      updatedFilters.splice(index, 1);

      const updatedFilter =
        updatedFilters?.length === 0 &&
        Object.keys(allFilters?.parties?.applied)?.length > 0;

      if (updatedFilter) {
        if (isTransporterOnly) {
          dispatch(
            getTransporterPartiesList(
              transporterPageLimit,
              transporterCurrentPage,
              searchQuery,
              {},
            ),
          );
        } else {
          dispatch(getPartiesList(pageLimit, currentPage, searchQuery, {}));
        }
      }

      dispatch(
        setAllFilters({
          ...allFilters,
          parties: {
            ...allFilters?.parties,
            ...(updatedFilters?.length === 0 &&
              Object.keys(allFilters?.parties?.applied)?.length > 0 && {
                applied: {},
              }),
            filters: [...updatedFilters],
            selectedItemIndex:
              updatedFilters?.length === 0 &&
              allFilters.parties.selectedItemIndex !== ''
                ? ''
                : allFilters.parties.selectedItemIndex,
          },
        }),
      );

      if (updatedFilters?.length === 0 && isEdit === true) {
        setIsEdit(false);
        setNameFilter('');
      }
    },
    [
      filters,
      dispatch,
      allFilters,
      isTransporterOnly,
      isEdit,
      transporterPageLimit,
      transporterCurrentPage,
      searchQuery,
      pageLimit,
      currentPage,
    ],
  );

  const selectedFilters = filters?.map(filter => {
    let filterDetailView = isTransporterOnly
      ? transporterFilterDetails
      : partiesFilterDetails;
    const filterDetail = filterDetailView?.find(
      detail => detail.value === filter.filter,
    );
    return filterDetail ? filterDetail : null;
  });

  const onPageRowsChange = useCallback(
    page => {
      // dispatch(setListParties([]));
      const updatedCurrentPage = page === 0 ? 0 : 1;

      dispatch(
        setAllFilters({
          ...allFilters,
          parties: {
            ...allFilters?.parties,
            currentPage: updatedCurrentPage,
            pageLimit: page,
          },
        }),
      );

      dispatch(getPartiesList(page, updatedCurrentPage, searchQuery, applied));
    },
    [allFilters, applied, dispatch, searchQuery],
  );

  const onJobsPageRowsChange = useCallback(
    page => {
      const updatedCurrentPage = page === 0 ? 0 : 1;

      dispatch(
        setOnlyTransporterPartyList({ ...onlyTransporterPartyList, list: [] }),
      );
      dispatch(
        setAllFilters({
          ...allFilters,
          parties: {
            ...allFilters?.parties,
            transporterCurrentPage: updatedCurrentPage,
            transporterPageLimit: page,
          },
        }),
      );
      dispatch(
        getTransporterPartiesList(
          page,
          updatedCurrentPage,
          searchQuery,
          applied,
        ),
      );
    },
    [dispatch, onlyTransporterPartyList, allFilters, searchQuery, applied],
  );

  const handleEdit = useCallback(
    party_id => {
      let partyList = isTransporterOnly
        ? onlyTransporterPartyList
        : listParties;
      const user = partyList?.list?.find(x => x?._id === party_id);
      if (user) {
        dispatch(
          setIsGetInitialValuesParty({
            ...isGetInitialValuesParty,
            update: false,
          }),
        );
        navigate(`/update-parties/${party_id}`);
      }
    },
    [listParties, navigate, isTransporterOnly, onlyTransporterPartyList],
  );

  const handleDelete = useCallback(
    async party_id => {
      if (party_id) {
        const result = await dispatch(deletePartiesDetails(party_id));
        if (result) {
          if (isTransporterOnly) {
            dispatch(
              getTransporterPartiesList(
                transporterPageLimit,
                transporterCurrentPage,
                searchQuery,
                applied,
              ),
            );
          } else {
            dispatch(
              getPartiesList(pageLimit, currentPage, searchQuery, applied),
            );
          }
          setDeletePopup(false);
        }
        // dispatch(getPartiesList(pageLimit, currentPage, searchQuery, applied));
      }
    },
    [
      dispatch,
      isTransporterOnly,
      pageLimit,
      currentPage,
      searchQuery,
      applied,
      transporterPageLimit,
      transporterCurrentPage,
    ],
  );

  const partiesAction = useCallback(
    party => {
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
                <Dropdown.Item onClick={() => handleEdit(party?._id)}>
                  <img src={EditIcon} alt="" /> Edit
                </Dropdown.Item>
              )}
              {is_delete_access && (
                <Dropdown.Item
                  onClick={() => {
                    setDeletePopup(party?._id);
                  }}
                >
                  <img src={TrashIcon} alt="" /> Delete
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    },
    [handleEdit, is_delete_access, is_edit_access],
  );
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
  const isActiveDetail = row => {
    return (
      <Tag
        value={row?.active_status}
        severity={getSeverity(row?.active_status)}
      />
    );
  };

  const handleFilterEdit = (data, index) => {
    const sortingFiletr = [
      ...partiesFilterDetails,
      ...transporterFilterDetails,
    ];

    const updatedFilterData = {
      ...data,
      filter_list: data?.filter_list?.map(item => {
        const findObj = sortingFiletr?.find(
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
        parties: {
          ...allFilters?.parties,
          filters: updatedFilterData?.filter_list,
          selectedItemIndex: index,
        },
      }),
    );
    setIsEdit(true);
    setNameFilter(data?.filter_name);
    setFilterId(data?._id);
  };

  const handleFilterDelete = async (e, data, index) => {
    const res = await dispatch(
      deleteFilter({
        filter_id: data?._id,
        module_name: 'parties',
      }),
    );
    if (res) {
      dispatch(
        setAllFilters({
          ...allFilters,
          parties: {
            ...allFilters?.parties,
            currentPage: 1,
            filters: [],
            selectedItemIndex: '',
            applied: {},
          },
        }),
      );
      dispatch(
        getListFilter({
          module_name: 'parties',
        }),
      );
      if (isTransporterOnly) {
        dispatch(
          getTransporterPartiesList(transporterPageLimit, 1, searchQuery, {}),
        );
      } else {
        dispatch(getPartiesList(pageLimit, 1, searchQuery, {}));
      }
      setNameFilter('');
      op.current?.hide();
    }
  };

  const applyFilterHandler = () => {
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
          parties: {
            ...allFilters?.parties,
            applied: filterObj,
            currentPage: isTransporterOnly ? currentPage : 1,
            transporterCurrentPage: isTransporterOnly
              ? 1
              : transporterCurrentPage,
          },
        }),
      );

      if (isTransporterOnly) {
        dispatch(
          getTransporterPartiesList(
            transporterPageLimit,
            1,
            searchQuery,
            filterObj,
          ),
        );
      } else {
        dispatch(getPartiesList(pageLimit, 1, searchQuery, filterObj));
      }
    }
  };
  // , [
  //   filters,
  //   dispatch,
  //   allFilters,
  //   currentPage,
  //   isTransporterOnly,
  //   transporterCurrentPage,
  // ]);

  const clearAppliedFilter = useCallback(
    index => {
      if (Object.keys(applied)?.length > 0) {
        if (isTransporterOnly) {
          dispatch(
            getTransporterPartiesList(transporterPageLimit, 1, searchQuery, {}),
          );
        } else {
          dispatch(getPartiesList(pageLimit, 1, searchQuery, {}));
        }

        dispatch(
          setAllFilters({
            ...allFilters,
            parties: {
              ...allFilters?.parties,
              applied: {},
              filters: [],
              selectedItemIndex: '',
              currentPage: isTransporterOnly ? currentPage : 1,
              transporterCurrentPage: isTransporterOnly
                ? 1
                : transporterCurrentPage,
            },
          }),
        );
      } else {
        dispatch(
          setAllFilters({
            ...allFilters,
            parties: {
              ...allFilters?.parties,
              filters: [],
              selectedItemIndex: '',
              currentPage: isTransporterOnly ? currentPage : 1,
              transporterCurrentPage: isTransporterOnly
                ? 1
                : transporterCurrentPage,
            },
          }),
        );
      }

      if (isEdit) {
        setIsEdit(false);
      }
      op.current?.hide();
    },
    [
      applied,
      isTransporterOnly,
      isEdit,
      dispatch,
      allFilters,
      currentPage,
      transporterCurrentPage,
      transporterPageLimit,
      searchQuery,
      pageLimit,
    ],
  );

  const content = (data, index, handleFilterEdit, handleFilterDelete) => {
    return (
      <>
        <span
          className="edit_icon"
          onClick={e => handleFilterEdit(data, index)}
        >
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
        module_name: 'parties',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(updateFilter(editPayload));
    } else {
      let addPayload = {
        module_name: 'parties',
        filter_name: nameFilter,
        filter_list: filterConvertToString,
      };
      res = await dispatch(addFilter(addPayload));
    }
    if (res) {
      dispatch(
        getListFilter({
          module_name: 'parties',
        }),
      );

      op.current?.hide();
    }

    setNameFilter('');
    setFilterId('');
    setIsEdit(false);
  }, [dispatch, filterId, filters, isEdit, nameFilter]);

  const filterOption = useMemo(() => {
    let filterArray = isTransporterOnly
      ? transporterFilterDetails
      : partiesFilterDetails;
    let flterOptionArray = [...filterArray];
    if (filters?.length > 0) {
      flterOptionArray = flterOptionArray?.map(item => {
        if (filters.find(item2 => item2.filter === item.value)) {
          return { ...item, disabled: true };
        }
        return item;
      });
    }
    return flterOptionArray;
  }, [filters, isTransporterOnly]);

  // For create Drop-Down :
  const filterOptions = useMemo(() => {
    return {
      party_type: partiesActivePartyTypes,
      state_name: partiesStateWithoutCountry,
      city_name: partiesCitiesWithoutState,
      present_advisor: partiesAdvisor,
      industry: partiesActiveIndustry,
      customer_source: partiesCustomerSource,
      status: statusObj,
      is_mobile_app_registered: statusObj,
      bag_rate_list: rateListObj,
      customer_source_detail_name: customerSourceDetailOptions,
    };
  }, [
    partiesActiveIndustry,
    partiesActivePartyTypes,
    partiesAdvisor,
    partiesCitiesWithoutState,
    partiesCustomerSource,
    partiesStateWithoutCountry,
    rateListObj,
    customerSourceDetailOptions,
  ]);

  const partyNameTemplate = data => {
    return (
      <span
        onClick={() => {
          dispatch(
            setIsGetInitialValuesParty({
              ...isGetInitialValuesParty,
              view: false,
            }),
          );

          navigate(`/parties-details/${data._id}`, {
            state: { isView: true },
          });
        }}
      >
        {data?.party_name}
      </span>
    );
  };

  const partiesListView = useMemo(() => {
    return (
      <div className="data_table_wrapper with_colspan_head cell_padding_large is_filter">
        <button
          type="button"
          className="table_filter_btn"
          onClick={e => {
            dispatch(
              setAllCommon({
                ...allCommon,
                parties: {
                  ...allCommon?.parties,
                  filterToggle: !filterToggle,
                  // transporterFilterToggle: false,
                },
              }),
            );
          }}
        >
          <img src={SearchIcon} alt="" />
        </button>

        <DataTable
          value={listParties?.list}
          sortMode="multiple"
          sortField="name"
          sortOrder={1}
          dataKey="_id"
          filterDisplay="row"
          filters={partyFilters}
          onFilter={event => {
            dispatch(
              setAllCommon({
                ...allCommon,
                parties: {
                  ...allCommon?.parties,
                  partyFilters: event?.filters,
                },
              }),
            );
          }}
          emptyMessage={
            (partiesListLoading || partiesLoading || gCLoading) && (
              <Skeleton count={11} />
            )
          }
        >
          <Column
            field="party_type_name"
            header="Party Type"
            sortable
            filter={filterToggle}
          ></Column>
          <Column
            field="party_name"
            header="Party Name"
            sortable
            filter={filterToggle}
            className="view_detail"
            body={partyNameTemplate}
          ></Column>
          <Column
            field="personal_contact_no"
            header="Contact Number"
            sortable
            filter={filterToggle}
          ></Column>
          <Column
            field="state_name"
            header="State"
            sortable
            filter={filterToggle}
          ></Column>
          <Column
            field="city_name"
            header="City"
            sortable
            filter={filterToggle}
          ></Column>
          <Column
            field="present_advisor_name"
            header="Present Advisor"
            sortable
            filter={filterToggle}
          ></Column>
          <Column
            field="industry_name"
            header="Industry"
            sortable
            filter={filterToggle}
          ></Column>
          <Column
            field="customer_source_name"
            header="Customer Source"
            sortable
            filter={filterToggle}
          ></Column>
          <Column
            field="customer_source_detail_name"
            header="Customer Source detail"
            sortable
            filter={filterToggle}
          ></Column>
          <Column
            field="gst"
            header="GST"
            sortable
            filter={filterToggle}
          ></Column>
          <Column
            field="mobile_registered"
            header="Mobile App"
            sortable
            filter={filterToggle}
          ></Column>
          <Column
            field="bag_rate_list_str"
            header="Rate List"
            sortable
            filter={filterToggle}
          ></Column>
          <Column
            field="comment"
            header="Comments"
            sortable
            filter={filterToggle}
          ></Column>
          <Column
            field="active_status"
            header="Active"
            sortable
            body={isActiveDetail}
            filter={filterToggle}
          ></Column>
          <Column field="action" header="Action" body={partiesAction}></Column>
        </DataTable>
        <CustomPaginator
          dataList={listParties?.list}
          pageLimit={pageLimit}
          onPageChange={onPageChange}
          onPageRowsChange={onPageRowsChange}
          currentPage={currentPage}
          totalCount={listParties?.count}
        />
      </div>
    );
  }, [
    filterToggle,
    currentPage,
    onPageChange,
    transporterFilterToggle,
    pageLimit,
    partiesAction,
    partyNameTemplate,
    dispatch,
    allCommon,
    isActiveDetail,
    onPageRowsChange,
    listParties,
    partiesListCount,
    partiesLoading,
    partyFilters,
  ]);

  const transporterListView = useMemo(() => {
    return (
      <div className="data_table_wrapper with_colspan_head cell_padding_large is_filter">
        <button
          type="button"
          className="table_filter_btn"
          onClick={e => {
            dispatch(
              setAllCommon({
                ...allCommon,
                parties: {
                  ...allCommon?.parties,
                  transporterFilterToggle: !transporterFilterToggle,
                  // filterToggle: false,
                },
              }),
            );
          }}
        >
          <img src={SearchIcon} alt="" />
        </button>
        <DataTable
          value={onlyTransporterPartyList?.list}
          sortMode="multiple"
          sortField="name"
          sortOrder={1}
          dataKey="_id"
          filterDisplay="row"
          filters={transporterFilters}
          onFilter={event => {
            dispatch(
              setAllCommon({
                ...allCommon,
                parties: {
                  ...allCommon?.parties,
                  transporterFilters: event?.filters,
                },
              }),
            );
          }}
          emptyMessage={
            (partiesListLoading || partiesLoading || gCLoading) && (
              <Skeleton count={10} />
            )
          }
        >
          <Column
            field="party_type_name"
            header="Party Type"
            sortable
            filter={transporterFilterToggle}
          ></Column>
          <Column
            field="party_name"
            header="Party Name"
            sortable
            filter={transporterFilterToggle}
            className="view_detail"
            body={partyNameTemplate}
          ></Column>
          <Column
            field="personal_contact_no"
            header="Contact Number"
            sortable
            filter={transporterFilterToggle}
          ></Column>
          <Column
            field="state_name"
            header="State"
            sortable
            filter={transporterFilterToggle}
          ></Column>
          <Column
            field="city_name"
            header="City"
            sortable
            filter={transporterFilterToggle}
          ></Column>
          <Column
            field="present_advisor_name"
            header="Present Advisor"
            sortable
            filter={transporterFilterToggle}
          ></Column>
          <Column
            field="industry_name"
            header="Industry"
            sortable
            filter={transporterFilterToggle}
          ></Column>
          <Column
            field="customer_source_name"
            header="Customer Source"
            sortable
            filter={transporterFilterToggle}
          ></Column>
          <Column
            field="customer_source_detail_name"
            header="Customer Source detail"
            sortable
            filter={transporterFilterToggle}
          ></Column>
          <Column
            field="gst"
            header="GST"
            sortable
            filter={transporterFilterToggle}
          ></Column>
          <Column
            field="mobile_registered"
            header="Mobile App"
            sortable
            filter={transporterFilterToggle}
          ></Column>
          <Column
            field="bag_rate_list_str"
            header="Rate List"
            sortable
            filter={transporterFilterToggle}
          ></Column>
          <Column
            field="comment"
            header="Comments"
            sortable
            filter={transporterFilterToggle}
          ></Column>
          <Column
            field="is_active"
            header="Active"
            sortable
            body={isActiveDetail}
            filter={transporterFilterToggle}
          ></Column>
          <Column field="action" header="Action" body={partiesAction}></Column>
        </DataTable>
        <CustomPaginator
          dataList={onlyTransporterPartyList?.list}
          pageLimit={transporterPageLimit}
          onPageChange={onTransporterPageChange}
          onPageRowsChange={onJobsPageRowsChange}
          currentPage={transporterCurrentPage}
          totalCount={onlyTransporterPartyList?.count}
        />
      </div>
    );
  }, [
    transporterFilterToggle,
    transporterCurrentPage,
    onTransporterPageChange,
    transporterPageLimit,
    partiesAction,
    onJobsPageRowsChange,
    onlyTransporterPartyList?.list,
    onlyTransporterPartyList?.count,
    allCommon,
    dispatch,
    isActiveDetail,
    transporterFilters,
    partiesLoading,
  ]);

  const handleSearchInput = (e, Transporterchecked) => {
    dispatch(
      setAllFilters({
        ...allFilters,
        parties: {
          ...allFilters?.parties,
          ...(!Transporterchecked && { currentPage: 1 }),
          ...(Transporterchecked && { transporterCurrentPage: 1 }),
        },
      }),
    );

    if (Transporterchecked) {
      dispatch(
        getTransporterPartiesList(
          transporterPageLimit,
          1,
          e.target.value,
          applied,
        ),
      );
    } else {
      dispatch(getPartiesList(pageLimit, 1, e.target.value, applied));
    }
  };

  const debounceHandleSearchInput = React.useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      {partiesCRUDLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper bg-white">
          <div className="top_filter_wrap">
            <Row className="align-items-center">
              <Col xl={3}>
                <div className="page_title">
                  <h3 className="m-0">Parties</h3>
                </div>
              </Col>
              <Col xl={9}>
                <div className="right_filter_wrapper">
                  <ul>
                    <li className="order_checkbox_wrap">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          inputId="ShowTransportersonly"
                          name="ShowTransportersonly"
                          onChange={e => {
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                parties: {
                                  ...allCommon?.parties,
                                  isTransporterOnly: e.checked,
                                  // filterToggle: e.checked ? false : true,
                                  filterToggle: false,
                                  transporterFilterToggle: false,
                                  searchQuery: '',
                                },
                              }),
                            );

                            if (e.checked) {
                              dispatch(
                                getTransporterPartiesList(
                                  transporterPageLimit,
                                  transporterCurrentPage,
                                  searchQuery,
                                  applied,
                                ),
                              );
                            } else {
                              dispatch(
                                getPartiesList(
                                  pageLimit,
                                  currentPage,
                                  searchQuery,
                                  applied,
                                ),
                              );
                            }
                          }}
                          checked={isTransporterOnly}
                        />
                        <label htmlFor="ShowTransportersonly" className="mb-0">
                          Show Transporters only
                        </label>
                      </div>
                    </li>
                    <li className="search_input_wrap">
                      <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          className="input_wrap small search_wrap"
                          value={searchQuery}
                          onChange={e => {
                            debounceHandleSearchInput(e, isTransporterOnly);
                            dispatch(
                              setAllCommon({
                                ...allCommon,
                                parties: {
                                  ...allCommon?.parties,
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
                            ? 'btn_border p-button filter_btn applied'
                            : 'btn_border filter_btn'
                        }
                        onClick={e => op?.current?.toggle(e)}
                      >
                        <img src={FilterIcon} alt="" /> Filter
                      </Button>
                    </li>
                    <li>
                      <OverlayTrigger
                        overlay={props => <Tooltip {...props}>Import</Tooltip>}
                        placement="bottom"
                      >
                        <Button
                          onClick={() => {
                            dispatch(setImporttedParties([]));
                            navigate('/import-parties');
                          }}
                          className="btn_border icon_btn"
                          disabled={!is_import_access}
                        >
                          <img src={ImportIcon} alt="" />
                        </Button>
                      </OverlayTrigger>
                    </li>
                    <li>
                      <Dropdown className="dropdown_common export_dropdown position-static">
                        <OverlayTrigger
                          // delay={{ hide: 200, show: 300 }}
                          overlay={props => (
                            <Tooltip {...props}>Export</Tooltip>
                          )}
                          placement="bottom"
                        >
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            className="btn_border icon_btn"
                            disabled={!is_export_access}
                          >
                            <img src={ExportIcon} alt="" />
                          </Dropdown.Toggle>
                        </OverlayTrigger>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              isTransporterOnly
                                ? dispatch(getExportTransportersPartiesPdf())
                                : dispatch(getExportPartiesPdf());
                            }}
                          >
                            PDF
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              isTransporterOnly
                                ? dispatch(getExportTransportersPartiesExcel())
                                : dispatch(getExportPartiesExcel());
                            }}
                          >
                            XLS
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                    <li className="add_btn">
                      <Button
                        className="btn_primary"
                        onClick={() => {
                          if (is_create_access) {
                            dispatch(clearPartiesInitialValues());
                            dispatch(
                              setIsGetInitialValuesParty({
                                ...isGetInitialValuesParty,
                                add: false,
                              }),
                            );
                            dispatch(clearAddSelectedPartyData());
                            navigate('/add-parties');
                          }
                        }}
                        disabled={is_create_access === true ? false : true}
                      >
                        <img src={PlusIcon} alt="" /> New Parties
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>

          {isTransporterOnly && transporterListView}
          {!isTransporterOnly && partiesListView}
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

      <ConfirmDialog
        visible={deletePopup}
        handleDelete={handleDelete}
        setDeletePopup={setDeletePopup}
      />

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
        content={content}
        selectedItemIndex={selectedItemIndex}
      />
    </>
  );
};
export default memo(HomePage);
