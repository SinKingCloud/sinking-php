<?php

/**
 * 测试job
 */

namespace app\Job;

use app\Base\BaseJob;

class Test extends BaseJob
{
    protected $name = 'Test';

    public function handle($id, $data = array())
    {
        $this->println("this is a test job,the id is ", $id,'. the data is ', $data);
        return true;
    }
}
