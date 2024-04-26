import { setPurchaseEntryList } from 'Store/Reducers/Purchase/PurchaseEntryProgressSlice';
import { socket } from 'app';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// export const sendDataToSocket = data => {
//   socket.emit('getData', data);
// };

export const socketDataSend = userDataId => {
  if (userDataId) {
    socket.emit('getData', {
      id: userDataId,
    });
  }
};

export const checkSocketConnection = () => {
  return socket && socket.connected ? true : false;
};

const SocketComponent = () => {
  const dispatch = useDispatch();

  const { purchaseEntryList } = useSelector(
    ({ PurchaseEntryProgress }) => PurchaseEntryProgress,
  );

  useEffect(() => {
    const handleUpdateStatus = data => {
      let updatedList = purchaseEntryList?.map(d => {
        if (d?.id === data?.upload_id) {
          return {
            ...d,
            count: (data?.count * 100) / d?.total,
          };
        } else {
          return d;
        }
      });
      dispatch(setPurchaseEntryList(updatedList));
    };

    socket.on('updateStatus', handleUpdateStatus);

    // return () => {
    //   socket.off('updateStatus', handleUpdateStatus);
    // };
  }, [dispatch, purchaseEntryList]);

  useEffect(() => {
    const handleCompleteProcess = data => {
      let updatedList = purchaseEntryList?.filter(d => d.id !== data.id);
      dispatch(setPurchaseEntryList(updatedList));
      toast.success('Your Data has been uploaded successfully');
    };

    socket.on('completeProcess', handleCompleteProcess);

    // return () => {
    //   socket.off('completeProcess', handleCompleteProcess);
    // };
  }, [dispatch, purchaseEntryList]);

  // useEffect(() => {
  //   // Update Status Event Listener
  //   const handleUpdateStatus = data => {
  //     // if (Object.keys(data).length > 0) {
  //     let updatedList = purchaseEntryList?.map(d => {
  //       if (d?.id === data?.upload_id) {
  //         return {
  //           ...d,
  //           count: (data?.count * 100) / d?.total,
  //         };
  //       } else {
  //         return d;
  //       }
  //     });
  //     dispatch(setPurchaseEntryList(updatedList));
  //     // }
  //   };

  //   // Complete Process Event Listener
  //   const handleCompleteProcess = data => {
  //     let updatedList = purchaseEntryList?.filter(d => d.id !== data.id);
  //     dispatch(setPurchaseEntryList(updatedList));
  //     toast.success('Your Data has been uploaded successfully');
  //   };

  //   // Attach Event Listeners
  //   socket.on('updateStatus', handleUpdateStatus);
  //   socket.on('completeProcess', handleCompleteProcess);

  //   // Cleanup Function
  //   return () => {
  //     socket.off('updateStatus', handleUpdateStatus);
  //     socket.off('completeProcess', handleCompleteProcess);
  //   };
  // }, [dispatch, purchaseEntryList]);

  return <></>;
};

export default SocketComponent;
