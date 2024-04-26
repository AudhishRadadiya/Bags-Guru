import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  setAddSelectedSalesInvoiceData,
  setIsGetInitialValuesSalesInvoice,
} from 'Store/Reducers/Sales/SalesInvoiceSlice';
import SalesInvoiceDetail from './SalesInvoiceDetail';
import {
  getSingleListParties,
  getTransporterPartyList,
} from 'Services/partiesService';
import { useLocation } from 'react-router-dom';
import { salesOrderJobByParty } from 'Services/Sales/SalesInvoiceServices';
import { convertIntoNumber } from 'Helper/Common';

export default function CreateProformaInvoice() {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});
  // const { search } = useLocation();
  const { state } = useLocation();
  // const query = useMemo(() => new URLSearchParams(search), [search]);
  // const order_id = query.get('order_id');
  // const { state } = useParams();

  const {
    salesInvoiceData,
    addSelectedSalesInvoiceData,
    isGetInitialValuesSalesInvoice,
  } = useSelector(({ salesInvoice }) => salesInvoice);

  const { selectedAddSalesIvoiceData } = useSelector(
    ({ salesOrder }) => salesOrder,
  );

  const handlePartiesData = async salesdata => {
    let newBillingList = [];
    let newShippingList = [];
    let billingList = [];
    let shippingList = [];

    if (salesdata?.party_name) {
      const parties_res = await dispatch(
        getSingleListParties(salesdata?.party_name),
      );
      const salesJobByPartyList = await dispatch(
        salesOrderJobByParty(salesdata?.party_name, ''),
      );

      billingList = parties_res?.party_address?.filter(
        x => x?.address_type_name === 'BILLING',
      );
      shippingList = parties_res?.party_address?.filter(
        x => x?.address_type_name !== 'BILLING',
      );

      if (
        Array.isArray(salesdata?.billing_address) &&
        salesdata?.billing_address?.every(item => typeof item !== 'string')
      ) {
        const upated = billingList?.filter(data => {
          return salesdata?.billing_address?.some(
            item => data?._id === item?._id,
          );
        });

        newBillingList = upated;
      } else {
        newBillingList = billingList?.filter(x =>
          salesdata?.billing_address.includes(x?._id),
        );
      }

      if (
        Array.isArray(salesdata?.shipping_address) &&
        salesdata?.shipping_address?.every(item => typeof item !== 'string')
      ) {
        const upated = shippingList?.filter(data => {
          return salesdata?.shipping_address?.some(
            item => data?._id === item?._id,
          );
        });
        newShippingList = upated;
      } else {
        newShippingList = shippingList?.filter(x =>
          salesdata?.shipping_address.includes(x?._id),
        );
      }

      const updatedSalesProducts = salesJobByPartyList?.map(item => {
        const obj = salesdata?.sales_invoice_item.find(
          item2 => item2.job_id === item._id,
        );
        return {
          ...item,
          disabled: obj ? true : false,
          select_slaes_product: obj ? true : false,
        };
      });

      const selectedSalesJobByParty = updatedSalesProducts?.filter(
        data => data?.select_slaes_product || data?.disabled,
      );

      return {
        billing_addrees_list: billingList,
        shipping_addrees_list: shippingList,
        billing_address: newBillingList,
        shipping_address: newShippingList,
        selected_product: selectedSalesJobByParty,
        sales_products_list: updatedSalesProducts,
      };
    }
  };

  const handleSalesInvoiceItemFirstPhase = async () => {
    let table_data = [];
    let selected_jobOrder_data = [];
    let selected_trasporter = {};
    // let partiesData = {};

    dispatch(
      setIsGetInitialValuesSalesInvoice({
        ...isGetInitialValuesSalesInvoice,
        add: true,
      }),
    );

    const transporter_res = await dispatch(getTransporterPartyList());

    if (state?.order_id) {
      // const res = await dispatch(getSalesOrderDetail(order_id));
      const res = { ...selectedAddSalesIvoiceData };

      // const parties_res = await dispatch(getSingleListParties(res?.party_name));
      const orderJobByParty_res = await dispatch(
        salesOrderJobByParty(res?.party_name, ''),
      );
      const finalAmount = res?.order_job
        ?.map(x => x.final_amount)
        .reduce((a, b) => a + b, 0);
      const totalAmount = res?.order_job
        ?.map(x => x.amount)
        .reduce((a, b) => a + b, 0);
      const discount = res?.order_job
        ?.map(x => x.discount)
        .reduce((a, b) => a + b, 0);
      const taxAmount = res?.order_job
        ?.map(x => x.gst_amount)
        .reduce((a, b) => a + b, 0);

      // ** // handlePartiesData is using for getting updated parties data:
      const partiesData = await handlePartiesData(res);

      // if (parties_res) {
      //   // const billingList = res?.billing_address_list;
      //   // const shippingList = res?.shipping_address_list;
      //   const billingList = parties_res?.party_address?.filter(x =>
      //     res?.billing_address.some(billing => billing === x?._id),
      //   );
      //   const shippingList = parties_res?.party_address?.filter(x =>
      //     res?.shipping_address.some(billing => billing === x?._id),
      //   );

      //   const newBillingList = billingList?.filter(x =>
      //     res?.billing_address.includes(x?._id),
      //   );
      //   const newShippingList = shippingList?.filter(x =>
      //     res?.shipping_address.includes(x?._id),
      //   );

      //   partiesData = {
      //     billing_addrees_list: billingList,
      //     shipping_addrees_list: shippingList,
      //     billing_address: newBillingList,
      //     shipping_address: newShippingList,

      //     // billing_addrees_list: billingList,
      //     //   shipping_addrees_list: shippingList,
      //     // shipping_address: [{ ...shippingList?.[0] }],
      //     // billing_address: [{ ...billingList?.[0] }],
      //   };
      // }

      if (res?.transporter) {
        const selectedTrasporter = transporter_res?.find(
          data => data?._id === res?.transporter,
        );

        selected_trasporter = selectedTrasporter;
      }

      if (res?.order_job) {
        table_data = res?.order_job?.map(i => {
          return {
            ...i,
            // image: i?.product_image,
            product_id: i?.product_id,
            remark: '',
            hsn: '',
            is_rate_per_kg: i?.unit_pc === false ? true : false,
            // is_rate_per_kg: i?.kg_rate,
            main_image: i?.product_detail?.main_image,
            pcs: i?.qty,
            weight: i?.kg_qty,
            charge: i?.stereo_charge,
            discount: convertIntoNumber(i?.discount),
            amount: i?.amount,
            tax_percentage: i?.gst_percentage,
            final_amount: i?.final_amount ? Math.round(i?.final_amount) : 0,
            product_code: i?.product_detail?.code,
            available_qty: 0,
            available_weight: 0,
            total_available_qty: 0,
            total_available_weight: 0,
            // warehouse_id: i?.warehouse_id,
            // warehouse: warehouseOption,
          };
        });

        if (orderJobByParty_res?.length > 0) {
          const new_jobOrder_data = res?.order_job?.map(item => {
            const obj = orderJobByParty_res?.find(
              item2 => item2.product_id === item.product_id,
            );

            if (obj) {
              return obj;
            }
            return item;
          });
          selected_jobOrder_data = new_jobOrder_data;
        }
      }

      const updated = {
        ...res,
        ...partiesData,
        invoice_date: new Date(),
        final_amount: finalAmount,
        total_amount: totalAmount,
        discount: discount,
        tax_amount: taxAmount,
        streo_charge: '',
        sales_item: table_data,
        selected_product: selected_jobOrder_data,
        transporter_gst: selected_trasporter?.gst || '',
        transporter_phone_no: selected_trasporter?.personal_contact_no || '',
        freight: res?.order_job[0]?.additional_charge,
        attachment: '',
      };

      setInitialData(updated);
      dispatch(setAddSelectedSalesInvoiceData(updated));
    } else {
      setInitialData(salesInvoiceData);
    }
  };

  const handleSalesInvoiceItemSecondPhase = async () => {
    // ** // handlePartiesData is using for getting updated parties data:
    const partiesData = await handlePartiesData(addSelectedSalesInvoiceData);
    const updatedObj = {
      ...addSelectedSalesInvoiceData,
      ...partiesData,
    };
    setInitialData(updatedObj);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isGetInitialValuesSalesInvoice?.add === true) {
        handleSalesInvoiceItemSecondPhase();
      } else {
        handleSalesInvoiceItemFirstPhase();
      }
    };

    fetchData();
  }, []);

  return <SalesInvoiceDetail initialValues={initialData} />;
}
