import { toast } from 'react-toastify';

export const statusObj = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export const roastError = e => {
  toast.error('Something goes wrong, please try again later');
};

export const rawItemAttributeType = key => {
  if (key === 1) return 'Text';
  else if (key === 2) return 'Number';
  else if (key === 3) return 'Select';
  else if (key === 4) return 'Radio';
  else if (key === 5) return 'Attachment';
  else if (key === 6) return 'Checkbox';
  else return;
};

export const convertThousandToNumeric = (value, data) => {
  const currencyValue = value ? value : '';
  const numberString = currencyValue.replace(/[^\d.]/g, '');
  const numberValue = parseFloat(numberString);
  return numberValue;
};

export const convertStringToArray = numbersString => {
  if (!numbersString) return;
  return numbersString?.split(',')?.map(number => number?.trim());
};

export const convertSnakeCaseToTitleCase = str => {
  if (!str) return;
  return str
    .replace(/(^\w)/g, g => g[0].toUpperCase())
    .replace(/([-_]\w)/g, g => ' ' + g[1].toUpperCase())
    .trim();
};

export const formattedDate = date => {
  if (!date) return;
  return new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const countDaysBetweenTwoDays = date => {
  const todayDate = new Date();
  const lastDate = new Date(date);
  const differenceInTime = todayDate?.getTime() - lastDate?.getTime();
  if (differenceInTime <= 0) return 'Just now';

  const minutes = Math.floor(differenceInTime / (1000 * 60));
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} before`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} before`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days > 1 ? 's' : ''} before`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''} before`;
  }

  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} before`;
};

export const getYTDDateRange = () => {
  const currentDate = new Date();

  const beginningOfYear = new Date(currentDate.getFullYear(), 3, 1);

  const year = beginningOfYear?.getFullYear();
  const month = (beginningOfYear?.getMonth() + 1).toString().padStart(2, '0');
  const day = beginningOfYear.getDate().toString().padStart(2, '0');

  const getDMYDateFormat = `${year}-${month}-${day}`;
  return [new Date(getDMYDateFormat), new Date(currentDate)];
};

export const getDMYDateRange = () => {
  const currentDate = new Date();

  const beginningOfYear = new Date(currentDate.getFullYear(), 3, 1);

  const year = beginningOfYear?.getFullYear();
  const month = (beginningOfYear?.getMonth() + 1).toString().padStart(2, '0');
  const day = beginningOfYear.getDate().toString().padStart(2, '0');

  const getDMYDateFormat = `${day}-${month}-${year}`;
  return [new Date(getDMYDateFormat), new Date(currentDate)];
};
export const getFormattedDate = value => {
  // if (!date) return;
  const date = value ? value : new Date();
  const year = date?.getFullYear();
  const month = (date?.getMonth() + 1)?.toString()?.padStart(2, '0');
  const day = date?.getDate()?.toString()?.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const covertDMYIntoLocalFormat = date => {
  const [day, month, year] = date?.split('-');
  const inputDate = new Date(`${year}-${month}-${day}`);
  const convertedDate = new Date(inputDate?.getTime() + 330 * 60000);
  return convertedDate;
};

export const getDMYDateFormat = date => {
  if (!date) return;
  const year = date?.getFullYear();
  const month = (date?.getMonth() + 1)?.toString()?.padStart(2, '0');
  const day = date?.getDate()?.toString()?.padStart(2, '0');
  return `${day}-${month}-${year}`;
};

export const excelSerialDateToUTC = serial => {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400; // seconds per day
  return new Date(utcValue * 1000);
};

export const getDateRange = (periodType, periodValue) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate);

  if (periodType === 'months') {
    startDate.setMonth(currentDate?.getMonth() - periodValue);
  } else if (periodType === 'years') {
    startDate.setFullYear(currentDate?.getFullYear() - periodValue);
  } else {
    throw new Error('Invalid periodType. Use "months" or "years"');
  }

  const formattedStartDate = new Date(startDate.toISOString().split('T')[0]);
  const formattedEndDate = new Date(currentDate.toISOString().split('T')[0]);

  return [formattedStartDate, formattedEndDate];
};

export const getPercentageRange = data => {
  if (!data) return;
  const trueSum = data?.find(item => item._id === true)?.sum || 0;
  const falseSum = data?.find(item => item._id === false)?.sum || 0;
  const totalSum = trueSum + falseSum;

  // Step 2: Calculate the percentage for true and false
  const truePercentage = (trueSum / totalSum) * 100;
  const falsePercentage = (falseSum / totalSum) * 100;

  // Step 3: Round the percentages to a specific number of decimal places (optional)
  const laminated = Math.round(truePercentage);
  const nonLaminated = Math.round(falsePercentage);

  return { nonLaminated, laminated };
};

export const getUniqItems = (list1, list2) => {
  let uniqueResultOne = list1.filter(
    obj => !list2.some(obj2 => obj.name === obj2.name),
  );

  // Get Same items
  let sameResult = list1.filter(obj =>
    list2.some(obj2 => obj.name === obj2.name),
  );

  //Find values that are in list2 but not in list1
  let uniqueResultTwo = list2.filter(
    obj => !list1.some(obj2 => obj.name === obj2.name),
  );

  //Combine the two arrays of unique entries
  return sameResult.concat(uniqueResultOne).concat(uniqueResultTwo);
  // return uniqueResultOne.concat(uniqueResultTwo).concat(sameResult);
};

// export const getMatchedItemsById = (list1, list2) => {
//   // Get Same items
//   let sameResult = list2.filter(obj =>
//     list1.some(obj1 => obj?._id === obj1?.data?._id),
//   );
//   return sameResult;
// };

// export const removeDuplicates = (arr, prop) => {
//   if (arr || prop) return;
//   const seen = new Set();
//   return arr?.filter(obj => {
//     if (seen.has(obj[prop])) {
//       return false; // Duplicate found, exclude from the result
//     }
//     seen.add(obj[prop]);
//     return true;
//   });
// };

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export const handleWhatsAppShare = (data, isBagDetail) => {
  if (!data) return;

  let text;
  // const imageUrl = encodeURIComponent(data?.img);

  // ${data?.img}\n\n---------------------------------\n
  if (isBagDetail)
    text = `${data?.productTitle}\n${data?.productType}\n${data?.productDescription}\n---------------------------------\n${data?.productDetails}\n\n${data?.oldStereo}`;
  else
    text = `${data?.productTitle}\n${data?.productType}\n${data?.productDescription}\n\n${data?.oldStereo}`;

  // if (isBagDetail)
  //   mobileText = `${data?.img}${data?.productTitle}${data?.productDescription}${data?.productDetails}`;
  // else
  //   mobileText = `${data?.img}${data?.productTitle}${data?.productDescription}`;

  const encodedMessage = encodeURIComponent(text);
  const productDetail = data?.productDetails?.split('\n');
  const updatedProductDetailsObj = {};

  // Extract Product Details:
  if (productDetail?.length > 0) {
    productDetail?.forEach((line, index) => {
      if (index === 0 && line?.includes('Bags')) {
        updatedProductDetailsObj['Bags'] = line;
      } else {
        if (['D - CUT', 'D - CUT WITH UF'].includes(data?.productType)) {
          updatedProductDetailsObj['Handle Color'] = null;
        }
        const [key, value] = line?.split(':');
        updatedProductDetailsObj[key.trim()] = value ? value.trim() : '';
      }
    });
  }

  const jsonObject = {
    ...updatedProductDetailsObj,
    ETD: null,
    img: data?.img,
    oldStereo: data?.oldStereo ? data?.oldStereo : '',
    productTitle: data?.productTitle,
    productType: data?.productType,
    productDescription: data?.productDescription,
  };

  // Converting the object to JSON format
  const jsonFormattedText = JSON.stringify(jsonObject);
  const base_url = 'http://cloud-dev.bagsguru.in?';
  const encodedDetails = encodeURIComponent(jsonFormattedText);

  // const whatsappMessage = `${encodedMessage}%0A%0A${imageUrl}`;

  // For WhatsApp Web (URL will be opened in a new tab)
  const whatsappWebLink = `https://web.whatsapp.com/send?text=${encodedMessage}`;

  // For WhatsApp app (mobile devices)
  // Old Flow :(direct open whatsapp in mobile view)
  // const whatsappAppLink = `whatsapp://send?text=${encodedMessage}`;

  // New Flow :(first of open bags-guru app then after open whatsapp in mobile view)
  const whatsappAppLink = base_url + 'details=' + encodedDetails;

  // Check if the user is on a mobile device
  if (isMobileDevice()) {
    // Redirect to WhatsApp app
    window.location.href = whatsappAppLink;
  } else {
    // Open WhatsApp Web link in a new tab
    window.open(whatsappWebLink, '_blank');
  }
};

