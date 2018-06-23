//index.js
//获取应用实例
var Bmob = require('../../dist/Bmob-1.6.0.min.js');
// var Bmob = require('../../dist/bmob.js');
var common = require('../../dist/common.js');

var app = getApp();
var that;
// var textList = [];
// var inputVal = [];
Page({

  data: {
    writeDiary: false,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 100,
    // inputVal =[],
    textList: [],
    amodifyDiarys: false
  },

  onReady: function(e) {
    const query = Bmob.Query("text");
    query.find().then(res => {
      console.log(res)
      this.setData({
        'textList': res
      })
      console.log('textList:', this.data.textList)
    });
  },

  onShareAppMessage: function() {
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function(res) {
        // 转发成功
        console.log('成功', res)

        wx.getShareInfo({
          shareTicket: res.shareTickets,
          success(res) {

            //内部调用云端代码
            var currentUser = Bmob.User.current();
            var data = {
              "objectId": currentUser.id,
              "encryptedData": res.encryptedData,
              "iv": res.iv
            };
            console.log(data);

            // console.log(data);
            Bmob.Cloud.run('getOpenGId', data).then(function(obj) {
              // var res = JSON.parse(obj)
              console.log(obj)
            }, function(err) {
              console.log(err)
            });

            data = {
              "objectId": currentUser.id,
              "encryptedData": "Q3h+kMwbKZ52BsxgNT4GS5LTYeLLGIXnA/BZrg/9iMJBD5Qv3Fs5H66xe9ml7iNIsOBEtaeUG0InAxbZOhn1qEeAJ2aC3wYpjARR4pCYA1v87+bj9khaUDY6pvaKX5/4TFHrofKAmA0gTT6bSaHyiw==",
              "iv": "YHoSkWomdfiyvAWHoYvKiQ=="
            };
            console.log(data);
            Bmob.Cloud.run('getOpenGId', data).then(function(obj) {
              // var res = JSON.parse(obj)
              console.log(obj)
            }, function(err) {
              console.log(err)
            });

          }
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  onLoad: function() {
    that = this;

    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })

    var k = 'http://bmob-cdn-12917.b0.upaiyun.com/2017/07/18/d99d3bb7400cb1ed808f34896bff6fcc.jpg';
    var newUrl = k.replace("http://bmob-cdn-12917.b0.upaiyun.com", "https://bmob-cdn-12917.bmobcloud.com")

    console.log(newUrl);
  },
  noneWindows: function() {
    that.setData({
      writeDiary: "",
      modifyDiarys: ""
    })
  },
  onShow: function() {

    // getList(this);
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
    console.log("onshow函数运行");
    const query = Bmob.Query("text");
    query.find().then(res => {
      console.log(res)
      this.setData({
        'textList': res
      })
      console.log('textList:', this.data.textList)
    });
  },
  pullUpLoad: function(e) {
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    this.onShow()
  },
  closeLayer: function() {
    that.setData({
      writeDiary: false
    })
  },
  toModifyDiary: function(event) {
    var nowTile = event.target.dataset.title;
    var nowContent = event.target.dataset.content;
    var nowId = event.target.dataset.id;
    that.setData({
      modifyDiarys: true,
      nowTitle: nowTile,
      nowContent: nowContent,
      nowId: nowId
    })
  },
  modifyDiary: function(e) {
    var t = this;
    modify(t, e)
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    getLike(this);
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    getLike(this);
  },
  inputTyping: function(e) {
    //搜索数据
    getLike(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
  },
  closeAddLayer: function() {
    that.setData({
      modifyDiarys: false
    })
  }

})

function getLike(t, k) {
  that = t;
  const query = Bmob.Query("text");
  // query.equalTo("content", "==", k);
  query.select("content");
  query.find().then(res => {
    console.log(res)
    var i;
    var test = [];
    for (i = 0; i < res.length; i++) {
      if (res[i].content.indexOf(k) >= 0) {
        console.log("成功");
        console.log(res[i]);
        // console.log(results[i]);
        test[test.length] = res[i]
        that.setData({
          textList: null,
          textList: test,
        })
      };
    }
  })
}