(function () {
    Array.prototype.remove = function (obj) {
        for (var i = 0; i < this.length; i++) {
            var temp = this[i];
            if (!isNaN(obj)) {
                temp = i;
            }
            if (temp == obj) {
                for (var j = i; j < this.length; j++) {
                    this[j] = this[j + 1];
                }
                this.length = this.length - 1;
            }
        }
    };
    Array.prototype.contains = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (obj == this[i]) {
                return true;
            }
        }
        return false;
    };
    Date.prototype.format = function (format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    };
    String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
        if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
            return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
        } else {
            return this.replace(reallyDo, replaceWith);
        }
    };

})(jQuery);
//路由
(function ($) {
    'use strict';

    var menuController = {
        changeFile: function () {
            $(".child_menu li a").on("click", function () {
                var dataName = $(this).attr("data-name");
                $(".right_col").load(dataName);
            });
        }
    }
})(jQuery);
var commonController = {
    controllerAs: 'familyController',
    defaultParam: {
        dicLibray:null
    },
    init: function () {
        commonController.loadDic();
    },
    loadDic:function () {
        $.ajax({
            url: baseUrl + "/dic/list/1" ,
            contentType: 'application/json;charset=utf-8',
            type: "GET",
            dataType: "json",
            success: function (result) {
                if (result.state == 1) {
                    commonController.defaultParam.dicLibray = result.data;
                } else {
                    console.log(result);
                }
            }
        });
    },
    getGroupCode:function(groupCode){
        var targetGroup = new Array();
        if(commonController.defaultParam.dicLibray){
            $.each(commonController.defaultParam.dicLibray,function () {
                var item = this;
                if(item){
                    if(groupCode==item.groupCode){
                        targetGroup.push(item);
                    }
                }
            })
        }
        return targetGroup;
    },
    initModalSelect:function(modalparam,targetModalId){
        var targetModal = $("#"+targetModalId);
        if(modalparam!=null){
            $.each(modalparam,function(i,value){
               var curSelect = targetModal.find("select[data-select="+value+"]");
               var str = '<option value="">请选择</option>';
               curSelect.html("");
                var dataGroupArr = commonController.getGroupCode(this);
                $.each(dataGroupArr,function(){
                    var pvDic = this;
                    str += "<option value='"+this.dicCode+"'>"+this.dicName+"</option>";
                });
                curSelect.html(str);
            });
        }
    },
    getPropetryNames:function (obj) {
        var props = [];
        do {
            props = props.concat(Object.getOwnPropertyNames(obj));
        } while (obj = Object.getPrototypeOf(obj));
        return props;
    },
    filterObjNullOrEmtpy:function(obj){
        var propsArr =  commonController.getPropetryNames(obj)
        $.each(propsArr,function () {
           var item = commonController.joinProp(this);
           if(obj[""+item]==null || obj[""+item]==""){
               delete obj[""+item];
           }
        });
        return obj;
    },
    joinProp:function(proItemArr){
        var str = ''
        for(var i = 0 ;i < proItemArr.length;i++){
            str+= proItemArr[i]
        }
        return str
    },
    repeatDom:function(id,data){
        var $repeatDom = $("."+id).eq(0);
        var $bindDomArr = $repeatDom.find("[data-bind-property]");
        var preAppendHtml = '';
        if(data!=null && data.length >=1){
            $.each(data,function(i,value){
                var itemData = value;
                $.each($bindDomArr,function(j,value){
                    var itemDom =$(value);
                    var key = itemDom.attr("data-bind-property");
                    if(itemDom.attr("data-bind-hidden")=='Y'){
                        itemDom.attr("data-"+key,itemData[key]);
                    }else{
                        if(itemDom.attr("data-bind-type")=="code"){
                            var dicArr = commonController.getGroupCode(key);
                            $.each(dicArr,function () {
                                var dic = this;
                                if(itemData[key]==dic.dicCode){
                                    itemDom.text(dic.dicName);
                                }
                            });
                        }else if(itemDom.attr("data-bind-type")=="date"){
                            itemDom.text(new Date(itemData[key]).format("yyyy-mm-dd"));
                        }else{
                            if(itemData[key]!=null && itemData!=''){
                                itemDom.text(itemData[key]);
                            }
                        }
                    }
                })
                var html = $repeatDom.prop("outerHTML");
                if(i<data.length-1){
                    preAppendHtml+=html;
                }
                $("#policyPersonTop").html("");
                $("#policyPersonTop").html(preAppendHtml);
            });
        }else{

        }

    },
    liveFilterGetKeyAndValue:function(ulId,name){
        return $("#"+ulId).find("[data-filter="+name+"]").attr("data-value");
    },
    initCompanyOption:function (selectId,mainCustId) {
        $('#'+selectId).selectpicker();

        $.ajax({
            url:baseUrl+"/policy/insCompany/"+mainCustId,
            type:'GET',
            contentType: 'application/json;charset=utf-8',
            dataType: "json",
            success:function(result){
                if (result.state == 1) {
                    var resultData = result.data;
                    var tempStr = "";
                    $.each(resultData,function(){
                        var itemCompany = this;
                        tempStr+="<option value=\""+itemCompany.insCompanyCode+"\">"+itemCompany.insCompanyName+"</option>";
                    });
                   $('#'+selectId).empty();
                   $('#'+selectId).append(tempStr);
                   $('#'+selectId).selectpicker('render');
                   $('#'+selectId).selectpicker('refresh');

                }
            }
        });
    },
    initAllCompanyOption:function(selectId,companyGroupCode){
        $('#'+selectId).selectpicker();
        var companyArr = commonController.getGroupCode(companyGroupCode);
        var tempStr = "";
        $.each(companyArr,function () {
            var itemCompany = this;
            tempStr+="<option value=\""+itemCompany.dicCode+"\">"+itemCompany.dicName+"</option>";
        });
        $('#'+selectId).empty();
        $('#'+selectId).append(tempStr);
        $('#'+selectId).selectpicker('render');
        $('#'+selectId).selectpicker('refresh');
    },
    initDateInput:function (dateIds) {
        $.each(dateIds,function () {
            var item = this;
            $("#"+item).datetimepicker({
                minView: "month",//设置只显示到月份
                format: "yyyy-mm-dd",//日期格式
                autoclose: true,//选中关闭
                todayBtn: true,
                language: 'zh-CN',
                initialDate: "2005-02-01"
            });
        })
    },
    initFamilySelOption:function(selectId){
        $.ajax({
            url:baseUrl+"/cust/"+custController.defaultParam.seeDetailRow.mainCustId+"/"+"list",
            type:'get',
            contentType: 'application/json;charset=utf-8',
            dataType: "json",
            success:function(result){
                if (result.state == 1) {
                    var tempStr = '<option value="">请选择</option>';
                    $.each(result.data,function () {
                        var itemCust = this;
                        tempStr+='<option value="'+itemCust.id+'">'+itemCust.name+'</option>'
                    });
                    if(selectId instanceof Array){
                        $.each(selectId,function(){
                            var itemId = this;
                            $("#"+itemId).append(tempStr);
                        })
                    }else{
                        $("#"+selectId).append(tempStr);
                    }

                }
            }
        });
    },
    key2Value:function(id){
        var $key2ValueObj = $("#"+id);
        var $prekey2ValueArr = $key2ValueObj.find("[data-bind-property]");
        $.each($prekey2ValueArr,function () {
            var item = this;
            var groupCode = $(item).attr("data-bind-property");
            var key = $(this).attr("data-bind-key");
            var groupCodeArr = commonController.getGroupCode(groupCode);
            $.each(groupCodeArr,function () {
                var group = this;
                if(group.dicCode==key){
                    $(item).text(group.dicName);
                    return;
                }
            })

        })
    }

}
var familyController = {
    controllerAs: 'familyController',
    defaultParam: {
        addFamilyModalSelect:['sex','certificate_type','marriage_status','educate_level','social_insu_flag','relation'],
        changeCustId:'',
        changeMainCustId:'',
        viewFamilyCustId:'',
        preEditFamilyId:'',
        lightFamilyIndex:'',
    },
    init: function () {
        new Swiper('.swiper-container', {
            scrollContainer: true,
            scrollbar: {
                container: '.swiper-scrollbar'
            }
        });


        $(".delUser").on("click", function () {
            $(".delUser").html("<i class='fa fa-trash-o'>" + "</i>" + "确定删除!");

        });
        $(".addFamilyBtn").on("click",function () {
            commonController.initModalSelect(familyController.defaultParam.addFamilyModalSelect,"addFamilyModal");
            $("#addFamilyForm").find("select[name=relation]").find("option").eq(1).remove();
            $("#addFamilyModal").modal("show");
        });
        $("#turn2CustList").on("click",function(){
            $(".right_col").load(baseUrl + "/policy?mainCustId="+custController.defaultParam.seeDetailRow.mainCustId);
        });
        $("#addFamilyForm").bootstrapValidator({
            message : '输入错误',
            fields : {
                name : {
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        stringLength : {
                            min : 2,
                            max : 300,
                            message : '只能输入6到30个字符'
                        }
                    }
                },
                mobileNumber : {
                    message : '输入错误',
                    validators : {
                        stringLength : {
                            min : 2,
                            max : 11,
                            message : '只能输入2到11个字符'
                        },
                        mobile:{
                            message : '输入项目必须是手机号码格式，例如：13485135075'
                        }
                    }
                },
                relation:{
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                selectInput:{
                    validators : {
                        message : '输入错误',
                        selectInput:{
                            message:'请选择内容'
                        }
                    }

                },
                birthDate:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                sex:{
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        message:'请选择内容',
                        selectInput:{
                            message:'请选择内容'
                        }
                    }
                },
                certificateNo:{
                    validators : {
                        message: '输入错误',
                        stringLength: {
                            min: 2,
                            max: 18,
                            message: '只能输入6到18个字符'
                        }
                    }
                },
                height:{
                    validators : {
                        message : '输入错误',
                        stringLength : {
                            min : 3,
                            max : 3,
                            message : '只能输入3个字符'
                        },
                        isinteger:{
                            message:"只能输入数字"
                        }
                    }
                },
                weight:{
                    validators : {
                        message : '输入错误',
                        isinteger:{
                            message:"只能输入数字"
                        }
                    }
                }
            }
        });
        $("#editFamilyForm").bootstrapValidator({
            message : '输入错误',
            fields : {
                name : {
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        stringLength : {
                            min : 2,
                            max : 300,
                            message : '只能输入6到30个字符'
                        }
                    }
                },
                mobileNumber : {
                    message : '输入错误',
                    validators : {
                        stringLength : {
                            min : 2,
                            max : 11,
                            message : '只能输入2到11个字符'
                        },
                        mobile:{
                            message : '输入项目必须是手机号码格式，例如：13485135075'
                        }
                    }
                },
                relation:{
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                selectInput:{
                    validators : {
                        message : '输入错误',
                        selectInput:{
                            message:'请选择内容'
                        }
                    }

                },
                birthDate:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                sex:{
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        message:'请选择内容',
                        selectInput:{
                            message:'请选择内容'
                        }
                    }
                },
                certificateNo:{
                    validators : {
                        message: '输入错误',
                        stringLength: {
                            min: 2,
                            max: 18,
                            message: '只能输入6到18个字符'
                        }
                    }
                },
                height:{
                    validators : {
                        message : '输入错误',
                        stringLength : {
                            min : 3,
                            max : 3,
                            message : '只能输入3个字符'
                        },
                        isinteger:{
                            message:"只能输入数字"
                        }
                    }
                },
                weight:{
                    validators : {
                        message : '输入错误',
                        stringLength : {
                            min : 3,
                            max : 3,
                            message : '只能输入3个字符'
                        },
                        isinteger:{
                            message:"只能输入数字"
                        }
                    }
                }
            }
        });

        $(".birthdayData").datetimepicker({
            minView: "month",//设置只显示到月份
            format: "yyyy-mm-dd",//日期格式
            autoclose: true,//选中关闭
            todayBtn: true,
            language: 'zh-CN',
            initialDate: "1989-01-01"
        });
        $("#saveFamilyBtn").on("click",function(){
            var $addFamilyModal = familyController.getFamilyModalInputObj("addFamilyForm");
            var preParam = {
                mainCustId:custController.defaultParam.seeDetailRow.mainCustId,
                name:$addFamilyModal.$name.val(),
                sex:$addFamilyModal.$sex.val(),
                birthDate:$addFamilyModal.$birthDate.val(),
                mobileNumber:$addFamilyModal.$mobileNumber.val(),
                certificateTyp:$addFamilyModal.$certificateType.val(),
                certificateNo:$addFamilyModal.$certificateNo.val(),
                socialInsuNo:$addFamilyModal.$socialInsuNo.val(),
                socialInsuFlag:$addFamilyModal.$socialInsuFlag.val(),
                marriageStatus:$addFamilyModal.$marriageStatus.val(),
                sstAddress:$addFamilyModal.$sstAddress.val(),
                educateLevel:$addFamilyModal.$educateLevel.val(),
                height:$addFamilyModal.$height.val(),
                weight:$addFamilyModal.$weight.val(),
                relation:$addFamilyModal.$relation.val()
            }

            var bootstrapValidator = $("#addFamilyForm").data('bootstrapValidator');
            bootstrapValidator.validate();
            if (!bootstrapValidator.isValid()) {
                return;
            }
            var param = commonController.filterObjNullOrEmtpy(preParam);
            console.log(param);

             $.ajax({
                 url:baseUrl+"/cust/member",
                 type:'post',
                 contentType: 'application/json;charset=utf-8',
                 data:JSON.stringify(param),
                 dataType: "json",
                 success:function(result){
                     if (result.state == 1) {
                        successPop("添加成功！");
                         familyController.initFamily();
                         $("#addFamilyModal").modal("hide");
                     } else {
                        errorPop(result.msg);
                     }
                 }
             });
        });
        //编辑家庭成员保存功能
        $("#editFamilyBtn").on("click",function(){
            var $addFamilyModal = familyController.getFamilyModalInputObj("editFamilyForm");
            var preParam = {
                id:familyController.defaultParam.changeCustId,
                mainCustId:familyController.defaultParam.changeMainCustId,
                name:$addFamilyModal.$name.val(),
                sex:$addFamilyModal.$sex.val(),
                birthDate:$addFamilyModal.$birthDate.val(),
                mobileNumber:$addFamilyModal.$mobileNumber.val(),
                certificateTyp:$addFamilyModal.$certificateType.val(),
                certificateNo:$addFamilyModal.$certificateNo.val(),
                socialInsuNo:$addFamilyModal.$socialInsuNo.val(),
                socialInsuFlag:$addFamilyModal.$socialInsuFlag.val(),
                marriageStatus:$addFamilyModal.$marriageStatus.val(),
                sstAddress:$addFamilyModal.$sstAddress.val(),
                educateLevel:$addFamilyModal.$educateLevel.val(),
                height:$addFamilyModal.$height.val(),
                weight:$addFamilyModal.$weight.val(),
                relation:$addFamilyModal.$relation.val()
            }

            var bootstrapValidator = $("#editFamilyForm").data('bootstrapValidator');
            bootstrapValidator.validate();
            if (!bootstrapValidator.isValid()) {
                return;
            }
            var param = commonController.filterObjNullOrEmtpy(preParam);
            console.log(param);

            $.ajax({
                url:baseUrl+"/cust/",
                type:'PATCH',
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify(param),
                dataType: "json",
                success:function(result){
                    if (result.state == 1) {
                        successPop("添加成功！");
                        familyController.initFamily();
                        $("#editFamilyModal").modal("hide");
                    } else {
                        errorPop(result.msg);
                    }
                }
            });
        });
        familyController.initFamily();
    },
    initFamily:function(){
        $("#policyPersonTop").load(baseUrl+"/custFamily?mainCustId="+custController.defaultParam.seeDetailRow.mainCustId);
    },
    initSeeDetail:function(){
        $(".seeDetails").qtip({
            style: {
                classes: 'qtip-blue qtip-shadow'
            },
            content: {
                text: function(event,api){
                    var $this = $(this)
                    $.ajax({
                        url: baseUrl + "/familyDetail?id="+$this.attr("data-id") // Use href attribute as URL
                    }).then(function(content) {
                        api.set('content.text', $(content).html());
                    }, function(xhr, status, error) {
                        api.set('content.text', status + ': ' + error);
                    });
                    return 'Loading...'; // Set some initial text
                }
            },
            position: {
                my: 'top center',
                at: 'bottom right',
                target: false, // Defaults to target element
                container: false, // Defaults to $(document.body)
                viewport: false, // Requires Viewport plugin
                adjust: {
                    x: 0, y: 0, // Minor x/y adjustments
                    mouse: true, // Follow mouse when using target:'mouse'
                    resize: true, // Reposition on resize by default
                    method: 'flip flip' // Requires Viewport plugin
                },
                effect: function (api, pos, viewport) {
                    $(this).animate(pos, {
                        duration: 200,
                        queue: false
                    });
                }
            },
        });
        $(".editUser").on("click", function () {
            var mainCustId = $(this).attr("data-mainCustId");
            var delBtn = $(this).find(".delFamily");
            var confirmBtn = $(this).find("confirm");
            var id = $(this).parent().prev().find("i").attr("data-id");
            delBtn.attr("data-id",id);
            confirmBtn.attr("data-id",id);
            familyController.defaultParam.preEditFamilyId = id;
            commonController.initModalSelect(familyController.defaultParam.addFamilyModalSelect,"editFamilyModal");
            $.ajax({
                url:baseUrl+"/cust/"+id,
                type:'get',
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success:function(result){
                    if (result.state == 1) {
                        console.log(result);
                        var inputObjs = custController.getModalInputObj("editFamilyModal");
                        var custMessage = result.data;


                        //处理modal内所有的下拉选框
                        commonController.initModalSelect(familyController.defaultParam.addCustomModalSelect,"editFamilyModal");

                        familyController.defaultParam.changeCustId     = custMessage.id;
                        familyController.defaultParam.changeMainCustId = custMessage.mainCustId;
                        inputObjs.$name.val(custMessage.name);
                        inputObjs.$birthDate.val(new Date(custMessage.birthDate).format("yyyy-MM-dd"));
                        inputObjs.$mobileNumber.val(custMessage.mobileNumber);
                        inputObjs.$certificateNo.val(custMessage.certificateNo);
                        inputObjs.$socialInsuNo.val(custMessage.socialInsuNo);
                        inputObjs.$sstAddress.val(custMessage.sstAddress);
                        inputObjs.$height.val(custMessage.height);
                        inputObjs.$weight.val(custMessage.weight);

                        inputObjs.$sex.val(custMessage.sex);
                        inputObjs.$certificateType.val(custMessage.certificateType);
                        inputObjs.$socialInsuFlag.val(custMessage.socialInsuFlag);
                        inputObjs.$marriageStatus.val(custMessage.marriageStatus);
                        inputObjs.$educateLevel.val(custMessage.educateLevel);
                        inputObjs.$relation.val(custMessage.relation);
                        $("#editFamilyForm").find("select[name=relation]").find("option").eq(1).remove();
                        $("#editFamilyModal").modal("show");

                    } else {
                        console.log(result);
                    }
                }
            });

        });
        $(".delFamily").on("click",function(){
            $(this).addClass("hidden");
            $(".confirm").removeClass("hidden");
        });
        $("#confirmDelFamily").on("click",function(){
            console.log("被点击了。。。");
             $.ajax({
                 url:baseUrl+"/cust/"+familyController.defaultParam.preEditFamilyId,
                 type:'DELETE',
                 contentType: 'application/json;charset=utf-8',
                 dataType: "json",
                 success:function(result){
                     if (result.state == 1) {
                         $(".delFamily").removeClass("hidden");
                         $(".confirm").addClass("hidden");
                         $("#editFamilyModal").modal("hide");
                         $("#policyPersonTop").load(baseUrl+"/custFamily?mainCustId="+custController.defaultParam.seeDetailRow.mainCustId);

                     } else {
                        errorPop(result.msg);
                     }
                 }
             });
        });

        //家庭投保统计弹窗
        $("#policy_familyAnalyse").on("click",function(){
            $("#reationModal").modal("show");
            $.ajax({
                url:baseUrl+"/policy/sum/"+custController.defaultParam.seeDetailRow.mainCustId,
                type:'GET',
                contentType: 'application/json;charset=utf-8',
                dataType : "json",
                success:function(result){
                    if (result.state == 1) {
                        var dataArr=result.data;
                        if(null!=dataArr){
                            $("#familySumTable > tbody").append("<tr><td>"+dataArr.yearPremSum+"元"+"</td><td>"+dataArr.cashValueSum+"元"+"</td><td>"+dataArr.creditValueSum+"元"+"</td><td>"+dataArr.accountValueSum+"元"+"</td></tr>")
                        }
                    } else {
                        errorPop(result.msg);
                    }
                }
            });

            function getdata(name,x,y,content){
                return {
                    name: name,x: x,y: y,symbol: 'roundRect',
                    symbolSize: [120, 80],
                    itemStyle: {
                        normal: { color: "#aed3f7"}
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: { color: '#000000'},
                            formatter: function(value,index){ return content;},
                            position: 'top',
                        }
                    }
                }
            };

            function gettemp1(name,x,y,num){
                return {
                    name: name,x: x+18,y: y, symbol: 'circle',
                    label: {
                        normal: {
                            show: true,
                            formatter: function(value,index){ return num;}
                        }
                    }
                }
            };

            function gettemp2(name,x,y,num){
                return {
                    name: name,
                    x: x-18,
                    y: y,
                    label: {
                        normal: {
                            show: true,
                            formatter: function(value,index){ return num;}
                        }
                    },
                    symbol:'image://http://www.easyicon.net/api/resizeApi.php?id=1206691&size=64'
                }
            };

            function getLink(sName,tName,num){
                return {
                    source: sName,
                    target: tName,
                    label: {
                        normal: {
                            show: true,
                            formatter: function (value, index) {
                                return num;
                            }
                        }
                    },
                    lineStyle: {
                        normal: { width: num,curveness: 0.3 }
                    }
                }
            };

            $.ajax({
                url:baseUrl+"/policy/familyReation/"+custController.defaultParam.seeDetailRow.mainCustId,
                type:'GET',
                contentType: 'application/json;charset=utf-8',
                dataType : "json",
                success:function(result){
                    if (result.state == 1) {

                        if(result.data != null){
                            var table = result.data.table;
                            if(table != null){
                                var tbody = "";
                                for(var i = 0 ;i < table.length;i++){
                                    var ta = table[i];
                                    tbody += "<tr><td>"+ta.applicantName+"</td><td scope=\"row\">"+ta.insuredName+"</td><td>"+ta.policyNum+"</td></tr>";
                                }
                                $("#familyRelationTable > tbody").append(tbody);
                            }

                            var chart = result.data.chart;
                            if(chart != null){
                            	var datas = chart.datas;
                                if(null != datas){
                                	var myData = new Array();
                                    for(var i = 0 ;i < datas.length;i++){
                                        if(i==0){
                                        	myData.push(getdata(datas[0].insuredName,100,200,datas[0].insuredName));
                                            myData.push(gettemp1(datas[0].insuredName+"_1",100,200,datas[0].otherInsuredNum));
                                            myData.push(gettemp2(datas[0].insuredName+"_2",100,200,datas[0].myInsuredNum));
                                        }else if(i==1){
                                        	myData.push(getdata(datas[1].insuredName,700,200,datas[1].insuredName));
                                            myData.push(gettemp1(datas[1].insuredName+"_1",700,200,datas[1].otherInsuredNum));
                                            myData.push(gettemp2(datas[1].insuredName+"_2",700,200,datas[1].myInsuredNum));
                                        }else if(i==2){
                                        	myData.push(getdata(datas[2].insuredName,300,100,datas[2].insuredName));
                                            myData.push(gettemp1(datas[2].insuredName+"_1",300,100,datas[2].otherInsuredNum));
                                            myData.push(gettemp2(datas[2].insuredName+"_2",300,100,datas[2].myInsuredNum));
                                        }else if(i==3){
                                        	myData.push(getdata(datas[3].insuredName,500,100,datas[3].insuredName));
                                            myData.push(gettemp1(datas[3].insuredName+"_1",500,100,datas[3].otherInsuredNum));
                                            myData.push(gettemp2(datas[3].insuredName+"_2",500,100,datas[3].myInsuredNum));
                                        }else if(i==4){
                                        	myData.push(getdata(datas[4].insuredName,300,300,datas[4].insuredName));
                                            myData.push(gettemp1(datas[4].insuredName+"_1",300,300,datas[4].otherInsuredNum));
                                            myData.push(gettemp2(datas[4].insuredName+"_2",300,300,datas[4].myInsuredNum));
                                        }else if(i==5){
                                            myData.push(getdata(datas[5].insuredName,500,300,datas[5].insuredName));
                                            myData.push(gettemp1(datas[5].insuredName+"_1",500,300,datas[5].otherInsuredNum));
                                            myData.push(gettemp2(datas[5].insuredName+"_2",500,300,datas[5].myInsuredNum));
                                        }else if(i==6){
                                        	myData.push(getdata(datas[6].insuredName,100,100,datas[6].insuredName));
                                            myData.push(gettemp1(datas[6].insuredName+"_1",100,100,datas[6].otherInsuredNum));
                                            myData.push(gettemp2(datas[6].insuredName+"_2",100,100,datas[6].myInsuredNum));
                                        }else if(i==7){
                                        	myData.push(getdata(datas[7].insuredName,700,100,datas[7].insuredName));
                                            myData.push(gettemp1(datas[7].insuredName+"_1",700,100,datas[7].otherInsuredNum));
                                            myData.push(gettemp2(datas[7].insuredName+"_2",700,100,datas[7].myInsuredNum));
                                        }else if(i==8){
                                            myData.push(getdata(datas[8].insuredName,100,300,datas[8].insuredName));
                                            myData.push(gettemp1(datas[8].insuredName+"_1",100,300,datas[8].otherInsuredNum));
                                            myData.push(gettemp2(datas[8].insuredName+"_2",100,300,datas[8].myInsuredNum));
                                        }else if(i==9){
                                            myData.push(getdata(datas[9].insuredName,700,300,datas[9].insuredName));
                                            myData.push(gettemp1(datas[9].insuredName+"_1",700,300,datas[9].otherInsuredNum));
                                            myData.push(gettemp2(datas[9].insuredName+"_2",700,300,datas[9].myInsuredNum));
                                        }
                                        
                                    }
                                }

                                var links = chart.links;
                                if(null != links){
                                	var myLinks = new Array();
                                    for(var i = 0 ;i < links.length;i++){
                                        var l = links[i];
                                        myLinks.push(getLink(l.applicantName,l.insuredName,l.policyNum));
                                    }
                                }

                                var relationDom = document.getElementById('relation');
                                var relationContainer = function(){
                                    relationDom.style.width = (window.innerWidth*0.6 )+"px";
                                    relationDom.style.height = '500px';
                                }
                                relationContainer();
                                var relationChart = echarts.init(relationDom);
                                var relationOption =   {
                                    tooltip: {},
                                    animationDurationUpdate: 1500,
                                    animationEasingUpdate: 'quinticInOut',
                                    series : [
                                        {
                                            type: 'graph',
                                            layout: 'none',
                                            symbolSize: 50,
                                            roam: true,
                                            label: {
                                                normal: {
                                                    show: true
                                                }
                                            },
                                            edgeSymbol: ['roundRect', 'arrow'],
                                            edgeSymbolSize: [7, 30],
                                            edgeLabel: {
                                                normal: {
                                                    textStyle: {
                                                        fontSize: 20
                                                    }
                                                }
                                            },
                                            data: myData,
                                            links: myLinks,
                                            lineStyle: {
                                                normal: {
                                                    opacity: 0.9,
                                                    width: 6,
                                                    curveness: 0,
                                                    color:'#cbb2a4'
                                                }
                                            }
                                        }
                                    ]
                                };
                                relationChart.setOption(relationOption);
                                //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
                                window.onresize = function () {
                                    //重置容器高宽
                                    relationContainer();
                                    relationChart.resize();
                                };
                            }
                        }
                    } else {
                        errorPop(result.msg);
                    }
                }
            });

        });
        //TODOBUSS 点击家庭成员查看家庭
        $(".color1").on("click",function(){
            var $curClick = $(this);
            $curClick.parent().find($(".lightcircle")).removeClass("hidden");
            $curClick.parent().siblings().find($(".lightcircle")).addClass("hidden");
            var custId = $curClick.parent().find(".seeDetails").attr("data-id");
            familyController.defaultParam.viewFamilyCustId  =custId;
            familyController.defaultParam.lightFamilyIndex = $curClick.attr("data-index");

            $(".right_col").load(baseUrl + "/policyView");
        });
        $(".relationBtn").on("click",function(){
            var obj = $(".relationTable");
            if(obj.hasClass("hidden")){
                obj.removeClass("hidden");
                $(".relationChart").addClass("hidden");
            }else{
                obj.addClass("hidden");
                $(".relationChart").removeClass("hidden");
            }
        });
        if(familyController.defaultParam.lightFamilyIndex!=''){
            var tempObj = $(".policyHolderBtn");
            if(tempObj!=null && tempObj.length && tempObj.length>0){
                $(".color1").eq(familyController.defaultParam.lightFamilyIndex).parent().find(".lightcircle").removeClass("hidden");
            }
        }

    },
    getFamilyModalInputObj:function(modalId){
        var   $addCustModal = $("#"+modalId);
        return {
            $name :$addCustModal.find("input[name=name]"),
            $sex :$addCustModal.find("select[name=sex]"),
            $birthDate :$addCustModal.find("input[name=birthDate]"),
            $relation :$addCustModal.find("select[name=relation]"),
            $certificateType :$addCustModal.find("select[name=certificateType]"),
            $certificateNo :$addCustModal.find("input[name=certificateNo]"),
            $mobileNumber :$addCustModal.find("input[name=mobileNumber]"),
            $socialInsuFlag :$addCustModal.find("select[name=socialInsuFlag]"),
            $socialInsuNo :$addCustModal.find("input[name=socialInsuNo]"),
            $sstAddress :$addCustModal.find("input[name=sstAddress]"),
            $marriageStatus :$addCustModal.find("select[name=marriageStatus]"),
            $educateLevel :$addCustModal.find("select[name=educateLevel]"),
            $height :$addCustModal.find("input[name=height]"),
            $weight :$addCustModal.find("input[name=weight]")

        }
    }
}
var custController = {
    controllerAs: 'custController',
    defaultParam: {
        addCustomModalSelect:['sex','certificate_type','marriage_status','educate_level','social_insu_flag'],
        changeMainCustId:'',
        changeCustId:'',
        seeDetailRow:{}

    },
    queryInputObj:function(){
        var $queryCustName = $("#queryCustName");
        var $queryCustPhone = $("#queryCustPhone");
        return {
            $queryCustName:$queryCustName ,
            $queryCustPhone:$queryCustPhone
        }
    },
    init: function () {
        $("#customerList").bootstrapTable({
            url: baseUrl + '/cust/main/list',		 //请求后台的URL（*）
            method: 'GET',					  //请求方式（*）
            striped: true,					  //是否显示行间隔色
            cache: false,					   //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,
            dataType: "json",
            singleSelect: false,
            pageSize: 10,
            pageList: [10, 25, 50, 100],
            showRefresh: true,
            showToggle: true,
            showPaginationSwitch: true,
            smartDisplay: true,
            checkboxHeader: true,
            columns: [{
                title: '序号',
                field: 'id',
                align: 'center',
                valign: 'middle',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                title: '姓名',
                field: 'name',
                align: 'center',
                valign: 'middle'
            }, {
                title: '性别',
                field: 'sex',
                align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
                    if(value==1){
                        return "男";
                    }else if(value==2){
                        return "女";
                    }
                }
            }, {
                title: '联系方式',
                field: 'mobileNumber',
                align: 'center',
                valign: 'middle'
            }, {
                title: '家庭人数',
                field:'familySize',
                align: 'center',
                valign: 'middle'
            }, {
                title: '保单件数',
                field:'policyNum',
                align: 'center',
                valign: 'middle'
            },{
                title: '操作',
                align: 'center',
                valign: 'middle',
                events: custController.operateEvents,
                formatter:function(value,row,index){
                    return "<a href='javascript:void(0)' style='padding: 5px;' class='btn btn-info btn-xs editCust fa fa-edit' >编辑</a>"
                        + "&nbsp;&nbsp;<a href='javascript:void(0)' style='padding: 5px;'  class='btn btn-danger btn-xs delCust fa fa-trash' >删除</a>"
                        + "&nbsp;&nbsp;<a href='javascript:void(0)' style='padding: 5px;'  class='btn btn-success btn-xs seeDetail fa fa-eye' >查看</a>";
                }
            }]
        });

        $("#addCustomerBtn").on("click",function () {
            commonController.initModalSelect(custController.defaultParam.addCustomModalSelect,"addCustModal");
            $("#addCustModal").modal("show");
        });
        $("#addCustForm").bootstrapValidator({
            message : '输入错误',
            fields : {
                name : {
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        stringLength : {
                            min : 2,
                            max : 300,
                            message : '只能输入6到30个字符'
                        }
                    }
                },
                mobileNumber : {
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        stringLength : {
                            min : 2,
                            max : 11,
                            message : '只能输入2到11个字符'
                        },
                        mobile:{
                            message : '输入项目必须是手机号码格式，例如：13485135075'
                        }
                    }
                },
                selectInput:{
                    validators : {
                        message : '输入错误',
                        selectInput:{
                            message:'请选择内容'
                        }
                    }

                },
                birthDate:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                sex:{
                    validators : {
                        message:'请选择内容',
                        selectInput:{
                            message:'请选择内容'
                        }
                    }
                },
                certificateNo:{
                    validators : {
                        message: '输入错误',
                        stringLength: {
                            min: 2,
                            max: 18,
                            message: '只能输入6到18个字符'
                        }
                    }
                },
                height:{
                    validators : {
                        message : '输入错误',
                        stringLength : {
                            min : 3,
                            max : 3,
                            message : '只能输入3个字符'
                        },
                        isinteger:{
                            message:"只能输入数字"
                        }
                    }
                },
                weight:{
                    validators : {
                        message : '输入错误',
                        stringLength : {
                            min : 3,
                            max : 3,
                            message : '只能输入3个字符'
                        },
                        isinteger:{
                            message:"只能输入数字"
                        }
                    }
                }
            }
        });
        $("#editCustForm").bootstrapValidator({
            message : '输入错误',
            fields : {
                name : {
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        stringLength : {
                            min : 2,
                            max : 300,
                            message : '只能输入6到30个字符'
                        }
                    }
                },
                mobileNumber : {
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        stringLength : {
                            min : 2,
                            max : 11,
                            message : '只能输入2到11个字符'
                        },
                        mobile:{
                            message : '输入项目必须是手机号码格式，例如：13485135075'
                        }
                    }
                },
                selectInput:{
                    validators : {
                        message : '输入错误',
                        selectInput:{
                            message:'请选择内容'
                        }
                    }

                },
                birthDate:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                sex:{
                    validators : {
                        message:'请选择内容',
                        selectInput:{
                            message:'请选择内容'
                        }
                    }
                },
                certificateNo:{
                    validators : {
                        message: '输入错误',
                        stringLength: {
                            min: 2,
                            max: 18,
                            message: '只能输入6到18个字符'
                        }
                    }
                },
                height:{
                    validators : {
                        message : '输入错误',
                        stringLength : {
                            min : 3,
                            max : 3,
                            message : '只能输入3个字符'
                        },
                        isinteger:{
                            message:"只能输入数字"
                        }
                    }
                },
                weight:{
                    validators : {
                        message : '输入错误',
                        stringLength : {
                            min : 3,
                            max : 3,
                            message : '只能输入3个字符'
                        },
                        isinteger:{
                            message:"只能输入数字"
                        }
                    }
                }
            }
        });
        //客户列表查询
        $("#queryCustListBtn").on("click",function(){
            var queryInputObjs = custController.queryInputObj();
            $('#customerList').bootstrapTable('refresh', {
                query :{
                    name:queryInputObjs.$queryCustName.val(),
                    mobileNumber:queryInputObjs.$queryCustPhone.val()
                }
            });
        });
        //客户列表重置功能
        $("#resestCustBtn").on("click",function () {
            var queryInputObjs = custController.queryInputObj();
            queryInputObjs.$queryCustName.val("");
            queryInputObjs.$queryCustPhone.val("");
            $('#customerList').bootstrapTable('refresh', {
                query :{
                    name:null,
                    mobileNumber:null
                }
            });
        });
        //保存主联系人
        $("#saveMainCustBtn").on("click",function(){

            var $addCustModal = custController.getModalInputObj("addCustModal");
            var preParam = {
                name:$addCustModal.$name.val(),
                sex:$addCustModal.$sex.val(),
                birthDate:$addCustModal.$birthDate.val(),
                mobileNumber:$addCustModal.$mobileNumber.val(),
                certificateTyp:$addCustModal.$certificateType.val(),
                certificateNo:$addCustModal.$certificateNo.val(),
                socialInsuNo:$addCustModal.$socialInsuNo.val(),
                socialInsuFlag:$addCustModal.$socialInsuFlag.val(),
                marriageStatus:$addCustModal.$marriageStatus.val(),
                sstAddress:$addCustModal.$sstAddress.val(),
                educateLevel:$addCustModal.$educateLevel.val(),
                height:$addCustModal.$height.val(),
                weight:$addCustModal.$weight.val()
            }

            var bootstrapValidator = $("#addCustForm").data('bootstrapValidator');
            bootstrapValidator.validate();
            if (!bootstrapValidator.isValid()) {
                return;
            }
            var param = commonController.filterObjNullOrEmtpy(preParam);
             $.ajax({
                 url:baseUrl+"/cust/main",
                 type:'POST',
                 contentType: 'application/json;charset=utf-8',
                 data:JSON.stringify(param),
                 dataType : "json",
                 success:function(result){
                     if (result.state == 1) {
                         successPop(result.msg);
                         $('#customerList').bootstrapTable('refresh', null);
                         $("#addCustModal").modal("hide");
                     } else {
                         errorPop(result.msg);
                     }
                 }
             });
        });
        //修改主联系人
        $("#editMainCustBtn").on("click",function(){

            var $addCustModal = custController.getModalInputObj("editCustModal");
            var preParam = {
                name:$addCustModal.$name.val(),
                sex:$addCustModal.$sex.val(),
                birthDate:$addCustModal.$birthDate.val(),
                mobileNumber:$addCustModal.$mobileNumber.val(),
                certificateTyp:$addCustModal.$certificateType.val(),
                certificateNo:$addCustModal.$certificateNo.val(),
                socialInsuNo:$addCustModal.$socialInsuNo.val(),
                socialInsuFlag:$addCustModal.$socialInsuFlag.val(),
                marriageStatus:$addCustModal.$marriageStatus.val(),
                sstAddress:$addCustModal.$sstAddress.val(),
                educateLevel:$addCustModal.$educateLevel.val(),
                height:$addCustModal.$height.val(),
                weight:$addCustModal.$weight.val(),
                id:custController.defaultParam.changeCustId,
                mainCustId:custController.defaultParam.changeMainCustId,
                relation:'1'
            }

            var bootstrapValidator = $("#editCustForm").data('bootstrapValidator');
            bootstrapValidator.validate();
            if (!bootstrapValidator.isValid()) {
                return;
            }
            var param = commonController.filterObjNullOrEmtpy(preParam);
            $.ajax({
                url:baseUrl+"/cust",
                type:'PATCH',
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify(param),
                dataType : "json",
                success:function(result){
                    if (result.state == 1) {
                        successPop(result.msg);
                        $('#customerList').bootstrapTable('refresh', null);
                        $("#editCustModal").modal("hide");
                    } else {
                        errorPop(result.msg);
                    }
                }
            });
        });

        $("#birthdayData").datetimepicker({
            minView: "month",//设置只显示到月份
            format: "yyyy-mm-dd",//日期格式
            autoclose: true,//选中关闭
            todayBtn: true,
            language: 'zh-CN',
            initialDate: "1989-01-01",
        });
    },
    getModalInputObj:function(modalId){
        var   $addCustModal = $("#"+modalId);
        return {
            $name :$addCustModal.find("input[name=name]"),
            $sex :$addCustModal.find("select[name=sex]"),
            $birthDate :$addCustModal.find("input[name=birthDate]"),
            $mobileNumber :$addCustModal.find("input[name=mobileNumber]"),
            $certificateType :$addCustModal.find("select[name=certificateType]"),
            $certificateNo :$addCustModal.find("input[name=certificateNo]"),
            $socialInsuNo :$addCustModal.find("input[name=socialInsuNo]"),
            $socialInsuFlag :$addCustModal.find("select[name=socialInsuFlag]"),
            $marriageStatus :$addCustModal.find("select[name=marriageStatus]"),
            $sstAddress :$addCustModal.find("input[name=sstAddress]"),
            $educateLevel :$addCustModal.find("select[name=educateLevel]"),
            $height :$addCustModal.find("input[name=height]"),
            $weight :$addCustModal.find("input[name=weight]"),
            $relation:$addCustModal.find("select[name=relation]")
        }
    },
    operateEvents: {
        'click .editCust': function (e, value, row, index) {
            console.log(row);
             $.ajax({
                 url:baseUrl+"/cust/"+row.id,
                 type:'get',
                 contentType: 'application/json;charset=utf-8',
                 dataType: "json",
                 success:function(result){
                     if (result.state == 1) {
                            console.log(result);
                            var inputObjs = custController.getModalInputObj("editCustModal");
                            var custMessage = result.data;


                            //处理modal内所有的下拉选框
                            commonController.initModalSelect(custController.defaultParam.addCustomModalSelect,"editCustModal");
                            commonController.initDateInput(['editCustBrithday']);
                            $("#editCustModal").modal("show");

                            custController.defaultParam.changeCustId = custMessage.id;
                            custController.defaultParam.changeMainCustId = custMessage.mainCustId;
                            inputObjs.$name.val(custMessage.name);
                            inputObjs.$birthDate.val(new Date(custMessage.birthDate).format("yyyy-MM-dd"));
                            inputObjs.$mobileNumber.val(custMessage.mobileNumber);
                            inputObjs.$certificateNo.val(custMessage.certificateNo);
                            inputObjs.$socialInsuNo.val(custMessage.socialInsuNo);
                            inputObjs.$sstAddress.val(custMessage.sstAddress);
                            inputObjs.$height.val(custMessage.height);
                            inputObjs.$weight.val(custMessage.weight);

                           inputObjs.$sex.val(custMessage.sex);
                           inputObjs.$certificateType.val(custMessage.certificateType);
                           inputObjs.$socialInsuFlag.val(custMessage.socialInsuFlag);
                           inputObjs.$marriageStatus.val(custMessage.marriageStatus);
                           inputObjs.$educateLevel.val(custMessage.educateLevel);



                     } else {
                            console.log(result);
                     }
                 }
             });

        },
        'click .delCust':function (e,value,row,index) {
            console.log(row);
            var preDelUserName = row.name;
            $.confirm({
                title: '警告！',
                content: '确定删除'+preDelUserName+'用户？',
                type: 'green',
                buttons: {
                    ok: {
                        text: "确定",
                        btnClass: 'btn-primary',
                        keys: ['enter'],
                        action: function(){
                            $.ajax({
                                url:baseUrl+"/cust/"+row.id,
                                type:'DELETE',
                                contentType: 'application/json;charset=utf-8',
                                dataType: "json",
                                success:function(result){
                                    if (result.state == 1) {
                                        successPop("删除成功");
                                        $('#customerList').bootstrapTable('refresh', {
                                            query :{
                                                name:null,
                                                mobileNumber:null
                                            }
                                        });
                                    } else {
                                        errorPop(result.msg);
                                    }
                                }
                            });
                        }
                    },
                    cancel: {
                        text:"取消"
                    }
                }
            });
        },
        'click .seeDetail':function (e,value,row,index) {
            custController.defaultParam.seeDetailRow = row;
            console.log(custController.defaultParam.seeDetailRow);
            $(".right_col").load(baseUrl + "/policy?mainCustId="+row.mainCustId);
        }
    }
}
var policyController = {
    controllerAs: 'policyController',
    defaultParam: {},
    init:function(){
        $('#companySel').selectpicker();
        $(".addPlicyBtn").on("click", function () {
            $(".right_col").load(baseUrl + "/createPolicy");
        });
        $.ajax({
            url:baseUrl+"/policy/insCompany/"+custController.defaultParam.seeDetailRow.mainCustId,
            type:'GET',
            contentType: 'application/json;charset=utf-8',
            dataType: "json",
            success:function(result){
                if (result.state == 1) {
                    var resultData = result.data;
                    var tempStr = "<option value=''>请选择</option>";
                    $.each(resultData,function(){
                       var itemCompany = this;
                       tempStr+="<option value=\""+itemCompany.insCompanyCode+"\">"+itemCompany.insCompanyName+"</option>";
                    });
                    $("#companySel").empty();
                    $("#companySel").append(tempStr);
                    //更新内容刷新到相应的位置
                    $('#companySel').selectpicker('render');
                    $('#companySel').selectpicker('refresh');

                }
            }
        });
        $("#queryPolicyBtn").on("click",function () {
           var insCompanyCode =  $('.selectpicker').selectpicker('val');
           var policyStatus =  $("#policyStateSel").val();
           var mainProductName = $("#mainProductNameInput").val();
            $(".right_col").load(baseUrl+"/policy?insCompanyCode="+insCompanyCode+"&policyStatus="+policyStatus+"&mainProductName="+mainProductName+"&mainCustId="+custController.defaultParam.seeDetailRow.mainCustId);
        });
        $(".cardPolicy").on("click",function(){
            var policyId = $(this).attr("data-id");
            policyDetailController.defaultParam.nextPolicyDeatil = policyId;
            $(".right_col").load(baseUrl+"/policyDetail?id="+policyDetailController.defaultParam.nextPolicyDeatil,function(){
                $("#preViewProductDetail").load(baseUrl+"/preViewDetail?id="+policyDetailController.defaultParam.nextPolicyDeatil);
            });
        });
        $(".closebtn").on("click",function(){
            var id = $(this).attr("data-id");
            $.confirm({
                title: '警告！',
                content: '确定删除该保单么？',
                type: 'green',
                buttons: {
                    ok: {
                        text: "确定",
                        btnClass: 'btn-primary',
                        keys: ['enter'],
                        action: function(){
                            $.ajax({
                                url:baseUrl+"/policy/"+id,
                                type:'DELETE',
                                contentType: 'application/json;charset=utf-8',
                                dataType: "json",
                                success:function(result){
                                    if (result.state == 1) {
                                        successPop("删除成功");
                                        var insCompanyCode =  $('.selectpicker').selectpicker('val');
                                        var policyStatus =  $("#policyStateSel").val();
                                        var mainProductName = $("#mainProductNameInput").val();
                                        $(".right_col").load(baseUrl+"/policy?insCompanyCode="+insCompanyCode+"&policyStatus="+policyStatus+"&mainProductName="+mainProductName+"&mainCustId="+custController.defaultParam.seeDetailRow.mainCustId);
                                    } else {
                                        errorPop(result.msg);
                                    }
                                }
                            });
                        }
                    },
                    cancel: {
                        text:"取消"
                    }
                }
            });
        });
    }
}
var createPolicyController = {
    "controllerAs" : 'createPolicyController ',
    defaultParam: {
        addCustomModalSelect:['policy_status','pay_mode','currency'],
        changeMainCustId:'',
        changeCustId:'',
        seeDetailRow:{},
        savePolicyReturnId:'',
        saveNextLiabInusres:[],//被保险人列表点击下一步进行参数传递的字段
        saveLiabParamStr:'',//保存险种清单
        saveNextInsCompanyCode:''

    },
    getAddPolicyObj:function(formId){
        var $formId = $("#"+formId);
        return {
            $companyName :$formId.find("select[name=companyName]"),
            $insureNum   :$formId.find("input[name=insureNum]"),
            $validDate   :$formId.find("input[name=validDate]"),
            $insureper   :$formId.find("select[name=insureper]"),
            $policystatues :$formId.find("select[name=policystatues]"),
            $payMode :$formId.find("select[name=payMode]"),
            $currency :$formId.find("select[name=currency]"),
        }
    },
    init:function(){
        $('#companySel').selectpicker();
        commonController.initModalSelect(createPolicyController.defaultParam.addCustomModalSelect,"policyMainInfo");
        commonController.initAllCompanyOption("companySelp","ins_company_name");
        commonController.initDateInput(["validDate"]);
        $("#turnBack").on("click",function () {
            $(".right_col").load(baseUrl + "/policy?mainCustId="+custController.defaultParam.seeDetailRow.mainCustId);
        });
        commonController.initFamilySelOption("insureper");

        $("#policyMainInfo").bootstrapValidator({
            message:"输入错误",
            fields : {
                companyName : {
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insureNum : {
                    message : '输入错误',
                    validators : {
                        stringLength : {
                            min : 2,
                            max : 11,
                            message : '只能输入2到11个字符'
                        },
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                validDate : {
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insureper : {
                    message : '输入错误',
                    validators : {
                        selectInput:{
                            message:'请选择内容'
                        }
                    }
                },
                policystatues : {
                    message : '输入错误',
                    validators : {
                        selectInput:{
                            message:'请选择内容'
                        }
                    }
                },
                payMode : {
                    message : '输入错误',
                    validators : {
                        selectInput:{
                            message:'请选择内容'
                        }
                    }
                },
                currency : {
                    message : '输入错误',
                    validators : {
                        selectInput:{
                            message:'请选择内容'
                        }
                    }
                }
            }
        });
        //保存保单信息
        $("#savePolicy").on("click",function(){
            var bootstrapValidator = $("#policyMainInfo").data('bootstrapValidator');
            bootstrapValidator.validate();
            if (!bootstrapValidator.isValid()) {
                return;
            }
            var $policyMainInfo = createPolicyController.getAddPolicyObj("policyMainInfo");
            var preParam = {
                mainCustId:custController.defaultParam.seeDetailRow.mainCustId,
                insCompanyCode:$policyMainInfo.$companyName.val(),
                policyNo:$policyMainInfo.$insureNum.val(),
                policyEffectDate:$policyMainInfo.$validDate.val(),
                applicantId:$policyMainInfo.$insureper.val(),
                payMode:$policyMainInfo.$payMode.val(),
                currency:$policyMainInfo.$currency.val(),
                policyStatus:$policyMainInfo.$policystatues.val()
            }
            var param = commonController.filterObjNullOrEmtpy(preParam);
            $.ajax({
                url:baseUrl+"/policy",
                type:'POST',
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify(param),
                dataType : "json",
                success:function(result){
                    if (result.state == 1) {
                        successPop(result.msg);
                        createPolicyController.defaultParam.savePolicyReturnId = result.data.id;
                        createPolicyController.showPolicyDetail(createPolicyController.defaultParam.savePolicyReturnId);
                        createPolicyController.defaultParam.saveNextInsCompanyCode = param.insCompanyCode;
                        createPolicyController.defaultParam.saveNextCompanyCode = param.insCompanyCode;
                        $("#addPolicyForm").hide();
                        $("#showmessage").hide();
                        $("#policyDetail").removeClass("hidden");
                        $("#savePolicy").hide();

                    } else {
                        errorPop(result.msg);
                    }
                }
            });
        });
        $('#productSel').selectpicker();
        $("#addPolicyItem").on("click",function(){
             $.ajax({
                 url:baseUrl+"/product/canChoose/list/"+createPolicyController.defaultParam.saveNextInsCompanyCode,
                 type:'GET',
                 contentType: 'application/json;charset=utf-8',
                 dataType: "json",
                 success:function(result){
                     if (result.state == 1) {
                         if(result.data==null ){
                             errorPop("还没有录入该公司的产品，暂不能添加险种！")
                             return;
                         }
                         var resultData = result.data;
                         var tempStr = "";
                         $.each(resultData,function(){
                             var itemCompany = this;
                             tempStr+="<option value=\""+itemCompany.productNo+"\">"+itemCompany.productName+"</option>";
                         });
                         $('#productSel').empty();
                         $('#productSel').append(tempStr);
                         $('#productSel').selectpicker('render');
                         $('#productSel').selectpicker('refresh');
                         $(".policyItemDetail").hide();
                         $("#saveLiab").hide();
                         $("#addPolicyItemModal").modal("show");
                     } else {

                     }
                 }
             });
        });
        //获取用户的家庭成员，进行初始化家庭成员列表
        commonController.initFamilySelOption(['insuredPersonLabel1','insuredPersonLabel2','insuredPersonLabel3'
            ,'insuredPersonLabel4','insuredPersonLabel5','insuredPersonLabel6','insuredPersonLabel7'
            ,'insuredPersonLabel8','insuredPersonLabel9','insuredPersonLabel10','insuredPersonLabel11','insuredPersonLabel12'
            ,'insuredMsgListSel']);
        //初始化所有校验内容
        var obj = {
            message : '输入错误',
            fields : {
                insuredPersonLabel1:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel2:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel3:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel4:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel5:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel6:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel7:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel8:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel9:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel10:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel11:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel12:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredMsgListSel:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                mainPrd:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                basicAmnt:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                prem:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                payYearsFlag:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                payYears:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isinteger:{
                            message:'只能输入整数'
                        }
                    }
                },
                insNum:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isinteger:{
                            message:'只能输入整数'
                        }
                    }
                },
                coverYearsFlag:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                coverYears:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isinteger:{
                            message:'只能输入整数'
                        }
                    }
                },
                cashValue:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                lastCashValue:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                annStartAge:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                annPeriodFlag:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isinteger:{
                            message:'只能输入整数'
                        }
                    }
                },
                annPeriod:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isinteger:{
                            message:'只能输入整数'
                        }
                    }
                },
                accountValue:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                accumDiv:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                creditRate:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq1:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq2:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq3:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq4:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq5:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq6:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq7:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq8:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq9:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLqs60:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLqs70:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLqs80:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLqs90:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLqs100:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                }
            }
        }

        //TODOBUSS 险种选择后处理表单内容
        $('#productSel').on('hidden.bs.select', function (e,b,c) {
            var productNo =  $('#productSel').val();
            var policyId = createPolicyController.defaultParam.savePolicyReturnId;
             $.ajax({
                 url:baseUrl+"/product/canInput/"+policyId+"/"+productNo+"",
                 type:'GET',
                 contentType: 'application/json;charset=utf-8',
                 dataType: "json",
                 success:function(result){
                     if (result.state == 1) {
                         if(result.data == null){
                             errorPop("未录入该公司的产品");
                             return ;
                         }
                         var propertiesArr = commonController.getPropetryNames(result.data);
                         $(".inputhidden").hide();
                         var preShowInput = "";
                         $.each(propertiesArr,function () {
                             var  itemName = commonController.joinProp(this);
                             preShowInput += itemName + ";";
                         });
                         createPolicyController.defaultParam.saveLiabParamStr=Object.getOwnPropertyNames(result.data);
                         //控制表单的显示与隐藏
                         var AliiInputArr = $(".policyItemForm ").find("[data-input-name]");
                         $.each(AliiInputArr,function () {
                             var itemIpnut = $(this);
                             var name = itemIpnut.attr("data-input-name");
                             if(preShowInput.indexOf(name)!=-1){
                                itemIpnut.show();
                             }
                         });
                         //处理被保险人个数操作
                         var insuredMsgList = result.data.insuredMsgList;
                         $.each(insuredMsgList,function(){
                             var insuredObj = this;
                             var insuredPersonLabel = insuredObj.insuredPersonLabel;
                             $(".policyItemForm ").find("[data-input-name=insuredPersonLabel"+insuredPersonLabel+"]").show();
                             //将被保险人的相关必填项添加到对应的数组中
                             var tempInsurePersonLabelInput = "insuredPersonLabel"+insuredPersonLabel;
                             createPolicyController.defaultParam.saveNextLiabInusres.push(tempInsurePersonLabelInput);
                             propertiesArr.push(tempInsurePersonLabelInput);
                         });
                         //处理表单数据库中的校验
                         var readyValudator = {};
                         $.each(propertiesArr,function(){
                             var item = this;
                             readyValudator[item]  = obj.fields[item];
                         });
                         console.log(readyValudator);
                         $("#productForm").bootstrapValidator(obj);

                     } else {
                        errorPop(result.msg)
                     }
                 }
             });
        });
        $("#turnBack2Change").on("click",function(){
            $(".policyItemAll").removeClass("hidden");
            $(".policyItemDetail").addClass("hidden");
            $("#turnBackDiv").addClass("hidden");
            $(".addPolicyItemTitle").text("添加险种");
            $("#nextBtn").show();
            $("#saveLiab").hide();
        });
        //险种保存下一步
        $("#nextBtn").on("click",function(){
            var bootstrapValidator = $("#productForm").data('bootstrapValidator');
            bootstrapValidator.validate();
            if (!bootstrapValidator.isValid()) {
                return;
            }
            console.log("校验通过！");
            var productNo =  $("#productSel").val();
            $("#turnBackDiv").removeClass("hidden");
            $("#nextBtn").hide();
            $("#saveLiab").show();
            $(".policyItemDetail").show();
            var insurerArr = [];
            $.each(createPolicyController.defaultParam.saveNextLiabInusres,function(index,value){
                var itemInsureInputStr = value;
                var itemInsureInputObj = $("#"+value);
                var insurer = {
                    name:itemInsureInputStr,
                    labelName:'',
                    insureInpuKey:itemInsureInputObj.val(),
                    insureInputValue:itemInsureInputObj.find("option[value="+itemInsureInputObj.val()+"]").text()
                };
                insurerArr.push(insurer);
            })
             $.ajax({
                 url:baseUrl+"/liab/need/list/"+productNo,
                 type:'get',
                 contentType: 'application/json;charset=utf-8',
                 dataType: "json",
                 success:function(result){
                     if (result.state == 1) {
                         var trStr = "<tr>";
                         $.each(result.data,function(){
                             var itemLiab = this;
                             var insuredPersonLabel = itemLiab.insuredPersonLabel;
                             for(var i = 0 ;i < insurerArr.length;i++){
                                 var itemInsure = insurerArr[i];
                                 if(itemInsure.name == "insuredPersonLabel"+insuredPersonLabel){
                                     itemLiab.insureKey = itemInsure.insureInpuKey;
                                     itemLiab.insureValue = itemInsure.insureInputValue;
                                 }
                             }
                         });
                         var trStr = "";
                         $("#liabTableTr").html("").append(trStr);
                         if(result.data!=null){
                             for(var i = 0 ;i< result.data.length;i++){
                                 var item = result.data[i];
                                 trStr += "<tr><td>"+(i+1)+"</td>";
                                 if(item.liabType==1 || item.liabType=='1'){
                                     trStr +=  '<td><input type="checkbox" checked="checked" disabled="disabled" data-id="'+item.id+'"/></td>';
                                 }else{
                                     trStr += '<td><input type="checkbox" data-id="'+item.id+'"/></td>';
                                 }
                                 trStr += "<td>"+item.liabLabel+"</td>";
                                 if(item.insuredPersonLabel=="1"){
                                     trStr += "<td>"+ "被保险人"+"</td>";
                                 }else if(item.insuredPersonLabel=="2"){
                                     trStr += "<td>"+ "主被保险人"+"</td>";
                                 }else if(item.insuredPersonLabel=="3"){
                                     trStr += "<td>"+ "连带被保险人"+"</td>";
                                 }else if(item.insuredPersonLabel=="4"){
                                     trStr += "<td>"+ "附带被保险人"+"</td>";
                                 }else if(item.insuredPersonLabel=="5"){
                                     trStr += "<td>"+ "第一被保险人"+"</td>";
                                 }else if(item.insuredPersonLabel=="6"){
                                     trStr += "<td>"+ "第二被保险人"+"</td>";
                                 }else if(item.insuredPersonLabel=="7"){
                                     trStr += "<td>"+ "第三被保险人"+"</td>";
                                 }else if(item.insuredPersonLabel=="8"){
                                     trStr += "<td>"+ "第四被保险人"+"</td>";
                                 }else if(item.insuredPersonLabel=="9"){
                                     trStr += "<td>"+ "第五被保险人"+"</td>";
                                 }else if(item.insuredPersonLabel=="10"){
                                     trStr += "<td>"+ "投保人"+"</td>";
                                 }else if(item.insuredPersonLabel=="11"){
                                     trStr += "<td>"+ "受益人"+"</td>";
                                 }else if(item.insuredPersonLabel=="12"){
                                     trStr += "<td>"+ "附属被保险人"+"</td>";
                                 }
                                 if(item.deductible==null){
                                     item.deductible ="";
                                 }
                                 if(item.waitPeriod==null){
                                     item.waitPeriod ="";
                                 }
                                 if(item.exemption==null){
                                     item.exemption ="";
                                 }
                                 if(item.insureKey==null){
                                     item.insureKey ="";
                                 }
                                 if(item.insureValue==null){
                                     item.insureValue ="";
                                 }
                                 trStr += "<td>"+item.deductible+"</td>";
                                 trStr += "<td>"+item.waitPeriod+"</td>";
                                 trStr += "<td>"+item.exemption+"</td>";
                                 trStr += "<td style='display: none;'>"+item.insureKey+"</td>";
                                 trStr += "<td>"+item.insureValue+"</td>";
                                 trStr +="<td>"+item.liabNote+"</td>"
                                 trStr+="</tr>"
                             }
                             $("#liabTableTr").append(trStr);
                         }else{
                             errorPop("该险种下没有任何责任，不能添加，请返回选择其他的险种");
                         }
                     } else {

                     }
                 }
             });
            $(".policyItemAll").addClass("hidden");
            $(".policyItemDetail").removeClass("hidden");
            $(".addPolicyItemTitle").text("添加责任");
        });
        $("#saveLiab").on("click",function(){
            var mainCustId = custController.defaultParam.seeDetailRow.mainCustId;
            var policyId = createPolicyController.defaultParam.savePolicyReturnId;
            var productNo = $("#productSel").val();
            var inputChecks =$("#liabTableTr tr td").find("input:checked")

            var liabIdList=[];
            for(var i = 0 ;i < inputChecks.length;i++){
                var $input = inputChecks.eq(i);
                liabIdList.push($input.attr("data-id"));
            }
            var mainPrd = $("#productForm").find("select[name=mainPrd]").val();
            //var insuredPersonLabel1 =  $("#productForm").find("[name=insuredPersonLabel1]").val();
            var preParam = [];
            var properties = createPolicyController.defaultParam.saveLiabParamStr;
            $.each(properties,function(i,value){
                var itemPro = value;
                var $productForm = $("#productForm");
                var itemObj = $productForm.find("[name="+value+"]").val();
                if(!(itemPro=="productNo" || itemPro=="insuredMsgList")){
                    var itemPreParam = {
                        name:itemPro,
                        value:itemObj
                    }
                    preParam.push(itemPreParam);
                }
            });
           var readyParam = {};
            $.each(preParam,function(j,value){
                readyParam[value.name] = value.value;
            });
            var saveNextLiabInusres = createPolicyController.defaultParam.saveNextLiabInusres;
            var insuredMsgList  = [];
            $.each(saveNextLiabInusres,function(i,value){
                var name = value;
                var insuredPersonLabelKey  = name.replaceAll("insuredPersonLabel","");
                var itemLiabInsuser = {
                    "insuredId":'',
                    "insuredPerson": '',
                    "insuredPersonLabel": ''
                }
                itemLiabInsuser.insuredId = $("#"+name).val();
                itemLiabInsuser.insuredPerson = insuredPersonLabelKey;
                itemLiabInsuser.insuredPersonLabel = insuredPersonLabelKey;
                insuredMsgList.push(itemLiabInsuser);
            });

            readyParam["productNo"] = productNo;
            readyParam["liabIdList"] = liabIdList;
            readyParam["mainCustId"] = mainCustId;
            //TODOBUSS: 修改内容
            readyParam["policyId"] = policyId;
            readyParam["insuredMsgList"] = insuredMsgList;
            $.ajax({
                 url:baseUrl+"/product",
                 type:'POST',
                 contentType: 'application/json;charset=utf-8',
                 data:JSON.stringify(readyParam),
                 dataType: "json",
                 success:function(result){
                     if (result.state == 1) {
                        console.log(result.data);
                        $("#addPolicyItemModal").modal("hide");
                         $("#preViewProductDetail").load(baseUrl+"/preViewDetail?id="+createPolicyController.defaultParam.savePolicyReturnId);
                     } else {
                        errorPop(result.msg);
                     }
                 }
             });
            console.log(readyParam);
        });
    },
    showPolicyDetail:function(id){
        $("#addPolicyForm").hide();
        $("#policyMainDetail").load(baseUrl+"/queryPoliyMain?id="+id);
    }
}
//TODOBUSS: policyDetailController
var policyDetailController = {
    "controllerAs" : 'createPolicyController ',
    defaultParam: {
        addCustomModalSelect:['policy_status','pay_mode','currency'],
        changeMainCustId:'',
        changeCustId:'',
        seeDetailRow:{},
        savePolicyReturnId:'',
        nextPolicyDeatil:'',
        editCanChooseListProductNo:''

    },
    getPolicyObj:function(formId){
        var $formId = $("#"+formId);
        return {
            $companyName :$formId.find("select[name=companyName]"),
            $insureNum   :$formId.find("input[name=insureNum]"),
            $validDate   :$formId.find("input[name=validDate]"),
            $insureper   :$formId.find("select[name=insureper]"),
            $policystatues :$formId.find("select[name=policystatues]"),
            $payMode :$formId.find("select[name=payMode]"),
            $currency :$formId.find("select[name=currency]"),
        }
    },
    init:function(){
        $("#policyDetailTurnBack").on("click",function(){
            $(".right_col").load(baseUrl + "/policy?mainCustId="+custController.defaultParam.seeDetailRow.mainCustId);
        });
        $('#companySelp').selectpicker();
        commonController.initAllCompanyOption("companySelp","ins_company_name");
        //TODOBUSS saveCanChooseBtn 保存可选责任列表
        $("#saveCanChooseBtn").on("click",function(){
            var $checkInput =  $("#canChooseTable td input:checked");
            var policyId = $("#policyId").val();
            var idsArr = [];
            var productId = $(this).attr("data-id");
            for(var i = 0 ;i < $checkInput.length;i++){
                var ItemCheck = $checkInput.eq(i);
                idsArr.push( ItemCheck.attr("data-id") );
            }
             $.ajax({
                 url:baseUrl+"/liab/canChoose/list/"+policyDetailController.defaultParam.editCanChooseListProductNo ,
                 type:'PATCH',
                 contentType: 'application/json;charset=utf-8',
                 dataType: "json",
                 data:JSON.stringify(idsArr),
                 success:function(result){
                     if (result.state == 1) {
                        successPop(result.msg);
                         $("#preViewProductDetail").load(baseUrl+"/preViewDetail?id="+policyId,function(){
                             $("#preViewProductDetail").load(baseUrl+"/preViewDetail?id="+policyId);
                         });
                         $("#canChooseModal").modal("hide");
                     } else {
                        errorPop(result.msg);
                     }
                 }
             });
        });
        //TODOBUSS delInsur 险种删除
        //表单校验
        $("#editPolicyMain").bootstrapValidator({
            message:"输入错误",
            fields : {
                companyName : {
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insureNum : {
                    message : '输入错误',
                    validators : {
                        stringLength : {
                            min : 2,
                            max : 11,
                            message : '只能输入2到11个字符'
                        },
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                validDate : {
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insureper : {
                    message : '输入错误',
                    validators : {
                        selectInput:{
                            message:'请选择内容'
                        }
                    }
                },
                policystatues : {
                    message : '输入错误',
                    validators : {
                        selectInput:{
                            message:'请选择内容'
                        }
                    }
                },
                payMode : {
                    message : '输入错误',
                    validators : {
                        selectInput:{
                            message:'请选择内容'
                        }
                    }
                },
                currency : {
                    message : '输入错误',
                    validators : {
                        selectInput:{
                            message:'请选择内容'
                        }
                    }
                }
            }
        });
        //显示保单基本信息
        $("#policyMain").load(baseUrl+"/queryPoliyMain?id="+policyDetailController.defaultParam.nextPolicyDeatil);
        //初始化日期组件
        commonController.initDateInput(["validDate"]);

        //编辑保单详情
        $("#editPolicyBtn").on("click",function(){
            commonController.initFamilySelOption("insureper");
            commonController.initModalSelect(policyDetailController.defaultParam.addCustomModalSelect,"editPolicyMain");
            $("#companySelp").val(policyDetailController.defaultParam.nextPolicyDeatil);
            var details = $("#policyViewMessage > div:gt(0) > div:nth-last-child(1)");
            var results = $("#editPolicyMain > .row > div:gt(0) > div > div");
            for(i=0;i<=$(details).length;i++){
                if($(details).eq(i).attr("data-bind-key")!=null &&$(details).eq(i).attr("data-bind-key")!=""){
                    $(results).eq(i).children("select").val($(details).eq(i).attr("data-bind-key"));
                }else{
                    $(results).eq(i).children("input").val($(details).eq(i).text());
                }
            }
            var applicanId = $("#applicantId").val();
            var insCompanyCode = $("#insCompanyCode").val();
            $("#insureper").val(applicanId);
            $('#companySelp').selectpicker('val',insCompanyCode);
            $("#editPolicyModel").modal("show");
        });
        //保存保单更改
        $("#savepolicychange").on("click",function () {
            var bootstrapValidator = $("#editPolicyMain").data('bootstrapValidator');
            bootstrapValidator.validate();
            if (!bootstrapValidator.isValid()) {
                return;
            }
            var policyId = $("#policyId").val();
            var insCompanyCode = $("#insCompanyCode").val();
            var $editPolicyMain = policyDetailController.getPolicyObj("editPolicyMain");
            var preParam = {
                id:policyId,
                insCompanyCode:insCompanyCode,
                mainCustId:custController.defaultParam.seeDetailRow.mainCustId,
                policyNo:$editPolicyMain.$insureNum.val(),
                policyEffectDate:$editPolicyMain.$validDate.val(),
                applicantId:$editPolicyMain.$insureper.val(),
                payMode:$editPolicyMain.$payMode.val(),
                currency:$editPolicyMain.$currency.val(),
                policyStatus:$editPolicyMain.$policystatues.val()
            };
            console.log(preParam);
            var param = commonController.filterObjNullOrEmtpy(preParam);
            $.ajax({
                url:baseUrl+"/policy",
                type:'patch',
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify(preParam),
                dataType : "json",
                success:function(result){
                    if (result.state == 1) {
                        successPop(result.msg);
                        $("#policyMain").load(baseUrl+"/queryPoliyMain?id="+policyId);
                        $("#editPolicyModel").modal("hide");
                    } else {
                        errorPop(result.msg);
                    }
                }
            });
        })
    }
}
var commonLiabController = {
    "controllerAs" : 'commonLiabController ',
    defaultParam: {
        addCustomModalSelect:['policy_status','pay_mode','currency'],
        changeMainCustId:'',
        changeCustId:'',
        seeDetailRow:{},
        savePolicyReturnId:'',
        nextPolicyDeatil:'',
        savePolicyId:'',
        saveInsCompanyCode:'',
        saveLiabParamStr:'',
        saveNextLiabInusres:[]
    },
    init:function(){
        commonController.initFamilySelOption(['insuredPersonLabel1','insuredPersonLabel2','insuredPersonLabel3'
            ,'insuredPersonLabel4','insuredPersonLabel5','insuredPersonLabel6','insuredPersonLabel7'
            ,'insuredPersonLabel8','insuredPersonLabel9','insuredPersonLabel10','insuredPersonLabel11','insuredPersonLabel12'
            ,'insuredMsgListSel']);
        var obj = {
            message : '输入错误',
            fields : {
                insuredPersonLabel1:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel2:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel3:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel4:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel5:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel6:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel7:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel8:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel9:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel10:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel11:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredPersonLabel12:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                insuredMsgListSel:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                mainPrd:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                basicAmnt:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                prem:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                payYearsFlag:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                payYears:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isinteger:{
                            message:'只能输入整数'
                        }
                    }
                },
                insNum:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isinteger:{
                            message:'只能输入整数'
                        }
                    }
                },
                coverYearsFlag:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                coverYears:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isinteger:{
                            message:'只能输入整数'
                        }
                    }
                },
                cashValue:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                lastCashValue:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                annStartAge:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        }
                    }
                },
                annPeriodFlag:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isinteger:{
                            message:'只能输入整数'
                        }
                    }
                },
                annPeriod:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isinteger:{
                            message:'只能输入整数'
                        }
                    }
                },
                accountValue:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                accumDiv:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                creditRate:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq1:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq2:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq3:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq4:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq5:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq6:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq7:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq8:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLq9:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLqs60:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLqs70:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLqs80:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLqs90:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                },
                policyLqs100:{
                    message : '输入错误',
                    validators : {
                        notEmpty : {
                            message : '该项不能为空'
                        },
                        isDouble:{
                            message:'只能输入数字或小数'
                        }
                    }
                }
            }
        }
        //保单详情添加险种
        $("#policyDetailAddLiabBtn").on("click",function(){
            //重置弹出页面
            $("#inpolicyDetailAddLiabModal .policyItemAll").show();
            $("#inpolicyDetailAddLiabModal .policyItemAll").removeClass("hidden");
            $("#inpolicyDetailAddLiabModal .policyItemDetail").hide();
            $("#inpolicyDetailAddLiabModal #nextBtn").text("下一步");

            var applicantId = $("#applicantId").val();
            var insCompanyCode = $("#insCompanyCode").val();
            var policyId = $("#policyId").val();
            $("#saveLiab").hide();
            commonLiabController.defaultParam.savePolicyId = policyId;
            commonLiabController.defaultParam.saveInsCompanyCode = insCompanyCode;
            $.ajax({
                url:baseUrl+"/product/canChoose/list/"+commonLiabController.defaultParam.saveInsCompanyCode,
                type:'GET',
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success:function(result){
                    if (result.state == 1) {
                        if(result.data==null ){
                            errorPop("还没有录入该公司的产品，暂不能添加险种！")
                            return;
                        }
                        var resultData = result.data;
                        var tempStr = "";
                        $.each(resultData,function(){
                            var itemCompany = this;
                            tempStr+="<option value=\""+itemCompany.productNo+"\">"+itemCompany.productName+"</option>";
                        });
                        $('#productSel').empty();
                        $('#productSel').append(tempStr);
                        $('#productSel').selectpicker('render');
                        $('#productSel').selectpicker('refresh');
                        $("#inpolicyDetailAddLiabModal").modal("show");
                    } else {

                    }
                }
            });
        });
        $('#productSel').on('hidden.bs.select', function (e,b,c) {
            var productNo =  $('#productSel').val();
            var policyId = commonLiabController.defaultParam.savePolicyId ;
            $.ajax({
                url:baseUrl+"/product/canInput/"+policyId+"/"+productNo+"",
                type:'GET',
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success:function(result){
                    if (result.state == 1) {
                        if(result.data == null){
                            errorPop("未录入该公司的产品");
                            return ;
                        }
                        commonLiabController.defaultParam.saveNextLiabInusres = [];
                        commonLiabController.defaultParam.saveLiabParamStr = '';
                        var propertiesArr = commonController.getPropetryNames(result.data);
                        $(".inputhidden").hide();
                        var preShowInput = "";
                        $.each(propertiesArr,function () {
                            var  itemName = commonController.joinProp(this);
                            preShowInput += itemName + ";";
                        });
                        commonLiabController.defaultParam.saveLiabParamStr=Object.getOwnPropertyNames(result.data);
                        //控制表单的显示与隐藏
                        var AliiInputArr = $(".policyItemForm ").find("[data-input-name]");
                        $.each(AliiInputArr,function () {
                            var itemIpnut = $(this);
                            var name = itemIpnut.attr("data-input-name");
                            if(preShowInput.indexOf(name)!=-1){
                                itemIpnut.show();
                            }
                        });
                        //处理被保险人个数操作
                        var insuredMsgList = result.data.insuredMsgList;

                        $.each(insuredMsgList,function(){
                            var insuredObj = this;
                            var insuredPersonLabel = insuredObj.insuredPersonLabel;
                            $(".policyItemForm ").find("[data-input-name=insuredPersonLabel"+insuredPersonLabel+"]").show();
                            //将被保险人的相关必填项添加到对应的数组中
                            var tempInsurePersonLabelInput = "insuredPersonLabel"+insuredPersonLabel;
                            commonLiabController.defaultParam.saveNextLiabInusres.push(tempInsurePersonLabelInput);
                            propertiesArr.push(tempInsurePersonLabelInput);
                        });
                        //处理表单数据库中的校验
                        var readyValudator = {};
                        $.each(propertiesArr,function(){
                            var item = this;
                            readyValudator[item]  = obj.fields[item];
                        });
                        $("#productForm").bootstrapValidator(obj);

                    } else {
                        errorPop(result.msg)
                    }
                }
            });
        });
        $("#turnBack2Change").on("click",function(){
            $(".policyItemAll").removeClass("hidden");
            $(".policyItemDetail").addClass("hidden");
            $("#turnBackDiv").addClass("hidden");
            $(".addPolicyItemTitle").text("添加险种");
            $("#nextBtn").text("下一步");
            $("#nextBtn").show();
            $("#saveLiab").hide();
        });
        //保单详情，添加险种，下一步
        $("#nextBtn").on("click",function(){
            var bootstrapValidator = $("#productForm").data('bootstrapValidator');
            bootstrapValidator.validate();
            if (!bootstrapValidator.isValid()) {
                return;
            }
            console.log("校验通过！");
            var productNo =  $("#productSel").val();
            $("#turnBackDiv").removeClass("hidden");
            $("#nextBtn").hide();
            $(".policyItemDetail").show();
            $("#saveLiab").show();
            var insurerArr = [];
            $.each(commonLiabController.defaultParam.saveNextLiabInusres,function(index,value){
                var itemInsureInputStr = value;
                var itemInsureInputObj = $("#"+value);
                var insurer = {
                    name:itemInsureInputStr,
                    labelName:'',
                    insureInpuKey:itemInsureInputObj.val(),
                    insureInputValue:itemInsureInputObj.find("option[value="+itemInsureInputObj.val()+"]").text()
                };
                insurerArr.push(insurer);
            })
            $.ajax({
                url:baseUrl+"/liab/need/list/"+productNo,
                type:'get',
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success:function(result){
                    if (result.state == 1) {
                        var trStr = "<tr>";
                        $.each(result.data,function(){
                            var itemLiab = this;
                            var insuredPersonLabel = itemLiab.insuredPersonLabel;
                            for(var i = 0 ;i < insurerArr.length;i++){
                                var itemInsure = insurerArr[i];
                                if(itemInsure.name == "insuredPersonLabel"+insuredPersonLabel){
                                    itemLiab.insureKey = itemInsure.insureInpuKey;
                                    itemLiab.insureValue = itemInsure.insureInputValue;
                                }
                            }
                        });
                        var trStr = "";
                        $("#liabTableTr").html("").append(trStr);
                        if(result.data!=null){
                            for(var i = 0 ;i< result.data.length;i++){
                                var item = result.data[i];
                                trStr += "<tr><td>"+(i+1)+"</td>";
                                if(item.liabType==1 || item.liabType=='1'){
                                    trStr +=  '<td><input type="checkbox" checked="checked" disabled="disabled" data-id="'+item.id+'"/></td>';
                                }else{
                                    trStr += '<td><input type="checkbox" data-id="'+item.id+'"/></td>';
                                }
                                trStr += "<td>"+item.liabLabel+"</td>";
                                if(item.insuredPersonLabel=="1"){
                                    trStr += "<td>"+ "被保险人"+"</td>";
                                }else if(item.insuredPersonLabel=="2"){
                                    trStr += "<td>"+ "主被保险人"+"</td>";
                                }else if(item.insuredPersonLabel=="3"){
                                    trStr += "<td>"+ "连带被保险人"+"</td>";
                                }else if(item.insuredPersonLabel=="4"){
                                    trStr += "<td>"+ "附带被保险人"+"</td>";
                                }else if(item.insuredPersonLabel=="5"){
                                    trStr += "<td>"+ "第一被保险人"+"</td>";
                                }else if(item.insuredPersonLabel=="6"){
                                    trStr += "<td>"+ "第二被保险人"+"</td>";
                                }else if(item.insuredPersonLabel=="7"){
                                    trStr += "<td>"+ "第三被保险人"+"</td>";
                                }else if(item.insuredPersonLabel=="8"){
                                    trStr += "<td>"+ "第四被保险人"+"</td>";
                                }else if(item.insuredPersonLabel=="9"){
                                    trStr += "<td>"+ "第五被保险人"+"</td>";
                                }else if(item.insuredPersonLabel=="10"){
                                    trStr += "<td>"+ "投保人"+"</td>";
                                }else if(item.insuredPersonLabel=="11"){
                                    trStr += "<td>"+ "受益人"+"</td>";
                                }else if(item.insuredPersonLabel=="12"){
                                    trStr += "<td>"+ "附属被保险人"+"</td>";
                                }
                                if(item.deductible==null){
                                    item.deductible ="";
                                }
                                if(item.waitPeriod==null){
                                    item.waitPeriod ="";
                                }
                                if(item.exemption==null){
                                    item.exemption ="";
                                }
                                if(item.insureKey==null){
                                    item.insureKey ="";
                                }
                                if(item.insureValue==null){
                                    item.insureValue ="";
                                }
                                trStr += "<td>"+item.deductible+"</td>";
                                trStr += "<td>"+item.waitPeriod+"</td>";
                                trStr += "<td>"+item.exemption+"</td>";
                                trStr += "<td style='display: none;'>"+item.insureKey+"</td>";
                                trStr += "<td>"+item.insureValue+"</td>";
                                trStr +="<td>"+item.liabNote+"</td>"
                                trStr+="</tr>"
                            }
                            $("#liabTableTr").append(trStr);
                        }else{
                            errorPop("该险种下没有任何责任，不能添加，请返回选择其他的险种");
                        }
                    } else {

                    }
                }
            });
            $(".policyItemAll").addClass("hidden");
            $(".policyItemDetail").removeClass("hidden");
            $(".addPolicyItemTitle").text("添加责任");
            $("#nextBtn").text("保存");
        });
        $("#saveLiab").on("click",function(){
            var mainCustId = custController.defaultParam.seeDetailRow.mainCustId;
            var policyId = commonLiabController.defaultParam.savePolicyId;
            var productNo = $("#productSel").val();
            var inputChecks =$("#liabTableTr tr td").find("input:checked")

            var liabIdList=[];
            for(var i = 0 ;i < inputChecks.length;i++){
                var $input = inputChecks.eq(i);
                liabIdList.push($input.attr("data-id"));
            }
            var mainPrd = $("#productForm").find("select[name=mainPrd]").val();
            //var insuredPersonLabel1 =  $("#productForm").find("[name=insuredPersonLabel1]").val();
            var preParam = [];
            var properties = commonLiabController.defaultParam.saveLiabParamStr;
            $.each(properties,function(i,value){
                var itemPro = value;
                var $productForm = $("#productForm");
                var itemObj = $productForm.find("[name="+value+"]").val();
                if(!(itemPro=="productNo" || itemPro=="insuredMsgList")){
                    var itemPreParam = {
                        name:itemPro,
                        value:itemObj
                    }
                    preParam.push(itemPreParam);
                }
            });
            var readyParam = {};
            $.each(preParam,function(j,value){
                readyParam[value.name] = value.value;
            });
            var saveNextLiabInusres = commonLiabController.defaultParam.saveNextLiabInusres;
            var insuredMsgList  = [];
            $.each(saveNextLiabInusres,function(i,value){
                var name = value;
                var insuredPersonLabelKey  = name.replaceAll("insuredPersonLabel","");
                var itemLiabInsuser = {
                    "insuredId":'',
                    "insuredPerson": '',
                    "insuredPersonLabel": ''
                }
                itemLiabInsuser.insuredId = $("#"+name).val();
                itemLiabInsuser.insuredPerson = insuredPersonLabelKey;
                itemLiabInsuser.insuredPersonLabel = insuredPersonLabelKey;
                insuredMsgList.push(itemLiabInsuser);
            });

            readyParam["productNo"] = productNo;
            readyParam["liabIdList"] = liabIdList;
            readyParam["mainCustId"] = mainCustId;
            //TODOBUSS: 修改内容
            readyParam["policyId"] = policyId;
            readyParam["insuredMsgList"] = insuredMsgList;
            $.ajax({
                url:baseUrl+"/product",
                type:'POST',
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify(readyParam),
                dataType: "json",
                success:function(result){
                    if (result.state == 1) {
                        console.log(result.data);
                        $("#inpolicyDetailAddLiabModal").modal("hide");
                        $("#preViewProductDetail").load(baseUrl+"/preViewDetail?id="+commonLiabController.defaultParam.savePolicyId,function(){
                            $("#preViewProductDetail").load(baseUrl+"/preViewDetail?id="+policyDetailController.defaultParam.nextPolicyDeatil);
                        });
                    } else {
                        errorPop(result.msg);
                    }
                }
            });
            console.log(readyParam);
        });

    }
};
var preViewController = {
    defaultParam:{
        saveLiabParamStr:'',
        saveNextLiabInusres:[],
        addCustomModalSelect:['policy_status','pay_mode','currency'],
        preEditProductId:''

    },
    init:function(){
        //TODOBUSS responEdit 可选责任列表点击
        $(".responEdit").on("click",function(){
            var productNo = $(this).attr("data-id");
            policyDetailController.defaultParam.editCanChooseListProductNo = productNo
            console.log(productNo);
            $("#canChooseTable").bootstrapTable({
                url: baseUrl + "/liab/canChoose/list/"+productNo,		 //请求后台的URL（*）
                method: 'GET',					  //请求方式（*）
                striped: true,					  //是否显示行间隔色
                cache: false,					   //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true,
                dataType: "json",
                singleSelect: false,
                pageSize: 10,
                pageList: [10, 25, 50, 100],
                showRefresh: true,
                showToggle: true,
                showPaginationSwitch: true,
                smartDisplay: true,
                checkboxHeader: true,
                columns: [{
                    title: '序号',
                    field: 'id',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    title: '是否选择',
                    field: 'isChoose',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        if(value==1 || value=='1'){
                            return  '<input type="checkbox" checked="checked" data-product-id='+productNo+' data-id="'+row.id+'"/>';
                        }else{
                            return  '<input type="checkbox"  data-product-id='+productNo+'  data-id="'+row.id+'"/>';
                        }
                    }
                }, {
                    title: '责任名称',
                    field: 'liabLabel',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '责任类型',
                    field: 'liabType',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        if(value==1 || value=='1'){
                            return  '基本';
                        }else{
                            return  '可选';
                        }
                    }
                }, {
                    title: '备注',
                    field:'liabNote',
                    align: 'center',
                    valign: 'middle'
                }]
            });
            $("#canChooseTable").bootstrapTable('refresh',{})
            $("#canChooseModal").modal("show");
        });
        $(".delInsur").on("click",function(){
            var productNo = $(this).attr("data-id");
            $.ajax({
                url:baseUrl + "/product/"+productNo,
                type:'DELETE',
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success:function(result){
                    if (result.state == 1) {
                        successPop("删除成功");
                        $(".right_col").load(baseUrl+"/policyDetail?id="+policyDetailController.defaultParam.nextPolicyDeatil,function(){
                            $("#preViewProductDetail").load(baseUrl+"/preViewDetail?id="+policyDetailController.defaultParam.nextPolicyDeatil);

                        });
                    } else {
                        errorPop(result.msg);
                    }
                }
            });
        });
        $(".editInsur").on("click",function(){
            var insCompanyCode = $("#insCompanyCode").val();
            var productNo = $(this).attr("data-productNo-id");
            var productId = $(this).attr("data-id");
            preViewController.defaultParam.preEditProductId = productId;
            $.ajax({
                url:baseUrl+"/product/canChoose/list/"+insCompanyCode,
                type:'GET',
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success:function(result){
                    if (result.state == 1) {
                        if(result.data==null ){
                            errorPop("还没有录入该公司的产品，暂不能添加险种！")
                            return;
                        }
                        var resultData = result.data;
                        //清空原有选择
                        $('#editProductSel').append("");
                        var tempStr = "";
                        $.each(resultData,function(){
                            var itemCompany = this;
                            tempStr+="<option value=\""+itemCompany.productNo+"\">"+itemCompany.productName+"</option>";
                        });
                        $('#editProductSel').empty();
                        $('#editProductSel').append(tempStr);
                        $('#editProductSel').selectpicker('render');
                        $('#editProductSel').selectpicker('refresh');
                        //获取用户的家庭成员，进行初始化家庭成员列表
                        commonController.initFamilySelOption(['editInsuredPersonLabel1','editInsuredPersonLabel2','editInsuredPersonLabel3'
                            ,'editInsuredPersonLabel4','editInsuredPersonLabel5','editInsuredPersonLabel6','editInsuredPersonLabel7'
                            ,'editInsuredPersonLabel8','editInsuredPersonLabel9','editInsuredPersonLabel10','editInsuredPersonLabel11','editInsuredPersonLabel12'
                            ,'editInsuredMsgListSel']);
                        commonController.initModalSelect(preViewController.defaultParam.addCustomModalSelect,"editDetailAddLiabModal");

                        var obj = {
                            message : '输入错误',
                            fields : {
                                insuredPersonLabel1:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                insuredPersonLabel2:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                insuredPersonLabel3:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                insuredPersonLabel4:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                insuredPersonLabel5:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                insuredPersonLabel6:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                insuredPersonLabel7:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                insuredPersonLabel8:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                insuredPersonLabel9:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                insuredPersonLabel10:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                insuredPersonLabel11:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                insuredPersonLabel12:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                insuredMsgListSel:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                mainPrd:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                basicAmnt:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                prem:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                payYearsFlag:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                payYears:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isinteger:{
                                            message:'只能输入整数'
                                        }
                                    }
                                },
                                insNum:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isinteger:{
                                            message:'只能输入整数'
                                        }
                                    }
                                },
                                coverYearsFlag:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                coverYears:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isinteger:{
                                            message:'只能输入整数'
                                        }
                                    }
                                },
                                cashValue:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                lastCashValue:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                annStartAge:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        }
                                    }
                                },
                                annPeriodFlag:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isinteger:{
                                            message:'只能输入整数'
                                        }
                                    }
                                },
                                annPeriod:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isinteger:{
                                            message:'只能输入整数'
                                        }
                                    }
                                },
                                accountValue:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                accumDiv:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                creditRate:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLq1:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLq2:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLq3:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLq4:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLq5:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLq6:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLq7:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLq8:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLq9:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLqs60:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLqs70:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLqs80:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLqs90:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                },
                                policyLqs100:{
                                    message : '输入错误',
                                    validators : {
                                        notEmpty : {
                                            message : '该项不能为空'
                                        },
                                        isDouble:{
                                            message:'只能输入数字或小数'
                                        }
                                    }
                                }
                            }
                        }

                        //回显数据
                        $.ajax({
                            url:baseUrl+"/product/"+productId,
                            type:'GET',
                            contentType: 'application/json;charset=utf-8',
                            dataType: "json",
                            success:function(result){
                                if (result.state == 1) {
                                    console.log(result.data);
                                    var dbData = result.data;
                                    $('#editProductSel').selectpicker('val',productNo);
                                    $("#editDetailAddLiabModal").modal("show");


                                    //查询可输入项目
                                    $.ajax({
                                        url:baseUrl+"/product/canEdit/"+productId,
                                        type:'GET',
                                        contentType: 'application/json;charset=utf-8',
                                        dataType: "json",
                                        success:function(result){
                                            if (result.state == 1) {
                                                var canEditObj = result.data;
                                                if(result.data == null){
                                                    errorPop("未录入该公司的产品");
                                                    return ;
                                                }
                                                var propertiesArr = commonController.getPropetryNames(result.data);
                                                $(".inputhidden").hide();
                                                var preShowInput = "";
                                                $.each(propertiesArr,function () {
                                                    var  itemName = commonController.joinProp(this);
                                                    preShowInput += itemName + ";";
                                                });
                                                preViewController.defaultParam.saveLiabParamStr=Object.getOwnPropertyNames(result.data);
                                                //控制表单的显示与隐藏
                                                var AliiInputArr = $(".policyItemForm ").find("[data-input-name]");
                                                $.each(AliiInputArr,function () {
                                                    var itemIpnut = $(this);
                                                    var name = itemIpnut.attr("data-input-name");
                                                    if(preShowInput.indexOf(name)!=-1){
                                                        itemIpnut.show();
                                                    }
                                                });
                                                //处理被保险人个数操作
                                                var insuredMsgList = result.data.insuredMsgList;
                                                $.each(insuredMsgList,function(){
                                                    var insuredObj = this;
                                                    var insuredPersonLabel = insuredObj.insuredPersonLabel;
                                                    $(".policyItemForm ").find("[data-input-name=insuredPersonLabel"+insuredPersonLabel+"]").show();
                                                    //将被保险人的相关必填项添加到对应的数组中
                                                    var tempInsurePersonLabelInput = "insuredPersonLabel"+insuredPersonLabel;
                                                    preViewController.defaultParam.saveNextLiabInusres.push(tempInsurePersonLabelInput);
                                                    propertiesArr.push(tempInsurePersonLabelInput);
                                                });
                                                //处理表单数据库中的校验
                                                var readyValudator = {};
                                                $.each(propertiesArr,function(){
                                                    var item = this;
                                                    readyValudator[item]  = obj.fields[item];
                                                });
                                                console.log(readyValudator);
                                                $("#editProductForm").bootstrapValidator(obj);
                                                var selId = "coverYearsFlag;payYearsFlag;annPeriodFlag;insuredPersonLabel;";
                                                //将数据库中的值回显到表单中
                                                $.each(propertiesArr,function(j,value){
                                                    if(value=="coverYearsFlag" || value=="payYearsFlag" || value=="insuredPersonLabel"){
                                                        $(".policyItemForm ").find("select[name="+value+"]").val(dbData[value]);
                                                    }else if(value=="insuredMsgList"){
                                                        var insuredMsgLists = canEditObj["insuredMsgList"];
                                                        $.each(insuredMsgLists,function(k,value){
                                                           var id =  value["insuredPerson"];
                                                            $(".policyItemForm ").find("select[name=insuredPersonLabel"+id+"]").val(value.insuredId);
                                                        });

                                                    }else{
                                                        $(".policyItemForm ").find("input[name="+value+"]").val(dbData[value]);
                                                    }
                                                });
                                                $(".policyItemForm").find("select[name=mainPrd]").val(dbData["mainPrd"]);
                                            } else {
                                                errorPop(result.msg)
                                            }
                                        }
                                    });
                                } else {
                                    errorPop(result.msg);
                                }
                            }
                        });


                    } else {

                    }
                }
            });
        });
        //保存险种信息
        $("#editSaveLiab").on("click",function(){
            var mainCustId = $("#mainCustId").val();
            var productNo = $("#editProductSel").val();
            var productId = preViewController.defaultParam.preEditProductId ;
            var policyId = $("#policyId").val();
            var mainPrd = $("#editProductForm").find("select[name=mainPrd]").val();
            var preParam = [];
            var properties = preViewController.defaultParam.saveLiabParamStr;
            $.each(properties,function(i,value){
                var itemPro = value;
                var $productForm = $("#editProductForm");
                var itemObj = $productForm.find("[name="+value+"]").val();
                if(!(itemPro=="productNo" || itemPro=="insuredMsgList")){
                    var itemPreParam = {
                        name:itemPro,
                        value:itemObj
                    }
                    preParam.push(itemPreParam);
                }
            });
            var readyParam = {};
            $.each(preParam,function(j,value){
                readyParam[value.name] = value.value;
            });
            var saveNextLiabInusres = preViewController.defaultParam.saveNextLiabInusres;
            var insuredMsgList  = [];
            $.each(saveNextLiabInusres,function(i,value){
                var name = value;
                var insuredPersonLabelKey  = name.replaceAll("insuredPersonLabel","");
                var itemLiabInsuser = {
                    "insuredId":'',
                    "insuredPerson": '',
                    "insuredPersonLabel": ''
                }
                itemLiabInsuser.insuredId = $("#"+name).val();
                itemLiabInsuser.insuredPerson = insuredPersonLabelKey;
                itemLiabInsuser.insuredPersonLabel = insuredPersonLabelKey;
                insuredMsgList.push(itemLiabInsuser);
            });

            readyParam["productNo"] = productNo;
            readyParam["mainCustId"] = mainCustId;
            readyParam["policyId"] = policyId;
            readyParam["id"] = productId;
            readyParam["insuredMsgList"] = insuredMsgList;
            readyParam["mainPrd"] = mainPrd;
            $.ajax({
                url:baseUrl+"/product",
                type:'PATCH',
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify(readyParam),
                dataType: "json",
                success:function(result){
                    if (result.state == 1) {
                        console.log(result.data);
                        $("#editDetailAddLiabModal").modal("hide");
                        $("#preViewPanel").load(baseUrl+"/preViewDetail?id="+policyId);
                    } else {
                        errorPop(result.msg);
                    }
                }
            });
            console.log(readyParam);
        });
        $("#editTurnBack2Change").on("click",function(){
            $(".editPolicyItemAll").removeClass("hidden");
            $(".editPolicyItemDetail").addClass("hidden");
            $("#editTurnBackDiv").addClass("hidden");
            $(".editPolicyItemTitle").text("添加险种");
            $("#editNextBtn").text("下一步");
        });
    }
}
var policyViewController = {
    "controllerAs" : 'policyViewController ',
    defaultParam: {
        addCustomModalSelect:['policy_status','pay_mode','currency'],
        changeMainCustId:'',
        changeCustId:'',
        seeDetailRow:{},
        savePolicyReturnId:'',
        nextPolicyDeatil:''
    },
    init:function(){
        $("#viewPolicyDatail").on("click",function(){
            window.open(baseUrl+"/policyViewDetail?id="+custController.defaultParam.seeDetailRow.mainCustId+"?custId="+familyController.defaultParam.viewFamilyCustId);
        })
        policyViewController.initFirTab();
    },
    initFirTab:function () {
        var mainCustId = custController.defaultParam.seeDetailRow.mainCustId;
        var custId = familyController.defaultParam.viewFamilyCustId;
        
        
		
        //应缴费用
        $.ajax({
            url:baseUrl+"/view/applicant/prem/"+mainCustId+"/"+custId+"",
            type:'GET',
            contentType: 'application/json;charset=utf-8',
            dataType : "json",
            success:function(result){
                if (result.state == 1) {
                    //1、定义一个结构体
                    var items = {
                        name:'',
                        data:[]
                    }
                    var topItem = []
                    var itemMonth = {
                        value:'',
                        month:''
                    };
                    var dataArr = result.data;
                    $.each(dataArr,function (i,value) {
                        var itemObj = value;
                        var containValue = false;
                        if(topItem == null || topItem.length==0){
                            containValue = true;
                        }
                        for(var j = 0 ;j < topItem.length;j++){
                            var itemTop = topItem[j];
                            if(itemTop.name==itemObj.productName){
                                containValue = false;
                                continue;
                            }else{
                                containValue = true;
                            }
                        }
                       if(containValue){
                           var items = {
                               name:'',
                               data:[]
                           }
                           items.name = itemObj.productName;
                           topItem.push(items);
                       }
                        containValue = false;

                    });
                   console.log(topItem);
                    $.each(dataArr,function (k,value) {
                        var itemMonth = value;
                        var month = itemMonth.month;
                        var prem = itemMonth.prem;
                        var productName = itemMonth.productName;
                        $.each(topItem,function(m,value){
                            var topItem = value;
                            var topItemName = value.name
                            if(productName==topItemName){
                                var dataMonth = {
                                    value:'',
                                    month:''
                                };
                                dataMonth.month = month;
                                dataMonth.value = prem;
                                topItem.data.push(dataMonth)
                            }
                        });
                    });
                    console.log(topItem);
                    var str = "";
                    for(var i = 0 ; i< topItem.length;i++){
                        var itemCompany = topItem[i];
                        var name = itemCompany.name;
                        var data = itemCompany.data;
                        str += "<tr><td>"+name+"</td>";
                        for(var j = 1;j<=12 ;j++){
                            var checkFlag = false;
                            for(var k = 0 ;k < data.length;k++){
                                if(data[k].month==j || data[k].month ==j+''){
                                    checkFlag = true;
                                    str+= "<td>"+data[k].value+"</td>";
                                }
                            }
                            if(!checkFlag){
                                str += "<td></td>"
                            }
                        }
                        str+="</tr>";
                    }
                    $("#payDue > tbody").append(str);
                } else {
                    errorPop(result.msg);
                }
            }
        });
        //保单件数
        $.ajax({
            url:baseUrl+"/view/applicant/policyNum/"+mainCustId+"/"+custId+"",
            type:'GET',
            contentType: 'application/json;charset=utf-8',
            dataType : "json",
            success:function(result){
                if (result.state == 1) {
                    var dataArr = result.data;
                    for(var i=0;i<dataArr.length;i++){
                        if(dataArr[i].policy_status ==1){
                            $("#policyAmount > tbody > tr >td:eq(1)").text(dataArr[i].num)
                        }else if(dataArr[i].policy_status ==2){
                            $("#policyAmount > tbody > tr >td:eq(2)").text(dataArr[i].num)
                        }else if(dataArr[i].policy_status ==3){
                            $("#policyAmount > tbody > tr >td:eq(3)").text(dataArr[i].num)
                        } else if(dataArr[i].policy_status ==4){
                            $("#policyAmount > tbody > tr >td:eq(4)").text(dataArr[i].num)
                        } else if(dataArr[i].policy_status ==5){
                            $("#policyAmount > tbody > tr >td:eq(5)").text(dataArr[i].num)
                        }
                    }
                  console.log(dataArr)

                } else {
                    errorPop(result.msg);
                }
            }
        });
        //风险保障图表
        $.ajax({
            url:baseUrl+"/view/insured/rcs/"+mainCustId+"/"+custId+"/"+"?"+"age",
            type:'GET',
            contentType: 'application/json;charset=utf-8',
            dataType : "json",
            success:function(result){
                if (result.state == 1) {
                  var dataArr = result.data;
                    var secondDataArr=new Array();
                    var ageData = new Array();
                    var amountData =new Array() ;
                    var secondName = new Array();
                    var firstcategory = new Array();
                  if (dataArr != null && dataArr.length>0){
                      for(i=0;i<dataArr.length;i++) {
                          if (dataArr[i] != null && dataArr[i].secondLevelList != null) {
                              for(var j=0;j<result.data[i].secondLevelList.length;j++){
                                  secondDataArr.push(result.data[i].secondLevelList[j]);
                                  ageData[j]=secondDataArr[j].age;
                                  amountData[j]=secondDataArr[j].faceAmt;
                                  secondName[j]=secondDataArr[j].liabName;
                              }
                          }
                          if (dataArr[i] != null && dataArr[i].secondLevelName != null) {
                              firstcategory.push(dataArr[i].secondLevelName);
                          }
                          //表格
                          for(l=0;l<firstcategory.length;l++){
                              $("#risktable > tbody").append(	"<tr>"+ "<td rowspan='firstcategory.length+1'>"+firstcategory[l]+"</td></tr>");
                              for(var m=0;m<secondDataArr.length;m++){
                                  $("#risktable > tbody > tr").append("<td>"+secondName[m]+"</td> <td>"+amountData[m]+"元"+"</td>" );
                              }
                          }

                          //图表
                          var riskGuaranteeDOM = document.getElementById('RiskGuarantee');
                          var resizeWorldMapContainer = function () {
                              riskGuaranteeDOM.style.width = (window.innerWidth - 230) + 'px';
                              riskGuaranteeDOM.style.height = '400px';
                          };
                          resizeWorldMapContainer();
                          var RiskGuaranteeChart = echarts.init(riskGuaranteeDOM);

                          var option = {
                              tooltip: {},
                              legend: {
                                  data: ['疾病名称']
                              },
                              xAxis: {
                                  data: [secondName.join(",")]
                              },
                              yAxis: {},
                              series: [{
                                  name: '保额',
                                  type: 'bar',
                                  data: [amountData.join(",")]
                              }]
                          };
                          RiskGuaranteeChart.setOption(option);

                      }
                  }
                  else{
                      var riskGuaranteeDOM = document.getElementById('RiskGuarantee');
                      riskGuaranteeDOM.innerHTML="暂无数据";
                      $("#risktable").append("<tr>"+"<td>"+"暂无数据"+"</td>");
                  }

                } else {
                    errorPop(result.msg);
                }
            }
        });
        //年龄滑块
        $.ajax({
            url:baseUrl+"/view/applicant/range/"+mainCustId+"/"+custId+"/"+"RCS",
            type:'GET',
            contentType: 'application/json;charset=utf-8',
            dataType : "json",
            success:function(result){
                if (result.state == 1) {
                    var dataArr = result.data;
                    for(i=0;i<dataArr.length;i++){
                        if(dataArr[i]!=null && dataArr[i].min !=null){
                            var minage=dataArr[i].min;
                        }else{
                            var minage=0;
                        }
                        if(dataArr[i]!=null && dataArr[i].max !=null){
                            var maxage=dataArr[i].max;
                        }else{
                            var maxage=0;
                        }
                    }
                   $("#ex5").attr("data-slider-min",minage);$("#ex5").attr("data-slider-max",maxage);$("#ex5").slider();
                   $("#ex6").attr("data-slider-min",minage);$("#ex6").attr("data-slider-max",maxage);$("#ex6").slider();
                   $("#ex7").attr("data-slider-min",minage);$("#ex7").attr("data-slider-max",maxage);$("#ex7").slider();
                   $("#ex8").attr("data-slider-min",minage);$("#ex8").attr("data-slider-max",maxage);$("#ex8").slider();
                } else {
                    errorPop(result.msg);
                }
            }
        });
        //约定给付图表
        $.ajax({
            url:baseUrl+"/view/insured/apy/"+mainCustId+"/"+custId+"/"+"?"+"age",
            type:'GET',
            contentType: 'application/json;charset=utf-8',
            dataType : "json",
            success:function(result){
                if (result.state == 1) {
                    var dataArr = result.data;
                    var secondDataArr=new Array();
                    var ageData = new Array();
                    var amountData =new Array() ;
                    var secondName = new Array();
                    var firstcategory = new Array();
                    if (dataArr != null && dataArr.length>0){
                        for(i=0;i<dataArr.length;i++) {
                            if (dataArr[i] != null && dataArr[i].secondLevelList != null) {
                                for(var j=0;j<result.data[i].secondLevelList.length;j++){
                                    secondDataArr.push(result.data[i].secondLevelList[j]);
                                    ageData[j]=secondDataArr[j].age;
                                    amountData[j]=secondDataArr[j].faceAmt;
                                    secondName[j]=secondDataArr[j].liabName;
                                }
                            }
                            if (dataArr[i] != null && dataArr[i].secondLevelName != null) {
                                firstcategory.push(dataArr[i].secondLevelName);
                            }
                            //表格
                            for(l=0;l<firstcategory.length;l++){
                                $("#paymenttable > tbody").append(	"<tr>"+ "<td rowspan='firstcategory.length+1'>"+firstcategory[l]+"</td></tr>");
                                for(var m=0;m<secondDataArr.length;m++){
                                    $("#paymenttable > tbody > tr").append("<td>"+secondName[m]+"</td> <td>"+amountData[m]+"元"+"</td>" );
                                }
                            }

                            //图表
                            var transferPaymentDOM = document.getElementById('transferPayment');
                            var transferPaymentContainer = function () {
                                transferPaymentDOM.style.width = (window.innerWidth-300)+'px';
                                transferPaymentDOM.style.height = '400px';
                            };
                            transferPaymentContainer();
                            var transferPaymentChart = echarts.init(transferPaymentDOM);

                            var tranPayOption = {
                                tooltip: {},
                                legend: {
                                    data: ['约定给付内容']
                                },
                                xAxis: {
                                    data: [secondName.join(",")]
                                },
                                yAxis: {},
                                series: [{
                                    name: '金额',
                                    type: 'bar',
                                    data: [amountData.join(",")]
                                }]
                            };
                            transferPaymentChart.setOption(tranPayOption);

                        }
                    }
                    else{
                        var transferPayment = document.getElementById('transferPayment');
                        transferPayment.innerHTML="暂无数据";
                        $("#paymenttable").append("<tr>"+"<td>"+"暂无数据"+"</td>");
                    }

                } else {
                    errorPop(result.msg);
                }
            }
        });
        //切换TAB
        $(".insuredBtn").on("click",function(){
            $(".insured").removeClass("hidden");
            $(".policyHolder").addClass("hidden");
            $(".viewTab").removeClass("viewTabActive");
            $(this).addClass("viewTabActive");
        });
        $(".policyHolderBtn").on("click",function(){
            $(".insured").addClass("hidden");
            $(".policyHolder").removeClass("hidden");
            $(".viewTab").removeClass("viewTabActive");
            $(this).addClass("viewTabActive");
        });
        //切换图表和表格
        $(".insuredBtns").on("click",function(){
            var obj = $(".insuredTable");
            if(obj.hasClass("hidden")){
                obj.removeClass("hidden");
                $(".insuredChart").addClass("hidden");
            }else{
                obj.addClass("hidden");
                $(".insuredChart").removeClass("hidden");
            }
        });
        $(".changePayTableBtn").on("click",function(){
            var obj = $(".changePayTable");
            if(obj.hasClass("hidden")){
                obj.removeClass("hidden");
                $(".changePayChart").addClass("hidden");
            }else{
                obj.addClass("hidden");
                $(".changePayChart").removeClass("hidden");
            }
        });


        
    }
}
