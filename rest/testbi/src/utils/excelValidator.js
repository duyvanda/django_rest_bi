import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/**
 * Validate file Excel
 * Kiểm tra 3 cột: NGÀY THU HỒI, THÁNG THU HỒI, NĂM THU HỒI
 * Ghép 3 cột thành ngày hợp lệ
 * 
 * @param {Array} data - Dữ liệu từ Excel (array of objects)
 * @returns {Object} - Kết quả validation với hasError và errors
 */
export function validateExcelFile(data) {
  const errors = [];
  const validatedData = [];

  if (!data || data.length === 0) {
    return {
      hasError: true,
      errors: [{
        row: 0,
        column: 'File',
        reason: 'File Excel không có dữ liệu'
      }]
    };
  }

  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 vì: +1 cho index 0-based, +1 cho header row
    const rowErrors = [];

    const findColumnValue = (row, columnName) => {
      if (row[columnName] !== undefined) return row[columnName];
      
      const trimmedKey = Object.keys(row).find(key => key.trim() === columnName.trim());
      if (trimmedKey) return row[trimmedKey];
      
      const partialKey = Object.keys(row).find(key => key.includes(columnName) || columnName.includes(key.trim()));
      if (partialKey) return row[partialKey];
      
      return null;
    };

    const ngayThuHoi = findColumnValue(row, 'NGÀY THU HỒI');
    const thangThuHoi = findColumnValue(row, 'THÁNG THU HỒI');
    const namThuHoi = findColumnValue(row, 'NĂM THU HỒI');
    
    const maKH = findColumnValue(row, 'MÃ KH') || findColumnValue(row, 'Mã KH') || findColumnValue(row, 'MAKH') || null;

    const ngayHLTheoHD = findColumnValue(row, 'Ngày HL theo Hợp đồng');
    const ngayHetHLTheoHD = findColumnValue(row, 'Ngày hết HL theo Hợp đồng');

    const isNgayEmpty = ngayThuHoi === null || ngayThuHoi === undefined || ngayThuHoi === '';
    const isThangEmpty = thangThuHoi === null || thangThuHoi === undefined || thangThuHoi === '';
    const isNamEmpty = namThuHoi === null || namThuHoi === undefined || namThuHoi === '';

    if (isNgayEmpty && isThangEmpty && isNamEmpty) {
      const validatedRow = {
        ...row,
        'NgàyThuHoi': null,
        'NgàyThuHoi_Original_Day': null,
        'NgàyThuHoi_Original_Month': null,
        'NgàyThuHoi_Original_Year': null
      };
      validatedData.push(validatedRow);
      return;
    }

    const ngayHLResult = validateDateString(ngayHLTheoHD);
    if (!ngayHLTheoHD || ngayHLTheoHD === '' || ngayHLTheoHD === null || ngayHLTheoHD === undefined) {
      rowErrors.push({
        row: rowNumber,
        column: 'Ngày HL theo Hợp đồng',
        reason: 'Bắt buộc phải nhập (VD: 1/1/2025, 01/01/2025, 1-1-25)',
        maKH: maKH
      });
    } else if (!ngayHLResult.isValid) {
      rowErrors.push({
        row: rowNumber,
        column: 'Ngày HL theo Hợp đồng',
        reason: 'Không phải ngày hợp lệ (VD: 1/1/2025, 01/12/25, 31-12-2025)',
        maKH: maKH
      });
    }

    const ngayHetHLResult = validateDateString(ngayHetHLTheoHD);
    if (!ngayHetHLTheoHD || ngayHetHLTheoHD === '' || ngayHetHLTheoHD === null || ngayHetHLTheoHD === undefined) {
      rowErrors.push({
        row: rowNumber,
        column: 'Ngày hết HL theo Hợp đồng',
        reason: 'Bắt buộc phải nhập (VD: 31/12/2025, 31-12-25)',
        maKH: maKH
      });
    } else if (!ngayHetHLResult.isValid) {
      rowErrors.push({
        row: rowNumber,
        column: 'Ngày hết HL theo Hợp đồng',
        reason: 'Không phải ngày hợp lệ (VD: 1/9/2025, 31/12/25, 01-01-2026)',
        maKH: maKH
      });
    }

    if (ngayThuHoi === null || ngayThuHoi === undefined || ngayThuHoi === '') {
      rowErrors.push({
        row: rowNumber,
        column: 'NGÀY THU HỒI',
        reason: 'Giá trị rỗng hoặc không hợp lệ',
        maKH: maKH
      });
    } else if (!isValidNumber(ngayThuHoi)) {
      rowErrors.push({
        row: rowNumber,
        column: 'NGÀY THU HỒI',
        reason: 'Không phải số hợp lệ',
        maKH: maKH
      });
    } else {
      const day = parseInt(ngayThuHoi);
      if (day < 1 || day > 31) {
        rowErrors.push({
          row: rowNumber,
          column: 'NGÀY THU HỒI',
          reason: 'Ngày phải từ 1-31',
          maKH: maKH
        });
      }
    }

    if (thangThuHoi === null || thangThuHoi === undefined || thangThuHoi === '') {
      rowErrors.push({
        row: rowNumber,
        column: 'THÁNG THU HỒI',
        reason: 'Giá trị rỗng hoặc không hợp lệ',
        maKH: maKH
      });
    } else if (!isValidNumber(thangThuHoi)) {
      rowErrors.push({
        row: rowNumber,
        column: 'THÁNG THU HỒI',
        reason: 'Không phải số hợp lệ',
        maKH: maKH
      });
    } else {
      const month = parseInt(thangThuHoi);
      if (month < 1 || month > 12) {
        rowErrors.push({
          row: rowNumber,
          column: 'THÁNG THU HỒI',
          reason: 'Tháng phải từ 1-12',
          maKH: maKH
        });
      }
    }

    if (namThuHoi === null || namThuHoi === undefined || namThuHoi === '') {
      rowErrors.push({
        row: rowNumber,
        column: 'NĂM THU HỒI',
        reason: 'Giá trị rỗng hoặc không hợp lệ',
        maKH: maKH
      });
    } else if (!isValidNumber(namThuHoi)) {
      rowErrors.push({
        row: rowNumber,
        column: 'NĂM THU HỒI',
        reason: 'Không phải số hợp lệ',
        maKH: maKH
      });
    } else {
      const year = parseInt(namThuHoi);
      if (year < 1900 || year > 2100) {
        rowErrors.push({
          row: rowNumber,
          column: 'NĂM THU HỒI',
          reason: 'Năm phải từ 1900-2100',
          maKH: maKH
        });
      }
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    } else {
      const day = parseInt(ngayThuHoi);
      const month = parseInt(thangThuHoi);
      const year = parseInt(namThuHoi);

      const dateString = `${day}/${month}/${year}`;
      const isValid = isValidDate(year, month, day);

      if (!isValid) {
        errors.push({
          row: rowNumber,
          column: 'NGÀY/THÁNG/NĂM THU HỒI',
          reason: `Ngày ${dateString} không hợp lệ (ví dụ: tháng 2 không có 30 ngày)`,
          maKH: maKH
        });
      } else {
        const ngayThuHoiFormatted = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
        
        const validatedRow = {
          ...row,
          'NgàyThuHoi': ngayThuHoiFormatted,
          'NgàyThuHoi_Original_Day': day,
          'NgàyThuHoi_Original_Month': month,
          'NgàyThuHoi_Original_Year': year,
          'NgàyHLTheoHD': ngayHLResult.formatted || null,
          'NgàyHetHLTheoHD': ngayHetHLResult.formatted || null
        };

        validatedData.push(validatedRow);
      }
    }
  });

  return {
    hasError: errors.length > 0,
    errors: errors,
    validatedData: validatedData
  };
}

