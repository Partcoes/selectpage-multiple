define("multilevel",["jquery","bootstrap","backend","selectpage"],function($,botstrap,Backend) {

    var Multilevel = {

        params:{
            element:"",
            url:"",
            data:"",
            keyField:"id",
            showField: "name",
            maxNumber:3,
            pid:"",
            parentContainer: ""
        },

        init:function(defaultData){
            var keyField = this.params.keyField;
            var showField = this.params.showField;
            var maxNumber = this.params.maxNumber;
            var parentContainer = this.params.parentContainer;
            //获取父元素
            var parent = $(this.params.element).parent('.col-sm-8');
            //绑定复制操作的事件
            Multilevel.copyClick(parent);
            //多级selectpage选择
            // this.multipleSelect();
            //单级选择
            this.index(this.params.element,this.params.url,keyField,showField,defaultData,maxNumber,parentContainer);
        },
        index:function (elementId,url,keyField = "id",showField = "name",defaultData,maxNumber=3,parentContainer,pid = "") {
            parentContainer = (parentContainer == undefined)?".col-sm-8":parentContainer;
            //目前bug 传pid值有问题
            var elements = elementId.split("-");
            var divIndex
            var node;

            if(elements[2] == 0){
                node = prex + "0";
                divIndex = 0;
            }else{
                divIndex =(elements[2] - 1);
                node = prex + divIndex;
            }

            var prex = elements[0] + '-' + elements[1] + "-";
            //获取去除id的#号进行拼接id
            var filterId = prex.replace("#","");
            var parents = $(elementId).parent(parentContainer);
            if(defaultData !== "" && defaultData  !== undefined){
                $(elementId).remove();
                var defaultHtml = "";
                for(var i = 0;i<defaultData.length;i++) {
                    var value = 0;
                    if(i==0){
                        value = defaultData['country'];
                    }else if(i == 1){
                        value = defaultData['province'];
                    }else if(i == 2){
                        value = defaultData['city'];
                    }else if(i == 3){
                        value = defaultData['county'];
                    }
                    if(value == ""){
                        break;
                    }
                    var index = (i == 0)?'':'-' + i;
                    defaultHtml ="<input value='"+ value  +"'  id=\"" + filterId + i + "\" class=\"form-control\" name=\"row[" + elements[1] + index + "] \" number=\"" + (i+2) + "\" type=\"text\">";
                    parents.append(defaultHtml);
                    var newElementId = prex + i;
                    //计算现有的input框的宽度
                    var width = (100 - (i + 1)) / (i+1);
                    // console.log(newElementId);
                    //赋值给父级元素宽度
                    Multilevel.index(newElementId, url, keyField, showField,"",maxNumber,parentContainer);
                    $("#" + filterId + i).attr('is_create',1);
                    $("#" + filterId + i).attr('is_clear',1);
                    $(newElementId).parents(parentContainer).find(".sp_container").prop("style", "width:" + width + "%;display:inline-block;margin-left:1%");
                }
                return true ;
            }
            var parent = $(elementId).parents(parentContainer).find('.sp_container').eq(divIndex).find('input').eq(1).val();
            pid = (parent === "" || parent == undefined || pid != "")?0:parent;
            $(elementId).selectPage({
                data:url,
                params:function () {
                    return {"custom":{"pid":pid}};
                },
                keyField: keyField,
                showField: showField,
                eAjaxSuccess:function(data){
                    $.each(data.list,function (i,v) {
                        if(v.id == 3751){
                            delete data.list[i];
                        }
                    })
                    data.list = typeof data.rows !== 'undefined' ? data.rows : (typeof data.list !== 'undefined' ? data.list : []);
                    data.totalRow = typeof data.total !== 'undefined' ? data.total : (typeof data.totalRow !== 'undefined' ? data.totalRow : data.list.length);
                    return data;
                },
                eSelect:function (data,v) {
                    var number = $(elementId).parent('.sp_container').prev().find('input').eq(0).attr('number');
                    number = (number == undefined)?1:number;
                    var isClear = $(elementId).attr('is_clear');
                    var defaultPid = '-1';
                    if(number != 0){
                        var defaultPid = $(elementId).parent('.sp_container').prev().find('input').eq(1).val();
                        defaultPid = (defaultPid === undefined)?-1:defaultPid;
                    }
                    pid = (isClear == 1)?(defaultPid == "-1")?0:defaultPid:pid;
                    if (number <= maxNumber){
                        var isClear = $(elementId).attr("is_clear");
                        if(isClear == 1){
                            number = $(elementId).parent('.sp_container').prev().find('input').eq(0).attr('number');
                            number = (number == undefined)?1:number;
                        }
                        $(elementId).attr('is_clear',0)
                        var isCreate = $(elementId).attr('is_create');
                        if(isCreate != 1){
                            var idNum = (number == 0)?1:number;
                            //获取去除id的#号进行拼接id
                            var filterId = prex.replace("#","");
                            //拼接id
                            var html = "<input  id=\"" + filterId + idNum + "\" class=\"form-control\" name=\"row[" + elements[1] + "-" + number + "] \" number=\"" + idNum + "\" type=\"text\">";
                            //在父容器下面插入要selectpage实例化的input元素
                            parents.append(html);
                            //判断是不是已经创建不需要重复创建

                            //获取创建元素的ID
                            var newElementId = prex + idNum;
                            //创建结束后number+1
                            number = parseInt(number) + 1;
                            //赋值给文本属性 number值获取的时候判断
                            $(elementId + '_text').attr('number',number);
                            //实例化selectpage
                            Multilevel.index(newElementId, url, keyField, showField,"",maxNumber,parentContainer);
                            $(elementId).attr('is_create',1);
                            //计算现有的input框的宽度
                            var width = (100 - number - 1) / number;
                            //赋值给父级元素宽度
                            $(elementId).parents(parentContainer).find(".sp_container").prop("style", "width:" + width + "%;display:inline-block;margin-left:1%");
                        }

                    }
                    return false;
                },
                eClear:function (data) {
                    $(elementId).attr('is_create',0)
                    $(elementId).attr('is_clear',1)
                    $(elementId).attr('pid',0);
                    $(elementId).parents(parentContainer).attr('clear-node',elementId);
                    $(elementId).parent('.sp_container').nextAll().remove();
                    var number =$(elementId).parents(parentContainer).children('.sp_container').length;
                    var width = (100 - number - 1) / number;
                    width = (number == 1)?100:width;
                    $(elementId).parents(parentContainer).find(".sp_container").prop("style", "width:" + width + "%;display:inline-block;margin-left:1%");
                }

            });
        },
        multipleSelect:function (elementId = '#c-household_registration-0',url = 'area/index',keyField = "id",showField = "name",defaultData,pid = 0) {
            var parent = $(elementId).parent(parentContainer);
            $(elementId).selectPage({
                data:url,
                keyField:keyField,
                params:function () {
                    return {"custom":{"pid":pid}};
                },
                showField:showField,
                eAjaxSuccess:function (data) {
                    $.each(data.list,function (i,v) {
                        if(v.id == 3751){
                            delete data.list[i];
                        }
                    })
                    // console.log(data);
                    data.list = typeof data.rows !== 'undefined' ? data.rows : (typeof data.list !== 'undefined' ? data.list : []);
                    data.totalRow = typeof data.total !== 'undefined' ? data.total : (typeof data.totalRow !== 'undefined' ? data.totalRow : data.list.length);
                    return data;
                },
                eSelect:function (data) {
                    //获取已经初始化好的selectpage 父级元素
                    var selecpageLen = parent.find('.sp_container').length;
                    //获取元素前缀
                    var elements = elementId.split('-');
                    //拼接元素前缀
                    var prex = elements[0] + '-' +elements[1] +  '-';
                    //获取id属性标签
                    var idattr = prex.replace('#','');
                    //重新初始化整体selectpage
                    parent.html("");
                    for(var i = 0;i< selecpageLen;i++){
                        var html = '<input type="text" class="form-control" id="' + idattr + i + '" name="row[household_registration]">';
                        //初始化新的元素ID同elemenId
                        newElementId = prex + i;
                        //第一个Input放在顶级父级容器中
                        if(i == 0){
                            parent.append(html);
                        }else{
                            //其他input放在上一个input元素的父级元素后面,为了生成和上一个父级元素相同的元素
                            $(prex+ (i-1)).parent('.sp_container').after(html);
                        }
                        //该元素是否已经选择过了
                        var is_change = (elementId == newElementId)?1:0;
                        //并将已经选择了值的input的索引放在新初始化的input元素的is_change属性上
                        $(newElementId).attr('is_change',i);
                        //如果is_change 等于一 就采用上一级的data.id作为父级id否则就采用0
                        var parent_id = (is_change == 1)?data.id:0;
                        //重新初始化元素
                        Multilevel.multipleSelect(newElementId,url,keyField,showField,defaultData,parent_id);
                    }
                    //元素初始化完毕，在最后一个元素后面放置  增加input 元素的 按钮
                    var span = '<span class="fa fa-lg fa-copy" id="copy-click" title="点击复制多选" style="position: absolute;right: -3%;top: 10px;"></span>';
                    parent.append(span);
                    //重新计算父级元素的宽度
                    var width = (100 - selecpageLen) / selecpageLen;
                    parent.find(".sp_container").prop("style", "width:" + width + "%;display:inline-block;margin-left:1%");

                    //获取赋值的input框
                    var val = $('#household').val();
                    //获取已经选择的input的框的索引
                    var number = $(elementId).prev().attr('is_change');
                    //input为空时新建值
                    if(val == ""){
                        var tmp2 = [];
                        val = [];
                        tmp2.push(data.name);
                        val[number] = tmp2.join(',');
                    }else{
                        //已经存在值则使用|分割获取数组
                        val = val.split('|');
                        //将空值替换成undefined
                        $.each(val,function (i,v) {
                            if(v == ''){
                                delete val[i]
                            }
                        });
                        vals = [];
                        for(var i = 0;i<val.length;i++){
                            //如果索引对应的值不存在就新建该索引的值
                            if(val[number] == undefined){
                                var tmp = [];
                                tmp.push(data.name);
                                vals[number] = (tmp.join(','));
                                break;
                                //如果该索引对应的值存在就 用 , 号分割，并判断再次选中的值是否在已经存在的值中，存在则入栈新值
                            }else if(val[number] !== undefined){
                                var tmp1 = (val[number]).split(',');
                                // console.log("tmp1:" + tmp1.length);
                                if(tmp1.indexOf(data.name) == '-1'){
                                    tmp1.push(data.name);
                                }
                                vals[number] = tmp1.join(',');
                                break;
                            }
                        }
                        //此处省略 冗余代码
                        val[number] = vals[number];
                    }
                    //将数组拼接成  | 分割的字符串
                    val = val.join('|');
                    //重新赋值给input展示框
                    $('#household').val(val);
                    //终止程序
                    return;
                },
                eClear:function (data) {

                }
            })
        },
        //复制操作按钮绑定事件
        copyClick:function (parent) {
            $(parent).on("click","#copy-click",function(){
                //获取父元素
                var parent = $(this).parent('.col-sm-8');
                //获取父元素下所有.sp_container 对象数组的长度
                var len = parent.find('.sp_container').length;
                //获取最后一个.sp_container元素
                var lastElement = parent.find('.sp_container').eq(len - 1);
                //构建html
                var html = '<input type="text" class="form-control" id="c-household_registration-' + (len) + '" name="row[household_registration]">';
                //最后一个元素插入新行
                lastElement.after(html);
                //初始化新行selectpage
                Multilevel.multipleSelect("#c-household_registration-" + (len) ,Multilevel.params.url,Multilevel.params.keyField,Multilevel.params.showField,[],0);
                //获取当前顶级父元素下所有.sp_container 的长度
                len = parent.find('.sp_container').length;
                //计算所占宽度
                var width = (100 - len) / len;
                //重新赋值所有.sp_container的宽度
                for(var i = 0;i< len;i++){
                    parent.find(".sp_container").eq(i).prop("style", "width:" + width + "%;display:inline-block;margin-left:1%");
                }
            });
        }
    };
    return Multilevel;
})
