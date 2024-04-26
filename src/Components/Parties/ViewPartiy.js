import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  setIsGetInitialValuesParty,
  setPartiesAddressList,
  setViewSelectedPartyData,
} from 'Store/Reducers/Parties/parties.slice';
import PartiesDetail from './PartiesDetail';
import {
  getPartiesAddressTypes,
  getPartiesCity,
  getPartiesCountry,
  getPartiesState,
  getSingleListParties,
} from 'Services/partiesService';

const ViewParty = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({});

  const { isGetInitialValuesParty, viewSelectedPartyData } = useSelector(
    ({ parties }) => parties,
  );

  const handleSetIndex = length => {
    let newArray = [];
    for (let i = 1; i <= length; i++) {
      newArray.push(' ');
    }
    return newArray;
  };

  const handlePartiesItem = async () => {
    // dispatch(
    //   setIsGetInitialValuesParty({
    //     ...isGetInitialValuesParty,
    //     view: true,
    //   }),
    // );
    const countries_res = await dispatch(getPartiesCountry());
    const address_res = await dispatch(getPartiesAddressTypes()); // getting all address types of party
    const res = await dispatch(getSingleListParties(id));
    let stateOption = [];
    let cityOption = [];
    const countryOption = countries_res?.map(country => ({
      label: country?.name,
      value: country?._id,
    }));

    if (res?.country) {
      const country = countries_res?.find(i => i?._id === res?.country);
      const partiesStateOption = await dispatch(
        getPartiesState({ code: country?.country_code }),
      );
      stateOption = partiesStateOption?.map(state => ({
        label: state?.name,
        value: state?._id,
      }));
    }
    if (res?.state) {
      const partiesCityOption = await dispatch(
        getPartiesCity({ state_id: res?.state }),
      );
      cityOption = partiesCityOption?.map(city => ({
        label: city?.name,
        value: city?._id,
      }));
    }

    const registerEmailList = res?.register_email?.length;
    const registerPhoneList = res?.register_mobile_number?.length;
    let emailIndex = [];
    let phoneIndex = [];

    if (registerEmailList > 0) {
      emailIndex = handleSetIndex(registerEmailList);
    }
    if (registerPhoneList > 0) {
      phoneIndex = handleSetIndex(registerPhoneList);
    }

    const payload = res?.party_address?.map(item => {
      return {
        address_type: address_res?.find(ele => ele._id === item?.address_type)
          ?._id,
        business_name: item?.business_name,
        gstin: item?.gstin,
        tripta_code: item?.tripta_code,
        address: item?.address,
        pincode: item?.pincode,
        city: item?.city,
        state: item?.state,
        country: item?.country,
        is_default: item?.is_default ? 1 : 0,
        is_same_as_shipping: item?.is_same_as_shipping ? 1 : 0,
        _id: item?._id,
      };
    });
    dispatch(setPartiesAddressList(payload?.length > 0 ? payload : []));

    const updated = {
      ...res,
      party_address: payload,
      register_phone_index: phoneIndex,
      register_email_index: emailIndex,
      address_details_countryOption: countryOption,
      country_option: countryOption,
      city_option: cityOption,
      state_option: stateOption,
    };

    setInitialData(updated);
    dispatch(setViewSelectedPartyData(updated));
  };

  useEffect(() => {
    if (id) {
      // if (isGetInitialValuesParty?.view === true) {
      //   setInitialData(viewSelectedPartyData);
      // } else {
      handlePartiesItem();
      // }
    }
  }, []);

  return <PartiesDetail initialValues={initialData} />;
};

export default memo(ViewParty);
