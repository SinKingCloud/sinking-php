<?php

/**
 * 测试command
 */

namespace app\Command;

use app\Base\BaseCommand;

class Test extends BaseCommand
{
    public function execute()
    {
        $this->println("welcome to sinking-php.this is a test command", $this->getParam());
    }
}
