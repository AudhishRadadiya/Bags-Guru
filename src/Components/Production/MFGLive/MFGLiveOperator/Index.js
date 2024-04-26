import React, { useCallback, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import MFGLiveFlexoPrinting from './MFGLiveFlexoPrinting';
import MFGLiveBtoB from './MFGLiveBtoB';
import MFGLiveBoxMaking from './MFGLiveBoxMaking';
import { useDispatch } from 'react-redux';
import {
  MFGfProcessLists,
  getLiveOperatorMachineTypes,
} from 'Services/Production/mfgLiveOperatorServices';
import { useSelector } from 'react-redux';
import { setAllFilters } from 'Store/Reducers/Common';
import Loader from 'Components/Common/Loader';
import MFGLiveRToRPrinting from './MFGLiveRtoR';
import MFGLiveZipper from './MFGLiveZipper';
import MFGLiveLoop from './MFGLiveLoop';
import MFGLivePlainPrint from './MFGLivePlainPrint';
import MFGLiveRotoGravure from './MFGLiveRotoGravure';
import MFGLiveHotStamping from './MFGLiveHotStamping';
import MFGLiveSemiRoto from './MFGLiveSemiRoto';
import {
  setCylinderSizeList,
  setListMFGProcess,
} from 'Store/Reducers/Production/mfgLiveOperatorSlice';

export const operatorPages = val => {
  switch (val?.name) {
    case 'SCREEN PRINT (B 2 B)':
      return <MFGLiveBtoB />;
    case 'SCREEN PRINT (R 2 R)':
      return <MFGLiveRToRPrinting printTechnologyData={val} />;
    case 'FLEXO PRINT':
      return <MFGLiveFlexoPrinting printTechnologyData={val} />;
    case 'PLAIN PRINT':
      return <MFGLivePlainPrint />;
    case 'ROTO GRAVURE':
      return <MFGLiveRotoGravure />;
    case 'Zipper Bag Machine':
      return <MFGLiveZipper />;
    case 'Loop Handle Bag Machine':
      return <MFGLiveLoop />;
    case 'Box Bag Machine':
      return <MFGLiveBoxMaking />;
    case 'HOT STAMPING':
      return <MFGLiveHotStamping />;
    case 'SEMI ROTO':
      return <MFGLiveSemiRoto printTechnologyData={val} />;
    default:
      return null;
  }
};

export default function Index() {
  const dispatch = useDispatch();

  const { allFilters } = useSelector(({ common }) => common);
  const {
    activeTabIndex,
    activeTabName,
    mfgListParam,
    mfgListRToRParam,
    mfgListBToBParam,
    mfgListHotStampingParam,
    mfgListFlexoParam,
    mfgListSemiRotoParam,
    mfgListLoopParam,
    mfgListZipperParam,
    mfgListPlainParam,
    mfgListRotoParam,
  } = allFilters?.mfgLiveFlexo;

  const {
    listMFGProcess,
    cylinderSizeList,
    liveOperatorMachineTypes,
    mfgRollConsumptionLoading,
  } = useSelector(({ mfgliveOperator }) => mfgliveOperator);

  const { mfgSuggestedRollLoading } = useSelector(({ mfgLive }) => mfgLive);

  const loadRequiredData = useCallback(async () => {
    const operatorMachineTypes = await dispatch(getLiveOperatorMachineTypes());
    const activeTabObj = operatorMachineTypes[0];

    const newObj = {
      print: activeTabObj?.print,
      machine: activeTabObj?.machine,
      print_technology: activeTabObj?._id,
      activeTabName: activeTabObj?.name,
    };

    dispatch(
      setAllFilters({
        ...allFilters,
        mfgLiveFlexo: {
          ...allFilters?.mfgLiveFlexo,
          ...newObj,
        },
      }),
    );

    dispatch(
      MFGfProcessLists({
        ...mfgListFlexoParam,
        ...newObj,
      }),
    );
  }, [dispatch, allFilters, mfgListFlexoParam]);

  useEffect(() => {
    loadRequiredData();
  }, []);

  const fetchMFGfProcessListData = (machine, cylinder) => {
    const newObj = {
      ...(['FLEXO PRINT', 'SCREEN PRINT (R 2 R)'].includes(activeTabName) && {
        cylinder: 10,
      }),
      print: machine?.print,
      machine: machine?.machine,
      print_technology: machine?.id,
    };
  };

  const handleTabChange = (tabIndex, tabName) => {
    const operatorMachienTypeObj = liveOperatorMachineTypes?.find(
      data => data?.name === tabName,
    );
    if (Object.keys(operatorMachienTypeObj)?.length > 0) {
      const newObj = {
        print_technology: operatorMachienTypeObj?._id,
        print: operatorMachienTypeObj?.print,
        machine: operatorMachienTypeObj?.machine,
      };
      if (tabName === 'SCREEN PRINT (R 2 R)') {
        dispatch(setCylinderSizeList([]));
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              activeTabName: tabName,
              activeTabIndex: tabIndex,
              ...newObj,
              mfgListRToRParam: {
                ...allFilters?.mfgLiveFlexo.mfgListRToRParam,
                cylinder: allFilters?.mfgLiveFlexo.mfgListRToRParam.cylinder
                  ? allFilters?.mfgLiveFlexo.mfgListRToRParam.cylinder
                  : cylinderSizeList[0] === 'All'
                  ? 0
                  : cylinderSizeList[0],
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListRToRParam,
            cylinder: allFilters?.mfgLiveFlexo.mfgListRToRParam.cylinder
              ? allFilters?.mfgLiveFlexo.mfgListRToRParam.cylinder
              : cylinderSizeList[0] === 'All'
              ? 0
              : cylinderSizeList[0],
            ...newObj,
          }),
        );
      } else if (tabName === 'FLEXO PRINT') {
        dispatch(setCylinderSizeList([]));
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              activeTabName: tabName,
              activeTabIndex: tabIndex,
              ...newObj,
              mfgListFlexoParam: {
                ...allFilters?.mfgLiveFlexo.mfgListFlexoParam,
                cylinder: allFilters?.mfgLiveFlexo.mfgListFlexoParam.cylinder
                  ? allFilters?.mfgLiveFlexo.mfgListFlexoParam.cylinder
                  : cylinderSizeList[0] === 'All'
                  ? 0
                  : cylinderSizeList[0],
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListFlexoParam,
            cylinder: allFilters?.mfgLiveFlexo.mfgListFlexoParam.cylinder
              ? allFilters?.mfgLiveFlexo.mfgListFlexoParam.cylinder
              : cylinderSizeList[0] === 'All'
              ? 0
              : cylinderSizeList[0],
            ...newObj,
          }),
        );
      } else if (tabName === 'SEMI ROTO') {
        dispatch(setCylinderSizeList([]));
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              activeTabName: tabName,
              activeTabIndex: tabIndex,
              ...newObj,
              mfgListSemiRotoParam: {
                ...allFilters?.mfgLiveFlexo.mfgListSemiRotoParam,
                cylinder: allFilters?.mfgLiveFlexo.mfgListSemiRotoParam.cylinder
                  ? allFilters?.mfgLiveFlexo.mfgListSemiRotoParam.cylinder
                  : cylinderSizeList[0] === 'All'
                  ? 0
                  : cylinderSizeList[0],
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListSemiRotoParam,
            cylinder: allFilters?.mfgLiveFlexo.mfgListSemiRotoParam.cylinder
              ? allFilters?.mfgLiveFlexo.mfgListSemiRotoParam.cylinder
              : cylinderSizeList[0] === 'All'
              ? 0
              : cylinderSizeList[0],
            ...newObj,
          }),
        );
      } else if (tabName === 'PLAIN PRINT') {
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              activeTabName: tabName,
              activeTabIndex: tabIndex,
              ...newObj,
              mfgListPlainParam: {
                ...allFilters?.mfgLiveFlexo.mfgListPlainParam,
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListPlainParam,
            ...newObj,
          }),
        );
      } else if (tabName === 'ROTO GRAVURE') {
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              activeTabName: tabName,
              activeTabIndex: tabIndex,
              ...newObj,
              mfgListRotoParam: {
                ...allFilters?.mfgLiveFlexo.mfgListRotoParam,
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListRotoParam,
            ...newObj,
          }),
        );
      } else if (tabName === 'SCREEN PRINT (B 2 B)') {
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              activeTabName: tabName,
              activeTabIndex: tabIndex,
              ...newObj,
              mfgListBToBParam: {
                ...allFilters?.mfgLiveFlexo.mfgListBToBParam,
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListBToBParam,
            ...newObj,
          }),
        );
      } else if (tabName === 'HOT STAMPING') {
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              activeTabName: tabName,
              activeTabIndex: tabIndex,
              ...newObj,
              mfgListHotStampingParam: {
                ...allFilters?.mfgLiveFlexo.mfgListHotStampingParam,
              },
            },
          }),
        );

        dispatch(
          MFGfProcessLists({
            ...mfgListHotStampingParam,
            ...newObj,
          }),
        );
      } else if (tabName === 'Box Bag Machine') {
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              activeTabName: tabName,
              activeTabIndex: tabIndex,
              ...newObj,
              mfgListParam: {
                ...allFilters?.mfgLiveFlexo.mfgListParam,
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListParam,
            ...newObj,
          }),
        );
      } else if (tabName === 'Zipper Bag Machine') {
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              activeTabName: tabName,
              activeTabIndex: tabIndex,
              ...newObj,
              mfgListZipperParam: {
                ...allFilters?.mfgLiveFlexo.mfgListZipperParam,
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListZipperParam,
            ...newObj,
          }),
        );
      } else if (tabName === 'Loop Handle Bag Machine') {
        dispatch(
          setAllFilters({
            ...allFilters,
            mfgLiveFlexo: {
              ...allFilters?.mfgLiveFlexo,
              activeTabName: tabName,
              activeTabIndex: tabIndex,
              ...newObj,
              mfgListLoopParam: {
                ...allFilters?.mfgLiveFlexo.mfgListLoopParam,
              },
            },
          }),
        );
        dispatch(
          MFGfProcessLists({
            ...mfgListLoopParam,
            ...newObj,
          }),
        );
      }
    }
  };

  // useEffect(() => {
  //   if (liveOperatorMachineTypes?.length > 0 && !cylinderSizeList?.length) {
  //     const findMachineObj = liveOperatorMachineTypes?.find(
  //       item => item.name === activeTabName,
  //     );

  //     // const newObj = {
  //     //   ...(['FLEXO PRINT', 'SCREEN PRINT (R 2 R)'].includes(
  //     //     liveOperatorMachineTypes[0]?.name,
  //     //   ) && {
  //     //     cylinder: cylinderSizeList[0] === 'All' ? 0 : cylinderSizeList[0],
  //     //   }),
  //     //   print: liveOperatorMachineTypes[0]?.print,
  //     //   machine: liveOperatorMachineTypes[0]?.machine,
  //     //   print_technology: liveOperatorMachineTypes[0]?._id,
  //     // };

  //     const newObj = {
  //       print: findMachineObj?.print,
  //       machine: findMachineObj?.machine,
  //       print_technology: findMachineObj?._id,
  //     };

  //     dispatch(
  //       setAllFilters({
  //         ...allFilters,
  //         mfgLiveFlexo: {
  //           ...allFilters?.mfgLiveFlexo,
  //           ...newObj,
  //           // activeTabName: liveOperatorMachineTypes[0]?.name,
  //           // activeTabIndex: activeTabIndex,
  //           // cylinderActiveTabIndex: 0,
  //         },
  //       }),
  //     );

  //     dispatch(
  //       MFGfProcessLists({
  //         // ...mfgListBToBParam,
  //         ...mfgListFlexoParam,
  //         ...newObj,
  //       }),
  //     );
  //   }
  // }, [dispatch, liveOperatorMachineTypes]);

  return (
    <>
      {(mfgSuggestedRollLoading || mfgRollConsumptionLoading) && <Loader />}
      <div className="operator_tab_wrap mb-3">
        <TabView
          activeIndex={activeTabIndex}
          onTabChange={e => {
            dispatch(setListMFGProcess([]));
            handleTabChange(e.index, e.originalEvent.target.textContent);
          }}
        >
          {liveOperatorMachineTypes?.length > 0 &&
            liveOperatorMachineTypes?.map((item, index) => {
              return (
                <TabPanel header={item?.name}>{operatorPages(item)}</TabPanel>
              );
            })}
        </TabView>
      </div>
      <div className="tab_inner"></div>
    </>
  );
}
