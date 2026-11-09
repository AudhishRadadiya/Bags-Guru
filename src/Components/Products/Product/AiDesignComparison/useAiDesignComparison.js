import { useCallback, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { uploadFile } from 'Services/CommonService';
import {
  compareAiDesign,
  getCustomerReferenceImages,
} from 'Services/Products/ProductService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  setAiDesignComparisonResult,
  setCustomerReferenceImages,
} from 'Store/Reducers/Products/ProductSlice';

const MAX_REFERENCE_SELECTION = 3;

const initialState = {
  visible: false,
  extraImages: [],
  isCompared: false,
  selectedReferenceImages: [],
};

const normalizeImage = (item, index, source) => ({
  id: `${source}-${index}-${item?.main_image ?? ''}`,
  image_url: item?.main_image,
  image_name: item?.design_name ?? 'Reference Image',
  label: item?.label ?? 'Old Reference Image',
  source,
});

const reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return {
        ...initialState,
        visible: true,
      };
    case 'CLOSE_DIALOG':
      return { ...initialState };
    case 'TOGGLE_SELECTION': {
      const { imageUrl } = action.payload;
      const isSelected = state.selectedReferenceImages.includes(imageUrl);

      if (isSelected) {
        return {
          ...state,
          selectedReferenceImages: state.selectedReferenceImages.filter(
            url => url !== imageUrl,
          ),
          isCompared: false,
        };
      }

      if (state.selectedReferenceImages.length >= MAX_REFERENCE_SELECTION) {
        toast.error(
          `You can select up to ${MAX_REFERENCE_SELECTION} references`,
        );
        return state;
      }

      return {
        ...state,
        selectedReferenceImages: [...state.selectedReferenceImages, imageUrl],
        isCompared: false,
      };
    }
    case 'ADD_EXTRA_IMAGE':
      return {
        ...state,
        extraImages: [...state.extraImages, action.payload],
        selectedReferenceImages: [
          ...state.selectedReferenceImages,
          action.payload.image_url,
        ].slice(0, MAX_REFERENCE_SELECTION),
        isCompared: false,
      };
    case 'SET_COMPARE_RESULT':
      return {
        ...state,
        isCompared: !!action.payload,
      };
    case 'RESET_COMPARE':
      return { ...state, isCompared: false };
    default:
      return state;
  }
};

export const useAiDesignComparison = () => {
  const dispatch = useDispatch();
  const [state, localDispatch] = useReducer(reducer, initialState);

  const { customerReferenceImages } = useSelector(({ product }) => product);

  const fetchReferenceImages = useCallback(
    async customerGroup => {
      dispatch(setCustomerReferenceImages({}));

      dispatch(setAiDesignComparisonResult(null));

      dispatch(getCustomerReferenceImages(customerGroup));
    },
    [dispatch],
  );

  const openDialog = useCallback(() => {
    dispatch(setAiDesignComparisonResult(null));
    localDispatch({ type: 'OPEN_DIALOG' });
  }, [dispatch]);

  const closeDialog = useCallback(() => {
    localDispatch({ type: 'CLOSE_DIALOG' });
  }, []);

  const toggleImageSelection = useCallback(imageUrl => {
    localDispatch({ type: 'TOGGLE_SELECTION', payload: { imageUrl } });
  }, []);

  const uploadExtraReference = useCallback(
    async file => {
      if (!file) return;

      const nameLength = file?.name?.split('.');
      const extension = nameLength[nameLength?.length - 1]?.toLowerCase();

      if (!['jpg', 'jpeg', 'png'].includes(extension)) {
        toast.error('Only JPG, JPEG, and PNG files are allowed');
        return;
      }

      const fileSizeLimit = 5 * 1024 * 1024;
      if (file.size > fileSizeLimit) {
        toast.error('Upload file must not be larger than 5MB');
        return;
      }

      const uploadedUrl = await dispatch(uploadFile(file));

      if (uploadedUrl) {
        const extraImage = normalizeImage(
          {
            main_image: uploadedUrl,
            design_name: file.name,
            label: 'Extra Reference Image',
          },
          state.extraImages.length,
          'upload',
        );
        localDispatch({ type: 'ADD_EXTRA_IMAGE', payload: extraImage });
      }
    },
    [dispatch, state.extraImages.length],
  );

  const runComparison = useCallback(
    async mainImage => {
      if (!mainImage) {
        toast.error('Please upload a main image before comparing');
        return;
      }

      // if (!state.selectedReferenceImages.length) {
      //   toast.error('Please select at least one reference image');
      //   return;
      // }

      const result = await dispatch(
        compareAiDesign({
          main_image: mainImage,
          reference_images: state.selectedReferenceImages,
        }),
      );

      localDispatch({
        type: 'SET_COMPARE_RESULT',
        payload: result,
      });
    },
    [dispatch, state],
  );

  const selectedCount = state.selectedReferenceImages.length;

  const allImages = [
    ...(customerReferenceImages.reference_images ?? []),
    ...state.extraImages,
  ];

  return {
    state,
    allImages,
    selectedCount,
    maxSelection: MAX_REFERENCE_SELECTION,
    openDialog,
    closeDialog,
    fetchReferenceImages,
    toggleImageSelection,
    uploadExtraReference,
    runComparison,
  };
};
