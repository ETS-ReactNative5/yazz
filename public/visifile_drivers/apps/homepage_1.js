async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage_1")
is_app(true)
display_name("Homepage 1")
control_type("SYSTEM")
description('Homepage 1')
uses_javascript_librararies(["aframe"])
load_once_from_file(true)
read_only(true)
logo_url("data:image/jpeg;base64,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")
*/

    Vue.component('homepage_1', {

      template:
`<div  class="container" style=''>

    <div class="row" style='background-color: white; color: black; padding-top: 20px;padding-bottom: 20px;'>
        <div class="col-md-12">
        <h2><b>Create and share webapps by coding a single JS file</b></h2>
            <a-scene style='width: 80%; height: 100px;' embedded vr-mode-ui="enabled: false">

            <a-assets>
                <a-mixin id="RobotoFont" text="font: /public/aframe_fonts/Roboto-msdf.json"></a-mixin>
                <a-mixin id="SourceCodeProFont" text="font: /public/aframe_fonts/SourceCodePro.fnt"></a-mixin>
                <a-mixin id="AileronFont" text="font: /public/aframe_fonts/Aileron-Semibold.fnt"></a-mixin>
            </a-assets>

            <a-entity camera look-controls>
                <a-entity geometry="primitive: plane; height: 0.2; width: 0.2" position="1 0 -1"
                      material="opacity: 0">
                    <a-box position="2 10 -10" rotation="0 0 0" color="#4CC3D9"  >
                        <a-entity
                            mixin="RobotoFont"
                            position="3.5 0 .6"
                            text='color: black; align: left; value: Creator ; width: 15; opacity:1;'>
                            </a-entity>
                        <a-animation attribute="position"
                              to="1 0 -1.5" dur="2000" direction="normal" ></a-animation>
                    </a-box>
                </a-entity>
            </a-entity>
            <a-sky color="white"></a-sky>
        </a-scene>
          <ul style='background-color: white; color: black;'>
              <li >Create apps in minutes</li>
              <li >All apps backed by a SQLite database</li>
              <li >Share an app by sending a URL link</li>
              <li >Use templates to get started with information apps, forms, database apps, and 3D interactive apps</li>
              <li >Open source (<a href='https://github.com/zubairq/creator'>https://github.com/zubairq/creator</a>)</li>
              <li >Can be hosted locally on Mac/PC</li>
          </ul>



          <div style='height:20px; width: 10px;'></div>
         <a href="http://dannea.com/visifile/64/dannea_creator_setup.exe" class="btn btn-secondary">
                 <img src='/windows.png' style='height: 30px;'></img>
                 Download Creator for Windows
              </a>
              <div style='height:20px; width: 10px;'></div>
              <a href="http://dannea.com/visifile/64/dannea_creator_setup.dmg" class="btn btn-primary">
                 <img src='/mac.png' style='height: 30px;'></img>
                 Download Creator for Mac
              </a>
              <div style='height:20px; width: 10px;'></div>


              <div id="mc_embed_signup">
<form action="https://zubairquraishi.us7.list-manage.com/subscribe/post?u=46afb6bb668c1280c3e739c54&amp;id=72288e6dc0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate="">
    <div id="mc_embed_signup_scroll">
	<label for="mce-EMAIL">Subscribe to our mailing list</label>
	<input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required="">
    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_46afb6bb668c1280c3e739c54_72288e6dc0" tabindex="-1" value=""></div>
    <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
    </div>
</form>
</div>


            </div>
</div>`



    })
}
