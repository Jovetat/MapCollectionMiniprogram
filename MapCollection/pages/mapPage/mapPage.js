// pages/mapPage/mapPage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        maplongitde: 111.6616,
        maplatitude: 40.8544,
        markers: [
            {
                id: 0,
                latitude: 40.8544,
                longitude: 111.6616,
                iconPath: '/image/pos.png',
                alpha: 0.8,
                width: 35,
                height: 37,
                isform: true,
            }
        ],
        iconPicker: [
            {
                id: 0,
                name: '美食',
                src: '/image/food.png'
            },
            {
                id: 1,
                name: '学习',
                src: '/image/study.png'
            },
            {
                id: 2,
                name: '运动',
                src: '/image/sport.png'
            },
            {
                id: 3,
                name: '娱乐',
                src: '/image/entertain.png'
            },
            {
                id: 4,
                name: '经济',
                src: '/image/economy.png'
            },
            {
                id: 5,
                name: '家庭',
                src: '/image/home.png'
            },
        ],
        iconIndex: 0,
        formViewAni: undefined,
        heightMove: 0,
        formHeight: 192,
        inforHeight: 120,
        isform: true,
        colInfor: undefined,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.mapInit()
    },

    mapInit(){
        this.readLocarColData()
        this.positionInit()
        this.animationInit()
    },

    exhaleFormBindtap(e){
        const nowmar = this.data.markers.find(s => s.id == e.detail.markerId)
        const flag = nowmar.isform
        if(!flag){
            this.setData({
                colInfor: {
                    id: nowmar.id,
                    name: nowmar.callout.content,
                    remarks: nowmar.remarks
                }
            })
            const move = this.data.inforHeight
            this.setData({ heightMove: move})
        }
        else{
            const move = this.data.formHeight
            this.setData({ heightMove: move})
        }
        this.setData({ isform: flag })
        this.animation.height(this.data.heightMove).step()
        this.setData({ formViewAni: this.animation.export() })
    },

    putawayFormBindtap(){
        this.animation.height(-this.data.heightMove).step()
        this.setData({ formViewAni: this.animation.export() })
    },

    addColData(e){
        const name = e.detail.value.name
        const remarks = e.detail.value.remarks
        const icon = e.detail.value.icon
        const src = this.data.iconPicker.find(s => s.id == icon).src
        if(remarks && name && icon){
            const mar = this.data.markers[0]
            this.newMarkers(this.randomNum(),mar.latitude,mar.longitude,src,false,name,remarks)
            wx.showToast({
                title: '提交成功',
                icon: 'success'
            })
            this.putawayFormBindtap()
        }
        else{
            if(!icon){
                wx.showToast({
                    title: '请选择图标',
                    icon: 'none'
                })
            }
            else{
                wx.showToast({
                    title: '请将信息填写完整',
                    icon: 'none'
                })
            }            
        }
    },

    deleteColData(){
        const _this = this
        wx.showModal({
            title: '提示',
            content: '是否要删除该地址收藏',
            confirmColor: '#F05050',
            success: (res)=>{
                if(res.confirm){
                    let nowmar = this.data.markers
                    let index = nowmar.findIndex(s => s.id == _this.data.colInfor.id)
                    nowmar.splice(index,1)
                    this.setData({ markers: nowmar })
                    this.putawayFormBindtap()
                    this.updataLocalColData()
                }
                else if(res.cancel){
                    console.log('判断出错')
                }
            }
        })
    },

    readLocarColData(){
        try{
            const data = wx.getStorageSync('markers')
            const markers = JSON.parse(data)
            this.setData({ markers: markers })
            console.log('读取数据成功')
        }
        catch{
            wx.showToast({
                title: '本地数据读取失败',
                icon: 'none'
            })
        }    
    },

    updataLocalColData(){
        const data = JSON.stringify(this.data.markers)
        wx.setStorage({
            key: 'markers',
            data: data,
            success:()=>{
                console.log('已存储至本地')
            },
        })
    },

    animationInit(){
        this.animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease-out',
            delay: 0
        })
    },

    positionInit(){
        wx.getLocation({
            type: 'gcj02',
            altitude: true,
            isHighAccuracy: true,
            success:(res)=>{
                console.log(res)
                this.setData({
                    maplatitude: res.latitude,
                    maplongitde: res.longitude,
                })
            },
            fail:()=>{
                wx.showToast({
                    title: '获取当前位置失败',
                    icon: 'none'
                })
            }
        })        
    },

    bindPickerChange(e){
        this.setData({ iconIndex: e.detail.value })
    },

    bindcontroltap(e){
        this.creatSign(e.detail.latitude,e.detail.longitude)
    },

    creatSign(latitude,longitude){
        let data = this.data.markers
        data.splice(0,1)
        const mar = {
            id: 0,
            latitude: latitude,
            longitude: longitude,
            iconPath: '/image/pos.png',
            alpha: 0.8,
            width: 35,
            height: 37,
            isform: true,
            callout: {
                content: '添加收藏',
                color: '#ffffff',
                fontSize: 13,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: '#ffffff',
                bgColor: '#3D3D3D',
                padding: 5,
                display: 'ALWAYS',
                textAlign: 'center',
            }
        }
        data.unshift(mar)
        this.setData({ markers: data })
    },

    newMarkers(id,latitude,longitude,iconPath,isform,content,remarks){
        const mar = {
            id: id,
            latitude: latitude,
            longitude: longitude,
            iconPath: iconPath,
            alpha: 0.8,
            width: 35,
            height: 37,
            isform: isform,
            remarks: remarks,
            callout: {
                content: content,
                color: '#3D3D3D',
                fontSize: 13,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: '#ffffff',
                bgColor: '#ffffff',
                padding: 5,
                display: 'ALWAYS',
                textAlign: 'center',
            }
        }
        let data = this.data.markers
        data.push(mar)
        this.setData({ markers: data })
        this.updataLocalColData()
    },

    randomNum(){
        let date = Date.now()
        return date
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})