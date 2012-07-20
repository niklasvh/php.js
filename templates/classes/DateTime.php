<?php

class DateTime  {

    const ATOM = "Y-m-d\TH:i:sP";
    const COOKIE = "l, d-M-y H:i:s T";
    const ISO8601 = "Y-m-d\TH:i:sO";
    const RFC822 = "D, d M y H:i:s O";
    const RFC850 = "l, d-M-y H:i:s T";
    const RFC1036 = "D, d M y H:i:s O";
    const RFC1123 = "D, d M Y H:i:s O";
    const RFC2822 = "D, d M Y H:i:s O";
    const RFC3339 = "Y-m-d\TH:i:sP";
    const RSS = "D, d M Y H:i:s O";
    const W3C = "Y-m-d\TH:i:sP";

  

    public function __construct($time = "now", DateTimeZone $timezone = NULL) {
        
    }

    public function add(DateInterval $interval) {
        
    }

    public static function createFromFormat(string $format, string $time, DateTimeZone $timezone) {
        
    }

    public function diff(DateTime $datetime2, $absolute = false) {
        
    }

    public function format($format) {
        
    }

    public static function getLastErrors() {
        
    }

    public function getOffset() {
        
    }

    public function getTimestamp() {
        
    }

    public function getTimezone() {
        
    }

    public function modify($modify) {
        
    }

    public static function __set_state(array $array) {
        
    }

    public function setDate($year, $month, $day) {
        
    }

    public function setISODate($year, $week, $day = 1) {
        
    }

    public function setTime($hour, $minute, $second = 0) {
        
    }

    public function setTimestamp($unixtimestamp) {
        
    }

    public function setTimezone(DateTimeZone $timezone) {
        
    }

    public function sub(DateInterval $interval) {
        
    }

    public function __wakeup() {
        
    }

}

?>