<?php
/*
 * Copy this to  ~/seedbay-secrets.php  (one level ABOVE public_html, so it is
 * never reachable over HTTP), fill it in, and chmod it 600.
 *
 * Do not put it inside public_html and do not commit the filled-in version.
 */
return [
    'db_host'     => 'localhost',
    'db_name'     => '',   // cPanel > MySQL Databases, e.g. usercpnl_seedbay
    'db_user'     => '',
    'db_pass'     => '',

    // Long random string. Reserved for signing; rotating it invalidates nothing
    // today but the API refuses to start without it, so it cannot be forgotten.
    'app_key'     => '',

    'site_origin' => 'https://seedbay.co.uk',
];
