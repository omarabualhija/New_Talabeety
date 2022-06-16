import {Platform} from 'react-native';

/**
 * init class API
 * @param opt
 * @returns {KensoftApi}
 * @constructor
 */
function KensoftApi(opt) {
  if (!(this instanceof KensoftApi)) {
    return new KensoftApi(opt);
  }
  opt = opt || {};
  this.classVersion = '1.0.0';
  this._setDefaultsOptions(opt);
}

KensoftApi.prototype._request = function (url, callback) {
  return fetch(url)
    .then(response => response.text()) // Convert to text instead of res.json()
    .then(text => {
      if (Platform.OS === 'android') {
        text = text.replace(/\r?\n/g, ''); //.replace(/[\u0080-\uFFFF]/g, ''); // If android , I've removed unwanted chars.
      }
      return text;
    })
    .then(response => JSON.parse(response))
    .catch((error, data) => {})
    .then(responseData => {
      if (typeof callback == 'function') {
        callback(responseData);
      }
      return responseData;
    })
    .catch(error => {});
};

KensoftApi.prototype._requestPost = function (url, data, callback) {
  //var self = this;
  var params = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(data),
  };

  return fetch(url, params)
    .then(response => response.json())
    .catch((error, data) => {})
    .then(responseData => {
      if (typeof callback == 'function') {
        callback(responseData);
      }

      return responseData;
    })
    .catch(error => {});
};

KensoftApi.prototype.join = function (obj, separator, ignoreCur = false) {
  var arr = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      arr.push(key + '=' + obj[key]);
    }
  }
  if (global.ViewingCurrency && global.ViewingCurrency.ID && !ignoreCur) {
    arr.push('cur=' + global.ViewingCurrency.ID);
  }

  return arr.join(separator);
};

/**
 * Default option
 * @param opt
 * @private
 */
KensoftApi.prototype._setDefaultsOptions = async function (opt) {
  this.url = opt.url;
  this.testURL = opt.testURL;
  this.logo = opt.logo;
};

