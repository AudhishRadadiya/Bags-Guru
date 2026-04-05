import axios from 'axios';
import { roastError } from 'Helper/Common';
import { toast } from 'react-toastify';
import {
  setThumbnailList,
  setThumbnailListCount,
  setThumbnailLoading,
} from 'Store/Reducers/Thumbnail/ThumbnailSlice';

export const getThumbnailList =
  (limit = 30, start = 1, query = '', field_filter) =>
  async dispatch => {
    try {
      dispatch(setThumbnailLoading(true));
      const response = await axios.post(
        `list/thumbnail_search/${start}/${limit}`,
        {
          search: query,
          field_filter: field_filter,
        },
      );
      const { msg, err, data } = response.data;

      if (err === 0) {
        dispatch(setThumbnailList(data?.list));
        dispatch(setThumbnailListCount(data?.count));

        return data;
      } else if (err === 1) {
        toast.error(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    } finally {
      dispatch(setThumbnailLoading(false));
    }
  };
