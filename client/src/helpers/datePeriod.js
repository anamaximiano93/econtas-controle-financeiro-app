const getMonthAndYear = (year, month) => {
  const date = new Date(year, month); // 2009-11-10
  let monthName = date
    .toLocaleString("default", { month: "long" })
    .toLocaleUpperCase();

  return monthName + "/" + year;
};

const getFullPeriod = () => {
  let d = new Date();

  const yearInitial = 2019;
  //prettier-ignore
  const valueLength =( d.getFullYear() - yearInitial )+2;

  const arr = [];
  for (let i = 0; i < valueLength; i++) {
    for (let y = 1; y <= 12; y++) {
      let valor = y.toString().length === 1 ? "0" + y : y;

      arr.push({
        //prettier-ignore
        value: (yearInitial + i) + "-" + valor,
        //prettier-ignore
        label: getMonthAndYear((yearInitial + i), y - 1),
      });
    }
  }

  return arr;
};

const getDefauldPeriod = () => {
  const d = new Date();
  let obj = {};
  let month = d.getMonth() + 1;

  let value =
    d.getFullYear() +
    "-" +
    (month.toString().length <= 1 ? "0" + month : month);
  let label = d
    .toLocaleString("default", { month: "short" })
    .toLocaleUpperCase();
  label = label.slice(0, label.length - 1) + "/" + d.getFullYear();

  obj = {
    value,
    label,
  };

  return obj;
};
const getDefauldYear = () => {
  const d = new Date();
  let obj = {};
  let year = d.getFullYear();

  obj = {
    value: year,
    label: year.toString(),
  };

  return obj;
};

const dataformatpicker = () => {
  const date = new Date();
  const dateTimeFormat = new Intl.DateTimeFormat("pt-br", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
  ] = dateTimeFormat.formatToParts(date);
  return `${year}-${day}-${month}`;
};

const getPagination = (tam) => {
  const total_page = Math.round(tam / 10);
  const pagination = Math.round(tam / total_page);
  console.log(total_page, pagination);
  return { total_page, pagination };
};

const getFullYearPeriod = () => {
  const d = new Date();

  const yearInitial = 2019;
  //prettier=ignore
  const valueLength = d.getFullYear() - yearInitial + 2;

  const array = [];

  for (let i = 0; i < valueLength; i++) {
    array.push({
      value: yearInitial + i,
      label: (yearInitial + i).toString(),
    });
  }

  return array;
};

export {
  getDefauldPeriod,
  getFullPeriod,
  dataformatpicker,
  getPagination,
  getFullYearPeriod,
  getDefauldYear,
};
