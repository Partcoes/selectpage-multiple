define("multilevel",["jquery","bootstrap","backend","selectpage"],function($,botstrap,Backend) {

    var Multilevel = {

        params:{
            element:"",
            url:""
        },

        init:function(){
            this.index(this.params.element,this.params.url);
        },

        index:function (elementId,url,keyField = "id",showField = "name",maxNumber=3,pid = "",data="") {
            var elements = elementId.split("-");
            var divIndex

            if(elements[2] == 0){
                divIndex = 0;
            }else{
                divIndex =(elements[2] - 1);
            }

            var prex = elements[0] + '-' + elements[1] + "-";
            var parent = $(elementId).parents(".col-sm-8").find('.sp_container').eq(divIndex).find('input').eq(1).val();
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
                            $(elementId).parents(".col-sm-8").append(html);
                            //判断是不是已经创建不需要重复创建
                            $(elementId + '_text').attr('is_create',1);
                            //获取创建元素的ID
                            var newElementId = prex + idNum;
                            //创建结束后number+1
                            number = parseInt(number) + 1;
                            //赋值给文本属性 number值获取的时候判断
                            $(elementId + '_text').attr('number',number);
                            //实例化selectpage
                            Multilevel.index(newElementId, url, keyField, showField);
                            //计算现有的input框的宽度
                            var width = (100 - number - 1) / number;
                            //赋值给父级元素宽度
                            $(elementId).parents(".col-sm-8").find(".sp_container").prop("style", "width:" + width + "%;display:inline-block;margin-left:1%");
                        }

                    }
                    return false;
                },
                eClear:function (data) {
                    $(elementId).attr('is_create',0)
                    $(elementId).attr('is_clear',1)
                    $(elementId).attr('pid',0);
                    $(elementId).parents('.col-sm-8').attr('clear-node',elementId);
                    $(elementId).parent('.sp_container').nextAll().remove();
                    // $(elementId).data('source',{list:[{}]});
                    // console.log($(elementId).val());
                    // $('#c-household_registration-' + number).selectPageClear();
                    // $('#c-household_registration-' + number).selectPageData([]);
                    // $('#c-household_registration-' + number).selectPageRefresh();
                }

            });
        }
    };
    return Multilevel;
})