export const customSortFunction = event => {
  const { data, field, order } = event;

  if (!data || !Array.isArray(data) || !field) {
    return data;
  }

  const updatedData = [...data];

  // Sort the data array based on the specified field and order
  updatedData.sort((a, b) => {
    const first_date = parseDate(a[field]);
    const second_date = parseDate(b[field]);

    // Check if either date is invalid
    if (!first_date || !second_date) {
      return 0; // Return 0 to maintain the current order if date values are invalid
    }

    // Compare the date values based on the sort order
    if (order === 1) {
      return first_date - second_date; // Ascending order
    } else {
      return second_date - first_date; // Descending order
    }
  });

  return updatedData;
};

const parseDate = dateString => {
  if (dateString) {
    const parts = dateString.split('-');
    if (parts?.length === 3) {
      const [day, month, year] = parts.map(part => parseInt(part, 10));
      return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
    }
  }
};

export const removeSpaceBetweenWords = str => {
  if (!str) return;
  return str?.replace(/ /g, '')?.toLowerCase(); // all space will remove
};

const getValueInInchOfRW = (bagType, h, g, w) => {
  if (bagType === 'd-cut') return (h + 2.5) * 2;
  else if (bagType === 'u-cut') return 0; // not given formula;
  else if (bagType === 'boxbag') return (h + 1.2) * 2 + g;
  else if (bagType === 'loophandlebagwithuf') return (h + 1.2) * 2 + g;
  else if (bagType === 'sidefold') return (w + g + 1) * 2;
  else if (bagType === 'd-cutwithuf') return (h + 2.5) * 2 + g;
  else if (bagType === 'loophandle') return (h + 1.2) * 2;
  else if (bagType === 'zipperbag') return h + 5;
  else if (bagType === 'cooler') return (h + 1.2) * 2 + g + 1.5;
  else return 0;
};

