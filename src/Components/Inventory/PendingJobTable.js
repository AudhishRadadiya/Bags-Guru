import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { Row } from 'primereact/row';
import ProductImg from '../../Assets/Images/product-thumb.jpg';

export const ProductService = {
  getProductsData() {
    return [
      {
        id: '1000',
        jobNo: '15917',
        image: 'Image',
        jobDate: '14/03/2023',
        designName: 'Babalu - Mela Ram Babu Ram ',
        size: 'W12 X H 15 X G 4',
        noofRolls: 1000,
        qty: 5000,
      },
      {
        id: '1001',
        jobNo: '15917',
        image: 'Bamboo Watch',
        jobDate: '14/03/2023',
        designName: 'Babalu - Mela Ram Babu Ram ',
        size: 'W12 X H 15 X G 4',
        noofRolls: 1000,
        qty: 5000,
      },
      {
        id: '1002',
        jobNo: '15917',
        image: 'Bamboo Watch',
        jobDate: '14/03/2023',
        designName: 'Babalu - Mela Ram Babu Ram ',
        size: 'W12 X H 15 X G 4',
        noofRolls: 1000,
        qty: 5000,
      },
      {
        id: '1003',
        jobNo: '15917',
        image: 'Bamboo Watch',
        jobDate: '14/03/2023',
        designName: 'Babalu - Mela Ram Babu Ram ',
        size: 'W12 X H 15 X G 4',
        noofRolls: 1000,
        qty: 5000,
      },
      {
        id: '1004',
        jobNo: '15917',
        image: 'Bamboo Watch',
        jobDate: '14/03/2023',
        designName: 'Babalu - Mela Ram Babu Ram ',
        size: 'W12 X H 15 X G 4',
        noofRolls: 1000,
        qty: 5000,
      },
    ];
  },

  getProductsMini() {
    return Promise.resolve(this.getProductsData().slice(0, 5));
  },

  getProductsSmall() {
    return Promise.resolve(this.getProductsData().slice(0, 10));
  },

  getProducts() {
    return Promise.resolve(this.getProductsData());
  },

  getProductsWithOrdersSmall() {
    return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
  },

  getProductsWithOrders() {
    return Promise.resolve(this.getProductsWithOrdersData());
  },
};

const pendingOrdersTemplate = () => {
  return (
    <div className="product_img">
      <img src={ProductImg} alt="" />
    </div>
  );
};

const noofRollsTotal = () => {
  return <span>5000</span>;
};

const qtyTotal = () => {
  return <span>25000</span>;
};

const footerGroup = (
  <ColumnGroup>
    <Row>
      <Column
        footer="Totals:"
        colSpan={5}
        footerStyle={{ textAlign: 'left' }}
      />
      <Column footer={noofRollsTotal} />
      <Column footer={qtyTotal} />
    </Row>
  </ColumnGroup>
);

export default function PendingJobTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ProductService.getProductsMini().then(data => setProducts(data));
  }, []);
  return (
    <div className="data_table_wrapper cell_padding_small mb-3 border">
      <DataTable value={products} footerColumnGroup={footerGroup}>
        <Column field="jobNo" header="Job No." sortable></Column>
        <Column
          field="image"
          header="Image"
          sortable
          body={pendingOrdersTemplate}
        ></Column>
        <Column field="jobDate" header="Job Date" sortable></Column>
        <Column field="designName" header="Design Name" sortable></Column>
        <Column field="size" header="Size" sortable></Column>
        <Column field="noofRolls" header="No. of Rolls" sortable></Column>
        <Column field="qty" header="Qty" sortable></Column>
      </DataTable>
    </div>
  );
}
