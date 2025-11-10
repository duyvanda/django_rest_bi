import moment from 'moment';

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
      const isValidDate = moment(dateString, 'D/M/YYYY', true).isValid();

      if (!isValidDate) {
        errors.push({
          row: rowNumber,
          column: 'NGÀY/THÁNG/NĂM THU HỒI',
          reason: `Ngày ${dateString} không hợp lệ (ví dụ: tháng 2 không có 30 ngày)`,
          maKH: maKH
        });
      } else {
        const ngayThuHoiFormatted = moment(dateString, 'D/M/YYYY').format('DD/MM/YYYY');
        
        const validatedRow = {
          ...row,
          'NgàyThuHoi': ngayThuHoiFormatted,
          'NgàyThuHoi_Original_Day': day,
          'NgàyThuHoi_Original_Month': month,
          'NgàyThuHoi_Original_Year': year
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
 * Format ngày từ 3 cột riêng biệt
 * @param {number} day 
 * @param {number} month 
 * @param {number} year 
 * @returns {string} - Ngày định dạng dd/mm/yyyy
 */
export function formatDate(day, month, year) {
  const dateString = `${day}/${month}/${year}`;
  const isValid = moment(dateString, 'D/M/YYYY', true).isValid();
  
  if (!isValid) {
    return null;
  }
  
  return moment(dateString, 'D/M/YYYY').format('DD/MM/YYYY');
}

/**
 * Xuất file Excel đã validate (để test)
 * @param {Array} validatedData 
 * @returns {Blob}
 */
export function exportValidatedData(validatedData) {
  return validatedData;
}