const getValueInMMOfRW = (bagType, h, g, w) => {
  if (bagType === 'd-cut') return (h + 65) * 2;
  else if (bagType === 'u-cut') return 0; // not given formula;
  else if (bagType === 'boxbag') return (h + 30) * 2 + g;
  else if (bagType === 'loophandlebagwithuf') return (h + 30) * 2 + g;
  else if (bagType === 'sidefold') return (w + g + 25) * 2;
  else if (bagType === 'd-cutwithuf') return (h + 65) * 2 + g;
  else if (bagType === 'loophandle') return (h + 30) * 2;
  else if (bagType === 'zipperbag') return h + 125;
  else if (bagType === 'cooler') return (h + 30) * 2 + g + 40;
};

const getValueInInchOfRL = (bagType, h, g, w) => {
  if (bagType === 'd-cut') return w;
  else if (bagType === 'u-cut') return 0; // not given formula;
  else if (bagType === 'boxbag' || bagType === 'cooler') return w + g + 0.6;
  else if (bagType === 'loophandlebagwithuf') return w;
  else if (bagType === 'sidefold') return h;
  else if (bagType === 'd-cutwithuf') return w;
  else if (bagType === 'loophandle') return w;
  else if (bagType === 'zipperbag') return w;
  else return 0;
};

