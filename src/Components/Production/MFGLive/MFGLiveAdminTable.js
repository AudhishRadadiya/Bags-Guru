import React, { memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import SearchIcon from '../../../Assets/Images/search.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CustomPaginator from 'Components/Common/CustomPaginator';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';

function MFGLiveAdminTable({
  setAllCommon,
  allCommon,
  filterToggle,
  mfgData,
  mfgFilters,
  selectedProducts,
  setSelectedProducts,
  bedgeBodyTemplate,
  statusRowFilterTemplate,
  bagMadeBodyTemplate,
  imageTemplate,
  designNameTemplate,
  bagTypeTemplate,
  handleMaterialTemplate,
  orderNoTemplate,
  factoryLocationTemplate,
  actionTemplate,
  pageLimit,
  onPageChange,
  onPageRowsChange,
  currentPage,
  mfgLiveCount,
  printBedgeBodyTemplate,
  laminationTemplate,
  amountTemplate,
  commentTemplate,
  cylinderTemplate,
  mainTableRollWidthTemplate,
  footerGroup,
}) {
  const dispatch = useDispatch();

  const { mfgFilterListLoading, mfgLiveListLoading } = useSelector(
    ({ mfgLive }) => mfgLive,
  );
  const { currentUser } = useSelector(({ auth }) => auth);
  const { partiesLoading } = useSelector(({ parties }) => parties);
  const { miscMasterLoading } = useSelector(({ miscMaster }) => miscMaster);

  const isMobile = useMemo(() => {
    if (window.innerWidth < 1400) {
      return true;
    } else {
      return false;
    }
  }, []);

  return (
    <div className="data_table_wrapper mfg_table_Wrapper with_colspan_head cell_padding_large is_filter break_header">
      <button
        type="button"
        className="table_filter_btn"
        onClick={() => {
          dispatch(
            setAllCommon({
              ...allCommon,
              mfgLive: {
                ...allCommon?.mfgLive,
                filterToggle: !filterToggle,
              },
            }),
          );
        }}
      >
        <img src={SearchIcon} alt="" />
      </button>
      <DataTable
        value={mfgData}
        sortMode="single"
        sortField="name"
        sortOrder={1}
        rows={10}
        filterDisplay="row"
        dataKey="_id"
        filters={mfgFilters}
        onFilter={event => {
          dispatch(
            setAllCommon({
              ...allCommon,
              mfgLive: {
                ...allCommon?.mfgLive,
                mfgFilters: event?.filters,
              },
            }),
          );
        }}
        footerColumnGroup={footerGroup}
        selection={selectedProducts}
        onSelectionChange={e => setSelectedProducts(e.value)}
        scrollable={isMobile === true ? false : true}
        emptyMessage={
          (miscMasterLoading ||
            mfgLiveListLoading ||
            mfgFilterListLoading ||
            partiesLoading) && <Skeleton count={9} />
        }
      >
        <Column
          field="srno"
          header="S.No."
          sortable
          filter={filterToggle}
          showFilterMenu={false}
          style={{ zIndex: '10' }}
          frozen
        ></Column>
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="roll_available_str"
            header="ROLL"
            sortable
            filter={filterToggle}
            showFilterMenu={false}
            body={e =>
              bedgeBodyTemplate(e.roll_available, e.roll_available_str, 'roll')
            }
            filterElement={e => statusRowFilterTemplate(e, 'roll')}
            style={{ zIndex: '10' }}
            frozen
          ></Column>
        )}
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="hndl_str"
            header="HNDL"
            sortable
            showFilterMenu={false}
            filter={filterToggle}
            body={e => bedgeBodyTemplate(e.hndl, e.hndl_str, 'hndl', e._id)}
            filterElement={e => statusRowFilterTemplate(e, 'hndl')}
            style={{ zIndex: '10' }}
            frozen
          ></Column>
        )}
        <Column
          field="old_str_str"
          header="OLD STR"
          sortable
          showFilterMenu={false}
          filter={filterToggle}
          filterElement={e => statusRowFilterTemplate(e, 'old_str')}
          body={e =>
            bedgeBodyTemplate(e.old_str, e.old_str_str, 'old_str', e._id)
          }
          style={{ zIndex: '10' }}
          frozen
        ></Column>
        <Column
          field="str_ord_str"
          header="STR ORD"
          sortable
          showFilterMenu={false}
          filter={filterToggle}
          filterElement={e => statusRowFilterTemplate(e, 'str_ord')}
          body={e =>
            bedgeBodyTemplate(e.str_ord, e.str_ord_str, 'str_ord', e._id)
          }
          style={{ zIndex: '10' }}
          frozen
        ></Column>
        <Column
          field="str_rcv_str"
          header="STR RCV"
          sortable
          showFilterMenu={false}
          filter={filterToggle}
          filterElement={e => statusRowFilterTemplate(e, 'str_rcv')}
          body={e =>
            bedgeBodyTemplate(e.str_rcv, e.str_rcv_str, 'str_rcv', e._id)
          }
          style={{ zIndex: '10' }}
          frozen
        ></Column>
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="print_str"
            header="PRINT"
            sortable
            showFilterMenu={false}
            filter={filterToggle}
            filterElement={e => statusRowFilterTemplate(e, 'print')}
            body={e =>
              printBedgeBodyTemplate(
                e?.print,
                e?.print_str,
                e?._id,
                e?.print_technology,
              )
            }
            style={{ zIndex: '10' }}
            frozen
          ></Column>
        )}
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="bag_made_str"
            header="BAG MADE"
            sortable
            showFilterMenu={false}
            filter={filterToggle}
            filterElement={e => statusRowFilterTemplate(e, 'bag_made')}
            body={e => bagMadeBodyTemplate(e.bag_made, e.bag_made_str, e._id)}
            style={{ zIndex: '10' }}
            frozen
          ></Column>
        )}
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="bag_sent_str"
            header="BAG SENT"
            sortable
            showFilterMenu={false}
            filter={filterToggle}
            filterElement={e => statusRowFilterTemplate(e, 'bag_sent')}
            body={e =>
              bedgeBodyTemplate(e.bag_sent, e.bag_sent_str, 'bag_sent', e._id)
            }
            style={{ zIndex: '10' }}
            frozen
          ></Column>
        )}
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="lr_sent_str"
            header="LR SENT"
            sortable
            showFilterMenu={false}
            filter={filterToggle}
            filterElement={e => statusRowFilterTemplate(e, 'lr_sent')}
            body={e =>
              bedgeBodyTemplate(e.lr_sent, e.lr_sent_str, 'lr_sent', e._id)
            }
            style={{ zIndex: '10' }}
            frozen
          ></Column>
        )}
        <Column
          field="job_date"
          header="Job Date"
          sortable
          filter={filterToggle}
        ></Column>
        <Column
          field="days"
          header="Day"
          headerClassName="th_center"
          sortable
          className="text-center"
          filter={filterToggle}
        ></Column>
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="action"
            header="Action"
            filter={filterToggle}
            body={actionTemplate}
          ></Column>
        )}
        <Column
          field="main_image"
          header="Image"
          filter={filterToggle}
          body={imageTemplate}
        ></Column>
        <Column
          field="design"
          header="Design Name"
          sortable
          filter={filterToggle}
          body={designNameTemplate}
        ></Column>
        <Column
          field="size_str"
          header="Size"
          sortable
          filter={filterToggle}
        ></Column>
        <Column
          field="gsm"
          header="GSM"
          className="text-center"
          headerClassName="th_center"
          sortable
          filter={filterToggle}
        ></Column>
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="qty"
            header="Qty(PCs)"
            sortable
            filter={filterToggle}
            style={{ textAlign: 'right' }}
          ></Column>
        )}
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="per_pc"
            header="Rate(PCs)"
            sortable
            filter={filterToggle}
            style={{ textAlign: 'right' }}
          ></Column>
        )}
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="per_kg"
            header="Rate(KGs)"
            sortable
            filter={filterToggle}
            style={{ textAlign: 'right' }}
          ></Column>
        )}
        <Column
          field="cylinder"
          header="Cylinder"
          sortable
          filter={filterToggle}
          body={cylinderTemplate}
        ></Column>
        <Column
          field="fabric_color"
          header="Fabric Color"
          sortable
          filter={filterToggle}
        ></Column>
        <Column
          field="roll_width"
          header="Roll Width"
          sortable
          filter={filterToggle}
          body={mainTableRollWidthTemplate}
        ></Column>
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="kg_qty"
            header="Qty(KGs)"
            sortable
            filter={filterToggle}
            style={{ textAlign: 'right' }}
          ></Column>
        )}
        <Column
          field="handle_color"
          header="Handle Color"
          sortable
          filter={filterToggle}
        ></Column>
        <Column
          field="handle_material_name"
          header="Handle Material"
          sortable
          filter={filterToggle}
          body={handleMaterialTemplate}
        ></Column>
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="amount"
            header="Amount"
            sortable
            filter={filterToggle}
            style={{ textAlign: 'right' }}
            body={amountTemplate}
          ></Column>
        )}
        <Column
          field="bag_type"
          header="Bag Type"
          sortable
          filter={filterToggle}
          body={bagTypeTemplate}
        ></Column>
        <Column
          field="background_design_name"
          header="Background Design"
          sortable
          filter={filterToggle}
        ></Column>
        <Column
          field="stereo_charge"
          header="Stereo Chg"
          sortable
          filter={filterToggle}
          style={{ textAlign: 'right' }}
        ></Column>
        <Column
          field="act_stereo_charge"
          header="Stereo Chg(Actual)"
          sortable
          filter={filterToggle}
          style={{ textAlign: 'right' }}
        ></Column>
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="additional_charge"
            header="Add Charge"
            sortable
            filter={filterToggle}
            style={{ textAlign: 'right' }}
          ></Column>
        )}
        <Column
          field="comment"
          header="Comment"
          sortable
          filter={filterToggle}
          body={commentTemplate}
        ></Column>
        <Column
          field="party_name"
          header="Party Name"
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
          field="is_laminated_str"
          header="Lamination"
          sortable
          filter={filterToggle}
          body={laminationTemplate}
        ></Column>
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="wastage"
            header="Wastage%"
            sortable
            className="text-center"
            headerClassName="th_center"
            filter={filterToggle}
          ></Column>
        )}
        {/* {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="profit"
            header="Profit"
            sortable
            filter={filterToggle}
          ></Column>
        )} */}
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="act_kg_rate"
            header="KG Rate Actual"
            sortable
            filter={filterToggle}
          ></Column>
        )}
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="theoretical_kg_rate"
            header="KG Rate Theoretical"
            sortable
            filter={filterToggle}
          ></Column>
        )}
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="order_no"
            header="Order No"
            sortable
            className="view_detail"
            body={orderNoTemplate}
            filter={filterToggle}
          ></Column>
        )}
        <Column
          field="created_by_name"
          header="Entry By"
          sortable
          filter={filterToggle}
        ></Column>
        {currentUser.role_name.toLowerCase() !== 'designer' && (
          <Column
            field="factory"
            header="Factory Location"
            filter={filterToggle}
            body={factoryLocationTemplate}
          ></Column>
        )}
      </DataTable>
      <CustomPaginator
        dataList={mfgData}
        pageLimit={pageLimit}
        onPageChange={onPageChange}
        onPageRowsChange={onPageRowsChange}
        currentPage={currentPage}
        totalCount={mfgLiveCount}
      />
    </div>
  );
}

export default memo(MFGLiveAdminTable);
