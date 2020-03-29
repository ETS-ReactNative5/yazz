async function get_apps_list(args) {
/*
description("This will return the apps available")
base_component_id("systemFunctions")
load_once_from_file(true)
only_run_on_server(true)
*/
    var getAppsList = new Promise(function(resolve, reject) {
            dbsearch.serialize(
                function() {
                    dbsearch.all(
                        "SELECT  base_component_id, display_name, logo_url  FROM system_code where component_scope = 'app' and code_tag = 'LATEST'  ; "
                        ,

                        function(err, results)
                        {
                            //console.log("*) results: " + JSON.stringify(results,null,2));
                            var list = [
                            ]
                            for (var tt = 0; tt < results.length ; tt ++) {
                                list.push(results[tt])
                            }
                            //console.log("*) list: " + JSON.stringify(list,null,2));
                            resolve(list)
                        })
            }, sqlite3.OPEN_READONLY)
      })

      try {
             //console.log("*) var list2 = await getAppsList() ");
             var list2 = await getAppsList
             console.log("*) returning list: " + JSON.stringify(list2,null,2));
             return list2
      } catch(err) {
          console.log("*) Error: " + JSON.stringify(err,null,2));
      }


}
