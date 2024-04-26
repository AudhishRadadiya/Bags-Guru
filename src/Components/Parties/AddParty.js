import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import PartiesDetail from './PartiesDetail';
import {
  setAddSelectedPartyData,
  setIsGetInitialValuesParty,
} from 'Store/Reducers/Parties/parties.slice';
import {
  getPartiesAddressTypes,
  getPartiesCountry,
} from 'Services/partiesService';

const AddParty = () => {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const {
    partiesData,
    isGetInitialValuesParty,
    addSelectedPartyData,
    partiesAddressType,
  } = useSelector(({ parties }) => parties);

  const handleAddPartyData = async () => {
    dispatch(
      setIsGetInitialValuesParty({
        ...isGetInitialValuesParty,
        add: true,
      }),
    );

    const res = await dispatch(getPartiesAddressTypes());
    const countries_res = await dispatch(getPartiesCountry());
    const countryOption = countries_res?.map(country => ({
      label: country?.name,
      value: country?._id,
    }));

    const defaultAddress = res?.find(
      data => data?.label?.toLowerCase() === 'shipping',
    );

    dispatch(
      setAddSelectedPartyData({
        ...addSelectedPartyData,
        address_type: defaultAddress?._id,
        country_option: countryOption,
        address_details_countryOption: countryOption,
      }),
    );

    setInitialData({
      ...partiesData,
      address_type: defaultAddress?._id,
      country_option: countryOption,
      address_details_countryOption: countryOption,
    });
  };

  useEffect(() => {
    if (isGetInitialValuesParty?.add === true) {
      setInitialData(addSelectedPartyData);
    } else {
      handleAddPartyData();
    }
  }, []);

  return <PartiesDetail initialValues={initialData} />;
};

export default memo(AddParty);
