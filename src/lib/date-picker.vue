<template>
    <div class="vue-date-picker" @mouseover="startMouseOver" @mouseout="penalHidden">
        <!-- 输入框 -->
        <input type="text" @focus="penalDisplay" @blur="penalHidden" :value="value" autocomplete="off" :name='filed' :id="filed">
        <!-- 选择框 -->
        <div class="vue-date-picker-penals" v-show="datepenalShow || monthpenalShow">
            <!-- 日期选择 -->
            <div class="vue-date-picker-datepenal" v-show="datepenalShow">
                <div class="vue-date-picker-datepenal-header">
                    <a class="date-picker-header-prev" @click="prevMonth">&lt;</a>
                    <span class="date-picker-header-choose" @click="chooseMonth">{{year}}年{{month + 1}}月</span>
                    <a class="date-picker-header-next" @click="nextMonth">&gt;</a>
                </div>
                <table class="vue-date-picker-datepenal-table">
                    <thead>
                        <tr>
                            <th v-for="items in langConf.week" :key="items">{{items}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(mIndex, m) in monthDays" :key="m" track-by='$index'>
                            <td v-for="(dIndex, d) in mIndex" 
                                :key="d" 
                                track-by='$index' 
                                @click="chooseDay(d, $event)">
                                <span>{{ dIndex }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 月份选择 -->
            <div class="vue-date-picker-monthpenal" v-show="monthpenalShow">
                <div class="vue-date-picker-monthpenal-header">

                </div>
                <div class="vue-date-picker-monthpenal-table">

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // 日期格式化输出
	function dateFormat(y, m, d, fm) {
		if (!fm) {
			fm = 'yyyy-mm-dd';
		}
		m = ('0' + (parseInt(m) + 1)).slice(-2);
		d = ('0' + d).slice(-2);
		return fm.replace('yyyy', y)
				.replace('YYYY', y)
				.replace('mm', m)
				.replace('MM', m)
				.replace('DD', d)
				.replace('dd', d);
    }
    // 比较两个日期的大小，返回1，0，-1
    function dateCompare(date1, date2) {
        if(date1.year == date2.year){
            if(date1.day && date2.day) {
                if(date1.month == date2.month) {
                    date1.day > date2.day ? 1 : (date1.day == date2.day ? 0 : -1);
                } else {
                    return date1.month > date2.month ? 1 : -1;
                }
            } else {
                return date1.month > date2.month ? 1 : (date1.month == date2.month ? 0 : -1);
            }
        } else {
            return date1.year > date2.year ? 1 : -1;
        }
    }
export default {
    props: {
        filed: {
            type: String,
            default: ''
        },
        format: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: '',
            twoWay: true
        },
        // 向前看，只能选择今天及今天之后
        forword: {
            default: false
        },
        // 向后看，只能选择今天及今天之前
        backword: {
            default: false
        },
        // 不能选择今天
        noToday: {
            default: false
        },
        conf: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data () {
        let {value, conf} = this;
        let dateObj,year,month,day;
        let langConf = {
            week: ['日','一','二','三','四','五','六'],
            month: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
        }
        if(value) {
            dateObj = new Date(value);
        } else {
            dateObj = new Date();
        }
        // dateObj = new Date();
        if(conf) {
            langConf = Object.assign(langConf,conf);
        }
        year = dateObj.getFullYear();
        month = dateObj.getMonth();
        day = dateObj.getDate();
        return {
            isMouseOver: false,
            datepenalShow: false,
            monthpenalShow: false,
            langConf,
            year,
            month,
            day,
            myValue: this.value
        }
    },
    computed: {
        // 当前日期
        current() {
            let {value, noToday} = this;
            let dateObj;
            let year = '0000';
            let month = '00';
            let day = '00';
            if(value) {
                return new Date(value);
            } else if(!noToday) {
                return new Date();
            } else {
                return {year, month, day};
            }
            year = dateObj.getFullYear();
            month = dateObj.getMonth();
            day = dateObj.getDate();
            return {year, month, day};
        },
        // 返回当前月的天数数组
        monthDays() {
            let {year, month} = this;
            let dayNum = 0;
            month++;
            // 判断一个月有几天
            if(month == 2) {
                if(year % 4 == 0 && !(year % 100 == 0 && year % 400 != 0)){
                    dayNum = 28;
                } else {
                    dayNum = 29;
                }
            } else {
                if([1,3,5,7,8,10,12].includes(month)){
                    dayNum = 31;
                } else {
                    dayNum = 30;
                }
            }
            // console.log(dayNum);
            // 生成对应星期的日期数组
            let firstDay = new Date(year, month-1, 1).getDay();
            let dayArr = new Array(6).fill(0).map(function() {  // 日期数组初始化
                return new Array(7).fill('');
            });
            let row = 0;
            let col = firstDay;
            for(let d = 1; d <= dayNum; d++){
                dayArr[row][col] = d;
                if(col < 6) {
                    col++;
                } else {
                    col = 0;
                    row++;
                }
            }
            // console.log(dayArr);
            return dayArr;
        },
        today() {
            let dateObj = new Date();
            let year = dateObj.getFullYear();
            let month = dateObj.getMonth()+1;
            let day = dateObj.getDate();
            return {year, month, day}
        }
    },
    methods: {
        // 判断日期是否合法，dateObj = {year,month,day}
        dateIsValid: function(dateObj) {
            let {today, forword, backword, noToday} = this;
            if(forword && dateCompare(today, dateObj) > 0) {
                return false;
            }
            if(backword && dateCompare(today, dateObj) < 0) {
                return false;
            }
            if(noToday && dateObj.day && dateCompare(today, dateObj) == 0) {
                return false;
            }
            return true;
        },
        // 日期+月份的选择
        penalDisplay: function(e) {
            if(e && e.type == 'keypress') {
                e.returnValue = false;
            }
            if(!this.datepenalShow && !this.monthpenalShow) {
                this.datepenalShow = true;
            }
            this.$dispatch('datepickerStart', this.field);
        },
        chooseMonth: function() {
            this.datepenalShow = false;
            this.monthpenalShow = true;
        },
        prevMonth: function() {
            let {year, month} = this;
            if(this.dateIsValid({year, month: month-1})) {
                if(month > 1) {
                    this.month--;
                } else {
                    this.year--;
                    this.month = 11;
                }
            }
        },
        nextMonth: function() {
            let {year, month} = this;
            if(this.dateIsValid({year, month: month+1})) {
                if(month < 11) {
                    this.month++;
                } else {
                    this.year++;
                    this.month = 0;
                }
            }
        },
        // 鼠标离开日期选择器一段时间，关闭面板
        penalHidden: function(e) {
            // this.datepenalShow = false;
            // this.monthpenalShow = false;
        },
        // 选择日期
        chooseDay: function(d) {
            let {year, month, format} = this;
            if(d && this.dateIsValid({year, month, day:d})) {
                this.day = d;
                this.value = dateFormat(year, month, d, format);
                this.immPenalHidden();
            }
        },
        startMouseOver: function() {
            this.isMouseOver = true;
        },
        immPenalHidden: function() {
            this.isMouseOver = true;
            this.datepenalShow = false;
            this.monthpenalShow = false;
            this.$dispatch('datepickerEnd', this.field);
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '/src/assets/date-picker.css';
</style>
