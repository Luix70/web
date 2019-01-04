<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'indesanblog_140670');

/** MySQL database username */
define('DB_USER', 'BlogAdmin');

/** MySQL database password */
define('DB_PASSWORD', 'Indesan_140670');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '=u/6:A>u[?m 2 $^zTRC-Zr80ckdfG3[{jQlMT`OAm*}7b:S/<1Phn/g6z5PvBm6');
define('SECURE_AUTH_KEY',  'C* ]k,oL:2,}<$gFZa/4nAuoeJ 1!|IR dv8hzJ<ivdl^qgA^ dYwu(_5[vD~,pG');
define('LOGGED_IN_KEY',    '=L1 WOMwTg{!FGA-3^6T6zy2rkFDi<`:MJFw[XRb`,a2mRyX0I~{%Xw|jc~Y6n+V');
define('NONCE_KEY',        'IgnQAj(lJTXY:%5Ka$9U@?~L/$MB(OK,3<~i+vRt]eHcGEQ/f9V^]%U-04ds&e. ');
define('AUTH_SALT',        '<JP(jcTZ3g.`RHG#m_`KbUkKo:%p(:^#/u`-_RQiTJXhUtVV ;5^pC4HBP#pOD~g');
define('SECURE_AUTH_SALT', 'fp6vs^Br9>)U:`E3r <x23`!ZXH9l6jEei7Nsk ;&7oSno0!2|/3P9ge}}fTZ;]_');
define('LOGGED_IN_SALT',   'nu=}XcF#CoDjp}B7x;|UxiyPQRHh&E@bkD*^[|hiY46,OVuNyE#r54)o/^+rj|Rj');
define('NONCE_SALT',       'W<^@?j.4]^m@{s0zsjj6~$yHY>8$;4o{O[.*DQT9Zdq5X5_!ATI.xklbO;V74=Z}');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'es_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
