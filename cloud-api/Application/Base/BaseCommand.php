<?php

/**
 * 基础Command
 */

namespace app\Base;

use Systems\Command;

class BaseCommand extends Command
{
    /**
     * 获取model类名(兼容php5.4写法)
     */
    public static function getClass()
    {
        return get_called_class();
    }
}
