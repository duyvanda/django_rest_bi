export function removeAccents(str) {
  str = str.toLowerCase();

  const AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "dđ",
    "eèẻẽéẹêềểễếệ",
    "iìỉĩíị",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "uùủũúụưừửữứự",
    "yỳỷỹýỵ",
  ];

  for (let map of AccentsMap) {
    const base = map[0];
    const accents = map.slice(1);
    const re = new RegExp("[" + accents + "]", "g");
    str = str.replace(re, base);
  }

  return str;
}

/**
 * Formats a date string to DD-MM-YYYY format.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
