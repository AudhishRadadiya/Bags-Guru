import { OverlayPanel } from 'primereact/overlaypanel';
import { Col, Row } from 'react-bootstrap';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import PlusIcon from '../../Assets/Images/plus.svg';
import TrashIcon from '../../Assets/Images/trash.svg';
import { Chip } from 'primereact/chip';
import { memo, useEffect, useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';

const FilterOverlay = memo(
  ({
    op,
    filters,
    filterOption, // For Key dropdown
    filterOptions, // For value fropdown if applicable
    handleFilterChange,
    handleRemoveFilter,
    handleAddFilter,
    handleFilterEdit,
    handleFilterDelete,
    applyFilterHandler,
    clearAppliedFilter,
    selectedFilters,
    listFilter,
    setSaveFilterModal,
    content,
    setNameFilter,
    selectedItemIndex,
  }) => {
    // const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [showBtn, setShowBtn] = useState(false);
    // const handleSelectedFilter = (e, index) => {
    //   setSelectedItemIndex(index);
    // };

    useEffect(() => {
      if (filters && filters?.length > 0) {
        if (filters[0]?.filter !== '' && filters[0]?.value !== '') {
          setShowBtn(true);
        } else {
          setShowBtn(false);
        }
      } else {
        setShowBtn(false);
      }
    }, [filters]);

    return (
      <>
        <OverlayPanel ref={op} showCloseIcon className="filter_overlay_panel">
          <div className="overlay_top_wrap">
            <h3>Filters</h3>
          </div>
          <div className="overlay_body">
            {filters?.map((filter, index) => {
              return (
                <div className="overlay_select_filter_row mb-3" key={index}>
                  <div className="filter_row">
                    <Row>
                      <Col sm={6}>
                        <div className="form_group">
                          <ReactSelectSingle
                            filter
                            value={filter?.filter}
                            options={filterOption}
                            optionDisabled="disabled"
                            onChange={e => {
                              handleFilterChange(index, 'filter', e.value);
                            }}
                            placeholder="Select Filter"
                          />
                        </div>
                      </Col>
                      {selectedFilters && (
                        <Col sm={6}>
                          <div className="form_group">
                            {selectedFilters[index]?.type === 'dropDown' ? (
                              // <ReactSelectSingle
                              //   filter
                              //   value={filter.value}
                              //   options={filterOptions?.[filter?.filter]}
                              //   onChange={e => {
                              //     handleFilterChange(index, 'value', e.value);
                              //   }}
                              //   placeholder="Select"
                              // />

                              <MultiSelect
                                filter
                                maxSelectedLabels={2}
                                options={filterOptions?.[filter?.filter]}
                                placeholder="Select"
                                value={filter?.value}
                                className="w-100"
                                onChange={e => {
                                  handleFilterChange(index, 'value', e.value);
                                }}
                              />
                            ) : selectedFilters[index]?.type === 'inputBox' ? (
                              <InputText
                                value={filter.value}
                                onChange={e =>
                                  handleFilterChange(
                                    index,
                                    'value',
                                    e.target.value,
                                  )
                                }
                                placeholder="Enter Value"
                              />
                            ) : null}
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                  <div className="remove_row">
                    <Button
                      className="btn_transperant"
                      onClick={() => handleRemoveFilter(index)}
                    >
                      <img src={TrashIcon} alt="" />
                    </Button>
                  </div>
                </div>
              );
            })}

            <div className="button_filter_wrap d-flex align-items-center justify-content-between mt-3">
              <Button className="btn_border" onClick={handleAddFilter}>
                <img src={PlusIcon} alt="" /> Add Filter
              </Button>
              <div className="d-flex">
                <Button
                  className="btn_border me-2"
                  onClick={e => {
                    clearAppliedFilter(e);
                    setNameFilter('');
                  }}
                  disabled={showBtn === false}
                >
                  Clear Filter
                </Button>
                <Button
                  className="btn_primary me-2"
                  onClick={applyFilterHandler}
                  disabled={showBtn === false}
                >
                  Apply Filter
                </Button>
                <Button
                  className="btn_primary"
                  onClick={e => {
                    setSaveFilterModal(true);
                    op.current?.toggle(e);
                  }}
                  disabled={showBtn === false}
                >
                  Save Filter
                </Button>
              </div>
            </div>
          </div>
          <div className="overlay_bottom_wrap">
            <div className="saved_filter_wrap">
              <h3 className="mb-2">Saved Filter</h3>
              <ul>
                {listFilter?.map((item, i) => {
                  return (
                    <li key={i}>
                      <Chip
                        template={() =>
                          content(item, i, handleFilterEdit, handleFilterDelete)
                        }
                        className={selectedItemIndex === i ? `active` : ''}
                        // style={{
                        //   backgroundColor:
                        //     selectedItemIndex === i ? '#322972' : '',
                        //   color: selectedItemIndex === i ? '#FFFFFF' : '',
                        // }}
                        // onClick={e => {
                        //   setNameFilter(item?.filter_name);
                        //   handleSelectedFilter(e, i);
                        // }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </OverlayPanel>
      </>
    );
  },
);

export default FilterOverlay;
