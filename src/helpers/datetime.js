import * as moment from 'moment-timezone';

const timezone = 'Asia/Bangkok';

const getCurrentTime = () => {
  return moment.tz(timezone).format();
}

export default {
  getCurrentTime
};