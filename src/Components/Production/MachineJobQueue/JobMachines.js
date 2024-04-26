import { thousandSeparator } from 'Helper/Common';
import {
  machineQueueBagMakingstatus,
  mfgProcessByMachineTypeList,
  updateMachineQueueProcess,
} from 'Services/Production/machineJobQueueServices';
import moment from 'moment';
import { Checkbox } from 'primereact/checkbox';
import React, { memo, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Image } from 'primereact/image';

const handleScroll = e => {
  // Check if the user is dragging and if they are near the top or bottom of the container
  if (e.clientY < 100) {
    // Scroll up
    e.currentTarget.scrollTop -= 20;
  } else if (e.clientY > window.innerHeight - 100) {
    // Scroll down
    e.currentTarget.scrollTop += 20;
  }
};

const JobMachines = props => {
  const dispatch = useDispatch();
  const { hasAccess } = props;

  const [machineTypeList, setMachineTypeList] = useState({});
  const [machineAllColumnList, setMachineAllColumnList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [countDateData, setCountDateData] = useState(0);

  const {
    machineJobQueueLoading,
    machineJobQueueListLoading,
    machineByMachineTypeList,
    mfgProcessByMachineList,
    activeTabData,
  } = useSelector(({ machineJobQueueSlice }) => machineJobQueueSlice);

  const { is_create_access, is_edit_access } = hasAccess;
  const checkMoveJobPermission = !is_create_access || !is_edit_access;

  const handleDragDropItemsDate = jobItems => {
    let itemDate = 0;
    Object.values(jobItems)?.forEach(machine => {
      machine.items = machine?.items?.map(item => {
        const totalJobQty = (item?.qty || 0) / (machine?.machine_speed || 1);
        const todayDate = totalJobQty === 0 ? 0 : Math.ceil(totalJobQty) + 1;
        const dateAddition = countDateData + todayDate;
        setCountDateData(dateAddition);
        itemDate += todayDate;
        const estimatedDate = moment().add(itemDate, 'days').format('DD-MMM');

        const newItem = {
          ...item,
          bag_making_date:
            machine?.name?.toLowerCase() !== 'unassigned' ? estimatedDate : '',
          select_machine_job: false, // default selected job
        };
        return newItem;
      });
    });
    return jobItems;
  };

  const generateMachinesWiseItems = useMemo(() => {
    let updatedMachineWiseItemData = {};
    const machineColumnList = [...machineByMachineTypeList];
    machineColumnList.unshift({
      _id: 'unassigned',
      name: 'Unassigned',
      speed: '',
    });

    if (
      machineColumnList?.length > 0 &&
      Object.keys(mfgProcessByMachineList)?.length > 0
    ) {
      machineColumnList?.forEach(key => {
        // Iterate over machineColumnList to find the corresponding machine
        // const machine = machineColumnList?.find(
        //   machine => machine?._id === key,
        // );

        const machineDate = mfgProcessByMachineList?.list[key?._id];

        // If the machine is found, construct an object with desired properties
        const Obj = {
          [key?._id]: {
            id: key,
            name: key?.name,
            machine_speed: key?.speed,
            items: machineDate?.list,
            total_qty: machineDate?.total_qty,
            active_machine: activeTabData,
          },
        };
        const updatedObj = handleDragDropItemsDate(Obj);
        updatedMachineWiseItemData = {
          ...updatedMachineWiseItemData,
          ...updatedObj,
        };
      });
    }
    setMachineAllColumnList(machineColumnList);
    setMachineTypeList(updatedMachineWiseItemData);
    return updatedMachineWiseItemData;
  }, [machineByMachineTypeList, mfgProcessByMachineList, activeTabData]);

  // const handleDragDropItems = (
  //   data,
  //   activeMachine,
  //   sourceObj,
  //   destinationObj,
  //   draggableData,
  // ) => {
  //   let newObj = {
  //     machine_id: activeMachine?._id,
  //     mfg_process: {},
  //     source: { id: sourceObj?.droppableId, order: sourceObj?.index + 1 },
  //     destination: {
  //       id: destinationObj?.droppableId,
  //       order: destinationObj?.index + 1,
  //     },
  //     process_id: draggableData?.draggableId,
  //   };

  //   Object.keys(data).forEach(key => {
  //     const a = { [key]: [] };
  //     if (key !== 'unassigned') {
  //       data[key]?.items?.forEach((arr, index) => {
  //         a[key].push({
  //           process_id: arr?._id,
  //           order: index + 1,
  //         });
  //       });

  //       newObj = {
  //         ...newObj,
  //         mfg_process: { ...newObj.mfg_process, ...a },
  //       };
  //     }
  //   });
  //   return newObj;
  // };

  const onDragEnd = async (
    result,
    machineTypeList,
    setMachineTypeList,
    active_machine,
  ) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = machineTypeList[source.droppableId];
      const destColumn = machineTypeList[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      const sourceObj = {
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      };
      const destinationObj = {
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      };

      const updatedSourceObj = handleDragDropItemsDate(sourceObj);
      const updateddestinationObj = handleDragDropItemsDate(destinationObj);

      const updatedObj = {
        ...machineTypeList,
        ...updatedSourceObj,
        ...updateddestinationObj,
      };

      setMachineTypeList(updatedObj);

      const allDestinateColumnJobWithIndex = updateddestinationObj[
        destination?.droppableId
      ]?.items?.map((arr, index) => ({
        process_id: arr?._id,
        order: index + 1,
      }));

      const payloadObj = {
        machine_id: activeTabData?._id,
        source: { id: source?.droppableId, order: source?.index + 1 },
        destination: {
          id: destination?.droppableId,
          order: destination?.index + 1,
        },
        process_id: draggableId,
        destination_mfg_process: allDestinateColumnJobWithIndex || [],
      };

      // ** // Old flow of call the update API.
      // const modifyResponse = handleDragDropItems(
      //   updatedObj,
      //   activeTabData,
      //   source,
      //   destination,
      //   result,
      // );

      dispatch(updateMachineQueueProcess(payloadObj));

      // ** // mfgProcessByMachineTypeList is using for listing.
      // if (status_res) {
      //   dispatch(mfgProcessByMachineTypeList(activeTabData?._id));
      // }
    } else {
      if (source.index !== destination.index) {
        const column = machineTypeList[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems?.splice(destination.index, 0, removed);
        const sourceObj = {
          [source.droppableId]: {
            ...column,
            items: copiedItems,
          },
        };
        const updatedSourceObj = handleDragDropItemsDate(sourceObj);

        const updatedObj = {
          ...machineTypeList,
          ...updatedSourceObj,
        };

        setMachineTypeList(updatedObj);
        // ** // Old flow of call the update API.
        // const modifyResponse = handleDragDropItems(
        //   updatedObj,
        //   activeTabData,
        //   source,
        //   destination,
        //   result,
        // );

        const allDestinateColumnJobWithIndex = updatedSourceObj[
          destination?.droppableId
        ]?.items?.map((arr, index) => ({
          process_id: arr?._id,
          order: index + 1,
        }));

        const payloadObj = {
          machine_id: activeTabData?._id,
          source: { id: source?.droppableId, order: source?.index + 1 },
          destination: {
            id: destination?.droppableId,
            order: destination?.index + 1,
          },
          process_id: draggableId,
          destination_mfg_process: allDestinateColumnJobWithIndex || [],
        };

        dispatch(updateMachineQueueProcess(payloadObj));

        // ** // mfgProcessByMachineTypeList is using for listing.
        // if (status_res) {
        //   dispatch(mfgProcessByMachineTypeList(activeTabData?._id));
        // }
      }
    }
  };

  const handleMachineJobItems = data => {
    let totalDays = 0;

    const totalBagsPerMachine = data?.items?.reduce(
      (accumulator, currentValue) => accumulator + currentValue?.qty,
      0,
    );
    if (data?.machine_speed || data?.id !== 'unassigned') {
      totalDays =
        (totalBagsPerMachine ? totalBagsPerMachine : '') /
        (data?.machine_speed ? data?.machine_speed : '');
    }

    return { totalBagsPerMachine, totalDays };
  };

  // const handleCheckboxChange = (checkItem, item) => {
  //   if (checkItem) {
  //     // dispatch(machineQueueBagMakingstatus(item));
  //     // setTimeout(() => {
  //     //   dispatch(mfgProcessByMachineTypeList(activeTabData?._id));
  //     // }, [100]);
  //   }
  // };

  const handlefieldChange = (
    e,
    eventValue,
    rowData,
    machineId,
    machineData,
  ) => {
    const value = eventValue;
    const name = e.target.name;
    let updatedList = [...machineData?.items];

    const index = updatedList?.findIndex(x => x?._id === rowData?._id);

    if (index !== -1) {
      const oldObj = updatedList[index];

      const updatedObj = {
        ...oldObj,
        [name]: value,
      };
      updatedList[index] = updatedObj;
    }

    const updatedMachineData = {
      ...machineTypeList,
      [machineId]: {
        ...machineData,
        items: updatedList,
      },
    };

    setMachineTypeList(updatedMachineData);
    dispatch(machineQueueBagMakingstatus(rowData?._id));
    setTimeout(() => {
      dispatch(mfgProcessByMachineTypeList(activeTabData?._id));
    }, [100]);
  };

  return (
    <div className="mboxmaking_wrap">
      <div className="machine_box_wrap">
        <ul className="item_main">
          <DragDropContext
            onDragEnd={result =>
              onDragEnd(
                result,
                machineTypeList,
                setMachineTypeList,
                activeTabData,
              )
            }
          >
            {Object.entries(machineTypeList)?.map(
              ([columnId, column], index) => {
                const { totalBagsPerMachine, totalDays } =
                  handleMachineJobItems(column);

                return (
                  <li
                    key={columnId}
                    // items_wrap
                  >
                    <div className="machine_box_top">
                      <h5 className="m-0">{column?.name}</h5>
                    </div>
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <>
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              style={
                                {
                                  // background: snapshot.isDraggingOver
                                  //   ? 'lightblue'
                                  //   : '#F0F0F0',
                                  // padding: 4,
                                  // minHeight: 500,
                                  // overflow: "auto"
                                }
                              }
                              onDragOver={handleScroll}
                              className="machine_box_inner"
                            >
                              {column?.items?.map((item, index) => {
                                // const { MachinebagVolume, estimatedDate } =
                                //   handleManageJobItem(column, item);

                                const date1 = item?.job_created_at;
                                const date2 = new Date(); // Current date

                                const diffInDays = moment(date2)
                                  .startOf('day')
                                  .diff(moment(date1).startOf('day'), 'days');

                                // If dates are not the same and the current date is not included, subtract 1 from the difference
                                const diffCreatedJobToCurrent = diffInDays
                                  ? diffInDays
                                  : 0;

                                const MachinebagVolume = item
                                  ? `${
                                      item?.width
                                        ? 'W ' + item?.width + '”'
                                        : ''
                                    } ${
                                      item?.height
                                        ? 'x  H ' + item?.height + '”'
                                        : ''
                                    } ${
                                      item?.gusset
                                        ? 'x G ' + item?.gusset + '”'
                                        : ''
                                    } ${
                                      item?.gsm ? '(' + item?.gsm + ' GSM)' : ''
                                    }`
                                  : '-';

                                return (
                                  <Draggable
                                    key={item?._id}
                                    draggableId={item?._id}
                                    index={index}
                                  >
                                    {(provided, snapshot) => {
                                      return (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            userSelect: 'none',
                                            // padding: 16,
                                            // margin: '0 0 8px 0',
                                            // minHeight: '50px',
                                            backgroundColor: snapshot.isDragging
                                              ? '#eeeaff'
                                              : '',
                                            // color: 'white',
                                            ...provided.draggableProps.style,
                                          }}
                                          className={`machine_box ${
                                            item?.color === 1
                                              ? 'machine_box_pending'
                                              : item?.color === 2 &&
                                                'machine_box_success'
                                          }
                                        ${
                                          (machineJobQueueLoading ||
                                            machineJobQueueListLoading ||
                                            checkMoveJobPermission) &&
                                          'machine_box_disable'
                                        }
                                        `}
                                        >
                                          <div className="machine_box_left">
                                            <Image
                                              // src={ProductImg}
                                              // zoomSrc={ProductImgBig}
                                              src={item?.main_image}
                                              zoomSrc={item?.main_image}
                                              alt="Image"
                                              preview
                                              downloadable
                                            />

                                            <span className="d-block mt-2 text_small white_space_nowrap">
                                              {/* {item?.bag_making_date} */}
                                              {/* {columnId !== 'unassigned'
                                                ? updatedJobDate
                                                : ''} */}
                                              {diffCreatedJobToCurrent} Days
                                            </span>

                                            {columnId !== 'unassigned' && (
                                              <div className="form_group checkbox_wrap">
                                                <Checkbox
                                                  // checked={
                                                  //   checkedItems || false
                                                  // }
                                                  checked={
                                                    item?.select_machine_job
                                                  }
                                                  name="select_machine_job"
                                                  onChange={e => {
                                                    // setCheckedItems(
                                                    //   e.target.checked,
                                                    // );
                                                    // handleCheckboxChange(
                                                    //   e.target.checked,
                                                    //   item?._id,
                                                    // );
                                                    handlefieldChange(
                                                      e,
                                                      e.target.checked,
                                                      item,
                                                      columnId,
                                                      column,
                                                    );
                                                  }}
                                                  disabled={
                                                    checkMoveJobPermission
                                                  }
                                                />
                                              </div>
                                            )}
                                          </div>
                                          <div className="machine_box_right">
                                            <ul>
                                              <li>
                                                <span>{item?.design}</span>
                                              </li>
                                              <li>
                                                <span>{MachinebagVolume}</span>
                                              </li>
                                              <li>
                                                <span>
                                                  {item?.handle_color}
                                                </span>
                                              </li>
                                              <li>
                                                <span>
                                                  {item?.handle_material}
                                                </span>
                                              </li>
                                              <li>
                                                <span>
                                                  Handle Length:{' '}
                                                  {item?.handle_length
                                                    ? `${item?.handle_length}"`
                                                    : ''}
                                                </span>
                                              </li>
                                              <li>
                                                <span>
                                                  {item?.qunatity} Bags
                                                </span>
                                              </li>
                                              {(item?.is_double_sided_tape ||
                                                item?.velcro) && (
                                                <>
                                                  <li>
                                                    <span>{`Velcro: ${
                                                      item?.velcro
                                                        ? item?.velcro
                                                        : 'N/A'
                                                    }`}</span>
                                                  </li>
                                                  <li>
                                                    <span>
                                                      Double Side Tap:{' '}
                                                      {item?.is_double_sided_tape
                                                        ? 'Yes'
                                                        : 'No'}
                                                    </span>
                                                  </li>
                                                </>
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                      );
                                    }}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          </>
                        );
                      }}
                    </Droppable>
                    <div className="machine_box_bottom">
                      {columnId === 'unassigned' ? (
                        <>
                          <ul style={{ justifyContent: 'end' }}>
                            <li style={{ borderLeft: '1px solid #d7d7d7' }}>
                              {thousandSeparator(totalBagsPerMachine)} Bags
                            </li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <ul>
                            <li>
                              <span className="w-100">
                                Speed:
                                <b className="fw_600 ms-1">
                                  {column?.machine_speed}
                                </b>
                              </span>
                            </li>
                            <li>
                              <span className="w-100">
                                Days:
                                <b className="fw_600 ms-1">
                                  {Math.ceil(totalDays)}
                                </b>
                              </span>
                            </li>
                            <li>
                              {thousandSeparator(totalBagsPerMachine)} Bags
                            </li>
                          </ul>
                        </>
                      )}
                    </div>
                  </li>
                );
              },
            )}
          </DragDropContext>
        </ul>
      </div>
      <div className="mt-3">
        <ul className="pending_bags">
          <li>
            Total Bags
            <span>
              {mfgProcessByMachineList?.total_qty
                ? thousandSeparator(mfgProcessByMachineList?.total_qty)
                : 0}{' '}
              Bags
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default memo(JobMachines);