/**
 * Kiểm tra ngày hợp lệ bằng dayjs
 * @param {number} year
 * @param {number} month (1-12)
 * @param {number} day
 * @returns {boolean}
 */
function isValidDate(year, month, day) {
  const dateString = `${day}/${month}/${year}`;
  const date = dayjs(dateString, 'D/M/YYYY', true);
  return date.isValid();
}

/**
 * Validate date string - Chấp nhận nhiều format (1/1/25, 01/01/2025, 1/12/2025, etc.)
 * @param {*} value - Giá trị ngày cần kiểm tra
 * @returns {Object} - { isValid: boolean, formatted: string|null, parsed: object|null }
 */
function validateDateString(value) {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, formatted: null, parsed: null };
  }

  let dateStr = String(value).trim();
  
  if (typeof value === 'number') {
    const excelDate = dayjs('1899-12-30').add(value, 'days');
    if (excelDate.isValid()) {
      return {
        isValid: true,
        formatted: excelDate.format('DD/MM/YYYY'),
        parsed: { day: excelDate.date(), month: excelDate.month() + 1, year: excelDate.year() }
      };
    }
  }

  const formats = [
    'DD/MM/YYYY',
    'DD-MM-YYYY',
    'D/M/YYYY',
    'D-M-YYYY',
    'DD/MM/YY',
    'DD-MM-YY',
    'D/M/YY',
    'D-M-YY'
  ];

  for (const format of formats) {
    const parsed = dayjs(dateStr, format, true);
    if (parsed.isValid()) {
      return {
        isValid: true,
        formatted: parsed.format('DD/MM/YYYY'),
        parsed: { day: parsed.date(), month: parsed.month() + 1, year: parsed.year() }
      };
    }
  }

  return { isValid: false, formatted: null, parsed: null };
}

/**
 * Kiểm tra xem giá trị có phải là số hợp lệ không
 * @param {*} value - Giá trị cần kiểm tra
 * @returns {boolean}
 */
function isValidNumber(value) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

/**
 * Format ngày từ day/month/year thành dd/mm/yyyy
 * @param {number} day 
 * @param {number} month 
 * @param {number} year 
 * @returns {string} - Ngày định dạng dd/mm/yyyy
 */
export function formatDate(day, month, year) {
  const dateString = `${day}/${month}/${year}`;
  const date = dayjs(dateString, 'D/M/YYYY', true);
  
  if (!date.isValid()) {
    return null;
  }
  
  return date.format('DD/MM/YYYY');
}

/**
 * Xuất file Excel đã validate (để test)
 * @param {Array} validatedData 
 * @returns {Blob}
 */
export function exportValidatedData(validatedData) {
  return validatedData;
}

export  function removeAccents(str) {
    const AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"
    ];
    for (let i = 0; i < AccentsMap.length; i++) {
      let re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      let char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }
