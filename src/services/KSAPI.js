import KensoftApi from '@services/KensoftApi';
import { Constants } from '@app/common';

var ks = new KensoftApi({
  url: Constants.URL,
  testURL: "https://talabeety.conveyor.cloud/"
});

export default ks;
