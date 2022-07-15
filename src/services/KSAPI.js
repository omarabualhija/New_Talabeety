import KensoftApi from '@services/KensoftApi';
import {Constants} from '@app/common';

var ks = new KensoftApi({
  //url: Constants.URL,
  url: 'https://talabeety-ot5.conveyor.cloud/',
  testURL: 'https://talabeety.conveyor.cloud/',
});

export default ks;
