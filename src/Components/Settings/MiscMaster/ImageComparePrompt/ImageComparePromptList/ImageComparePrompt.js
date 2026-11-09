import React, { memo, useCallback, useState } from 'react';
import {
  Button,
  Col,
  Dropdown,
  Row,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import Skeleton from 'react-loading-skeleton';
import EditIcon from '../../../../../Assets/Images/edit.svg';
import ActionBtn from '../../../../../Assets/Images/action.svg';
import SearchIcon from '../../../../../Assets/Images/search.svg';
import RefreshIcon from '../../../../../Assets/Images/refresh-circle.svg';
import Loader from 'Components/Common/Loader';
import EditImageComparePrompt from '../EditImageComparePrompt/EditImageComparePrompt';
import ResetImageComparePrompt from '../ResetImageComparePrompt/ResetImageComparePrompt';
import useImageComparePromptTable from '../hooks/useImageComparePromptTable';
import useResetImageComparePrompt from '../hooks/useResetImageComparePrompt';

const ImageComparePrompt = ({ hasAccess }) => {
  const { is_edit_access } = hasAccess;

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const {
    visible: resetPopup,
    openResetPopup,
    closeResetPopup,
  } = useResetImageComparePrompt();

  const {
    loadList,
    onFilter,
    onFilterToggle,
    filterToggle,
    miscMasterLoading,
    miscMasterCRUDLoading,
    imageComparePromptList,
    imageComparePromptFilters,
  } = useImageComparePromptTable();

  const handleEdit = useCallback(rowData => {
    setEditData(rowData);
    setEditModal(true);
  }, []);

  const handleEditSuccess = useCallback(() => {
    loadList();
  }, [loadList]);

  const handleEditHide = useCallback(() => {
    setEditModal(false);
    setEditData(null);
  }, []);

  const itemAction = rowData => {
    return (
      <div className="edit_row">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="ection_btn"
            disabled={!is_edit_access}
          >
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {is_edit_access && (
              <Dropdown.Item onClick={() => handleEdit(rowData)}>
                <img src={EditIcon} alt="" /> Edit
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  return (
    <>
      {miscMasterCRUDLoading && <Loader />}

      <div className="table_main_Wrapper bg-white">
        <div className="top_filter_wrap border-0">
          <Row className="align-items-center">
            <Col sm={3}>
              <div className="page_title">
                <h3 className="m-0">Image Compare Prompt</h3>
              </div>
            </Col>

            <Col sm={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
                    <Button
                      className="btn_primary"
                      onClick={() => {
                        if (is_edit_access) {
                          openResetPopup();
                        }
                      }}
                      disabled={!is_edit_access}
                    >
                      <img src={RefreshIcon} alt="" /> Reset Prompt
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>

        <div className="data_table_wrapper misc_master_table_wrapper image_compare_prompt_table with_colspan_head cell_padding_large is_filter">
          <button
            type="button"
            className="table_filter_btn"
            onClick={onFilterToggle}
          >
            <img src={SearchIcon} alt="" />
          </button>

          <DataTable
            value={imageComparePromptList}
            sortMode="multiple"
            sortField="title"
            sortOrder={1}
            emptyMessage={miscMasterLoading ? <Skeleton count={10} /> : false}
            filterDisplay="row"
            dataKey="_id"
            filters={imageComparePromptFilters}
            onFilter={onFilter}
            tableStyle={{ tableLayout: 'fixed', width: '100%' }}
          >
            <Column
              field="title"
              header="Prompt Title"
              sortable
              filter={filterToggle}
              filterMatchMode="contains"
              className="prompt_description_col"
            ></Column>
            <Column
              field="action"
              header="Action"
              body={itemAction}
              headerStyle={{ width: '110px' }}
              bodyStyle={{ width: '110px' }}
            ></Column>
          </DataTable>
        </div>
      </div>

      <EditImageComparePrompt
        visible={editModal}
        editData={editData}
        onHide={handleEditHide}
        onSuccess={handleEditSuccess}
      />

      <ResetImageComparePrompt
        visible={resetPopup}
        onHide={closeResetPopup}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default memo(ImageComparePrompt);
