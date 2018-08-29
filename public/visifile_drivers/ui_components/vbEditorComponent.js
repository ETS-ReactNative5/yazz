async function component( args ) {
/*
base_component_id("vb_editor_component")
load_once_from_file(true)
*/

    //alert(JSON.stringify(args,null,2))
    var uid2 = uuidv4()
    var mm = null
    var texti = null
    if (args) {
        texti = args.text
    }
    var designMode = true
    var runtimeMode = false
    Vue.component("vb_editor_component",
    {
    //*** COPY_START ***//
      template: `<div >
                    <div>
                        <h4 style='display: inline-block; margin-right: 10px; ' v-if='design_mode' >VB app designer</h4>
                        <slot style='display: inline-block;' v-if='text' :text2="text"></slot>
                    </div>

                    <div>
                        <div    v-if='design_mode'
                                v-bind:style='(design_mode?"border: 1px solid black;":"") + " width: 200px;height: 55vmin; display: inline-block;overflow-x: none;overflow-y: scroll;vertical-align: top; "'>

                            <div    v-for='av in available_components'
                                    draggable="true"
                                    v-on:dragstart='drag($event,{
                                                           type:   "add_component",
                                                           text:    av.base_component_id
                                                        })'
                                    style='height: 50px; border: 5px;'>

                                <img v-bind:src='av.logo_url' style='width: 50px; height: auto; max-height: 50px;'></img>
                                {{av.base_component_id}}
                            </div>
                        </div>

                        <div            id='vb_grid'
                                        v-on:drop="$event.stopPropagation();drop($event)"
                                        v-on:ondragover="allowDrop($event)"
                                        v-bind:class='(design_mode?"dotted":"" )'
                                        v-bind:style='"display: inline-block; vertical-align: top; position: relative; width: 55vmin;height: 55vmin; ;" + (design_mode?"border: 1px solid black;":"" ) '>

                             <div v-bind:refresh='refresh' v-for='(item,index) in getActiveFormComponents'
                                  ondrop="return false;"
                                  v-bind:style='(design_mode?"border: 1px solid black;":"") + "position: absolute;top: " + item.topY + ";left:" + item.leftX + ";height:" + item.height + "px;width:" + item.width + "px;background: white;;overflow:none;"'>

                                    <div ondrop="return false;" v-bind:style='"position: absolute; top: 0px; left: 0px;height:" + item.height + "px;width:" + item.width + "px;overflow:auto;"'>
                                        <component  v-bind:refresh='refresh' v-bind:is='item.base_component_id'></component>
                                    </div>
                                    <div    style='position: absolute; top: 0px; left: 0px;z-index: 10000000;width: 100%;height: 100%;border: 1px solid black;'
                                            v-bind:draggable='design_mode'
                                            v-if='design_mode'
                                            ondrop="return false;"
                                            v-on:dragstart='drag($event,{
                                               type:   "move_component",
                                               index:   index
                                            })'
                                    >

                                            <div    v-if='design_mode'
                                                    ondrop="return false;"
                                                    v-bind:refresh='refresh'
                                                    style='position: absolute; top: 0px; left: 0px;z-index: 10000000;width: 100%;height: 100%;opacity: 0;border: 1px solid black;'
                                                    >

                                            </div>
                                    </div>
                                    <div    v-if='design_mode'
                                            v-bind:refresh='refresh'
                                            style='opacity:0.5;position: absolute; top: 0px; left: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: lightgray;'
                                            v-bind:draggable='true'
                                            ondrop="return false;"
                                            v-on:dragstart='drag($event,{
                                               type:   "resize_top_left",
                                               index:   index
                                            })'
                                     >
                                         <div    style='position: absolute; top: 0px; left: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'></div>
                                         <div    style='position: absolute; top: 0px; left: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'></div>
                                    </div>


                                    <div    v-if='design_mode'
                                            v-bind:refresh='refresh'
                                            style='opacity:0.5;position: absolute; top: 0px; right: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: lightgray;'
                                            v-bind:draggable='true'
                                            v-on:dragstart='drag($event,{
                                               type:   "resize_top_right",
                                               index:   index
                                            })'>
                                         <div    style='position: absolute; top: 0px; right: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'></div>
                                         <div    style='position: absolute; top: 0px; right: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'></div></div>



                                     <div    v-if='design_mode'
                                             v-bind:refresh='refresh'
                                             style='opacity:0.5;position: absolute; bottom: 0px; left: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: lightgray;'
                                             v-bind:draggable='true'
                                             v-on:dragstart='drag($event,{
                                                type:   "resize_bottom_left",
                                                index:   index
                                             })'>
                                          <div    style='position: absolute; bottom: 0px; left: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'></div>
                                          <div    style='position: absolute; bottom: 0px; left: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'></div></div>



                                          <div    v-if='design_mode'
                                                  v-bind:refresh='refresh'
                                                  style='opacity:0.5;position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: lightgray;'
                                                  v-bind:draggable='true'
                                                  v-on:dragstart='drag($event,{
                                                     type:   "resize_bottom_right",
                                                     index:   index
                                                  })'>
                                               <div    style='position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'></div>
                                               <div    style='position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'></div></div>





                              </div>




                      </div>





                      <div    v-if='design_mode'
                              v-bind:style='(design_mode?"border: 1px solid black;":"") + " width: 200px;height: 55vmin; display: inline-block;overflow-x: none;overflow-y: scroll;vertical-align: top; "'
                              v-bind:refresh='refresh'>

                          <div    v-bind:refresh='refresh'
                                  style='height: 50%; border: 5px;'>
                                  List of forms:

                                  <div v-for='form in getForms()' v-bind:refresh='refresh'>
                                    <br>
                                    <div v-on:click='$event.stopPropagation();selectForm(form.name)'>{{form.name}}</div>
                                  </div>
                                  <button  type=button class='btn btn-sm btn-info'  v-on:click='$event.stopPropagation();addForm()'  > Add form </button>
                          </div>
                          <div
                                  style='height: 50%; border: 5px;'>
                                  Properties
                          </div>

                      </div>



                    </div>





                    <div v-bind:id='uid2' v-on:click='$event.stopPropagation();current_edited_item = null'
                         style='width:95%; height: 45vh;overflow-y:scroll;'>
                        <div v-for='(field,index) in model.fields' style='padding: 5px;'>
                            <div class='container'>
                                <div class='row' v-on:click='if (design_mode) {$event.stopPropagation();current_edited_item = field.id}'>

                                    <div class='col-md-12' v-if='field.type=="text" && (current_edited_item != field.id)' v-bind:style='"border-radius: 5px; padding:2px; background: " + (current_edited_item == field.id?"whitesmoke":"")'>
                                        <div v-bind:style='getStyle(field.id)'>
                                            <span v-if='getFieldCssStyle(field.id,"bullet")'>&#9679; </span>{{field.text}}
                                        </div>
                                    </div>
                                    <textarea v-on:keyup='generateCodeFromModel(model  )' class='col-md-6' v-if='field.type=="text" && (current_edited_item == field.id)'
                                            v-bind:style='"border-radius: 25px; padding:20px; background: " + (current_edited_item == field.id?"whitesmoke":"") + ";" + getStyle(field.id)' v-model='field.text'>
                                            </textarea>
                                    <div class='col-md-2'></div>
                                    </div>
                                    <div class='col-md-6' v-if='(current_edited_item == field.id) && design_mode' style='border-radius: 5px; padding:2px; background:beige'  >
                                        <button v-bind:class='fieldSize(field.id)>5?"active":""'  type=button class='btn btn-sm btn-info'      v-on:click='$event.stopPropagation();updateFieldCssStyle(field.id, "size",fieldSize(field.id)-1) '  > - </button>
                                        <button v-bind:class='fieldSize(field.id)<50?"active":""'  type=button class='btn btn-sm btn-info'      v-on:click='$event.stopPropagation();updateFieldCssStyle(field.id, "size",fieldSize(field.id)+1)'  > + </button>
                                        <button v-bind:class='getFieldCssStyle(field.id,"bold")?"active":""'  type=button class='btn btn-sm btn-info'      v-on:click='$event.stopPropagation();updateFieldCssStyle(field.id, "bold",getFieldCssStyle(field.id,"bold")?false:true)'  > B </button>
                                        <button v-bind:class='getFieldCssStyle(field.id,"bold")?"active":""'  type=button class='btn btn-sm btn-info'      v-on:click='$event.stopPropagation();updateFieldCssStyle(field.id, "bullet",getFieldCssStyle(field.id,"bullet")?false:true)'  > &#9679;  </button>
                                        <button class='xs-4'  type=button class='btn btn-sm btn-info'  v-bind:disabled='index==0'    v-on:click='$event.stopPropagation();moveUp(field.id)'  > &uarr; </button>
                                        <button class='xs-4'  type=button class='btn btn-sm btn-info'  v-bind:disabled='index==(model.fields.length - 1)'    v-on:click='$event.stopPropagation();moveDown(field.id)'  > &darr; </button>
                                        <button class='xs-4'  type=button class='btn btn-sm btn-info'  v-on:click='$event.stopPropagation();deleteField(field.id)'  > Delete </button>
                                    </div>
                                </div>
                            </div>
                        <button  v-if='design_mode' type=button class='btn btn-info'      v-on:click='addField()'  >Add field</button>
                    </div>
                    <hr />


                 </div>`
        ,





        mounted: async function() {
            mm = this

            document.getElementById(uid2).style.width="100%"

            document.getElementById(uid2).style.height="45vh"

            if (texti) {
                var json2 = this.getJsonModelFromCode(  texti  )
                mm.model = json2
                mm.edited_app_component_id = saveHelper.getValueOfCodeString(texti, "base_component_id")

                //this.generateCodeFromModel(  json2  )

                this.read_only = saveHelper.getValueOfCodeString(texti, "read_only")
             //alert(this.text)
           }

           for (var rtw = 0; rtw < mm.model.forms[mm.model.active_form].components.length ; rtw++ )
           {
                var newItem = mm.model.forms[mm.model.active_form].components[rtw]
                //alert(newItem.base_component_id)
                await load(newItem.base_component_id)
           }



           //editor.getSession().on('change', function() {
           //mm.text = editor.getSession().getValue();
           //alert("changed text to : " + mm.text)
           //   });

           var sql =    "select  *  from  system_code  where " +
                        "        code_tag = 'LATEST' and logo_url is not null"

           var results = await callApp({ driver_name:    "systemFunctions2",method_name:    "sql"},
               {   sql: sql  })

           mm.available_components = results


           mm.$forceUpdate();
     },

     computed: {
        getActiveFormComponents: function() {
            return this.model.forms[this.model.active_form].components
        }

     },


     methods: {
         getForms: function() {
             var forms = []
             var llf = Object.keys(this.model.forms)
             for (var ii = 0; ii < llf.length ; ii ++) {
                 forms.push(this.model.forms[llf[ii]])
             }
             return forms
         },
         selectForm: function(formId) {
             mm.model.active_form = formId
             mm.refresh ++
         },



         allowDrop: function(ev) {
             ev.preventDefault();
         },

         drag: function(ev,message) {
             var doc = document.documentElement;
             var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
             var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
             var rrr = ev.target.getBoundingClientRect()
             message.offsetX = (ev.clientX - rrr.left )
             message.offsetY = (ev.clientY - rrr.top )
             ev.dataTransfer.setData("message",
                                     JSON.stringify(message,null,2));
         },

         drop: async function (ev) {

             var data2 = ev.dataTransfer.getData("message");
             var data = eval("(" + data2 + ")")

             var doc = document.documentElement;
             var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
             var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

             if (data.type == "add_component") {
                 var newItem = new Object()
                 var rrr = document.getElementById("vb_grid").getBoundingClientRect()


                 newItem.leftX = (ev.clientX  - rrr.left)  - data.offsetX;
                 newItem.topY = (ev.clientY  - rrr.top)   - data.offsetY;

                 newItem.base_component_id = data.text
                 newItem.width = 100
                 newItem.height = 100
                 this.refresh++
                 await load(newItem.base_component_id)
                 this.model.forms[this.model.active_form].components.push(newItem)
                 ev.preventDefault();
                 this.generateCodeFromModel(  mm.model  )


             } else if (data.type == "move_component") {
                var rrr = document.getElementById("vb_grid").getBoundingClientRect()
                //alert(this.model.forms[this.model.active_form].components[data.index].base_component_id)
                this.model.forms[this.model.active_form].components[data.index].leftX = (ev.clientX  - rrr.left) - data.offsetX;
                this.model.forms[this.model.active_form].components[data.index].topY = (ev.clientY  - rrr.top) - data.offsetY;
                ev.preventDefault();
                this.generateCodeFromModel(  mm.model  )


             } else if (data.type == "resize_top_left") {
                 var rrr = document.getElementById("vb_grid").getBoundingClientRect()
                 var oldX = this.model.forms[this.model.active_form].components[data.index].leftX
                 var oldY = this.model.forms[this.model.active_form].components[data.index].topY

                 this.model.forms[this.model.active_form].components[data.index].leftX = ev.clientX  - rrr.left - data.offsetX;
                 this.model.forms[this.model.active_form].components[data.index].topY = ev.clientY  - rrr.top - data.offsetY;
                 var diffX = this.model.forms[this.model.active_form].components[data.index].leftX - oldX
                 var diffY = this.model.forms[this.model.active_form].components[data.index].topY - oldY
                 this.model.forms[this.model.active_form].components[data.index].width -= diffX
                 this.model.forms[this.model.active_form].components[data.index].height -= diffY


                 ev.preventDefault();
                 this.generateCodeFromModel(  mm.model  )



             } else if (data.type == "resize_top_right") {
                 var rrr = document.getElementById("vb_grid").getBoundingClientRect()
                 var newX = (ev.clientX + 20) - rrr.left - data.offsetX;
                 var newY = ev.clientY - rrr.top - data.offsetY;

                 console.log(" X,Y: ------------ " +  newX + "," +  newY)

                 this.model.forms[this.model.active_form].components[data.index].width = newX - this.model.forms[this.model.active_form].components[data.index].leftX

                 var newHeight = (this.model.components[data.index].topY + this.model.forms[this.model.active_form].components[data.index].height) - newY
                 this.model.forms[this.model.active_form].components[data.index].topY = newY
                 this.model.forms[this.model.active_form].components[data.index].height = newHeight


                 ev.preventDefault();
                 this.generateCodeFromModel(  mm.model  )

             } else if (data.type == "resize_bottom_left") {
                 var rrr = document.getElementById("vb_grid").getBoundingClientRect()
                 var newX = ev.clientX  - rrr.left - data.offsetX;
                 var newY = (ev.clientY + 20)  - rrr.top - data.offsetY;

                 console.log(" X,Y: ------------ " +  newX + "," +  newY)

                 var newWidth = (this.model.forms[this.model.active_form].components[data.index].leftX + this.model.forms[this.model.active_form].components[data.index].width) - newX
                 this.model.forms[this.model.active_form].components[data.index].leftX = newX
                 this.model.forms[this.model.active_form].components[data.index].width = newWidth

                 this.model.forms[this.model.active_form].components[data.index].height = newY - this.model.forms[this.model.active_form].components[data.index].topY
                 ev.preventDefault();
                 this.generateCodeFromModel(  mm.model  )



                 } else if (data.type == "resize_bottom_right") {
                     var rrr = document.getElementById("vb_grid").getBoundingClientRect()
                     var newX = (ev.clientX + 20)  - rrr.left - data.offsetX;
                     var newY = (ev.clientY + 20) - rrr.top - data.offsetY;

                     console.log(" X,Y: ------------ " +  newX + "," +  newY)

                     var newWidth = newX - this.model.forms[this.model.active_form].components[data.index].leftX
                     this.model.forms[this.model.active_form].components[data.index].width = newWidth

                     var newHeight = newY - this.model.forms[this.model.active_form].components[data.index].topY
                     this.model.forms[this.model.active_form].components[data.index].height = newHeight

                     ev.preventDefault();
                     this.generateCodeFromModel(  mm.model  )
                 }






         },

         addForm: function() {
            mm.model.max_form ++
            var newFormName = "form_" + mm.model.max_form
            mm.model.forms[newFormName] = {
                name: newFormName,
                components: []
            }
            mm.model.active_form = newFormName
            mm.refresh ++
            //alert(JSON.stringify(mm.model,null,2))
            this.generateCodeFromModel(  mm.model  )
         }
         ,


        addField: function() {
            mm.model.forms[mm.model.active_form].fields.push({   id: mm.model.next_id,   type: "text",   text: "Enter text here",
                                      style: {}})
            mm.model.next_id ++
            this.generateCodeFromModel(  mm.model  )
            //alert("Added: " + JSON.stringify(mm.model,null,2))
        },

        getFieldCssStyle: function(   fieldId   , styleName) {
            var mm = this
            var itemD = null
            for (var tt=0; tt < mm.model.fields.length ; tt++) {
                var ciurr = mm.model.fields[tt]
                if (ciurr.id == fieldId) {
                    if (!ciurr.style) {
                        ciurr.style = {}
                        return null
                    }
                    if (ciurr.style[styleName]) {
                        return ciurr.style[styleName]
                    }
                    return null
                }
            }
            return null
        },


        fieldSize: function(fieldId) {
            var mm = this
            if (mm.getFieldCssStyle(fieldId,"size") == null) {
                return 16
            }
            return this.getFieldCssStyle(fieldId,"size")
        },


        updateFieldCssStyle: function(   fieldId   , styleName, styleValue) {
            var itemD = null
            var mm = this
            for (var tt=0; tt < mm.fields.length ; tt++) {
                var ciurr = mm.model.fields[tt]
                if (ciurr.id == fieldId) {
                    if (!ciurr.style) {
                        ciurr.style = {}
                    }
                    ciurr.style[styleName] = styleValue
                }
            }
            this.generateCodeFromModel(  mm.model  )
        },


        getStyle: function(fieldId) {
            var mm = this
            var styleT = ""
            for (var tt = 0; tt < mm.model.fields.length ; tt++) {
                var ciurr = mm.model.fields[tt]
                if (ciurr ) {
                    if (ciurr.id == fieldId) {
                        if (!ciurr.style) {
                            return ""
                        }
                        var fg = ciurr.style
                        if (fg.bold){
                            styleT += "font-weight: bold;"
                        }
                        styleT += "font-size: " + mm.fieldSize(fieldId) + "px;"
                        return styleT
                    }
                }
            }
            return ""
        },


        moveUp: function(   fieldId   ) {
            var itemD = null
            for (var tt=0; tt < mm.model.forms[mm.model.active_form].fields.length ; tt++) {
                var ciurr = mm.model.forms[mm.model.active_form].fields[tt]
                if (ciurr.id == fieldId) {
                    itemD = ciurr
                }
            }
            if (itemD) {
                var index = mm.model.forms[mm.model.active_form].fields.indexOf(  itemD  );
                if (index > -1) {
                  mm.model.fields.splice(index, 1);
                  mm.model.fields.splice(index - 1, 0, itemD);
                }

            }

            this.generateCodeFromModel(  mm.model  )
        },

        moveDown: function(   fieldId   ) {
            var itemD = null
            for (var tt=0; tt < mm.model.forms[mm.model.active_form].fields.length ; tt++) {
                var ciurr = mm.model.forms[mm.model.active_form].fields[tt]
                if (ciurr.id == fieldId) {
                    itemD = ciurr
                }
            }
            if (itemD) {
                var index = mm.model.forms[mm.model.active_form].fields.indexOf(  itemD  );
                if (index > -1) {
                  mm.model.fields.splice(index, 1);
                  mm.model.fields.splice(index + 1, 0, itemD);
                }

            }

            this.generateCodeFromModel(  mm.model  )
        },

        deleteField: function(   fieldId   ) {
            var itemD = null
            for (var tt=0; tt < mm.model.forms[mm.model.active_form].fields.length ; tt++) {
                var ciurr = mm.model.forms[mm.model.active_form].fields[tt]
                if (ciurr.id == fieldId) {
                    itemD = ciurr
                }
            }
            if (itemD) {
                var index = mm.model.forms[mm.model.active_form].fields.indexOf(  itemD  );
                if (index > -1) {
                  mm.model.fields.splice(index, 1);
                }
            }

            this.generateCodeFromModel(  mm.model  )
            //alert("Added: " + JSON.stringify(mm.model,null,2))
        },
        getText: function() {
            return this.text
        },
        setText: function(textValue) {
            this.text =  textValue
            var json2 = this.getJsonModelFromCode(  textValue  )
            mm.model = json2
            this.generateCodeFromModel(  json2  )
        }
        ,
        getJsonModelFromCode: function(  codeV  ) {
            var json2 = saveHelper.getValueOfCodeString(codeV,"formEditor",")//formEditor")
            return json2
        }

        ,
        generateCodeFromModel: async function(  jsonModel  ) {
            var startIndex = this.text.indexOf("//** gen_" + "start **//")
            var endIndex = this.text.indexOf("//** gen_" + "end **//")

            //zzz
            var sql =    "select  cast(code as text)  as  code  from  system_code  where " +
                         "        base_component_id = 'vb_editor_component'   and   code_tag = 'LATEST' "

            var results = await callApp({ driver_name:    "systemFunctions2",method_name:    "sql"},
                {   sql: sql  })

            var editorCode = results[0].code
            var stt = "//*** COPY_" + "START ***//"
            var editorCodeToCopyStart = editorCode.indexOf(stt) + stt.length
            var editorCodeToCopyEnd = editorCode.indexOf("//*** COPY_" + "END ***//")
            var editorCodeToCopy = editorCode.substring(editorCodeToCopyStart, editorCodeToCopyEnd)
            //console.log(editorCodeToCopy)
            //alert(JSON.stringify(mm.model,null,2))

            this.text = this.text.substring(0,startIndex) +

                `//** gen_start **//
                var uid2 = uuidv4()
                var mm = null
                var texti = null
                var designMode = false
                var runtimeMode = true
                Vue.component('${this.edited_app_component_id}', {`

                + editorCodeToCopy +

                `,
                data: function () {
                  return {
                      design_mode: designMode,
                      runtime_mode: runtimeMode,
                      current_edited_item: null,
                      text: texti,
                      uid2: uid2,
                      model: `
                      + JSON.stringify(mm.model,null,2) +

                  `}
                }
              })`

              +
              this.text.substring(endIndex)
              //console.log(this.text)

              this.text = saveHelper.deleteCodeString(  this.text, "formEditor", ")//form" + "Editor")

              this.text = saveHelper.insertCodeString(  this.text,
                                                        "formEditor",
                                                        mm.model,
                                                        ")//form" + "Editor")
        }

     }
     //*** COPY_END ***//
     ,
     data: function () {
       return {
           design_mode:                 designMode,
           runtime_mode:                runtimeMode,
           edited_app_component_id:     null,
           current_edited_item:         null,
           text:                        texti,
           uid2:                        uid2,
           refresh:                     0,
           read_only:                   false,
           available_components:        [],

           model:                      {
                                            next_id: 1,
                                            max_form: 1,
                                            active_form: "Form 1",

                                            fields: [

                                                    ],

                                            forms: {
                                                "Form 1": {
                                                    name: "Form 1",
                                                    components: [

                                                                ]

                                                }
                                            }
                                        }
       }
     }


    }
    )

}
