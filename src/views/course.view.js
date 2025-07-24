const purchaseConfirmaitonBody = (coursePurchase) => {
    const { name, course_name, amount } = coursePurchase;
    return `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Untitled Document</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Gelasio:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
        <style>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <script src="https://kit.fontawesome.com/1380329a16.js" crossorigin="anonymous"></script>

            body {
                font-family: "Montserrat", sans-serif;
                font-size: 14px;
            }
            a {
                text-decoration: none !important;
            }
            h1,
            h2,
            h3,
            h4,
            h5 {
                font-weight: 700;
                 font-family: "Gelasio", serif;
                  font-style: italic;
                  
            }
            h4 {
                font-size: 36px;
            }
             div {
                font-size: 23px;
                 font-family: "Montserrat", sans-serif;
            }
            .p-3 {
                padding: 0 30px;
            }
            p {
                font-family: "Montserrat", sans-serif;
                line-height: 28px;
                margin-bottom: 15px;
                color: #666;
            }
            .red-text {
                color: #d73d34;
            }
            .black-text {
                color: #000;
            }
            [class^="hvr-"] {
                margin: 0;
                margin-bottom: 10px;
                padding: 0.7em;
                cursor: pointer;
                background: #e1e1e1;
                text-decoration: none;
                color: #fff;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                border-radius: 30px;
            }
            .btn3 {
                background-color: #046f37;
                color: #fff;
                border: 1px solid #046f37 !important;
                text-transform: uppercase;
                font-weight: bold;
                padding: 5px 8px;
                display: inline-block;
                transition: all 300ms ease;
                margin: 10px;
                margin-bottom: 30px;
                margin-left: 0;
            }
            .btn3:hover {
                background-color: #292a2d;
                color: #fff;
            }
            .small-t {
                font-size: 12px;
                line-height: 15px;
            }
            .red-text {
                color: #046f37;
            }
        </style>
    </head>

    <body style="background: #fff; text-align: center;">
        <table width="420px" style="margin: 0 auto; border: 2px solid #efefef; border-top: 0; border-bottom: 0;" cellpadding="18">
            <tr>
                <td style="text-align: center;">
                   
                     <img src=""  type="image/png" style="width:130px " alt="logo" />
                   
                    <p>&nbsp;</p>
                    <h4 style="margin-top:10px;">CertEd Technologies</h4>
                </td>
            </tr>

            <tr >
                <td >
                    <table width="380px" style="background: #fff; margin: 0 auto; border: 2px solid #efefef; text-align: left; " cellpadding="18">
                        <tr>
                            <td>
                            <p>
                            Dear ${name},<br />
                            
                            </p>
                            <div style="text-align:start">${ course_name }  Course Purchase Confirmed – Welcome Aboard!</div>
                               
                            </td>
                        </tr>
                        
                        <tr>
                            <td>
                                <p>
                                    Thank you for enrolling in ${course_name}! 🎓  <br/>
Your payment of ₹${amount} has been received successfully.

We’re excited to have you on board. <br/>
You’ll receive further details and access instructions shortly.
</p>
<p>
Happy learning!  
   </p>                             
                            </td>
                        </tr>

                        

                        <tr>
                            <td align="center">
                                <hr />
                                <p className="small-t">
                                    Problems or questions? Email us at <br /> info@certed.com<br />
                                    
                                    &copy; CertEd Technologies <br />
                                </p>
                                

                                <p className="small-t black-text">[This is an auto-generated mail. Please do not reply.]</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>`;
};

module.exports = { purchaseConfirmaitonBody }