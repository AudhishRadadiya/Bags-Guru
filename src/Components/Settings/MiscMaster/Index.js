import { useCallback, useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import Warehouse from './Warehouse';
import Unit from './Unit';
import Bank from './Bank';
import BagType from './BagType';
import PrintType from './PrintType';
import PrintTechnology from './PrintTechnology';
import Country from './Country';
import State from './State';
import City from './City';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import FactoryLocation from './FactoryLocation';
import OperatorRole from './OperatorRole';
import BagMachine from './BagMachine';
import LaminationType from './LaminationType';
import BusinessType from './BusinessType';
import PartyType from './PartyMaster/PartyType';
import Market from './PartyMaster/Market';
import Industry from './PartyMaster/Industry';
import CustomerSource from './PartyMaster/CustomerSource';
import CustomerSourceDetail from './PartyMaster/CustomerSourceDetail';
import AddressType from './PartyMaster/AddressType';
import PatchCylinder from './ProductMaster/PatchCylinder';
import CustomerGroup from './ProductMaster/CustomerGroup';
import BackgroundDesign from './ProductMaster/BackgroundDesign';
import HandleMaterial from './ProductMaster/HandleMaterial';
import BagCapacity from './ProductMaster/BagCapacity';
import Form from './ProductMaster/Form';
import Material from './ProductMaster/Material';
import FabricColor from './ProductMaster/FabricColor';
import { useLocation } from 'react-router-dom';
import BagTypeCollection from './BagTypeCollection';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setAllCommon } from 'Store/Reducers/Common';
import MachineType from './MachineType';
import Machines from './Machines';
import GsmLength from './ProductMaster/GSMLength';
import RawMaterialGroup from './RawMaterialGroup';
import Velcro from './Velcro';
import CustomerRating from './CustomerRating';
import TargetMaster from './TargetMaster';

export const miscMasterLabelList = [
  'Warehouse',
  'Unit',
  'Bank',
  'Bag Type',
  'Bag Collection',
  'Printing Type',
  'Printing Technology',
  'Country',
  'State',
  'City',
  'Operator Role',
  'Factory Location',
  'Bag Machine',
  'Lamination Type',
  'Business Type',
  'Raw Material Group',
  ///////// 'Party Master',
  'Party Type',
  'Market',
  'Industry',
  'Customer Source',
  'Customer Source Detail',
  /////////'Product Master',
  'Patch Cylinder',
  'Customer Group',
  'Background Design',
  'Handle Material',
  'Bag Capacity',
  'Form',
  'Material',
  'Fabric Color',
  ///////// 'Party Master',
  'Address Type',
  'Machine Type',
  'Machines',
  'GSM and Length',
  'Velcro',
  'Customer Rating',
  'Advisor Target',
];

const getMiscMasters = (index, permission) => {
  switch (index) {
    case 0:
      return <Warehouse hasAccess={permission} />;
    case 1:
      return <Unit hasAccess={permission} />;
    case 2:
      return <Bank hasAccess={permission} />;
    case 3:
      return <BagType hasAccess={permission} />;
    case 4:
      return <BagTypeCollection hasAccess={permission} />;
    case 5:
      return <PrintType hasAccess={permission} />;
    case 6:
      return <PrintTechnology hasAccess={permission} />;
    case 7:
      return <Country hasAccess={permission} />;
    case 8:
      return <State hasAccess={permission} />;
    case 9:
      return <City hasAccess={permission} />;
    case 10:
      return <OperatorRole hasAccess={permission} />;
    case 11:
      return <FactoryLocation hasAccess={permission} />;
    case 12:
      return <BagMachine hasAccess={permission} />;
    case 13:
      return <LaminationType hasAccess={permission} />;
    case 14:
      return <BusinessType hasAccess={permission} />;
    case 15:
      return <RawMaterialGroup hasAccess={permission} />;
    case 16:
      return <PartyType hasAccess={permission} />;
    case 17:
      return <Market hasAccess={permission} />;
    case 18:
      return <Industry hasAccess={permission} />;
    case 19:
      return <CustomerSource hasAccess={permission} />;
    case 20:
      return <CustomerSourceDetail hasAccess={permission} />;
    case 21:
      return <PatchCylinder hasAccess={permission} />;
    case 22:
      return <CustomerGroup hasAccess={permission} />;
    case 23:
      return <BackgroundDesign hasAccess={permission} />;
    case 24:
      return <HandleMaterial hasAccess={permission} />;
    case 25:
      return <BagCapacity hasAccess={permission} />;
    case 26:
      return <Form hasAccess={permission} />;
    case 27:
      return <Material hasAccess={permission} />;
    case 28:
      return <FabricColor hasAccess={permission} />;
    case 29:
      return <AddressType hasAccess={permission} />;
    case 30:
      return <MachineType hasAccess={permission} />;
    case 31:
      return <Machines hasAccess={permission} />;
    case 32:
      return <GsmLength hasAccess={permission} />;
    case 33:
      return <Velcro hasAccess={permission} />;
    case 34:
      return <CustomerRating hasAccess={permission} />;
    case 35:
      return <TargetMaster hasAccess={permission} />;
    default:
      return;
  }
};

export default function MiscMaster({ hasAccess }) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { allCommon } = useSelector(({ common }) => common);
  const { masterName, filteredList, searchQuery, activeIndex } =
    allCommon?.miscMasters;
  const handleChange = useCallback(
    val => {
      const filtered = miscMasterLabelList?.filter(x =>
        x?.toLowerCase()?.includes(val?.toLowerCase()),
      );

      dispatch(
        setAllCommon({
          ...allCommon,
          miscMasters: {
            ...allCommon?.miscMasters,
            searchQuery: val,
            filteredList: filtered,
          },
        }),
      );
    },
    [dispatch, allCommon],
  );
  useEffect(() => {
    if (filteredList?.length === 0) {
      dispatch(
        setAllCommon({
          ...allCommon,
          miscMasters: {
            ...allCommon?.miscMasters,
            filteredList: miscMasterLabelList,
          },
        }),
      );
    }
  }, []);
  const onChange = useCallback(
    val => {
      const index = miscMasterLabelList?.findIndex(x => x === val);
      if (index >= 0) {
        dispatch(
          setAllCommon({
            ...allCommon,
            miscMasters: {
              ...allCommon?.miscMasters,
              masterName: val,
              activeIndex: index,
            },
          }),
        );
      }
    },
    [allCommon, dispatch],
  );

  return (
    <div className="main_Wrapper">
      <div className="tab_wrapper">
        <div className="tab_wrapper_inner">
          <h3>Misc Master</h3>
          <div className="form_group mb-3">
            <InputText
              id="search"
              placeholder="Search"
              type="search"
              name="searchQuery"
              value={searchQuery}
              className="input_wrap small search_wrap"
              onChange={e => handleChange(e.target.value)}
            />
          </div>
          <ul>
            {filteredList?.map((x, i) => {
              return (
                <li key={i}>
                  <Button
                    onClick={() => onChange(x)}
                    className={
                      masterName === x
                        ? 'p-button-text active'
                        : 'p-button-text'
                    }
                    label={x}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <TabView
          activeIndex={activeIndex}
          onTabChange={e => {
            dispatch(
              setAllCommon({
                ...allCommon,
                miscMasters: {
                  ...allCommon?.miscMasters,
                  masterName: e.index,
                },
              }),
            );
          }}
        >
          {miscMasterLabelList?.map((x, i) => {
            return (
              <TabPanel header={x} key={i}>
                {getMiscMasters(i, hasAccess)}
              </TabPanel>
            );
          })}
        </TabView>
      </div>
    </div>
  );
}
