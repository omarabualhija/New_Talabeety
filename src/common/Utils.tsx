import moment from 'moment';
const Utils = {
  formatAMPM: (date: any) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  },
  getPercentage: (num1: number, num2: number) => {
    let decrease = num1 - num2;
    let percentage = ((decrease / num1) * 100).toFixed(0);
    return '-' + percentage + '%';
  },
  getDaysRemaining: (date: any) => {
    var eventdate = moment(date, '');
    var todaysdate = moment();
    return eventdate.diff(todaysdate, 'days');
  },
};
export default Utils;
