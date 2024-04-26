import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import ItemDetail from './ItemDetail';
import { useParams } from 'react-router-dom';
import {
  attributes,
  setIsGetInitialValuesItem,
  setUpdateSelectedItemData,
} from 'Store/Reducers/Settings/RawItemSlice';
import { getRawItemsFullList } from 'Services/Settings/MiscMasterService';
import { getUniqItems } from 'Helper/Common';

function EditItem() {
  const dispatch = useDispatch();
  const { item_id } = useParams();
  const [initialData, setInitialData] = useState({});

  const { initialItemData, isGetInitialValuesItem, updateSelectedItemData } =
    useSelector(({ rawitem }) => rawitem);

  const handleSalesItems = async () => {
    dispatch(
      setIsGetInitialValuesItem({
        ...isGetInitialValuesItem,
        update: true,
      }),
    );

    const res = await dispatch(getRawItemsFullList());

    if (res) {
      let selectedRawItem = {
        ...res?.find(x => x?._id === item_id),
      };

      if (Object.keys(selectedRawItem)?.length > 0) {
        const updated = getUniqItems(
          selectedRawItem.item_attribute,
          attributes,
        );
        let values = updated?.map((item, i) => {
          return {
            _id: item._id,
            no: i + 1,
            name: item.name,
            type: item.type,
            is_mandatory: item.is_mandatory ? 1 : 0,
            is_multiple_selection: item?.is_multiple_selection ? 1 : 0,
            values: item.attribute_value,
            isSelected: item.isSelected,
            isDefault: attributes?.find(x => x?.name === item?.name)?.isDefault
              ? true
              : false,
          };
        });

        const list = attributes?.map(item =>
          values?.find(obj => obj?.name === item?.name),
        );
        const uniqueResultTwo = values?.filter(
          obj => !attributes?.some(obj2 => obj?.name === obj2?.name),
        );
        values = [...list, ...uniqueResultTwo];
        selectedRawItem = { ...selectedRawItem, item_attribute: values };
      }
      if (selectedRawItem?.item_attribute?.length < 1)
        selectedRawItem.item_attribute = attributes;
      selectedRawItem.is_active = selectedRawItem.is_active ? 1 : 0;
      selectedRawItem.used_as_bag_handle = selectedRawItem.used_as_bag_handle
        ? 1
        : 0;
      selectedRawItem.has_multiple_variant =
        selectedRawItem?.has_multiple_variant ? 1 : 0;

      // dispatch(setSelectedRawItem(selectedRawItem));

      setInitialData(selectedRawItem);
      dispatch(setUpdateSelectedItemData(selectedRawItem));
    }
  };

  useEffect(() => {
    if (item_id) {
      if (isGetInitialValuesItem?.update === true) {
        setInitialData(updateSelectedItemData);
      } else {
        handleSalesItems();
      }
    }
  }, [dispatch]);

  return <ItemDetail initialValues={initialData} />;
}

export default EditItem;
