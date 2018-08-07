<?php
        //$cid=10;
    
        //require_once("../krumo/class.krumo.php");
        //require_once("admin/dataManagement/dataGate.php");
        //$siteID=$_GET["siteID"];
        $CID=$_GET["cid"];
        $name=$_GET["name"];
       // $type=isset($_GET["type"])?$_GET["type"]:"facebook";
    
        //$loginUser=DataGate::getData("appUserLogin", (object)array("email"=>"aa@ss.ss","cid"=>$cid,"groupCode"=>$siteID));
        //$data=DataGate::getData("appUserGetGroup2", (object)array("cid"=>$cid,"groupCode"=>$siteID));
        switch ($CID) {
        case 5:
           $img = 'icon_splash_ybz.png';
           $title = $name;
           $description = 'גם אני השתתפתי בסיור של יד בן צבי!';
           //$description = 'הסיוריים של יד בן צבי הינם מופלאים! הכנסו ושתפו!';
           $link ='https://www.ybz.org.il/';
            break;
         case 3:
           $img = 'odtechLogo.png';
           $title = $name;
           $description = 'גם אני השתתפתי בסיור עם אפליקציית ODTech!';
           //$description = 'ODTech הינה אפליקציית טיולים יחודית!';
           $link ='http://odtech.co.il/';
            break;
    
    }
    
    
?>



<!DOCTYPE html>
<html>
    <head>


        <meta property="og:title" content="<?php echo rawurldecode($title); ?>" />
        <meta property="og:image" content="<?php echo "http://team.cambium.co.il/odtechsummary/img/".$img; ?>" />
        <meta property="og:url" content="<?php echo "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"; ?>" />
        <meta property="og:description" content="<?php echo rawurldecode($description); ?>" />


        <!-- etc. -->
    </head>
    <body>

        <script type="text/javascript">
         //   window.location = "<?php echo $link ?>";

         
        </script>
           <?php echo $title; ?>
    </body>
</html>