const getValueInMMOfRL = (bagType, h, g, w) => {
  if (bagType === 'd-cut') return w;
  else if (bagType === 'u-cut') return 0; // not given formula;
  else if (bagType === 'boxbag' || bagType === 'cooler') return w + g + 15;
  else if (bagType === 'loophandlebagwithuf') return w;
  else if (bagType === 'sidefold') return h;
  else if (bagType === 'd-cutwithuf') return w;
  else if (bagType === 'loophandle') return w;
  else if (bagType === 'zipperbag') return w;
};

// Bag Formulas for calculated dimensions
export const getSelectedBagTypesRollWidth = (bagType, unit, h, g, w) => {
  if (!bagType || !unit) return 0;
  let rw;
  if (unit === 'inch')
    rw = getValueInInchOfRW(bagType, Number(h), Number(g), Number(w));
  else if (unit === 'mm')
    rw = getValueInMMOfRW(bagType, Number(h), Number(g), Number(w));
  if (rw) return rw?.toFixed(2);
  else return 0;
};

export const getSelectedBagTypesRepeatLength = (bagType, unit, h, g, w) => {
  if (!bagType || !unit) return 0;
  let rw;
  if (unit === 'inch')
    rw = getValueInInchOfRL(bagType, Number(h), Number(g), Number(w));
  else if (unit === 'mm')
    rw = getValueInMMOfRL(bagType, Number(h), Number(g), Number(w));
  if (rw) return rw?.toFixed(2);
  else return 0;
};

export const getBagWeightInGrams = (unit, rw, rl, gsm, hw) => {
  if (!unit) return '0';

  if (unit === 'inch')
    return (Number(rw) * Number(rl) * Number(gsm)) / 1550 + Number(hw);
  else return (Number(rw) * Number(rl) * Number(gsm)) / 1000000 + Number(hw);
};

export const getExtensionFromName = name => {
  const nameLength = name?.split('.');
  return nameLength?.[nameLength?.length - 1]?.toLowerCase();
};

export const thousandSeparator = number => {
  if (!number) {
    return 0;
  }
  const options = {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };
  const separatedNumber = number?.toLocaleString('en-IN', options);
  return separatedNumber;
};

export const roundValueThousandSeparator = (number, decimal = '') => {
  if (!number) {
    return 0;
  }
  const roundedNumber = Math.round(number);
  const options = {
    style: 'decimal',
    minimumFractionDigits: decimal ? 2 : 0,
    maximumFractionDigits: 2,
  };
  const separatedNumber = roundedNumber?.toLocaleString('en-IN', options);
  return separatedNumber;
};

export const checkModulePermission = (
  permissionList,
  mainItem,
  subItem,
  access,
) => {
  const checkModulePermission = permissionList
    .map(item => {
      return (
        item.name === mainItem &&
        item.sub_module.some(per => {
          return per.name === subItem && per.permission[access];
        })
      );
    })
    .find(item => item);

  return checkModulePermission;
};

export const convertIntoNumber = value => {
  return parseFloat(Number(value).toFixed(2));
};

export const removeSpecialCharacter = value => {
  const stringWithoutSpecialChars = value?.replace(/[^a-zA-Z0-9]/g, ' ');
  return stringWithoutSpecialChars;
};

export const generateUniqueId = () => {
  const timestamp = new Date().getTime().toString(16);
  const randomPart = Math.random().toString(16).substr(2, 12);
  return timestamp + randomPart;
};

export const getObjectWithMaxLength = array => {
  return array?.reduce((max, obj) => {
    const objKeys = Object.keys(obj);
    const maxKeys = Object.keys(max);

    if (objKeys.length > maxKeys.length) {
      return obj;
    } else {
      return max;
    }
  }, array[0]);
};

export const areObjectsEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

export const infinityOrNanToZero = value => {
  if (value === Infinity || value === -Infinity || isNaN(value)) {
    return 0;
  } else {
    return parseFloat(Number(value)?.toFixed(2));
  }
};

export function areArraysOfObjectsEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((obj1, index) => {
    const obj2 = arr2[index];
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  });
}
export function isPositive(val) {
  if (typeof val === 'number') return val > 0;
  else if (typeof val === 'string') return !val?.startsWith('-');
}
