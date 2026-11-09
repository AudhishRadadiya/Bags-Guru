import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllCommon } from 'Store/Reducers/Common';
import { getImageComparePromptList } from 'Services/Settings/MiscMasterService';

const useImageComparePromptTable = () => {
  const dispatch = useDispatch();

  const { miscMasterLoading, miscMasterCRUDLoading, imageComparePromptList } =
    useSelector(({ miscMaster }) => miscMaster);
  const { allCommon } = useSelector(({ common }) => common);

  const { imageComparePromptFilters, filterToggle } =
    allCommon?.imageComparePrompt || {};

  const loadList = useCallback(() => {
    dispatch(getImageComparePromptList());
  }, [dispatch]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const onFilterToggle = useCallback(() => {
    dispatch(
      setAllCommon({
        ...allCommon,
        imageComparePrompt: {
          ...allCommon?.imageComparePrompt,
          filterToggle: !filterToggle,
        },
      }),
    );
  }, [allCommon, dispatch, filterToggle]);

  const onFilter = useCallback(
    event => {
      dispatch(
        setAllCommon({
          ...allCommon,
          imageComparePrompt: {
            ...allCommon?.imageComparePrompt,
            imageComparePromptFilters: event?.filters,
          },
        }),
      );
    },
    [allCommon, dispatch],
  );

  return useMemo(
    () => ({
      miscMasterLoading,
      miscMasterCRUDLoading,
      imageComparePromptList,
      imageComparePromptFilters,
      filterToggle,
      loadList,
      onFilterToggle,
      onFilter,
    }),
    [
      filterToggle,
      imageComparePromptFilters,
      imageComparePromptList,
      loadList,
      miscMasterCRUDLoading,
      miscMasterLoading,
      onFilter,
      onFilterToggle,
    ],
  );
};

export default useImageComparePromptTable;
