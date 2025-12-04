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