<?php

/**
 * Title:SinKingCloud安全阻拦
 * Author：流逝中沉沦
 * Date: 2019/02/02 12:00
 */

namespace Systems;

class Safe
{
    public static $status = true;

    public static $cookie = true;

    public static $post = true;

    public static $get = true;

    public static $HTML = "";

    public static $whiteDIr = null; //后台白名单

    public static $whiteUrl = array(); //网址白名单

    public static function start()
    {
        $safe = new self();
        return $safe->run();
    }
    public function run()
    {
        if (!self::$status) {
            return false;
        }
        if (!empty(self::$whiteDIr) || !empty(self::$whiteUrl)) {
            if (!$this->checkWhite(self::$whiteDIr, self::$whiteUrl)) {
                return;
            }
        }
        if (self::$get) {
            $this->getFitter();
        }
        if (self::$post) {
            $this->postFitter();
        }
        if (self::$cookie) {
            $this->cookieFitter();
        }
    }
    private function checkWhite($webscan_white_name, $webscan_white_url = array())
    {
        $url_path = $_SERVER['SCRIPT_NAME'];
        $url_var = $_SERVER['QUERY_STRING'];
        if (is_array($webscan_white_name)) {
            foreach ($webscan_white_name as $key) {
                if (preg_match("/" . $key . "/is", $url_path) == 1 && !empty($key)) {
                    return false;
                }
            }
        } else {
            if (preg_match("/" . $webscan_white_name . "/is", $url_path) == 1 && !empty($webscan_white_name)) {
                return false;
            }
        }
        foreach ($webscan_white_url as $key2) {
            foreach ($key2 as $key => $value) {
                if (!empty($url_var) && !empty($value)) {
                    if (stristr($url_path, $key) && stristr($url_var, $value)) {
                        return false;
                    }
                } elseif (empty($url_var) && empty($value)) {
                    if (stristr($url_path, $key)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    private function arrayForeach($arr)
    {
        static $str;
        static $keystr;
        if (!is_array($arr)) {
            return $arr;
        }
        foreach ($arr as $key => $val) {
            $keystr = $keystr . $key;
            if (is_array($val)) {

                $this->arrayForeach($val);
            } else {

                $str[] = $val . $keystr;
            }
        }
        return implode($str);
    }
    private function fitter($StrFiltKey, $StrFiltValue, $ArrFiltReq)
    {
        $StrFiltValue = $this->arrayForeach($StrFiltValue);
        if (preg_match("/" . $ArrFiltReq . "/is", $StrFiltValue) == 1) {
            return $this->webExit();
        }
        if (preg_match("/" . $ArrFiltReq . "/is", $StrFiltKey) == 1) {
            return $this->webExit();
        }
    }
    public function webExit($html = "")
    {
        $html = empty($html) ? self::$HTML : $html;
        throw new \Systems\Exception($html);
    }
    private function cookieFitter()
    {
        $cookiefilter = "benchmark\s*?\(.*\)|sleep\s*?\(.*\)|load_file\s*?\\(|\\b(and|or)\\b\\s*?([\\(\\)'\"\\d]+?=[\\(\\)'\"\\d]+?|[\\(\\)'\"a-zA-Z]+?=[\\(\\)'\"a-zA-Z]+?|>|<|\s+?[\\w]+?\\s+?\\bin\\b\\s*?\(|\\blike\\b\\s+?[\"'])|\\/\\*.*\\*\\/|<\\s*script\\b|\\bEXEC\\b|UNION.+?SELECT\s*(\(.+\)\s*|@{1,2}.+?\s*|\s+?.+?|(`|'|\").*?(`|'|\")\s*)|UPDATE\s*(\(.+\)\s*|@{1,2}.+?\s*|\s+?.+?|(`|'|\").*?(`|'|\")\s*)SET|INSERT\\s+INTO.+?VALUES|(SELECT|DELETE)@{0,2}(\\(.+\\)|\\s+?.+?\\s+?|(`|'|\").*?(`|'|\"))FROM(\\(.+\\)|\\s+?.+?|(`|'|\").*?(`|'|\"))|(CREATE|ALTER|DROP|OR|TRUNCATE)\\s+(TABLE|DATABASE)";
        foreach ($_COOKIE as $key => $value) {
            $key = $this->daddslashes($key);
            $value = $this->daddslashes($value);
            $_COOKIE[$key] = $value;
            $this->fitter($key, $value, $cookiefilter);
        }
    }
    private function getFitter()
    {
        $getfilter = "\\<.+javascript:window\\[.{1}\\\\x|<.*=(&#\\d+?;?)+?>|<.*(data|src)=data:text\\/html.*>|\\b(alert\\(|confirm\\(|expression\\(|prompt\\(|benchmark\s*?\(.*\)|sleep\s*?\(.*\)|\\b(group_)?concat[\\s\\/\\*]*?\\([^\\)]+?\\)|\bcase[\s\/\*]*?when[\s\/\*]*?\([^\)]+?\)|load_file\s*?\\()|<[a-z]+?\\b[^>]*?\\bon([a-z]{4,})\s*?=|^\\+\\/v(8|9)|\\b(and|or)\\b\\s*?([\\(\\)'\"\\d]+?=[\\(\\)'\"\\d]+?|[\\(\\)'\"a-zA-Z]+?=[\\(\\)'\"a-zA-Z]+?|>|<|\s+?[\\w]+?\\s+?\\bin\\b\\s*?\(|\\blike\\b\\s+?[\"'])|\\/\\*.*\\*\\/|<\\s*script\\b|\\bEXEC\\b|UNION.+?SELECT\s*(\(.+\)\s*|@{1,2}.+?\s*|\s+?.+?|(`|'|\").*?(`|'|\")\s*)|UPDATE\s*(\(.+\)\s*|@{1,2}.+?\s*|\s+?.+?|(`|'|\").*?(`|'|\")\s*)SET|INSERT\\s+INTO.+?VALUES|(SELECT|DELETE)@{0,2}(\\(.+\\)|\\s+?.+?\\s+?|(`|'|\").*?(`|'|\"))FROM(\\(.+\\)|\\s+?.+?|(`|'|\").*?(`|'|\"))|(CREATE|ALTER|DROP|OR|TRUNCATE)\\s+(TABLE|DATABASE)|<.*(iframe|frame|style|embed|object|frameset|meta|xml|a|img)|hacker";
        foreach ($_GET as $key => $value) {
            $key = $this->daddslashes($key);
            $value = $this->daddslashes($value);
            $_GET[$key] = $value;
            $this->fitter($key, $value, $getfilter);
        }
    }
    private function postFitter()
    {
        $postfilter = "<.*=(&#\\d+?;?)+?>|<.*data=data:text\\/html.*>|\\b(alert\\(|confirm\\(|expression\\(|prompt\\(|benchmark\s*?\(.*\)|sleep\s*?\(.*\)|\\b(group_)?concat[\\s\\/\\*]*?\\([^\\)]+?\\)|\bcase[\s\/\*]*?when[\s\/\*]*?\([^\)]+?\)|load_file\s*?\\()|<[^>]*?\\b(onerror|onmousemove|onload|onclick|onmouseover)\\b|\\b(and|or)\\b\\s*?([\\(\\)'\"\\d]+?=[\\(\\)'\"\\d]+?|[\\(\\)'\"a-zA-Z]+?=[\\(\\)'\"a-zA-Z]+?|>|<|\s+?[\\w]+?\\s+?\\bin\\b\\s*?\(|\\blike\\b\\s+?[\"'])|\\/\\*.*\\*\\/|<\\s*script\\b|\\bEXEC\\b|UNION.+?SELECT\s*(\(.+\)\s*|@{1,2}.+?\s*|\s+?.+?|(`|'|\").*?(`|'|\")\s*)|UPDATE\s*(\(.+\)\s*|@{1,2}.+?\s*|\s+?.+?|(`|'|\").*?(`|'|\")\s*)SET|INSERT\\s+INTO.+?VALUES|(SELECT|DELETE)(\\(.+\\)|\\s+?.+?\\s+?|(`|'|\").*?(`|'|\"))FROM(\\(.+\\)|\\s+?.+?|(`|'|\").*?(`|'|\"))|(CREATE|ALTER|DROP|OR|TRUNCATE)\\s+(TABLE|DATABASE)|<.*(iframe|frame|style|embed|object|frameset|meta|xml|a|img)|hacker";
        foreach ($_POST as $key => $value) {
            $key = $this->daddslashes($key);
            $value = $this->daddslashes($value);
            $_POST[$key] = $value;
            $this->fitter($key, $value, $postfilter);
        }
    }
    private function daddslashes($string, $force = 0, $strip = FALSE)
    {
        !defined('MAGIC_QUOTES_GPC') && define('MAGIC_QUOTES_GPC', ini_set("magic_quotes_runtime", 0) ? True : False);
        if (!MAGIC_QUOTES_GPC || $force) {
            if (is_array($string)) {
                foreach ($string as $key => $val) {
                    $string[$key] = daddslashes($val, $force, $strip);
                }
            } else {
                $string = addslashes($strip ? stripslashes($string) : $string);
            }
        }
        return $string;
    }
    public static function getRequestInfo()
    {
        return array(
            'get' => $_GET,
            'post' => $_POST,
            'cookie' => $_COOKIE,
            'request' => $_SERVER
        );
    }
}
