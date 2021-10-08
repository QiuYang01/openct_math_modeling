exports.install = function(Vue, options) {

        // 判断是否为空（无提示）
        Vue.prototype.notEmptyN = function(value) {
            if (typeof value == "undefined" || value == null || String(value) == "") {
                return false;
            } else {
                return true;
            }
        }
    
    
        // 判断是否为空
        Vue.prototype.notEmpty = function(value, name) {
            if (typeof value == "undefined" || value == null || String(value) == "") {
                this.warnMsg(name + '不能为空！');
                return false;
            } else {
                return true;
            }
        }
    
        // 判断是否为空
        Vue.prototype.notEmptyFull = function(value, name) {
            if (typeof value == "undefined" || value == null || String(value) == "") {
                this.warnMsg(name);
                return false;
            } else {
                return true;
            }
        }

    /*------------      消息提示     ------------*/
    // 成功消息提示
    Vue.prototype.succMsg = function(str) {
        this.$message({
            message: str,
            type: 'success'
        });
    }

    // 警告消息提示
    Vue.prototype.warnMsg = function(str) {
        this.$message({
            message: str,
            type: 'warning'
        });
    }

    // 错误消息提示
    Vue.prototype.errMsg = function(str) {
        this.$message.error(str);
    }

    // 普通消息提示
    Vue.prototype.Msg = function(str) {
        this.$message(str);
    }

     /*------------      时间、日期格式化     ------------*/
    // 日期格式化
    Vue.prototype.dateFormate = function(dateStr) {
        if (!this.notEmptyN(dateStr) || isNaN(Date.parse(dateStr))) return "";
        var dt = new Date(dateStr);
        return dt.getFullYear() + '-' + (dt.getMonth() + 1).toString().padStart(2, '0') + '-' + dt.getDate().toString().padStart(2, '0');
    }

    // 日期时间格式化
    Vue.prototype.dateTimeFormate = function(dateStr) {
        if (!this.notEmptyN(dateStr) || isNaN(Date.parse(dateStr))) return "";
        var dt = new Date(dateStr);
        return dt.getFullYear() + '-' + (dt.getMonth() + 1).toString().padStart(2, '0') + '-' + dt.getDate().toString().padStart(2, '0') +
            ' ' + dt.getHours().toString().padStart(2, '0') + ':' + dt.getMinutes().toString().padStart(2, '0') + ':' + dt.getSeconds().toString().padStart(2, '0');
    }

    // 时间格式化
    Vue.prototype.timeFormate = function(dateStr) {
        if (!this.notEmptyN(dateStr) || isNaN(Date.parse(dateStr))) return "";
        var dt = new Date(dateStr);
        return dt.getHours().toString().padStart(2, '0') + ':' + dt.getMinutes().toString().padStart(2, '0');
    }


    // 时间格式化
    Vue.prototype.timeSecondsFormate = function(dateStr) {
        if (!this.notEmptyN(dateStr) || isNaN(Date.parse(dateStr))) return "";
        var dt = new Date(dateStr);
        return dt.getHours().toString().padStart(2, '0') + ':' + dt.getMinutes().toString().padStart(2, '0') +
            ' ' + dt.getSeconds().toString().padStart(2, '0');
    }

    // 时间格式化
    Vue.prototype.MinutesFormate = function(dateStr) {
        if (!this.notEmptyN(dateStr) || isNaN(Date.parse(dateStr))) return "";
        var dt = new Date(dateStr);
        return dt.getMinutes().toString().padStart(2, '0') + ':' + dt.getSeconds().toString().padStart(2, '0');
    }
    Vue.prototype.randomsort = function(a, b) {
        return Math.random()>.5 ? -1 : 1;
        //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
    }
    //左右两栏可拖动 contentId为父div
Vue.prototype.dragTwoColDiv=(contentId,leftBoxId,resizeId,rightBoxId)=>{
    let resize = document.getElementById(resizeId);
    let leftBox = document.getElementById(leftBoxId);
    let rightBox = document.getElementById(rightBoxId);
    let box = document.getElementById(contentId);
    resize.onmousedown = function (e) {
      let startX = e.clientX;
      resize.left = resize.offsetLeft;
      document.onmousemove = function (e) {
        let endX = e.clientX;
        let moveLen = resize.left + (endX - startX);
        let maxT = box.clientWidth - resize.offsetWidth;
        if (moveLen < 150) moveLen = 150;
        if (moveLen > maxT - 150) moveLen = maxT - 150;
        resize.style.left = moveLen;
        leftBox.style.width = moveLen + 'px';
        rightBox.style.width = (box.clientWidth - moveLen - 5) + 'px';
      }
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
        resize.releaseCapture && resize.releaseCapture();
      }
      resize.setCapture && resize.setCapture();
      return false;
    }
  }



}