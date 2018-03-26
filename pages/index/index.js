const app = getApp()

Page({
  data: {
    appId: 'wx2ad14ddf0b77b56c',
    secret: '83d8311fb4beddcc5cd80c1c5d0e7207',
    decoding_api: 'https://yuam.xyz/PHP/demo.php',
    session_keyApi: 'https://yuam.xyz/PHP/request.php',
    user_session_key:'',
    user_openid: '',
    img: '',
    name: ''
  },
  onLoad: function () {
    new Promise((resolve, reject) => {
      //获取用户 code
      wx.login({
        success: (res) => {
          resolve(res);
        }
      })
    }).then((res) => {
      return new Promise((resolve, reject) => {
        //获取用户openId 与  session_key
        wx.request({
          url: this.data.session_keyApi,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: res.code
          },
          success: (res) => {
            this.setData({
              user_session_key: res.data.session_key
            })
            let data = {
              user_session_key: res.data.session_key
            }
            //因为resolve 只能接收一个参数所以将该数据以对象的方式传递方便下一步
            resolve(data);
          }
        })
      })
    }).then((data) => {
      return new Promise((resolve, reject) => {
        //获取用户公开信息与敏感信息
        //如果只要用户的openId上一步就已经获取到了
        //此步是为了获取用户公开信息如：头像、昵称、所在城市等·····
        wx.getUserInfo({
          success: (res) => {
            let da = {
              encryptedData: res.encryptedData,
              iv: res.iv
            };
            Object.assign(da, data);
            resolve(da);
          },
          fail: () => {
            reject();
          }
        })
      })
    }).then((data) => {
      //将获取到的session_key encryptedData iv 等传到服务器进行解密
      wx.request({
        url: this.data.decoding_api,
        method: 'GET',
        dataType: 'json',
        data: {
          appid: this.data.appId,
          session_key: data.user_session_key,
          encryptedData: data.encryptedData,
          iv: data.iv
        },
        success: (res) => {
          this.setData({
            img: res.data.avatarUrl,
            name: res.data.nickName,
            user_openid: res.data.openId
          });
        }
      })
    }).catch(() => {
      //接收用户拒绝授权抛出的错误
      //弹出提示框提示用户
      wx.showModal({
        title: '登录失败',
        content: '您需要授权才能使用',
        confirmText: '去授权',
        cancelText: '拒绝授权',
        success: (res) => {
          if (res.confirm == true) {
            //跳转到设置页面重新打开权限
            wx.openSetting({
              success: (res) => {
                if (res.authSetting['scope.userInfo'] == true) {
                  //重新获取用户公开信息
                  wx.getUserInfo({
                    success: (res) => {
                      //进行解密
                      wx.request({
                        url: this.data.decoding_api,
                        method: 'GET',
                        dataType: 'json',
                        data: {
                          appid: this.data.appId,
                          session_key: this.data.user_session_key,
                          encryptedData: res.encryptedData,
                          iv: res.iv
                        },
                        success: (res) => {
                          this.setData({
                            img: res.data.avatarUrl,
                            name: res.data.nickName,
                            user_openid: res.data.openId
                          });
                        }
                      })
                    }
                  })
                } else if (res.authSetting['scope.userInfo'] == false) {
                  //用户拒绝重新开启权限跳转到提示页
                  wx.redirectTo({
                    url: '/pages/caveat/caveat'
                  })
                }
              }
            })
          } else if (res.confirm == false) {
            //用户拒绝重新开启权限跳转到提示页
            wx.redirectTo({
              url: '/pages/caveat/caveat'
            })
          }
        }
      })
    })
  }
})
