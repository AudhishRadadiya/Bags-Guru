import moment from 'moment';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import MovableJobItem from './MovableJobItem';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import {
  mfgProcessByMachineTypeList,
  updateMachineQueueProcess,
} from 'Services/Production/machineJobQueueServices';
import {
  DndProvider,
  MouseTransition,
  TouchTransition,
  MultiBackend,
} from 'react-dnd-multi-backend';
import { thousandSeparator } from 'Helper/Common';

export default function MachineFlexoPrinting({ activeTabName, hasAccess }) {
  let date = 0;
  const dispatch = useDispatch();

  const HTML5toTouch = {
    backends: [
      {
        id: 'html5',
        backend: HTML5Backend,
        transition: MouseTransition,
      },
      {
        id: 'touch',
        backend: TouchBackend,
        options: { enableMouseEvents: true },
        preview: true,
        transition: TouchTransition,
      },
    ],
  };

  const [machineAllColumnList, setMachineAllColumnList] = useState([]);
  const [machineAllTypeList, setMachineAllTypeList] = useState({});

  const { machineByMachineTypeList, mfgProcessByMachineList, activeTabData } =
    useSelector(({ machineJobQueueSlice }) => machineJobQueueSlice);

  const handleDragDropItems = data => {
    let newObj = {
      machine_id: activeTabName._id,
      mfg_process: {},
    };
    Object.keys(data?.list).map(key => {
      const a = { [key]: [] };
      if (key !== 'unassigned') {
        data?.list[key]?.list?.map((arr, index) => {
          a[key].push({
            process_id: arr?._id,
            order: index + 1,
          });
        });

        newObj = {
          ...newObj,
          mfg_process: { ...newObj.mfg_process, ...a },
        };
      }
    });

    return newObj;
  };

  useEffect(() => {
    const machineColumnList = [...machineByMachineTypeList];
    machineColumnList.unshift({
      _id: 'unassigned',
      name: 'Unassigned',
      speed: '',
    });
    setMachineAllColumnList(machineColumnList);
    setMachineAllTypeList(mfgProcessByMachineList);
  }, [machineByMachineTypeList, mfgProcessByMachineList]);

  const handleMachineJobItems = data => {
    date = 0;
    const MachineJobItem =
      Object.keys(machineAllTypeList)?.length > 0 &&
      Object.keys(machineAllTypeList?.list)
        ?.map(key => key === data?._id && machineAllTypeList?.list[key])
        ?.find(arr => arr);

    const totalBagsPerMachine = MachineJobItem?.list?.reduce(
      (accumulator, currentValue) => accumulator + currentValue?.qty,
      0,
    );
    const totalDays =
      (totalBagsPerMachine ? totalBagsPerMachine : '') /
      (data?.speed ? data?.speed : '');

    // const totalDays =
    //   (MachineJobItem?.total_qty ? MachineJobItem?.total_qty : '') /
    //   (data?.speed ? data?.speed : '');
    return { MachineJobItem, totalBagsPerMachine, totalDays };
  };

  const Column = ({
    index,
    children,
    data,
    MachineJobItem,
    totalDays,
    totalBagsPerMachine,
  }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: 'machineJOb',
      // drop: () => ({ name: data }),
      drop: item => manageDropData(item, data),
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      // Override monitor.canDrop() function
      // canDrop: item => {
      //   console.log('column-item', item);
      // },
    });

    const manageDropData = async (item, data) => {
      let updateMachineTypeData = machineAllTypeList;

      const removeDragItem = machineAllTypeList?.list[
        item?.data?._id
      ]?.list?.filter(unItem => unItem._id !== item?.jobItem?._id);

      const addDropItem = [...machineAllTypeList.list[data._id].list];
      addDropItem.push(item?.jobItem);

      // let estimatedDays = updateMachineTypeData.list[data._id].list.reduce(
      //   (acc, curr) => acc + curr.qty,
      //   0,
      // );
      // const allJobBagTotal = estimatedDays / data.speed;

      if (item?.data?._id !== data?._id) {
        updateMachineTypeData = {
          ...updateMachineTypeData,
          list: {
            ...machineAllTypeList.list,
            [item?.data?._id]: {
              ...machineAllTypeList.list[data?._id],
              list: removeDragItem,
            },
            [data?._id]: {
              ...machineAllTypeList.list[data?._id],
              list: addDropItem,
            },
          },
        };
        const modifyResponse = handleDragDropItems(updateMachineTypeData);
        setMachineAllTypeList(updateMachineTypeData);
        const status_res = await dispatch(
          updateMachineQueueProcess(modifyResponse),
        );
        if (status_res) {
          dispatch(mfgProcessByMachineTypeList(activeTabData?._id));
        }
      }
    };

    return (
      <li>
        <div className="machine_box_top">
          <h5 className="m-0">{data.name}</h5>
        </div>
        <div ref={drop} className="machine_box_inner">
          {children}
        </div>
        <div className="machine_box_bottom">
          {data?.name === 'Unassigned' ? (
            <>
              <ul style={{ justifyContent: 'end' }}>
                <li style={{ borderLeft: '1px solid #d7d7d7' }}>
                  {thousandSeparator(
                    mfgProcessByMachineList?.list?.unassigned?.total_qty,
                  )}{' '}
                  Bags
                </li>
              </ul>
            </>
          ) : (
            <>
              <ul>
                <li>
                  <span className="w-100">
                    Speed:<b className="fw_600 ms-1">{data.speed}</b>
                  </span>
                </li>
                <li>
                  <span className="w-100">
                    Days:
                    <b className="fw_600 ms-1">{Math.ceil(totalDays)}</b>
                  </span>
                </li>
                <li>{thousandSeparator(totalBagsPerMachine)} Bags</li>
              </ul>
            </>
          )}
        </div>
      </li>
    );
  };

  const returnItemsForColumn = (MachineJobItem, data, totalDays, date) => {
    return MachineJobItem?.list?.map((jobItem, index) => {
      // const MachinebagVolume = `W ${jobItem?.width}" X H ${jobItem?.height}" X G ${jobItem?.gsm}"`;
      const MachinebagVolume = jobItem
        ? `${jobItem?.width ? 'W ' + jobItem?.width + '”' : ''} ${
            jobItem?.height ? 'x  H ' + jobItem?.height + '”' : ''
          } ${jobItem?.gusset ? 'x G ' + jobItem?.gusset + '”' : ''} ${
            jobItem?.gsm ? '(' + jobItem?.gsm + ' GSM)' : ''
          }`
        : '-';
      const totalJobQty =
        (jobItem?.qty ? jobItem?.qty : '') / (data?.speed ? data?.speed : '');
      const todayDate = totalJobQty === 0 ? 0 : Math.ceil(totalJobQty) + 1;
      date += todayDate;
      const incresedDate = moment().add(date, 'days')?._d;
      const estimatedDate = moment(incresedDate).format('DD-MMM');

      return (
        <MovableJobItem
          key={index}
          index={index}
          orderId={jobItem?.order}
          data={data}
          jobItem={jobItem}
          estimatedDate={estimatedDate}
          MachinebagVolume={MachinebagVolume}
          MachineJobItem={MachineJobItem}
          machineAllTypeList={machineAllTypeList}
          setMachineAllTypeList={setMachineAllTypeList}
          activeTabName={activeTabName}
          handleDragDropItems={handleDragDropItems}
          hasAccess={hasAccess}
        />
      );
    });
  };

  return (
    <div className="mboxmaking_wrap">
      <div className="machine_box_wrap">
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          <ul>
            {/* {machineByMachineTypeList?.length > 0 && (
              <li>
                <div className="machine_box_top">
                  <h5 className="m-0">Unassigned</h5>
                </div>
                <div className="machine_box_inner">
                  {mfgProcessByMachineList?.list?.unassigned?.list?.map(
                    item => {
                      const UnassignedItemVolume = `W ${item.width}" X H ${item.height}" X G ${item.gsm}"`;
                      return (
                        <>
                          <div
                            className={`machine_box ${
                              item?.color === 1
                                ? 'machine_box_pending'
                                : item?.color === 2 && 'machine_box_success'
                            }`}
                          >
                            <div className="machine_box_left">
                              <img src={ProductImg} alt="ProductImg" />
                              <span className="d-block mt-2 text_small">
                                19-Oct
                              </span>
                            </div>
                            <div className="machine_box_right">
                              <ul>
                                <li>
                                  <span>{item?.design}</span>
                                </li>
                                <li>
                                  <span>{UnassignedItemVolume}</span>
                                </li>
                                <li>
                                  <span>{item?.handle_color}</span>
                                </li>
                                <li>
                                  <span>{item?.handle_material}</span>
                                </li>
                                <li>
                                  <span>
                                    Handle Length: {item.handle_length}{' '}
                                  </span>
                                </li>
                                <li>
                                  <span>{item?.qunatity}</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </>
                      );
                    },
                  )}
                </div>
                <div className="machine_box_bottom">
                  <ul style={{ justifyContent: 'end' }}>
                    <li style={{ borderLeft: '1px solid #d7d7d7' }}>
                      <span>
                        {mfgProcessByMachineList?.list?.unassigned?.total_qty}{' '}
                        bags
                      </span>
                    </li>
                  </ul>
                </div>
              </li>
            )} */}

            {machineAllColumnList?.length > 0 &&
              machineAllColumnList?.map((data, index) => {
                const { MachineJobItem, totalBagsPerMachine, totalDays } =
                  handleMachineJobItems(data);
                return (
                  <>
                    <Column
                      key={index}
                      index={index}
                      data={data}
                      MachineJobItem={MachineJobItem}
                      totalDays={totalDays}
                      totalBagsPerMachine={totalBagsPerMachine}
                    >
                      {returnItemsForColumn(
                        MachineJobItem,
                        data,
                        totalDays,
                        date,
                      )}
                    </Column>

                    {/* <Column title={data.name} className="column do-it-column">
                      <li ref={ref}>
                        <div className="machine_box_top">
                          <h5 className="m-0">{data.name}</h5>
                        </div>
                        <div className="machine_box_inner">
                          {MachineJobItem?.list?.map(jobItem => {
                            const MachinebagVolume = `W ${jobItem.width}" X H ${jobItem.height}" X G ${jobItem.gsm}"`;
                            const totalJobQty =
                              (jobItem?.qty ? jobItem?.qty : '') /
                              (data?.speed ? data?.speed : '');
                            const estimatedDate =
                              handleEstimateDate(totalJobQty);

                            return (
                              <>
                                <div
                                  className={`machine_box ${
                                    jobItem?.color === 1
                                      ? 'machine_box_pending'
                                      : jobItem?.color === 2 &&
                                        'machine_box_success'
                                  }`}
                                >
                                  <div className="machine_box_left">
                                    <img src={ProductImg} alt="ProductImg" />
                                    <span className="d-block mt-2 text_small">
                                      {estimatedDate}
                                    </span>
                                  </div>
                                  <div className="machine_box_right">
                                    <ul>
                                      <li>
                                        <span>{jobItem?.design}</span>
                                      </li>
                                      <li>
                                        <span>{MachinebagVolume}</span>
                                      </li>
                                      <li>
                                        <span>{jobItem?.handle_color}</span>
                                      </li>
                                      <li>
                                        <span>{jobItem?.handle_material}</span>
                                      </li>
                                      <li>
                                        <span>
                                          Handle Length: {jobItem.handle_length}{' '}
                                        </span>
                                      </li>
                                      <li>
                                        <span>{jobItem?.qunatity}</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>

                        <div className="machine_box_bottom">
                          <ul>
                            <li>
                              <span className="w-100">
                                Speed:<div>{data.speed}</div>
                              </span>
                            </li>
                            <li>
                              <span className="w-100">
                                Days:
                                <div>
                                  {parseFloat(Number(totalDays).toFixed(2))}
                                </div>
                              </span>
                            </li>
                            <li>{MachineJobItem?.total_qty} bags</li>
                          </ul>
                        </div>
                      </li>
                    </Column> */}
                  </>
                );
              })}
          </ul>
          <div className="mt-3">
            <ul className="pending_bags">
              <li>
                Total Bags
                <span>
                  {machineAllTypeList?.total_qty
                    ? thousandSeparator(machineAllTypeList?.total_qty)
                    : 0}{' '}
                  Bags
                </span>
              </li>
            </ul>
          </div>
        </DndProvider>
      </div>
    </div>
  );
}
