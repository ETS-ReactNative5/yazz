function(args) {
/*
is_app(true)
control_type("VB")
display_name("Docker control")
description("This will return the docker control")
base_component_id("docker_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "text",
            name:   "Text",
            type:   "String"
        }
        ,
        {
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
    ]
)//properties
logo_url("/driver_icons/ducker.png")
*/

    Vue.component("docker_control",{
      props: ["args"]
      ,
      template: `<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    args["background_color"]  +  ";"'>

                                                {{args.text}}
                 </div>`
      ,
      data: function() {
       return {
         msg: "..."
     }
      },

      mounted: async function() {
        if (!this.design_mode) {
            var result = await callFunction(
                                {
                                    driver_name: "serverDatabaseStuff",
                                    method_name: "serverDatabaseStuff"  }
                                    ,{ })

           if (result.value) {
                alert(result.value)

           }


           }
       }


    })
}
