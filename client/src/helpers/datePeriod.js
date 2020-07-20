const getMonthAndYear = (year, month) => {
  const date = new Date(year, month); // 2009-11-10
  let monthName = date
    .toLocaleString("default", { month: "short" })
    .toLocaleUpperCase();

  return monthName.slice(0, monthName.length - 1) + "/" + year;
};

const getFullPeriod = () => {
  let d = new Date();

  let yearPast = d.getFullYear() - 1;
  let yearCurrent = d.getFullYear();
  let yearFuture = d.getFullYear() + 1;

  const arr = [];
  for (let i = 0; i < 3; i++) {
    for (let y = 1; y <= 12; y++) {
      let valor = y.toString().length === 1 ? "0" + y : y;

      if (i === 0) {
        arr.push({
          value: yearPast + "-" + valor,
          label: getMonthAndYear(yearPast, y - 1),
        });
      } else if (i === 1) {
        arr.push({
          value: yearCurrent + "-" + valor,
          label: getMonthAndYear(yearCurrent, y - 1),
        });
      } else {
        arr.push({
          value: yearFuture + "-" + valor,
          label: getMonthAndYear(yearFuture, y - 1),
        });
      }
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

export { getDefauldPeriod, getFullPeriod, dataformatpicker };