KensoftApi.prototype.Login = function (data, callback) {
  var requestUrl = this.url + 'services/Login?';

  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.Register = function (data, callback) {
  var requestUrl = this.url + 'services/Register?';

  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};
KensoftApi.prototype.SaveCart = function (data, callback) {
  var requestUrl = this.url + 'services/SaveCart?';

  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};
KensoftApi.prototype.CartCheckout = function (data, callback) {
  var requestUrl = this.url + 'services/CartCheckout?';

  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.DrugStoreGet = function (data, callback) {
  var requestUrl = this.url + `services/DrugStoreGet?`;
  requestUrl += this.join(data, '&');
  return this._request(requestUrl);
};
KensoftApi.prototype.UserVerifyOTP = function (data, callback) {
  var requestUrl = this.url + `services/UserVerifyOTP?`;
  requestUrl += this.join(data, '&');

  return this._request(requestUrl);
};
KensoftApi.prototype.OtpsendSMS = function (data, callback) {
  var requestUrl = this.url + `services/OtpsendSMS?`;
  requestUrl += this.join(data, '&');

  return this._request(requestUrl);
};
KensoftApi.prototype.CategoriesGet = function (data, callback) {
  var requestUrl = this.url + `services/DrugStoreCategoriesGet?`;
  requestUrl += this.join(data, '&');
  return this._request(requestUrl).then(function (data) {
    return data;
  });
};

KensoftApi.prototype.CitiesGet = function (data, callback) {
  var requestUrl = this.url + `services/CitiesGet?`;
  requestUrl += this.join(data, '&');
  return this._request(requestUrl).then(function (data) {
    return data;
  });
};
KensoftApi.prototype.CheckCartProduct = function (data, callback) {
  var requestUrl = this.url + `services/CheckCartProduct?`;
  requestUrl += this.join(data, '&');
  return this._request(requestUrl).then(function (data) {
    return data;
  });
};
KensoftApi.prototype.DrugStoreProductsFilter = function (data, callback) {
  var requestUrl = this.url + `services/DrugStoreProductGet?`;
  requestUrl += this.join(data, '&');
  return this._request(requestUrl).then(function (data) {
    return data;
  });
};

KensoftApi.prototype.AdsGet = function (data, callback) {
  var requestUrl = this.url + `services/AdsGet?`;
  requestUrl += this.join(data, '&');
  return this._request(requestUrl).then(function (data) {
    return data;
  });
};

KensoftApi.prototype.SetUserToken = function (data, callback) {
  var requestUrl = this.url + `services/SetUserToken?`;
  requestUrl += this.join(data, '&');
  return this._request(requestUrl).then(function (data) {
    return data;
  });
};
KensoftApi.prototype.CheckUserName = function (data, callback) {
  var requestUrl = this.url + `services/CheckUserName?`;
  requestUrl += this.join(data, '&');
  return this._request(requestUrl).then(function (data) {
    return data;
  });
};
KensoftApi.prototype.CheckPhone = function (data, callback) {
  var requestUrl = this.url + `services/CheckPhone?`;
  requestUrl += this.join(data, '&');
  return this._request(requestUrl).then(function (data) {
    return data;
  });
};

KensoftApi.prototype.DrugStorePointGet = function (data, callback) {
  var requestUrl = this.url + `services/DrugStorePointGetList?`;
  requestUrl += this.join(data, '&');
  return this._request(requestUrl).then(function (data) {
    return data;
  });
};

KensoftApi.prototype.GetAllChats = function (data, callback) {
  var requestUrl = this.url + `services/ChatGet?`;
  requestUrl += this.join(data, '&');
  return this._request(requestUrl).then(function (data) {
    return data;
  });
};

KensoftApi.prototype.SendMessage = function (data, callback) {
  var requestUrl = this.url + 'services/MessagingSend?';
  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.GetMessages = function (data, callback) {
  var requestUrl = this.url + 'services/MessageGet?';

  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.NotificationRead = function (data, callback) {
  var requestUrl = this.url + 'services/NotificationRead?';
  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.NotificationsGet = function (data, callback) {
  var requestUrl = this.url + 'services/NotificationGEt?';
  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.DrugStoreAddFavorite = function (data, callback) {
  var requestUrl = this.url + 'services/DrugStoreAddFavorite?';
  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.DrugStoreAddAvailable = function (data, callback) {
  var requestUrl = this.url + 'services/DrugStoreAddAvailable?';
  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.PharmacyDoAdd = function (data, callback) {
  var requestUrl = this.url + 'services/PharmacyDoAdd?';
  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.UserPharmacyGet = function (data, callback) {
  var requestUrl = this.url + 'services/UserPharmacyGet?';
  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.UserPharmacyDelete = function (data, callback) {
  var requestUrl = this.url + 'services/UserPharmacyDelete?';
  requestUrl += this.join(data, '&');
  return this._request(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.MemberDelete = function (data, callback) {
  var requestUrl = this.url + 'services/UserPharmacyDelete?';
  requestUrl += this.join(data, '&');
  return this._request(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.UserShowPriceGet = function (data, callback) {
  var requestUrl = this.url + 'services/UserShowPriceGet?';
  requestUrl += this.join(data, '&');
  return this._request(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.BarQRCode = function (data, callback) {
  var requestUrl = this.url + 'services/QRBarCodeProductGet?';
  requestUrl += this.join(data, '&');
  return this._request(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.GetCategoryItems = function (data, callback) {
  var requestUrl = this.url + 'services/products?';
  requestUrl += this.join(data, '&');
  return this._request(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.MyOrders = function (data, callback) {
  var requestUrl = this.url + 'services/Orders?';
  requestUrl += this.join(data, '&');

  return this._request(requestUrl, data, response => {
    return response;
  });
};
KensoftApi.prototype.getCart = function (data, callback) {
  var requestUrl = this.url + 'services/getCart?';
  requestUrl += this.join(data, '&');

  return this._request(requestUrl, data, response => {
    return response;
  });
};
KensoftApi.prototype.DeleteCart = function (data, callback) {
  var requestUrl = this.url + 'services/DeleteCart?';
  requestUrl += this.join(data, '&');

  return this._request(requestUrl, data, response => {
    return response;
  });
};
KensoftApi.prototype.GetOrderDetails = function (data, callback) {
  var requestUrl = this.url + 'services/OrderDetails?';

  requestUrl += this.join(data, '&');
  return this._request(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.CancelOrder = function (data, callback) {
  var requestUrl = this.url + 'services/CancelOrder?';
  requestUrl += this.join(data, '&');
  return this._request(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.GetUserFavourites = function (data, callback) {
  var requestUrl = this.url + 'services/ProductUserFavoriteGet?';
  requestUrl += this.join(data, '&');

  return this._request(requestUrl, data, response => {
    return response;
  });
};

// KensoftApi.prototype.UserShowPriceInsert = function (data, callback) {
//   var requestUrl = this.url + 'services/UserShowPriceInsert?';
//   return this._requestPost(requestUrl, data, response => {
//     return response;
//   });
// };
KensoftApi.prototype.UserShowPriceInsert = function (data, callback) {
  var requestUrl = this.url + 'services/UserShowPriceInsert?';
  requestUrl += this.join(data, '&');
  return this._request(requestUrl, data, response => {
    return response;
  });
};
KensoftApi.prototype.AddItemFavourite = function (data, callback) {
  var requestUrl = this.url + 'services/ProductAddFavorite?';
  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.RemoveItemFavourite = function (data, callback) {
  var requestUrl = this.url + 'services/ProductRemoveFavorite?';
  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.ResetPassword = function (data, callback) {
  var requestUrl = this.url + 'services/ResetPassword?';
  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

KensoftApi.prototype.UpdateUser = function (data, callback) {
  var requestUrl = this.url + 'services/UpdateUser?';
  return this._requestPost(requestUrl, data, response => {
    return response;
  });
};

export default KensoftApi;
