import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import ProductImg from '../../../Assets/Images/product-thumb.jpg';
import update from 'immutability-helper';
import { useDispatch } from 'react-redux';
import {
  machineQueueBagMakingstatus,
  mfgProcessByMachineTypeList,
  updateMachineQueueProcess,
} from 'Services/Production/machineJobQueueServices';
import { useSelector } from 'react-redux';
import { Checkbox } from 'primereact/checkbox';

const MovableJobItem = props => {
  const {
    data,
    orderId,
    index,
    jobItem,
    estimatedDate,
    MachinebagVolume,
    MachineJobItem,
    activeTabName,
    machineAllTypeList,
    setMachineAllTypeList,
    handleDragDropItems,
    hasAccess,
  } = props;

  const { is_create_access, is_edit_access } = hasAccess;
  const checkMoveJobPermission = !is_create_access || !is_edit_access;

  const ref = useRef(null);
  const dispatch = useDispatch();
  const [checkedItems, setCheckedItems] = useState({});
  // const [jobItems, setJobItems] = useState({});
  const { machineJobQueueLoading, machineJobQueueListLoading, activeTabData } =
    useSelector(({ machineJobQueueSlice }) => machineJobQueueSlice);

  const moveCardHandler = async (dragIndex, hoverIndex, item) => {
    const oldJobsArray = [...item?.list];
    const updatedJobsArray = update(oldJobsArray, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, oldJobsArray[dragIndex]],
      ],
    });

    const updateMachineType = {
      ...machineAllTypeList,
      list: {
        ...machineAllTypeList.list,
        [item.data._id]: {
          ...machineAllTypeList[item.data._id],
          list: updatedJobsArray,
        },
      },
    };
    setMachineAllTypeList(updateMachineType);
    const modifyResponse = handleDragDropItems(updateMachineType);
    const status_res = await dispatch(
      updateMachineQueueProcess(modifyResponse),
    );
    if (status_res) {
      dispatch(mfgProcessByMachineTypeList(activeTabData?._id));
    }
  };

  const [, drop] = useDrop({
    accept: 'machineJOb',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex || item.data._id === 'unassigned') {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // for jump product one column to infinity:
      // const isNearTopEdge = clientOffset.y < hoverBoundingRect.top + 50;
      // const isNearBottomEdge = clientOffset.y > hoverBoundingRect.bottom - 50;

      // if (isNearTopEdge) {
      //   ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // } else if (isNearBottomEdge) {
      //   ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      // }

      moveCardHandler(dragIndex, hoverIndex, item);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type:
      machineJobQueueLoading ||
      machineJobQueueListLoading ||
      checkMoveJobPermission
        ? ''
        : 'machineJOb',
    item: {
      data: data,
      jobItem: jobItem,
      list: MachineJobItem?.list,
      id: orderId,
      index,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),

    // for jump product one column to infinity:
    // end: (item, monitor) => {
    //   const dropResult = monitor.getDropResult();
    //   if (dropResult && dropResult.columnIndex === 8) {
    //     // Scroll the last column into view after dropping the item
    //     const lastColumn = document.querySelector(`#column-8`);
    //     lastColumn.scrollIntoView({
    //       behavior: 'smooth',
    //       block: 'nearest',
    //       inline: 'end',
    //     });
    //   }
    // },

    end: (item, monitor) => {
      // const dropResult = monitor.getDropResult();
    },
  });

  drag(drop(ref));

  // useEffect(() => {
  //   handleCheckedItems();
  // }, [checkedItems]);

  // const handleCheckedItems = () => {
  //   if (Object.keys(checkedItems)?.length > 0) {
  //     dispatch(machineQueueBagMakingstatus(jobItem._id));
  //   }
  // };

  // const handleCheckboxChange = itemId => {
  //   setCheckedItems(prevCheckedItems => ({
  //     ...prevCheckedItems,
  //     [itemId]: !prevCheckedItems[itemId],
  //   }));
  // };

  const handleCheckboxChange = (checkItem, item) => {
    if (checkItem) {
      dispatch(machineQueueBagMakingstatus(item));
      setTimeout(() => {
        dispatch(mfgProcessByMachineTypeList(activeTabName?._id));
      }, [100]);
    }
  };

  // const handleStart = () => {
  //   ref.current = setTimeout(() => {
  //     drag(); // Start dragging after a long press
  //   }, 500); // Adjust the duration as needed
  // };

  // const handleMove = () => {
  //   clearTimeout(ref.current); // Cancel the long press timer if the mouse moves
  // };

  // const handleEnd = () => {
  //   clearTimeout(ref.current); // Cancel the long press timer
  // };

  // const longPressHandlers = useLongPress(() => {
  //   // Callback function for long press
  //   drag();
  // });

  // const handleKeyDown = e => {
  //   if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
  //     // Move focus up or down
  //     e.preventDefault();
  //     const newIndex = e.key === 'ArrowUp' ? index - 1 : index + 1;
  //     const selector = `li[data-index='${newIndex}']`;
  //     const element = document.querySelector(selector);
  //     if (element) {
  //       element.focus();
  //     }
  //   } else if (e.key === ' ') {
  //     // Start dragging
  //     e.preventDefault();
  //     drag();
  //   }
  // };

  return (
    <>
      <div
        ref={ref}
        // tabIndex={focused ? 0 : -1}
        // onKeyDown={e => {
        //   handleKeyDown(e);
        // }}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        // {...longPressHandlers}
        className={`machine_box ${
          jobItem?.color === 1
            ? 'machine_box_pending'
            : jobItem?.color === 2 && 'machine_box_success'
        } ${
          (machineJobQueueLoading ||
            machineJobQueueListLoading ||
            checkMoveJobPermission) &&
          'machine_box_disable'
        }`}
      >
        <div className="machine_box_left">
          <img src={jobItem?.main_image} alt="ProductImg" />
          <span className="d-block mt-2 text_small">
            {data?.name !== 'Unassigned' && estimatedDate}
          </span>

          {data?.name !== 'Unassigned' && (
            <div className="form_group checkbox_wrap">
              <Checkbox
                // checked={checkedItems[jobItem._id] || false}
                checked={checkedItems || false}
                onChange={e => {
                  setCheckedItems(e.target.checked);
                  handleCheckboxChange(e.target.checked, jobItem?._id);
                }}
                disabled={checkMoveJobPermission}
              />
            </div>
          )}
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
              <span>Handle Length: {jobItem?.handle_length}" </span>
            </li>
            <li>
              <span>{jobItem?.qunatity} Bags</span>
            </li>
            {(jobItem?.is_double_sided_tape || jobItem?.velcro) && (
              <>
                <li>
                  <span>{`Velcro: ${
                    jobItem?.velcro ? jobItem?.velcro : 'N/A'
                  }`}</span>
                </li>
                <li>
                  <span>
                    Double Side Tap:{' '}
                    {jobItem?.is_double_sided_tape ? 'Yes' : 'No'}
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MovableJobItem;
